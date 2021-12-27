import hapiAuthJwt2 from 'hapi-auth-jwt2';
import { server, mongooseConnect, CrudApiArgs } from '@ctt/crud-api';
import { permit } from '@ctt/service-utils';
import redisPlugin from '@ctt/redis-client';

import conf from './config';
import mongooseSchema from './persistence/mongoose/queries';
import routes from './routes';
import services from './services';

import config, { configFiles } from './utils/loadconfig';
import { Server } from 'hapi';

config.loadFile(configFiles);

import '../env';

interface PharmacyServer extends Server {
  permissions: PermissionOnRedis;
}

interface Permission {
  c?: number;
  r?: number;
  u?: number;
  d?: number;
}

export type Map<T> = { [k: string]: T };

type ResourcePermission = Map<Permission>;

type PermissionOnRedis = Map<ResourcePermission[]>;

type PermissionsQuery = (role: string) => Promise<ResourcePermission[]>;

interface DataSource {
  query: PermissionsQuery;
}

type datasource = (app: PharmacyServer) => Promise<DataSource>;

const datasource = async (application: PharmacyServer): Promise<DataSource> => {
  const { redis } = application.plugins['@ctt/redis-client'];

  return {
    query: async (role: string): Promise<ResourcePermission[]> => {
      const permissions: PermissionOnRedis =
        application.permissions ||
        JSON.parse(await redis.get(`${config.get('service.project')}:${config.get('service.name')}:Permissions`));

      application.permissions = permissions;

      return permissions[role];
    },
  };
};

export interface JsonError {
  code: number;
  message: string;
  title: string;
}

interface PermitResponse {
  isValid: boolean;
}

type validate = (application: PharmacyServer) => Promise<PermitResponse>;

const validate = (application: PharmacyServer) => async (
  { role },
  { route },
): Promise<PermitResponse> => {
  const permissions = await permit.getPermissions({
    role,
    datasource: await datasource(application),
  });

  return permit.authorize(permissions, {
    method: route.method,
    fingerprint: route.fingerprint,
  });
};

export default (): Promise<Server> =>
  server({
    dbConnect: mongooseConnect,
    schema: mongooseSchema,
    config: conf,
    configFiles,
    configOptions: {
      dbConnectOptions: { useNewUrlParser: true, useFindAndModify: false },
    },
    routes,
    services,
    plugins: [
      { plugin: hapiAuthJwt2, options: {} },
      {
        plugin: redisPlugin,
        options: {
          mode: config.get('redis.mode'),
          options: config.get('redis.options'),
        },
      },
    ],
    postRegisterHook: async application => {
      application.auth.strategy('jwt', 'jwt', {
        key: config.get('jwt.secret'),
        validate: await validate(application),
        verifyOptions: { algorithms: ['HS256'] },
        urlKey: false,
      });
      application.auth.default('jwt');
    },
    swaggerOptions: {
      auth: false,
      tags: {},
      info: {
        title: '@ctt/pharmacy',
        description: 'Online pharmacy',
        version: '0.0.1',
      },
    },
    swaggerUiOptions: {
      title: '@ctt/pharmacy',
      path: '/docs',
      authorization: false,
      auth: false,
      swaggerOptions: {
        validatorUrl: null,
      },
    },
    loggerOptions: {
      redact: {
        paths: ['req.headers.authorization', '*.password'],
        remove: true,
      },
    },
  } as CrudApiArgs);

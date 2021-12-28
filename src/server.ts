import { server, mongooseConnect, CrudApiArgs } from '@ctt/crud-api';

import conf from './config';
import mongooseSchema from './persistence/mongoose/queries';
import routes from './routes';
import services from './services';

import config, { configFiles } from './utils/loadconfig';
import { Server } from 'hapi';

config.loadFile(configFiles);

import './env';

export type Map<T> = { [k: string]: T };

export interface JsonError {
  code: number;
  message: string;
  title: string;
}

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
    postRegisterHook: async application => {
      application !== null;
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

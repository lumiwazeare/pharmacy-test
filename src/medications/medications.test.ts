import { http, test } from '@ctt/service-utils';
import { factory } from 'factory-girl';
import application from '../../test/utils/requestHelper';
import config, { configFiles } from '../utils/loadconfig';

import '../../test/factories/medication';
import { verifyMedication, verifyResponse } from '../../test/helpers/medications';

import { ROUTE_NAME } from './routes';

const {
  response: { CREATED, JSON_TYPE, BAD_REQUEST },
} = http;
const {
  requestHelpers: { parsedSingleResponse, parsedErrorResponse, bearerToken },
} = test;

config.loadFile(configFiles);

let app = null;
const url = `/${ROUTE_NAME}`;
let headers = null;

describe('Users', () => {
  beforeAll(async () => {
    app = await application();
    await app.start();
    headers = bearerToken(config);
  });

  afterAll(async () => {
    const db = await app.db;
    await db.disconnect();
    await app.stop({ timeout: 10 });
  });

  describe('Create', () => {
    it('Create Medication', async () => {
      const payload = await factory.attrs('Medication');
      const response = await app.inject({
        method: 'POST',
        url,
        payload,
        headers,
      });

      expect(response.statusCode).toBe(CREATED.code);
      expect(response.statusMessage).toBe('Created');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const Medication = parsedSingleResponse(response);

      verifyMedication(Medication);

      verifyResponse(Medication, payload);
      expect(Medication.id).toBeValidObjectId();
    });

    it('Cannot create Medication', async () => {
      const payload = await factory.attrs('Medication', { name: null });
      const response = await app.inject({
        method: 'POST',
        url,
        payload,
        headers,
      });

      expect(response.statusCode).toBe(BAD_REQUEST.code);
      expect(response.statusMessage).toBe('Bad Request');
      expect(response.headers['content-type']).toMatch(JSON_TYPE);

      const res = parsedErrorResponse(response);
      expect(res).toHaveProperty('message');
      expect(res.message).toBe(BAD_REQUEST.message);
    });
  });
});

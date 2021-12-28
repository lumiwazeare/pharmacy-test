import { factory } from 'factory-girl';

import '../../../../test/factories/medication';
import queries from './queries';
import { configFiles } from '../../../utils/loadconfig';

import { mongooseConnect, dbConfig as config } from '@ctt/crud-api';

let db, medicationQueries;

describe('Medication queries', () => {
  beforeAll(async () => {
    config.loadFile(configFiles);
    db = await mongooseConnect(config);
    medicationQueries = queries(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('create', () => {
    it('can create a Medication', async () => {
      const payload = await factory.attrs('Medication');

      const medication = await medicationQueries.create({ payload });

      expect(medication).toBeDefined();

      expect(medication).toHaveProperty('name');
      expect(medication).toHaveProperty('id');
      expect(medication['name']).toEqual(payload['name']);
    });

    it('cannot create a Medication', async () => {
      const payload = await factory.attrs('Medication', { name: undefined });

      try {
        await expect(await (async () => medicationQueries.create({ payload }))()).resolves.toThrow();
      } catch ({ errors, name, message }) {
        expect(name).toBe('ValidationError');
        expect(message).toMatch(/`name` is required/);
        expect(errors).toHaveProperty('name');
        expect(errors['name']['path']).toBe('name');
        expect(errors['name']['kind']).toBe('required');
      }
    });
  });
});

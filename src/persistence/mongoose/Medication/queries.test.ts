import factory from '../../../../test/factories/medication';
import queries from './queries';
import { configFiles } from '../../../utils/loadconfig';
import * as mongoose from 'mongoose';

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

    it('find all medication by default', async () => {
      let payload = await factory.attrs('Medication', { name: 'test' });
      await medicationQueries.create({ payload });

      payload = await factory.attrs('MedicationAll');
      const medications = await medicationQueries.findAll({ payload });
      expect(medications.docs).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'test' })]));
      expect(medications).toHaveProperty('page');
      expect(medications).toHaveProperty('limit');
      expect(medications).toHaveProperty('totalPages');
      expect(medications).toHaveProperty('pagingCounter');
      expect(medications).toHaveProperty('prevPage', null);
      expect(medications).toHaveProperty('nextPage', null);
    });

    it('find medication by id', async () => {
      let payload = await factory.attrs('Medication');

      const result = await medicationQueries.create({ payload });

      payload = await factory.attrs('MedicationAll', { id: result.id });
      const medication = await medicationQueries.findById({ payload });
      expect(result.id).toMatch(medication.id);
    });

    it('remove medication by id', async () => {
      let payload = await factory.attrs('Medication');

      const result = await medicationQueries.create({ payload });

      payload = await factory.attrs('MedicationAll', { id: result.id });
      let medication = await medicationQueries.removeById({ payload });

      //validate the object does not exist again
      medication = await medicationQueries.findById({ payload });
      expect(medication).toBeNull();
    });

    it('update medication by id', async () => {
      let payload = await factory.attrs('Medication', {
        identifier: ['56cb91bdc3464f14678934ca', '56cb91bdc3464f14678934c2'],
      });

      const result = await medicationQueries.create({ payload });

      payload = await factory.attrs('MedicationAll', { id: result.id, name: 'olumide' });
      let medication = await medicationQueries.updateById({ payload });
      expect(medication).toMatchObject({ n: 1, nModified: 1, ok: 1 });

      //validate the object has been modified by checking the name
      payload = result;
      medication = await medicationQueries.findById({ payload });
      expect(medication.name).toMatch('olumide');
    });

    it('find all medication by manaufacturer name', async () => {
      const names = ['enyo', 'mayor', 'thedrug', 'enyo2'];
      for (let i = 0; i < names.length; i++) {
        const payload = await factory.attrs('Medication', { name: `test${i}`, manufacturer: names[i] });
        await medicationQueries.create({ payload });
      }

      const payload = await factory.attrs('MedicationAll', { manufacturer: 'en' });
      const medications = await medicationQueries.findAll({ payload });
      expect(medications.docs).toEqual(expect.arrayContaining([expect.objectContaining({ manufacturer: 'enyo' })]));
      expect(medications).toHaveProperty('page');
      expect(medications).toHaveProperty('limit');
      expect(medications).toHaveProperty('totalPages');
      expect(medications).toHaveProperty('pagingCounter');
      expect(medications).toHaveProperty('prevPage');
      expect(medications).toHaveProperty('nextPage');
    });
  });
});

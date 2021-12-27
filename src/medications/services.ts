import { pickBy } from 'ramda';
import tmplJson from './parsers/json';
import { Dict, Crud, ServiceArgs } from '@ctt/crud-api';
import { MedicationI } from '../persistence/mongoose/Medication/model';
import { PaginateResult } from 'mongoose';
import { responseDocumentSchema, createPaginationLink } from '../utils/schemas';

const create = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const medication = await db.medications.create({ payload, config });

  if (!medication) {
    throw Error(medication);
  }

  return json(responseDocumentSchema(tmplJson))({ data: [medication] });
};

const findById = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const medication = await db.medications.findById({ payload, config });

  if (!medication) {
    throw Error(medication);
  }

  return json(responseDocumentSchema(tmplJson))({ data: [medication] });
};

const findAll = async ({ db, payload, config, json }: ServiceArgs): Promise<string> => {
  const medications = (await db.medications.findAll({ payload, config })) as PaginateResult<MedicationI>;

  if (!medications) {
    throw Error(`$}`);
  }

  if (medications.docs.length < 1) {
    throw Error('Could not find medications');
  }

  const {
    docs,
    totalDocs: items,
    nextPage,
    prevPage,
    totalPages: pages,
    page,
    hasNextPage,
    hasPrevPage,
    limit,
    pagingCounter,
  } = medications;

  const medicationPaginator = createPaginationLink('medications');

  const next = hasNextPage && medicationPaginator(nextPage, limit);
  const previous = hasPrevPage && medicationPaginator(prevPage, limit);
  const first = medicationPaginator(page, 1, pagingCounter - 1);
  const last = medicationPaginator(page, 1, pagingCounter - 2 + docs.length);
  const current = medicationPaginator(page, limit);

  return json(responseDocumentSchema(tmplJson))({
    data: docs,
    pagination: pickBy(val => !!val, { items, next, previous, pages, first, last, current }),
  });
};

const removeById = async ({ db, payload, config }: ServiceArgs): Promise<void> => {
  const result = await db.medications.removeById({ payload, config });

  if (!result.nModified) {
    throw Error(result);
  }
};

const updateById = async ({ db, payload, config }: ServiceArgs): Promise<object> => {
  const result = await db.medications.updateById({ payload, config });

  if (!result.nModified) {
    throw Error(result);
  }

  return result;
};

export default (db: Dict): Crud<string> => ({
  create: async ({ payload, config, json }: ServiceArgs): Promise<string> =>
    create({
      db,
      payload,
      config,
      json,
    }),
  findById: async ({ payload, config, json }: ServiceArgs): Promise<string> =>
    findById({
      db,
      payload,
      config,
      json,
    }),
  findAll: async ({
    payload,
    config,
    json,
  }: ServiceArgs): Promise<any> => // eslint-disable-line
    findAll({
      db,
      payload,
      config,
      json,
    }),
  removeById: async ({ payload, config, json }: ServiceArgs): Promise<void> =>
    removeById({
      db,
      payload,
      config,
      json,
    }),
  updateById: async ({ payload, config, json }: ServiceArgs): Promise<object> =>
    updateById({
      db,
      payload,
      config,
      json,
    }),
});

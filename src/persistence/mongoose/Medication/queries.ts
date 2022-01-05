import { pickBy, path } from 'ramda';
import { timezone, intl } from '@ctt/service-utils';

import Medication, { MedicationI } from './model';
import { PaginateResult } from 'mongoose';
import { QueryArgs, DbClient, Query } from '@ctt/crud-api';

const create = async ({ payload }: QueryArgs): Promise<MedicationI> => {
  const medication = new Medication({
    ...payload,
    meta: { ...payload.meta, ...{ created: timezone.parse(Date.now(), intl.tz.LB) } },
  });

  return (await medication.save()).toObject();
};

const findAll = async ({ payload }: QueryArgs): Promise<PaginateResult<MedicationI>> =>
  Medication.paginate(
    {
      ...pickBy(val => !!val, {
        name: path(['name'], payload),
        manufacturer: path(['manufacturer'], payload) && {
          $regex: '' + path(['manufacturer'], payload),
          $options: 'i',
        },
        'meta.created': path(['from'], payload) && {
          $gte: path(['from'], payload),
          $lte: path(['to'], payload),
        },
      }),
    },
    {
      page: payload.page,
      limit: payload.limit,
      offset: payload.offset,
      lean: true,
      leanWithId: true,
      sort: { 'meta.created': 'desc', 'meta.updated': 'desc', manufacturer: 'asc' },
    }
  );

const findById = async ({ payload }: QueryArgs): Promise<MedicationI> =>
  Medication.findById(payload.id).lean({ virtuals: true });

const removeById = async ({ payload }: QueryArgs): Promise<object> =>
  Medication.remove({ _id: payload.id }, { $set: { 'meta.active': false, 'meta.updated': Date.now() } });

const updateById = async ({ payload }: QueryArgs): Promise<object> =>
  Medication.updateOne(
    { _id: payload.id },
    {
      ...pickBy(val => !!val, {
        ...payload,
        ...{
          $set: {
            'meta.updated': Date.now(),
          },
        },
      }),
    }
  );

export default (client: DbClient): Query<MedicationI> => ({
  create: async ({ payload, config }: QueryArgs): Promise<MedicationI> => await create({ client, payload, config }),
  findAll: async ({ payload }: QueryArgs): Promise<PaginateResult<MedicationI>> => await findAll({ payload, client }),
  findById: async ({ payload }: QueryArgs): Promise<MedicationI> => await findById({ payload, client }),
  removeById: async ({ payload }: QueryArgs): Promise<object> => await removeById({ payload, client }),
  updateById: async ({ payload }: QueryArgs): Promise<object> => await updateById({ payload, client }),
});

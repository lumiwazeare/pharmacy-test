import paginate from 'mongoose-paginate-v2';
import leanVirtuals from 'mongoose-lean-virtuals';
import { Document, Schema, PaginateModel, model } from 'mongoose';

import { MetaSchema, Persistable, DefaultSchemaOptions } from '../schemas';

interface MedicationFields extends Persistable {
  name: string;
}

export interface MedicationI extends MedicationFields, Document {}

export const MedicationSchema: Schema = new Schema(
  {
    name: { type: String, lowercase: true, trim: true, required: true },
    meta: { type: MetaSchema },
  },
  DefaultSchemaOptions
);

MedicationSchema.index({ 'meta.created': -1 });
MedicationSchema.index({ 'meta.updated': -1 });

MedicationSchema.plugin(paginate);
MedicationSchema.plugin(leanVirtuals);

type Medication = PaginateModel<MedicationI>;

const Medication = model<MedicationI>('Medication', MedicationSchema) as Medication;

export default Medication;

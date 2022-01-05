import { Document, Schema, PaginateModel, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import leanVirtuals from 'mongoose-lean-virtuals';

import { MetaSchema, Persistable, DefaultSchemaOptions } from '../schemas';
import { bool, date, number, string } from 'joi';

//------------ Ingredient BEGIN -----------------
//ingredient
export enum ingredientResourceType {
  substance,
  medication,
}

interface IngredientFields extends Persistable {
  item: 'codeableConcept' | ingredientResourceType;
  isActive: boolean;
  ratio: number;
}

export interface IngredientI extends IngredientFields, Document {}

export const IngredientSchema: Schema = new Schema({
  item: Schema.Types.Mixed,
  isActive: Boolean,
  ratio: Number,
  meta: { type: MetaSchema },
});

//------------ Batch BEGIN -----------------
//Batch
interface BatchFields extends Persistable {
  lotNumber: string;
  expirationDate: Date;
}

export interface BatchI extends BatchFields, Document {}

export const BatchSchema: Schema = new Schema({
  lotNumber: { type: String, unique: true },
  expirationDate: Date,
  meta: { type: MetaSchema },
});

//------------ Medication BEGIN -----------------
interface MedicationFields extends Persistable {
  identifier: string;
  code: string;
  status: 'active' | 'inactive' | 'entered-in-error';
  manufacturer: string;
  form: 'powder' | 'tablets' | 'capsule';
  amount: number;
  name: string;
  ingredient: IngredientI[];
  batch: BatchI[];
}

export interface MedicationI extends MedicationFields, Document {}

export const MedicationSchema: Schema = new Schema(
  {
    identifier: [Schema.Types.ObjectId],
    name: { type: String, lowercase: true, trim: true, required: true },
    code: String,
    status: { type: String, enum: ['active', 'inactive', 'entered-in-error'] },
    manufacturer: String,
    form: { type: String, enum: ['powder', 'tablets', 'capsule'] },
    amount: Number,
    ingredient: [IngredientSchema],
    batch: BatchSchema,
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

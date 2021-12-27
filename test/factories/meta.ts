import { factory } from 'factory-girl';

import { MetaSchema } from '../../src/persistence/mongoose/schemas';

export default factory.define('Meta', MetaSchema, {
  active: true,
});

import { factory } from 'factory-girl';

import Medication from '../../src/persistence/mongoose/Medication/model';

factory.define('Medication', Medication, {
  name: 'test',
});

factory.define('MedicationAll', Medication, {
  page: 1,
  limit: 10,
  offset: 0,
});

export default factory;

import { factory } from 'factory-girl';

import Medication from '../../src/persistence/mongoose/Medication/model'

export default factory.define('Medication', Medication, {
  name: 'test'
});

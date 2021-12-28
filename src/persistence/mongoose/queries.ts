import { Dict, DbClient } from '@ctt/crud-api';

import medication from './Medication/queries';

export default (client: DbClient): Dict => ({
  medications: medication(client),
}); // eslint-disable-line  no-unused-vars

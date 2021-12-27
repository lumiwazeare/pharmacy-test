import { database } from '@ctt/service-utils';
import { resolve } from 'path';
import config, { configFiles } from '../../utils/loadconfig';

config.loadFile(configFiles);

database.restore({
  // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
  uri: `${config.get('mongo.host')}/${config.get('mongo.database')}`,
  root: resolve(__dirname, `./${config.get('db.dump')}/${config.get('mongo.database')}`),
  metadata: true,
  dropCollections: [],
});

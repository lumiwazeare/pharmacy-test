import { resolve } from 'path';
import convict from 'convict';
import { config as conf } from '@ctt/crud-api';

import appConfig from '../config';

export const configFiles = [
  resolve(__dirname, `../../config/${String(process.env.NODE_ENV)}.json`),
];

export default convict({ ...conf, ...appConfig });

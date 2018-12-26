import 'dotenv/config';

import middlewares from './middlewares';
import './database';
import routes from '../modules';

export default (app) => {
  middlewares(app);
  routes(app);
};


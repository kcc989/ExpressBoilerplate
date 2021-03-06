import 'dotenv/config';
import express from 'express';

import appConfig from './config/appConfig';

const app = express();
appConfig(app);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});


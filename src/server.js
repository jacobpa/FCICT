import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

import apiRouter from './server/api';
import FCICSDb from './db';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = polka();

const init = async () => {
  const db = await FCICSDb.getDatabase();

  // Deprecating this service as of 2022/12/18
  // cron.schedule('15 2,8,14,20 * * *', () => {
  //   fetch();
  // });

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use(compression({ threshold: 0 }));
  app.use(sirv('static', { dev }));
  app.use('/api', apiRouter);
  app.use(sapper.middleware());


  app.listen(PORT, (err) => {
    if (err) console.log('error', err);
  });
};

init();

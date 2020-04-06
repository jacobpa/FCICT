import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

import apiRouter from './server/api';
import FCICSDb from './db';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = polka();

const init = async() => {
	const db = await FCICSDb.getDatabase();

	app.use((req, res, next) => {
		req.db = db;
		next();
	});
	
	app.use(compression({threshold: 0}));
	app.use(sirv('static', { dev }));
	app.use('/api', apiRouter);
	app.use(sapper.middleware());


	app.listen(PORT, err => {
		if (err) console.log('error', err);
	});
}

init();

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import morgan from 'morgan';
import config from '../config/config';
import routes from './routes';

const { PORT, DIRNAME } = config;
const app = express();

/**
* Configuring application middleware
*/
app.use('/', express.static('views'));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));

/** Application REST endpoint's definition */
app.use('/api', routes);

/** Serving main view file */
// app.get('/', (req, res) => {
//   res.sendFile(`${DIRNAME}/views/index.html`);
// });

/** Starting server on the configured PORT */
app.listen(PORT, (err) => {
  if(err) {
    console.error(`Error on port ${PORT}`);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});

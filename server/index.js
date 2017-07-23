import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import morgan from 'morgan';
import routes from './routes';
import appConfig from './config';

const { PORT, DIRNAME } = appConfig;
const app = express();

/**
* Configuring application middleware
*/
app.use('/', express.static('views'));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/** Application REST endpoint's definition */
app.use('/api', routes);

/** Serving main view file */
app.get('/', (req, res) => {
  res.sendFile(`${DIRNAME}/views/index.html`);
});

/** Starting server on the configured PORT */
app.listen(PORT, (err) => {
  if(err) {
    console.error(`Error on port ${PORT}`);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});

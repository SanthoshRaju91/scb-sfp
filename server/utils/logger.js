/**
* Creating logger instance and exposing logger methods
*/

import logger from 'logger';
import config from '../config';
import fs from 'fs';
import path from 'path';

const ENV = process.env.ENV || 'development';

const {
    loggerConfig,
    DIRNAME
} = config;

let loggerInstance = null;

if (ENV === 'development') {
    if (!fs.existsSync(path.resolve(`${__dirname}/../${loggerConfig.PATH}/${loggerConfig.dev}`))) {
        console.log(`${__dirname}/../${loggerConfig.PATH}`);
        fs.mkdirSync(path.resolve(`${__dirname}/../${loggerConfig.PATH}`));
    }

    loggerInstance = logger.createLogger(path.resolve(`${__dirname}/../${loggerConfig.PATH}/${loggerConfig.dev}`));
} else if (ENV === 'production') {
    if (!fs.existsSync(path.resolve(`${__dirname}/../${loggerConfig.PATH}/${loggerConfig.prod}`))) {
      console.log(`${__dirname}/../${loggerConfig.PATH}`);
        fs.mkdirSync(path.resolve(`${__dirname}/../${loggerConfig.PATH}`));
    }

    loggerInstance = logger.createLogger(path.resolve(`${__dirname}/../../${loggerConfig.PATH}/${loggerConfig.prod}`));
}


loggerInstance.info('Logger instaniated');

module.exports = {

  /**
  * info logger function
  * @method info
  * @param message
  */
  info(message) {
    loggerInstance.info(message);
  },

  /**
  * error logger function
  * @method error
  * @param message
  */
  error(message) {
    loggerInstance.error(message);
  },


  /**
  * warn logger function
  * @method warn
  * @param message
  */
  warn(message) {
    loggerInstance.warn(message);
  },
};

module.exports = {
  PORT : 3000,
  DIRNAME: '__dirname',
  mapping: {
    location: 'LOCATION',
    gitURL: 'GIT_URL',
    name: 'NAME'
  },
  loggerConfig: {
    PATH: '../logs',
    dev: 'development.log',
    prod: 'production.logs'
  }
};

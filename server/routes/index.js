import {
    Router
} from 'express';
import fs from 'fs';
import shell from 'shelljs';
import path from 'path';
import appConfig from '../config';
import utils from '../utils';
import logger from '../utils/logger';

const routes = new Router;

var isLocked = false;
var version = Math.floor(Math.random() * 1000000000);

/**
 * Route for getting the translation for the selected language
 * @URL /getTranslation/:lang
 */
routes.get('/getTranslation/:lang', (req, res) => {
    let payload = req.params;
    let appConfig = JSON.parse(utils.readFileSync(`${__dirname}/../../config/config.json`, 'utf8'));
    let {
        LOCATION
    } = appConfig;

    utils.readFile(`${LOCATION}/${payload.lang}/translations.json`, 'utf8')
        .then(response => {
            let data = JSON.parse(response);
            res.json({
                transactionSuccess: true,
                data,
                version
            });
        })
        .catch(err => {
            logger.error(err);
            res.json({
                transactionSuccess: false,
                message: 'Something went wrong'
            });
        });
});

/**
* Route to save the translation
* @URL /submit
*/
routes.post('/submit', async(req, res) => {
    if (isLocked) {
        res.json({
            transactionSuccess: false,
            message: 'File update in progess'
        });
        return;
    } else if (req.body.version !== version) {
        res.json({
            transactionSuccess: false,
            message: 'Your translation file is not updated.'
        });
        return;
    }

    isLocked = true;
    let appConfig = JSON.parse(utils.readFileSync(`${__dirname}/../../config/config.json`, 'utf8'));

    let {
        LOCATION,
        GIT_URL,
        GIT_LOCATION
    } = appConfig;

    let lang = req.body.lang,
        dir = `${LOCATION}/${lang}`,
        username = req.body.username,
        password = req.body.password,
        translations = JSON.stringify(req.body.data),
        mode = req.body.mode;

    let pwd = shell.exec('pwd');
    let rootPwd = pwd.stdout.toString();

    if (!fs.existsSync(`${LOCATION}`)) {
        fs.mkdirSync(`${LOCATION}`);
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    //create back up
    utils.createFileBackup(`${dir}/translations.json`);

    utils.writeFile(`${dir}/translations.json`, translations, 'utf8')
      .then(response => {
        if(response) {

          let gitURL = utils.constructGitURL(GIT_URL, username, password);

          if (!fs.existsSync(`${GIT_LOCATION}`)) {
              fs.mkdirSync(`${GIT_LOCATION}`);
              shell.exec(`git clone ${gitURL} ${GIT_LOCATION}`);
          }

          shell.cp('-r', `${dir}/`, `${GIT_LOCATION}`);
          shell.exec(`git config user.name "${username}"`);
          shell.exec(`git config user.password "${password}"`);
          shell.cd(`${GIT_LOCATION}/${lang}`);
          shell.exec('git add .');
          shell.exec(`git commit -m "Adding translation to ${lang}"`);
          shell.exec(`git pull origin master`);
          let command = shell.exec(`git push ${gitURL} --all`);


          if (command.code !== 0) {
              shell.cd(`${rootPwd}`);

              //roll back translations.json
              utils.rollBackFile(`${dir}/translations.json`, `${dir}/translations.json.bak`);
              if (mode === 'add') {
                  shell.rm('-rf', `${dir}`);
                  // roll back language.json
                  utils.rollBackFile(`${__dirname}/../../config/language.json`, `${__dirname}/../../config/language.json.bak`);
              }
              isLocked = false;
              res.json({
                  transactionSuccess: false
              });
          } else {
              shell.cd(`${rootPwd}`);
              // deleting backup file
              utils.deleteBackup(`${dir}/translations.json.bak`);
              isLocked = false;
              version = Math.floor(Math.random() * 1000000000);

              res.json({
                  transactionSuccess: true,
                  version
              });
          }
        } else {
          logger.warn('Was not able to write to translations file');

          // roll back to existing file.
          utils.rollBackFile(`${dir}/translations.json`, `${dir}/translations.json.bak`);

          res.json({
            transactionSuccess: false,
            message: 'Something went wrong'
          });
        }
      })
      .catch(err => {
        logger.error(err);

        // roll back to existing file.
        utils.rollBackFile(`${dir}/translations.json`, `${dir}/translations.json.bak`);

        res.json({
          transactionSuccess: false,
          message: 'Something went wrong'
        });
      });
});


/**
 * Route for getting the configuration
 * @URL /config
 */
routes.get('/config', (req, res) => {
    utils.readFile(`${__dirname}/../../config/config.json`, 'utf8')
        .then(response => {
            let data = JSON.parse(response);

            if (data.isConfigured) {
                res.json({
                    isConfigured: true,
                    name: data.NAME
                })
            } else {
                logger.warn('config.json is empty');
                res.json({
                    isConfigured: false
                });
            }
        })
        .catch(err => {
            logger.error(err);
            res.json({
                isConfigured: false,
                message: 'Something went wrong'
            })
        });
});


/**
 * Route for saving the configuration for the application
 * @URL /config
 */
routes.post('/config', (req, res) => {

    let request = req.body;

    let configJSON = {};

    for (let i in request) {
        configJSON[appConfig.mapping[i]] = request[i];
    };

    configJSON['isConfigured'] = true;
    configJSON['GIT_LOCATION'] = 'git-location';
    configJSON['DIRNAME'] = '__dirname';

    utils.writeFile(path.resolve(`${__dirname}/../../config/config.json`), JSON.stringify(configJSON), 'utf8')
        .then(response => {
            if (response) {
                res.json({
                    transactionSuccess: true
                })
            } else {
              logger.warn('Was not able to save the configuration');
              res.json({
                transactionSuccess: false
              })
            }
        })
        .catch(err => {
          logger.error(err);
            res.json({
                transactionSuccess: false,
                message: 'Something went wrong'
            });
        });
});

/**
 * Route for getting the saved languages
 * @URL /language
 */
routes.get('/language', (req, res) => {
    utils.readFile(`${__dirname}/../../config/language.json`, 'utf8')
        .then(response => {
            logger.info('languages fetched');
            res.json({
                transactionSuccess: true,
                languages: JSON.parse(response)
            })
        })
        .catch(err => {
            logger.error(err);
            res.json({
                transactionSuccess: false,
                message: 'Something went wrong'
            })
        });
});

/**
 * Route for saving the language
 * @URL /language
 */
routes.post('/language', (req, res) => {
    let {
        lang,
        description,
    } = req.body;

    let languagesArray = JSON.parse(utils.readFileSync(`${__dirname}/../../config/language.json`, 'utf8'));
    let selectedLanguage = languagesArray.filter((item) => {
        return item.lang.toLocaleLowerCase() === lang.toLocaleLowerCase() || !lang;
    });
    if (selectedLanguage && selectedLanguage.length > 0) {
        res.json({
            transactionSuccess: false,
            message: 'Language already exists or invalid'
        });
    } else {
        languagesArray.push({
            lang,
            description
        });

        utils.createFileBackup(`${__dirname}/../../config/language.json`);

        utils.writeFile(`${__dirname}/../../config/language.json`, JSON.stringify(languagesArray), 'utf8')
            .then(response => {
                if (response) {
                    utils.deleteBackup(`${__dirname}/../../config/language.json.bak`);
                    res.json({
                        transactionSuccess: true,
                        lang,
                        version,
                        description
                    })
                } else {
                    logger.warn('Was not able to save the language');
                    utils.rollBackFile(`${__dirname}/../../config/language.json`, `${__dirname}/../../config/language.json.bak`);
                    res.json({
                        transactionSuccess: false,
                        message: 'Something went wrong'
                    });
                }
            })
            .catch(err => {
                logger.error(err);
                utils.rollBackFile(`${__dirname}/../../config/language.json`, `${__dirname}/../../config/language.json.bak`);
                res.json({
                    transactionSuccess: false,
                    message: 'Something went wrong'
                });
            });
    }
});

export default routes;

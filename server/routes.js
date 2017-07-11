import {
    Router
} from 'express';
import fs from 'fs';
import config from '../config/config.json';
import language from '../config/language.json';

const routes = new Router;
const {
    LOCATION
} = config;

routes.post('/submit', (req, res) => {
    fs.writeFile(LOCATION, JSON.stringify(req.body), 'utf8', (err) => {
        if (err) throw err;
        res.json({
            transactionSuccess: true
        });
    });
});

routes.get('/config', (req, res) => {
    res.json(config);
});

routes.post('/config', (req, res) => {
    fs.writeFile(`${__dirname}/../config/config.json`, JSON.stringify(req.body), 'utf8', (err) => {
        if (err) throw err;
        res.json({
            transactionSuccess: true
        });
    });
});

routes.get('/language', (req, res) => {
    res.json(language);
});

routes.post('/language', (req, res) => {
    let { lang, description } = req.body;
    let selectedLanguage = language.filter((item) => {
      return item.lang === lang;
    });
    if(selectedLanguage && selectedLanguage.length > 0) {
      res.send(500, 'Language already exists');
    } else {
      language.push({lang, description});
      fs.writeFile(`${__dirname}/../config/language.json`, JSON.stringify(language), 'utf8', (err) => {
          if (err) throw err;
          res.json({
              transactionSuccess: true,
              data: language
          });
      });
    }
});

export default routes;

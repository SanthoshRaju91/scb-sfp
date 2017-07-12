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


routes.get('/getTranslation/:lang', (req, res) => {
  let payload = req.params;
  fs.readFile(`${config.LOCATION}/${payload.lang}/translations.json`, 'utf8',(err, data) => {
    if(err) {
      console.error(err);
      res.json({ success: false, message: 'Something went wrong'});
    } else {
      let responseData = JSON.parse(data);
      res.json({ success: true, data: responseData });
    }
  });
});

routes.post('/submit', (req, res) => {
    let lang = req.body.lang,
        dir  = `${LOCATION}/${lang}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    fs.writeFile(`${dir}/translations.json`, JSON.stringify(req.body.data), 'utf8', (err) => {
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

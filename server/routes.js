import {
    Router
} from 'express';
import fs from 'fs';
import config from '../config/config.json';
import language from '../config/language.json';
import shell from 'shelljs';
import appConfig from './config';

const routes = new Router;


var isLocked = false;

function constructGitURL(url, username, password) {
    let encodedPassword = encodeURIComponent(password);
    encodedPassword = encodedPassword.replace(/!/g, '%21');
    let index = url.indexOf('//');
    let protocol = url.substr(0, index);
    let git = url.slice(index + 2);
    return `${protocol}//${username}:${encodedPassword}@${git}`;
}

routes.get('/getTranslation/:lang', (req, res) => {
    let payload = req.params;
    let appConfig = JSON.parse(fs.readFileSync(`${__dirname}/../config/config.json`, 'utf8'));
    let { LOCATION } = appConfig;
    
    fs.readFile(`${LOCATION}/${payload.lang}/translations.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.json({
                success: false,
                message: 'Something went wrong'
            });
        } else {
            let responseData = JSON.parse(data);
            res.json({
                success: true,
                data: responseData
            });
        }
    });
});

routes.post('/submit', async(req, res) => {
    if (isLocked) {
        res.json({
            transactionSuccess: false,
            message: 'File update in progess'
        });
    }

    isLocked = true;
    let appConfig = JSON.parse(fs.readFileSync(`${__dirname}/../config/config.json`, 'utf8'));

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


    shell.exec(`mv ${dir}/translations.json ${dir}/translations.json.bak`);

    fs.writeFile(`${dir}/translations.json`, translations, 'utf8', (err) => {
        if (err) {
            shell.exec(`mv ${dir}/translations.json.bak ${dir}/translations.json`);
            res.json({
                transactionSuccess: false,
                message: 'Something went wrong'
            });
        } else {

            let gitURL = constructGitURL(GIT_URL, username, password);
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
                shell.rm('-rf', `${dir}/translations.json`);
                shell.exec(`mv ${dir}/translations.json.bak ${dir}/translations.json`);
                if (mode === 'add') {
                    shell.rm('-rf', `${dir}`);
                    shell.exec(`mv ${__dirname}/../config/language.json.bak ${__dirname}/../config/language.json`);
                }
                isLocked = false;
                res.json({
                    transactionSuccess: false
                });
            } else {
                shell.cd(`${rootPwd}`);
                shell.rm('-rf', `${dir}/translations.json.bak`);
                isLocked = false;
                console.log('Passed!!!!!!')

                res.json({
                    transactionSuccess: true
                });
            }
        }
    });
});


routes.get('/config', (req, res) => {
    fs.readFile(`${__dirname}/../config/config.json`, 'utf8', (err, data) => {
        if (err) {
            res.json({
                isConfigured: false,
                message: 'Something went wrong'
            })
        } else {
            let responseData = JSON.parse(data);
            if (responseData.isConfigured) {
                res.json({
                    isConfigured: true,
                    name: responseData.NAME
                });
            } else {
                res.json({
                    isConfigured: false
                });
            }
        }
    });
});

routes.post('/config', (req, res) => {

    let request = req.body;

    let configJSON = {};

    for (let i in request) {
        configJSON[appConfig.mapping[i]] = request[i];
    };

    configJSON['isConfigured'] = true;
    configJSON['GIT_LOCATION'] = 'git-location';
    configJSON['DIRNAME'] = '__dirname';

    fs.writeFileSync(`${__dirname}/../config/config.json`, JSON.stringify(configJSON), 'utf8', (err) => {
        if (err) throw err;
    });

    res.json({
        transactionSuccess: true
    });
});

routes.get('/language', (req, res) => {
    fs.readFile(`${__dirname}/../config/language.json`, 'utf8', (err, data) => {
        if(err) {
          res.json({
            transactionSuccess: false,
            message: 'Something went wrong'
          })
        } else {
          res.json({
            transactionSuccess: true,
            languages: JSON.parse(data)
          })
        }
    });
});

routes.post('/language', (req, res) => {
    let {
        lang,
        description,
    } = req.body;

    let languagesArray = JSON.parse(fs.readFileSync(`${__dirname}/../config/language.json`, 'utf8'));
    let selectedLanguage = languagesArray.filter((item) => {
        return item.lang.toLocaleLowerCase() === lang.toLocaleLowerCase() || !lang;
    });
    if (selectedLanguage && selectedLanguage.length > 0) {
        res.json({
            transactionSuccess: false,
            message: 'Language already exists or invalid'
        });
    } else {
        language.push({
            lang,
            description
        });
        shell.exec(`mv ${__dirname}/../config/language.json ${__dirname}/../config/language.json.bak`);
        fs.writeFile(`${__dirname}/../config/language.json`, JSON.stringify(language), 'utf8', (err) => {
            if (err) throw err;
            res.json({
                transactionSuccess: true,
                lang,
                description
            });
        });
    }
});

export default routes;

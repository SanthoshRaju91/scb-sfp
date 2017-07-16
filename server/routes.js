import {
    Router
} from 'express';
import fs from 'fs';
import config from '../config/config.json';
import language from '../config/language.json';
import shell from 'shelljs';
// import async from 'async';
// import websocketServer from './websocketServer'

const routes = new Router;
const {
    LOCATION,
    GIT_LOCATION
} = config;

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
    fs.readFile(`${config.LOCATION}/${payload.lang}/translations.json`, 'utf8', (err, data) => {
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
    console.log(isLocked);
    if(isLocked) {
      res.json({ transactionSuccess: false, message: 'File update in progess'});
    }

    isLocked =true;
    let lang = req.body.lang,
        dir = `${LOCATION}/${lang}`,
        username = req.body.username,
        password = req.body.password,
        translations = JSON.stringify(req.body.data);
    // websocketConnection = websocketServer.getConnection();
    let pwd = shell.exec('pwd');
    let rootPwd = pwd.stdout.toString();

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

            let gitURL = constructGitURL(config.GIT_URL, username, password);
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
                isLocked = false;
                res.json({
                    transactionSuccess: false
                });
            } else {
                shell.cd(`${rootPwd}`);
                shell.rm('-rf', `${dir}/translations.json.bak`);
                isLocked = false;
                res.json({
                    transactionSuccess: true
                });
            }
        }
        // websocketConnection.sendUTF(JSON.stringify({'lang':lang,'translations': translations}));

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
    let {
        lang,
        description
    } = req.body;
    let selectedLanguage = language.filter((item) => {
        return item.lang.toLocaleLowerCase() === lang.toLocaleLowerCase() || !lang;
    });
    if (selectedLanguage && selectedLanguage.length > 0) {
        res.send(500, 'Language already exists or invalid');
    } else {
        language.push({
            lang,
            description
        });
        fs.writeFile(`${__dirname}/../config/language.json`, JSON.stringify(language), 'utf8', (err) => {
            if (err) throw err;
            res.json({
              transactionSuccess: true,
              lang,
              description
            });
            // let dir = `${LOCATION}/${lang}`;
            // if (!fs.existsSync(dir)) {
            //     fs.mkdirSync(dir);
            // }
            // fs.writeFile(`${dir}/translations.json`, JSON.stringify(data), 'utf8', (err2) => {
            //     if (err2) throw err2;
            //
            //     let gitURL = constructGitURL(config.GIT_URL, password);
            //     if (!fs.existsSync(`${GIT_LOCATION}`)) {
            //         fs.mkdirSync(`${GIT_LOCATION}`);
            //         shell.exec(`git clone ${gitURL} ${GIT_LOCATION}`);
            //     }
            //
            //     shell.cp('-r', `${dir}/`, `${GIT_LOCATION}`);
            //     shell.exec(`git config user.name "${username}"`);
            //     shell.exec(`git config user.password "${password}"`);
            //     shell.cd(`${GIT_LOCATION}/${lang}`);
            //     shell.exec('git add .');
            //     shell.exec(`git commit -m "Adding translation to ${lang}"`);
            //     shell.exec(`git pull origin master`);
            //     let command = shell.exec(`git push ${gitURL} --all`);
            //
            //     if (command.code !== 0) {
            //         shell.cd(`${rootPwd}`);
            //         shell.rm('-rf', `${dir}/translations.json`);
            //         shell.exec(`mv ${dir}/translations.json.bak ${dir}/translations.json`);
            //         isLocked = false;
            //         res.json({
            //             transactionSuccess: false
            //         });
            //     } else {
            //         shell.cd(`${rootPwd}`);
            //         shell.rm('-rf', `${dir}/translations.json.bak`);
            //         isLocked = false;
            //         res.json({
            //           transactionSuccess: true,
            //           lang,
            //           data,
            //           description
            //         });
            //     }
            // });
        });
    }
});

export default routes;

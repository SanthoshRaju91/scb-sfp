import {
    Router
} from 'express';
import fs from 'fs';
import config from '../config';

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

export default routes;

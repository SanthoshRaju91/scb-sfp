const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use('/',express.static('views'));

app.post('/submit',bodyParser.json(),function(req,res){
  var newTranslation = req.body;
  console.log(newTranslation);
  console.log(JSON.stringify(newTranslation));
  fs.writeFile('views/assets/translations.json',JSON.stringify(newTranslation),'utf8',function(err){
    if(err) throw err;
  });
  res.json(newTranslation);
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, function () {
  console.log('server started at http://127.0.0.1/3000');
})

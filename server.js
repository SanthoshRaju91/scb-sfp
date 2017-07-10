const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use('/',express.static('views'));
app.use(bodyParser.json({limit:'50mb'}));

app.post('/submit',function(req,res){
  fs.writeFile('views/assets/translations.json',JSON.stringify(req.body),'utf8',function(err){
    if(err) throw err;
    res.json({transactionSuccess: true});
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, function () {
  console.log('server started at http://127.0.0.1/3000');
})

const express = require('express');
const app = express();

app.use('/static',express.static('views'));


app.post('/submit',function(req,res){

});

app.listen(3000, function () {
  console.log('server started at 3000');
})

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');
const dns = require('dns');

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyparser.urlencoded({extended: false}));

var list = [];

arrayCheck = (url) => {
  if(list.indexOf(url) === -1){
    return false;
  }else{
    return true;
  }
}

app.post('/api/shorturl',(req,res)=>{
  var url = req.body.url;
  var hostname = new URL(url).hostname;

  dns.lookup(hostname,(err,address)=>{
    if(err){
      res.json({error: 'invalid url'});
    }else{
      if(arrayCheck(url)){
        res.json({ original_url: url, short_url: list.indexOf(url) });
      }else{
        list.push(url);
        res.json({ original_url: url, short_url: list.indexOf(url) });
      }
    }
  });
})

app.get('/api/shorturl/:short_url',(req,res)=>{
  var shorturl = req.params.short_url;
  if(shorturl < list.length){
    var original = list[shorturl];
    res.redirect(original);
  }else{
    res.json({error: 'invalid url'});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

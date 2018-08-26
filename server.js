var compression = require('compression');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

app.use(compression());
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));
http.listen(app.get('port'), function () {
  console.log('On localhost 3000');
});

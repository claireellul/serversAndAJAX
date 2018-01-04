  // express is the server that forms part of the nodejs program
  var express = require('express');
  var http = require('http');
  var app = express();
  var httpServer = http.createServer(app);
  httpServer.listen(8080); // as 80 is used by apache

app.get('/', function (req, res) {
  // run some server-side code
	console.log(‘the server has received a request’); 
	res.send(‘Hello World’);
});

// express is the server that forms part of the nodejs program
var express = require('express');
var app = express();

var https = require('https');
var fs = require('fs');
var app = express();
var privateKey = fs.readFileSync('/home/studentuser/certs/client-key.pem').toString();
var certificate = fs.readFileSync('/home/studentuser/certs/client-cert.pem').toString(); 
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");


var databasecode  = require("databasecode");
app.get('/database',function(req,res){
  console.log("database");
  databasecode.printMsg();
  res.send("database");
});



//var pg = require('pg');
//var pool = new pg.Pool(config)


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


httpsServer.listen(4443);


app.post('/uploadData',function(req,res){
  databasecode.uploadData(req,res);
});


app.get('/postgistest', function (req,res) {
  databasecode.simpleQuery(req,res);
});

app.get('/getGeoJSON/:tablename/:geomcolumn', function (req,res) {
  databasecode.generateGeoJSON(req,res);
});


app.get('/getPOI', function (req,res) {
  databasecode.getPOI(req,res);
});

app.get('/', function (req, res) {
  // run some server-side code
	console.log('the server has received a request'); 
	res.send('Hello World');
});

app.get('/:fileName', function (req, res) {
  // run some server-side code
  	var fileName = req.params.fileName;
	console.log(fileName + ' requested'); 
	// note that __dirname  gives the path to the server.js file
	res.sendFile(__dirname + '/'+ fileName);
});

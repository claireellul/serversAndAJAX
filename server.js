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


/*app.post('/uploadData',function(req,res){
	// note that we are using POST here as we are uploading data
	// so the parameters form part of the BODY of the request rather than the RESTful API
	console.dir(req.body);

 	pool.connect(function(err,client,done) {
       	if(err){
          	console.log("not able to get connection "+ err);
           	res.status(400).send(err);
       	} 

        // pull the geometry component together
        // note that well known text requires the points as longitude/latitude !
        // well known text should look like: 'POINT(-71.064544 42.28787)'
        var geometrystring = "st_geomfromtext('POINT(" + req.body.longitude + " " + req.body.latitude + ")'";

       	var querystring = "INSERT into formdata (name,surname,module,language, modulelist, lecturetime, geom) values ('";
       	querystring = querystring + req.body.name + "','" + req.body.surname + "','" + req.body.module + "','";
       	querystring = querystring + req.body.language + "','" + req.body.modulelist + "','" + req.body.lecturetime+"',"+geometrystring + "))";
       	console.log(querystring);
       	client.query( querystring,function(err,result) {
          done(); 
          if(err){
               console.log(err);
               res.status(400).send(err);
          }
          res.status(200).send("row inserted");
       });
    });

});

*/
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

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
//const config = "{"+configtext+"}";

// now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
    var split = configarray[i].split(':');
    config[split[0].trim()] = split[1].trim();
}


console.log(config);

var pg = require('pg');
var pool = new pg.Pool(config)




httpsServer.listen(4443);

app.get('/postgistest', function (req,res) {
pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT name FROM united_kingdom_counties' ,function(err,result) {
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


  app.get('/getPOI', function (req,res) {
     pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
        // use the inbuilt geoJSON functionality
        //client.query('SELECT name, st_asgeojson(geom) as geom from united_kingdom_poi LIMIT 100', function(err,result){
        	var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type     , ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((SELECT l FROM (SELECT id, name, category) As l      )) As properties   FROM united_kingdom_poi  As lg limit 100  ) As f ";
        	console.log(querystring);
        	client.query(querystring,function(err,result){

          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           console.log(result);
           res.status(200).send(result.rows);
       });
    });
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

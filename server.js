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
        // and create the required geoJSON format using a query adapted from here:  http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
        // note that query needs to be a single string with no line breaks so built it up bit by bit

        	var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
        	querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.geom)::json As geometry, ";
        	querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, name, category) As l      )) As properties";
        	querystring = querystring + "   FROM united_kingdom_poi  As lg limit 100  ) As f ";
        	console.log(querystring);
        	client.query(querystring,function(err,result){

          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});


app.get('/getGeoJSON/:tablename/:geomcolumn', function (req,res) {
     pool.connect(function(err,client,done) {
      	if(err){
          	console.log("not able to get connection "+ err);
           	res.status(400).send(err);
       	} 

       	var colnames = "";

       	// first get a list of the columns that are in the table 
       	// use string_agg to generate a comma separated list that can then be pasted into the next query
       	var querystring = "select string_agg(colname,',') from ( select column_name as colname ";
       	querystring = querystring + " FROM information_schema.columns as colname ";
       	querystring = querystring + " where table_name   = '"+ req.params.tablename +"'";
       	querystring = querystring + " and column_name <>'"+req.params.geomcolumn+"') as cols ";

        	console.log(querystring);
        	
        	// now run the query
        	client.query(querystring,function(err,result){
          //call `done()` to release the client back to the pool
          	done(); 
	          if(err){
               	console.log(err);
               		res.status(400).send(err);
          	}
           	colnames = result.rows;
       	});
        	console.log("colnames are " + colnames);

        	// now use the inbuilt geoJSON functionality
        	// and create the required geoJSON format using a query adapted from here:  
        	// http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
        	// note that query needs to be a single string with no line breaks so built it up bit by bit

        	var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
        	querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg." + req.params.geomcolumn+")::json As geometry, ";
        	querystring = querystring + "row_to_json((SELECT l FROM (SELECT "+colnames + ") As l      )) As properties";
        	querystring = querystring + "   FROM "+req.params.tablename+"  As lg limit 100  ) As f ";
        	console.log(querystring);

        	// run the second query
        	client.query(querystring,function(err,result){
	          //call `done()` to release the client back to the pool
          	done(); 
           	if(err){	
                          	console.log(err);
               		res.status(400).send(err);
          	 }
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

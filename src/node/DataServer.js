// urbanDNA API Server
// Author: Mateo Neira
// Description: this API server allows users to connect to a the london amenities
// and ward information database


var portNumber = 8809;

var mysql = require('mysql');

// MySQL Connection Variables
var connection = mysql.createConnection({
  host     : 'dev.spatialdatacapture.org',
  user     : 'ucfnlan',
  password : 'wubumimevu',
  database : 'ucfnlan'
});

connection.connect();

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');


// Default API Endpoint - return the index.ejs file in the views folder
app.get('/', function(req, res) {
    return res.render('index');
})


//  API EndPoint to get data for different amenities
app.get('/amenities/:type/:amenity/:lat/:lon/:r', function (req, res) {

  // Alows data to be downloaded from the server with security concerns
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");

  // If all the variables are provided connect to the database
  if(req.params.type != "" && req.params.lat != "" && req.params.lon !="" && req.params.r != ""){
  	// Parse value to prevent SQL injection
  	var type = mysql_real_escape_string(req.params.type);
  	var type = '"' + type + '"';
    var amenity = mysql_real_escape_string(req.params.amenity);
    var amenity = '"' + amenity + '"';
  	var lat = parseFloat(req.params.lat);
  	var lon = parseFloat(req.params.lon);
    var r =  parseFloat(req.params.r);

   	console.log(lat, lon);

  	// Build SQL statement
  	if(type === '"summary"'){
      var sql = "select distinct amenity, type, count(amenity) as count from final_amenities group by amenity";
  	}
		else if(type === '"all"' && !isNaN(lat) && !isNaN(lon) && !isNaN(r)){

    	var sql = "select * from final_amenities WHERE DISTANCE(points, POINT("+lon+","+lat+") ) <=" + r;
  	}
  	else if (!isNaN(lat) && !isNaN(lon) && !isNaN(r)){
      if(amenity === '"all"'){
        var sql = "select * from final_amenities WHERE type = " + type + " AND DISTANCE(points, POINT("+lon+","+lat+") ) <=" + r;
      }
      else{
        var sql = "select * from final_amenities WHERE type = " + type + " AND amenity = " + amenity + " AND DISTANCE(points, POINT("+lon+","+lat+") ) <=" + r;
      }
  		
      
  	}

  	// Log query for debugging
  	console.log(sql);

  	// Run the SQL query
  	connection.query(sql, function(err, rows, fields){
  		if(err) console.log("Err: " + err);
  		if(rows != undefined){
  			res.send(rows);
  		}
  		else{
  			res.send("");
  		}
  	});
  }
  else{
  	res.send("");
  }
})

app.get('/aSpace/:rTreshold', function(req, res) {
  // Alows data to be downloaded from the server with security concerns
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");

  if(req.params.rTreshold != "") {
  	// Parse value to prevent SQL injection
  	var rTreshold = parseFloat(req.params.rTreshold);

  	// Build SQL statement
  	var sql = "select * from Spearman_list WHERE rho >=" + rTreshold;

	connection.query(sql, function(err, rows, fields){
		if(err) console.log("Err: " + err);
		if(rows != undefined){
		  res.send(rows);
		}
		else{
		  res.send("");
		}
	});

  }
  else{
  	res.send("");
  }
})



// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});


// Function to prevent SQL injections
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

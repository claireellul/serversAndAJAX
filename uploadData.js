/* TO RUN THIS EXAMPLE YOU NEED A POSTGIS TABLE CREATED WITH THE FOLLOWING SQL



create table formdata
(
name character varying (100),
surname character varying(100),
module character varying(10),
language character varying (20),
modulelist character varying (200),
lecturetime character varying (15),
geom geometry
)

*/

function startDataUpload() {
	
	// get the textbox values
	var name = document.getElementById("name").value;
	var surname = document.getElementById("surname").value;
	var module = document.getElementById("module").value;
	var postString = "name="+name +"&surname="+surname+"&module="+module;
	// now get the select box values
	var language = document.getElementById("languageselectbox").value;
	postString = postString + "&language="+language;
	// now get the checkbox values - separate them with a | so that they can be split later on if necessary
	var checkString = "";
	for (var i = 1;i< 5;i++){
		if (document.getElementById("check"+i).checked === true) {
			checkString = checkString + document.getElementById("check"+i).value + "||"
		}

	}
	postString = postString + "&modulelist="+checkString;
	// now get the radio button values
	if (document.getElementById("morning").checked) {
 		 postString=postString+"&lecturetime=morning";
	}
	if (document.getElementById("afternoon").checked) {
 		 postString=postString+"&lecturetime=afternoon";
	}


	// now get the geometry values
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;

	alert(postString);
	processData(postString);
}

var client;

function processData(postString) {
   client = new XMLHttpRequest();
   client.open('POST','https://developer.cege.ucl.ac.uk:31060/uploadData',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = dataUploaded;  
   client.send(postString);
}
// create the code to wait for the response from the data server, and process the response once it is received
function dataUploaded() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
    document.getElementById("dataUploadResult").innerHTML = client.responseText;
    }
}






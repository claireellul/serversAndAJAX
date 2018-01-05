function startDataUpload() {
	alert ("start data upload");

	var name = document.getElementById("name").value;
	var surname = document.getElementById("surname").value;
	var module = document.getElementById("module").value;



	var postString = "name="+name +"&surname="+surname+"&module="+module;
	alert(postString);
	processData(postString);
}

var client;

// create the code to get the geoJSON data using an XMLHttpRequest
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






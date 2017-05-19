var map;
var markerArray = [];
var dataArray = [];
var infowindow = new google.maps.InfoWindow({maxWidth: 300});

var port = 8809;



$(document).ready(function() {
	// Register Click events 
	$("#resetLink").click( function(event){
		event.preventDefault();
		location.reload();
	});

	$("#clearLink").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
	});

	$("#iPhoneLink").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Apple+iPhone", "blue_marker.png");
	});

	$("#FujiFilmS1500").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Fujifilm+FinePix+S1500", "green_marker.png");
	});

	$("#Canon400").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Canon+EOS+400D+DIGITAL", "lightBlue_marker.png");
	});

	$("#Nikon").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("NIKON+CORPORATION+NIKON+D90", "orange_marker.png");
	});

	$("#Canon450").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Canon+EOS+450D", "pink_marker.png");
	});

	$("#Canon5").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Canon+EOS+5D", "purple_marker.png");
	});

	$("#Panasonic5").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Panasonic+DMC-TZ5", "yellow_marker.png");
	});

	$("#Sony").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("SONY+DSLR-A200", "lightBlue_marker.png");
	});

	$("#FujiFilm120").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("FUJIFILM+FinePix+J120", "blue_marker.png");
	});

	$("#Panasonic38").click( function(event){
		event.preventDefault();
		//Clear Markers
		setAllMap(null);
		google.maps.event.clearListeners(map, 'dragend');
		$("#photoNum").html("0");
		// --------- Call your edited getCameraData() function in here --------------------
		getCameraData("Panasonic+DMC-FZ38", "green_marker.png");
	});

	// ------------------------------------------------------------------------------------

	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(51.514756, -0.104345),
			zoom: 14,
		 	styles: monotoneMuted
		};
		
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		google.maps.event.addListener(map, 'dragend', function() {
			var bounds = map.getBounds();
			console.log("SW: " + bounds.getSouthWest() + " NE: " + bounds.getNorthEast());
			console.log("Center: " + map.getCenter().lat() + ", " +  map.getCenter().lng());
			getData(map.getCenter().lat(), map.getCenter().lng());
		});

		getData(map.getCenter().lat(), map.getCenter().lng());
	}

	function getCameraData(cameraType, markerImg){
		console.log("Getting Data: " + cameraType + ", with Image: " + markerImg );

		setAllMap(null);
		markerArray = [];

		var url = "http://dev.spatialdatacapture.org:"+port+"/data/cameraType/"+cameraType;
		console.log(url);
		console.log("Started ...");

		$.getJSON( url, function( data ) {
			$.each(data, function(k,v){
				
				var latLng = new google.maps.LatLng(v.points.y, v.points.x);
				
				dataArray.push(latLng);
				
				var marker = new google.maps.Marker({
  					position: latLng, 
  					icon: "./img/" + markerImg,
  					customInfo: v.pid				
  				});

				google.maps.event.addListener(marker, 'click', function(content) {
					return function(){
						infowindow.setContent("");
						
						map.setCenter(new google.maps.LatLng(v.points.y, v.points.x));
						$.getJSON("http://dev.spatialdatacapture.org:"+port+"/data/photoDescription/"+this.customInfo, function( data ) {
							var dateTaken = new XDate((data[0].date_uploaded * 1000)).toString("MMM d, yyyy HH:mm:ss");
							var content = "<b>Photo ID: </b>"+v.pid+"<br/> <br/><b>Description:</b><br/> "+data[0].description.replaceAll("+", " ")+" <br/> <br/><b>Date Taken: </b> "+dateTaken+" <br/><b>Camera: </b> "+data[0].device.replaceAll("+", " ")+"<br/><b>Location:</b> "+ v.points.y + ", " + v.points.x +" <br/><br/> <b>Photo</b> <br/><br/> <img src='"+data[0].download_url+"' width='300px' alt='Description'>";
					    	infowindow.setContent(content);
					    });
		
					    infowindow.open(map,this);
					}
				}(""));

				markerArray.push(marker);

  			});

  			$("#photoNum").html(data.length);
  			console.log("Done!");
  			
  			setAllMap(map);
		});
	}

	function getData(lat, lng){
		var lat = lat.toFixed(2); 
		var lng = lng.toFixed(3);

		console.log("Getting Data: " + lat + ", " + lng );

		setAllMap(null);
		markerArray = [];

		$.getJSON( "http://dev.spatialdatacapture.org:"+port+"/data/"+lat+"/"+lng+"/500", function( data ) {
			$.each(data, function(k,v){
				
				var latLng = new google.maps.LatLng(v.points.y, v.points.x);
				
				dataArray.push(latLng);
				
				var marker = new google.maps.Marker({
  					position: latLng, 
  					icon: "./img/icon.png",
  					customInfo: v.pid				
  				});

				google.maps.event.addListener(marker, 'click', function(content) {
					return function(){
						infowindow.setContent("");
						
						map.setCenter(new google.maps.LatLng(v.points.y, v.points.x));
						$.getJSON("http://dev.spatialdatacapture.org:"+port+"/data/photoDescription/"+this.customInfo, function( data ) {
							var dateTaken = new XDate((data[0].date_uploaded * 1000)).toString("MMM d, yyyy HH:mm:ss");
							var content = "<b>Photo ID: </b>"+v.pid+"<br/> <br/><b>Description:</b><br/> "+data[0].description.replaceAll("+", " ")+" <br/> <br/><b>Date Taken: </b> "+dateTaken+" <br/><b>Camera: </b> "+data[0].device.replaceAll("+", " ")+"<br/><b>Location:</b> "+ v.points.y + ", " + v.points.x +" <br/><br/> <b>Photo</b> <br/><br/> <img src='"+data[0].download_url+"' width='300px' alt='Description'>";
					    	infowindow.setContent(content);
					    });
		
					    infowindow.open(map,this);
					}
				}(""));

				markerArray.push(marker);

  			});

  			$("#photoNum").html(data.length);
  			
  			setAllMap(map);
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});

//  ******************* FUNCTIONS TO USE FOR THE MAP YOU DON"T NEED TO EDIT ANYTHING BELOW THIS LINE **************************************************

function createMarkers(){
	var marker = new google.maps.Marker({
			position: latLng 				
		});
}

function setAllMap(map) {
	for (var i = 0; i < markerArray.length; i++) {
		markerArray[i].setMap(map);
	}
}

function clearMarkers() {
	setAllMarkers(null);
}

String.prototype.replaceAll = function(str1, str2, ignore) {
	return decodeURIComponent( this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2) );
} 
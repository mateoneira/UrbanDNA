var map;
//var infowindow = new google.maps.InfoWindow({maxWidth: 300});
var type = "all"
var markerArray = [];
var dataArray = [];
var pointArray = [];
var r = 50.000;
var port = 8809;
console.log("connecting to port: ", port);


$(document).ready(function() {
	// Register Click events 
	// ------------------------------------------------------------------------------------
	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(51.507,  -0.055),
			zoom: 13,
		 	styles: darkMap
		};
		
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		google.maps.event.addListener(map, 'dragend', function() {
			var bounds = map.getBounds();
			console.log("SW: " + bounds.getSouthWest() + "NE: " + bounds.getNorthEast());
			//calculate radius based on bounding box
			//console.log(Math.acos(Math.sin(bounds.getSouthWest().lng())));
			//r = 500.00;
			r = Math.acos( Math.sin(bounds.getSouthWest().lng()) * Math.sin(bounds.getNorthEast().lng()) + Math.cos(bounds.getSouthWest().lng()) * Math.cos(bounds.getNorthEast().lng()) * Math.cos(bounds.getNorthEast().lat() - bounds.getSouthWest().lat())) * 6380;
			r = r.toFixed(1)/2;
			console.log(r);
			getData(map.getCenter().lat(), map.getCenter().lng(), r);
		});

		console.log("test");
		getData(map.getCenter().lat(), map.getCenter().lng(), r);
	}

	function getData(lat, lon, r){
		var lat = lat.toFixed(3);
		var lon = lon.toFixed(3);
		var radius = r.toFixed(1);

		setAllMap(null);
		pointArray = [];

		var url = "http://dev.spatialdatacapture.org:"+port+"/amenities/"+type+"/"+lat+"/"+lon+"/"+radius;
		console.log(url);

		$.getJSON(url, function(data) {
		  $.each(data, function(k,v) {
		  	var LatLng = new google.maps.LatLng(v.points.y, v.points.x);
		  	dataArray.push(LatLng);

		  	var pointCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
					strokeOpacity: 0.2,
					strokeWeight: 1,
					fillColor: '#FF0000',
					fillOpacity: 0.2,
					map: map,
					center: {lat: v.lat, lng: v.lon},
					radius: 50
			});
		  	pointArray.push(pointCircle);

		  });

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
	for (var i = 0; i < pointArray.length; i++) {
		pointArray[i].setMap(map);
	}
}


String.prototype.replaceAll = function(str1, str2, ignore) {
	return decodeURIComponent( this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2) );
}


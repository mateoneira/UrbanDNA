var map;
var infowindow = new google.maps.InfoWindow({maxWidth: 300});

$(document).ready(function() {
	// Register Click events 
	// ------------------------------------------------------------------------------------
	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(51.5194471,  0.01306762),
			zoom: 12,
		 	styles: darkMap
		};
		
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		google.maps.event.addListener(map, 'dragend', function() {
			var bounds = map.getBounds();
			console.log("SW: " + bounds.getSouthWest() + " NE: " + bounds.getNorthEast());
			console.log("Center: " + map.getCenter().lat() + ", " +  map.getCenter().lng());
		});
	}

	
	google.maps.event.addDomListener(window, 'load', initialize);

});

//  ******************* FUNCTIONS TO USE FOR THE MAP YOU DON"T NEED TO EDIT ANYTHING BELOW THIS LINE **************************************************

function setAllMap(map) {
	for (var i = 0; i < markerArray.length; i++) {
		markerArray[i].setMap(map);
	}
}


String.prototype.replaceAll = function(str1, str2, ignore) {
	return decodeURIComponent( this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2) );
}

// functions for interactivity of graphs and story navigation

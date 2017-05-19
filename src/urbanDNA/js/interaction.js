var map, heatmap;
var type = "all";
var amenity = "all";
var dataArray = [];
var r = 10000.000;
var port = 8809;
var viridis = [
          'rgba(68, 1, 84, 0)',
          'rgba(72, 29, 111, 1)',
          'rgba(69,53,129, 1)',
          'rgba(61,77,138, 1)',
          'rgba(52,97,141, 1)',
          'rgba(43,116,142, 1)',
          'rgba(36,135,142, 1)',
          'rgba(31,153,138, 1)',
          'rgba(37,172,130, 1)',
          'rgba(64,188,114, 1)',
          'rgba(103,204,92, 1)',
          'rgba(151,216,63, 1)',
          'rgba(203,225,30, 1)',
          'rgba(253,231,37, 1)'
        ]

$(document).ready(function() {
	function initialize() {
		console.log("initializing map")

		var mapOptions = {
			center: {lat: 51.507, lng: -0.055},
			zoom: 11,
			minZoom: 10,
			maxZoom: 15,
			disableDefaultUI: true,
			styles: mapStyle_MER_dark
		};

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		getPoints(map.getCenter().lat(), map.getCenter().lng(), r, type);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});


function getPoints(lat, lng, r, type, amenity){
	var lat = lat.toFixed(2);
	var lng = lng.toFixed(3);

	console.log("Getting Points for Lat: " + lat + " Lon: " + lng + ", within " + r + "m");

	var url = "http://dev.spatialdatacapture.org:"+port+"/amenities/"+type+"/"+amenity+"/"+lat+"/"+lng+"/"+r;
	dataArray = [];

	console.log("from: " + url);
	$.getJSON(url, function(data) {
		$.each(data, function(k, v) {
			var LatLng = new google.maps.LatLng(v.points.y, v.points.x);
			dataArray.push(LatLng);
		});
		console.log("done fetching points. Example: " + dataArray[5]);
		console.log(dataArray.length + " Points retrieved");
		console.log("drawing heatmap");

		heatmap = new google.maps.visualization.HeatmapLayer({
			data: dataArray,
			map: map,
			gradient: viridis
		});
	});

}
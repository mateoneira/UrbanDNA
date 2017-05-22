// initialize global variables 
var map, heatmap;
var type = "all";
var amenity = "all";
var dataArray = [];
var polygonArray = [];
var r = 10000.000;
var port = 8809;
var amenities = [];
var links = [];
var nodes = [];
var latlon = ["null", "null"];
var rTreshold = 0;
var page=0; //to keep track of story
var MSP="true";
var position = []
//variables to keep colors between graphs equal
var defaults = {
	"id": ["type", "amenity"],
}
var trmLoaded = false;
var ntwrkLoaded = false;
var categoryArray = [];
var clrCat = [];
var ntwrkLrgLoaded = false;


// var viridis = [
//           'rgba(68, 1, 84, 0)',
//           'rgba(72, 29, 111, 1)',
//           'rgba(69,53,129, 1)',
//           'rgba(61,77,138, 1)',
//           'rgba(52,97,141, 1)',
//           'rgba(43,116,142, 1)',
//           'rgba(36,135,142, 1)',
//           'rgba(31,153,138, 1)',
//           'rgba(37,172,130, 1)',
//           'rgba(64,188,114, 1)',
//           'rgba(103,204,92, 1)',
//           'rgba(151,216,63, 1)',
//           'rgba(203,225,30, 1)',
//           'rgba(253,231,37, 1)'
//         ]

var spectral = [
	'rgba(94,79,162,0)',
	'rgba(50,136,189,1)',
	'rgba(102,194,165,1)',
	'rgba(171,221,164,1)',
	'rgba(230,245,152,1)',
	'rgba(255,255,191,1)',
	'rgba(254,224,139,1)',
	'rgba(253,174,97,1)',
	'rgba(244,109,67,1)',
	'rgba(213,62,79,1)',
	'rgba(158,1,66,1)',
]

var ctg = [
	'#8dd3c7',
	'#ffffb3',
	'#bebada',
	'#fb8072',
	'#80b1d3',
	'#fdb462',
	'#b3de69',
	'#fccde5',
	'#d9d9d9',
	'#bc80bd',
	'#ccebc5',
	'#ffed6f',
]

//load map into webpage
$(document).ready(function() {
	var mapCenter = defCenter();
	console.log("starting map")
	function initialize() {
		console.log("initializing map")
		var mapOptions = {
			center: mapCenter,
			zoom: 11,
			minZoom: 10,
			maxZoom: 15,
			disableDefaultUI: true,
			styles: greyMap
		};

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		pageControl(0);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});

//funtion in case of window resize, 
//keeps map centered
window.addEventListener("resize", function() {
	var mapCenter = defCenter();
	map.setCenter(mapCenter);
	//add function to reset top of story div after resize

});

function startViz() {
	$('.welcome').hide("slow");
	$('.infoWrapper').show("slow");
	$('#map-info').show();
	page=1;
	pageControl(page);
}


//function for sidebar controls and navigation
function pageNav(t, n) {
	var height = $('#info-container').height() + ($('#info-container').position().top)*1.5;
	var top = $('.info-slide').position().top;
	var prevPage = page;
	if(t==="scroll") {
		page = page + n;
	}
	else if(t==="page") {
		page = n
	};
	if(page < 0) {
		page = 0;
	}	
	else if(page > 5) {
		page = 5;
	};
	console.log("going from: " + prevPage + " to: " + page + " at height: " + height + " and top: " + top);
	pageControl(page);
	if(page === 0 ){
		$('.info-slide').animate({
		    top: 0
		});
	}
	else{
		top =  top + height*(prevPage-page);
		$('.info-slide').animate({
		    top: top
		});
	}

	console.log("new top: " + top);
}

function enLarge(){
	$('.infoWrapper').hide();
	$('.vizEnlarge').show();
	if(!ntwrkLrgLoaded){
		ntwrkLrgLoaded = true;
		var url = "http://dev.spatialdatacapture.org:"+port+"/aSpace/"+rTreshold+"/"+MSP;
		console.log("getting amenity space data from: " + url)
		// get data from server
		$.getJSON(url, function(data) {
			$.each(data, function(k,v) {
			links.push({"source":v.amen_1, "target":v.amen_2, "strength":v.rho, "width": v.rho});
			})

			console.log("done fetching data. Example: " + links[1]);
			console.log("total rows recieved for network: " + links.length);

			var url = "http://dev.spatialdatacapture.org:"+port+"/nodeList";
			console.log("getting amenity space data from: " + url)
			// get data from server
			$.getJSON(url, function(data) {
				$.each(data, function(k,v) {
				nodes.push({"amenity":v.amenity, "type": v.type, "count": v.count});
				position.push({"amenity":v.amenity,"type": v.type, "x":v.x, "y":v.y});
				})

				console.log("done fetching data. Example: " + nodes[1]);
				console.log("total rows recieved for network: " + nodes.length);
			});

			var amenity_spaceLarge = d3plus.viz()
				.config(defaults)
			    .container("#vizLarge")
			    .type("network")
			    .data(nodes)
			    // uncomment this section if we want the nodes to be positioned form the precomputed layoyt
			    // .nodes(position) 
			    .edges({
			    	"size": "width",
			    	"strength": "strength",
			    	"value": links
				})
			    .size("count")
			    .color("type")
			    .depth(1)
			    .tooltip(["type", "count"])
			    .background("transparent")
			    .resize(true)
			    .legend({
			    	"align": "center",
			    	"data": false,
			    	"order": {"value":"size", "sort":"desc"},
			    	"size": [15,30],
			    })
			    .draw()
		});
	}
}

function returnViz(){
	$('.infoWrapper').show();
	$('.vizEnlarge').hide();

}
// function openSidebar(state) {
// 	if(state === true) {
// 		$('.infoWrapper').animate({
// 			width: "98%"
// 		});
// 		$('.infoWrapper').css({
// 			"background-color": "rgba(255,255,255,0.85)",
// 			"color": "rgba(33,48,58,0.75)"
// 		});
// 		$('.viz').css({
// 			"width": "100%",
// 			"width": "90%"
// 		});
// 	}
// 	else{
// 		// $('.infoWrapper').animate({
// 		// 	width: "30%"
// 		// });
// 		// $('.infoWrapper').css({
// 		// 	"background-color": "rgba(33,48,58,0.75)",
// 		// 	"color": "#ffffff"
// 		// });
// 		$('.infoWrapper').removeAttr('style');
// 		$('.viz').removeAttr('style');
// 		$('.infoWrapper').show();
// 	}
// }

//function to control flow of story
function pageControl(page) {
	if(page === 0 ) {
		if(heatmap === undefined) {
			getPoints(map.getCenter().lat(), map.getCenter().lng(), r, type,amenity, false);
		}		
		else if(heatmap!= undefined && heatmap.map != null){
			heatmap.setMap(null)
		};
		if(polygonArray.length != 0){
			removePolygons();
		};
		$('.welcome').show();
		$('.infoWrapper').hide();
	}
	else if(page === 1) {
		heatmap.set('opacity', 0.6);
		if(polygonArray.length != 0){
		removePolygons();
		}
		if(heatmap.map === null){
			heatmap.setMap(map);
		}
		if(trmLoaded===false){
			console.log("drawing treemap");
			make_treemap();
			trmLoaded=true;
		}
	}
	else if(page===2) {
		heatmap.set('opacity', 0.3);
		if(ntwrkLoaded===false){
			make_network();
			ntwrkLoaded=true;
		}
		if(polygonArray.length != 0){
		removePolygons();
		}		
	}
	else if(page===3) {
        heatmap.set('opacity', 0.3);
	}
	else if(page===4) {
		if(heatmap.map != null){
			heatmap.setMap(null);
		}
        polygonCat();
	}
}

//function to get amenity locations for heatmap
function getPoints(lat, lng, r, type, amenity, draw){
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

		heatmap = new google.maps.visualization.HeatmapLayer({
			data: dataArray,
			map: null,
			gradient: spectral,
			opacity: 0.6
		});
		if(draw){
			heatmap.setMap(map);
		}
		$('button').prop('disabled', false);
		$("#start").html("Data Retrieved. click start!");
	});

}

//function to draw polygons of areas found and clusters
function drawClusters(ctype, callback) {
	var url = "http://dev.spatialdatacapture.org:"+port+"/areas/"+ctype;
	var category = [];
	if(polygonArray.length != 0){
		removePolygons();
	}

	console.log("retrieving polygon data from: " + url);
	console.log("from: " + url);
	$.getJSON(url, function(data) {
		$.each(data, function(k, v) {
			dataArray = [];
			var temp = v.Polygon.split(",");
			var lat, lon;
			var i=0;
			$.each(temp, function(k, v){
				if(i%2 === 0) {
					lon = v.replace(/["[""("]/g, "");
				}
				else {
					lat = v.replace(/[^0-9\.]+/g, "");
					var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lon));					
					dataArray.push(latLng);
				}
				i += 1;
			});
			if(ctype==="HDBSCAN"){
				var category = {"category": v.Categories, "clusters": v.Clusters};
				categoryArray.push(category.category);
			}
			// console.log(dataArray);
			var polygon = new google.maps.Polygon({
				map: map,
				paths: dataArray,
				strokeColor: '#FF0000',
				strokeOpacity: 0.3,
				fillColor: '#FF0000',
				fillOpacity: 0.3
			});
			polygonArray.push([category, polygon]);
		});
		// console.log("done fetching points. Example: " + dataArray[5]);
		console.log(polygonArray.length + " clusters retrieved");
		var unique = categoryArray.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
		//create dictionary of color and category
		for(var i=0; i<unique.length; i ++) {
			clrCat.push({"category": unique[i], "color": ctg[i]})
		}
		callback();

	});
}

function polygonCat() {
	drawClusters("HDBSCAN", function(){
		for(var i=0; i<polygonArray.length; i++){
			for(var j =0; j<clrCat.length; j++){
				if(clrCat[j].category === polygonArray[i][0].category){
					polygonArray[i][1].set("fillColor", clrCat[j].color);
					polygonArray[i][1].set("strokeColor", clrCat[j].color);
					polygonArray[i][1].set("fillOpacity", 0.6);
					// console.log("setting color of :" + i);
				}				
			}
		}
		console.log("done setting category colors");
	});
	
}

//function to remove polygons from map
function removePolygons() {
	for(var i = 0; i< polygonArray.length; i++) {
		polygonArray[i][1].setMap(null);
	};
	polygonArray=[];
	categoryArray=[];
}

//function to get center of map according to window width, used when resizing
function defCenter() {
	var resCenter;
	console.log("Getting map center for window size: " + $(window).width());
	if($(window).width() >=1200){
		resCenter = {lat: 51.51, lng: 0.06};
	}
	else if($(window).width() >=992 && $(window).width()<1200){
		resCenter = {lat: 51.51, lng: -0.02};
	}
	else if($(window).width() >=500 && $(window).width()<992){
		resCenter = {lat: 51.51, lng: -0.04};
	}
	else{
		resCenter = {lat: 51.42, lng: -0.125};
	}
	return resCenter;
}

//function for treemap visualization
function make_treemap() {
	var url = "http://dev.spatialdatacapture.org:"+port+"/amenities/summary/"+"all/"+latlon[0]+"/"+latlon[1]+"/null";
	console.log("getting amenity data from: " + url);
	//get data from server
	$.getJSON(url, function(data) {
		$.each(data, function(k,v) {
		//console.log(v)
		amenities.push(v);
		})
		console.log("total rows recieved for treemap: " + amenities.length);

		var amenity_type = d3plus.viz()
			.config(defaults)
			.container("#viz1")
			.data(data)
			.type("tree_map")
			.depth(0)
			.size("count")
			.labels({"align": "left", "valign": "top"})
			.title({
			  "total": {"prefix": "Total Number of Amenities in London: "}
			})
			.font({
			  "color": "#ffffff"
			})
			.color("type")
			.background("transparent")
			.legend(false)
			.resize(true)
			.mouse({                                  
			    "click": function(d, viz){
			    	if(amenity_type.depth() === 0) {
				    	console.log("clicked on: " + d.type + " at depth: " + amenity_type.depth());
				    	console.log(d)
					    heatmap.setMap(null);
					    getPoints(map.getCenter().lat(), map.getCenter().lng(), r, d.type, amenity, true);
					    $("#amenity-type").html("Showing " + d.type + " amenities");
			    	}
			    	else if(amenity_type.depth() === 1) {
			    		console.log("clicked on: " + d.amenity + " at depth: " + amenity_type.depth());
					    heatmap.setMap(null);
					    getPoints(map.getCenter().lat(), map.getCenter().lng(), r, d.type, d.amenity, true);
					    $("#amenity-type").html(d.amenity);
			    	}
			    	else{
			    		console.log("error")
			    	}
				    
			    }   
			  })
			.ui([
				{
					"method": "depth",
					"value": [{"Type": 0}, {"Amenities": 1}],
				}

			])
			.draw()
	});
}

//function for network visualization
function make_network() {
	var url = "http://dev.spatialdatacapture.org:"+port+"/aSpace/"+rTreshold+"/"+MSP;
	console.log("getting amenity space data from: " + url)
	// get data from server
	$.getJSON(url, function(data) {
		$.each(data, function(k,v) {
		links.push({"source":v.amen_1, "target":v.amen_2, "strength":v.rho, "width": v.rho});
		})

		console.log("done fetching data. Example: " + links[1]);
		console.log("total rows recieved for network: " + links.length);

		var url = "http://dev.spatialdatacapture.org:"+port+"/nodeList";
		console.log("getting amenity space data from: " + url)
		// get data from server
		$.getJSON(url, function(data) {
			$.each(data, function(k,v) {
			nodes.push({"amenity":v.amenity, "type": v.type, "count": v.count});
			position.push({"amenity":v.amenity,"type": v.type, "x":v.x, "y":v.y});
			})

			console.log("done fetching data. Example: " + nodes[1]);
			console.log("total rows recieved for network: " + nodes.length);
		});

		var amenity_space = d3plus.viz()
			.config(defaults)
		    .container("#viz2")
		    .type("network")
		    .data(nodes)
		    // uncomment this section if we want the nodes to be positioned form the precomputed layoyt
		    // .nodes(position) 
		    .edges({
		    	"size": "width",
		    	"strength": "strength",
		    	"value": links
			})
		    .size("count")
		    .color("type")
		    .depth(1)
		    .tooltip(["type", "count"])
		    .background("transparent")
		    .resize(true)
		    .legend({
		    	"align": "center",
		    	"data": false,
		    	"order": {"value":"size", "sort":"desc"},
		    	"size": [15,30],
		    })
		    .draw()
	});
}





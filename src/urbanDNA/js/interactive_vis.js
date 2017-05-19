//create empty array to put data
var amenities = [];
var links = [];
var nodes = [];
var port = 8809;
var type = "summary";
var latlon = ["null", "null"];
var radius = "null";
var rTreshold = 0;
// var position = []

var url = "http://dev.spatialdatacapture.org:"+port+"/amenities/"+type+"/"+"all/"+latlon[0]+"/"+latlon[1]+"/"+radius;
console.log("getting amenity data from: " + url);
//get data from server
$.getJSON(url, function(data) {
	$.each(data, function(k,v) {
	//console.log(v)
	amenities.push(v);
	nodes.push({"name":v.amenity, "size":v.count, "group":v.type})
	// position.push({"name":v.amenity, "x": 0, "y": 0 })
	})
	console.log("total rows recieved for treemap: " + amenities.length);
	make_treemap(amenities);

});

var url = "http://dev.spatialdatacapture.org:"+port+"/aSpace/"+rTreshold;
console.log("getting amenity space data from: " + url)
// get data from server
$.getJSON(url, function(data) {
	$.each(data, function(k,v) {
	links.push({"source":v.amen_1, "target":v.amen_2, "strength":v.rho, "width": v.rho});
	})

	console.log("done fetching data. Example: " + links[1]);
	console.log("total rows recieved for network: " + links.length);
	make_network(nodes, links)
});

//create functions for visualization
function make_treemap(data) {
	var amenity_type = d3plus.viz()
		.container("#viz1")
		.data(data)
		.type("tree_map")
		.id({
			"value": ["type", "amenity"],
			"group": true
		})
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
				    heatmap.setMap(null);
				    getPoints(map.getCenter().lat(), map.getCenter().lng(), r, d.type, amenity);
				    $("#amenity-type").html(d.type);
		    	}
		    	else if(amenity_type.depth() === 1) {
		    		console.log("clicked on: " + d.amenity + " at depth: " + amenity_type.depth());
				    heatmap.setMap(null);
				    getPoints(map.getCenter().lat(), map.getCenter().lng(), r, d.type, d.amenity);
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
}

function make_network(nodes, links) {
	var amenity_space = d3plus.viz()
	    .container("#viz2")
	    .type("network")
	    .data(nodes)
	    // .color(group)
	    // .nodes(position)
	    .edges({
	    	"size": "width",
	    	"strength": "strength",
	    	"value": links
		})
	    .size("size")
	    .id("name")
	    .background("transparent")
	    .resize(true)
	    .draw()
}



//create functions to control flow of story
$('.story_slidedown').click(function() {
	var $container = $('#info-container'),
	cheight = $container.height();

	var $slide = $('.info-slide'),
	sltop= $container.position().top;
	var top=sltop+cheight;
	console.log("top: " + sltop + " Height: " + cheight);
	$('.info-slide').animate({
	    top: "-=" + top + "px"
	});
	console.log("nav button clicked");
});

$('.story_slideup').click(function() {
	var $container = $('#info-container'),
	cheight = $container.height();

	var $slide = $('.info-slide'),
	sltop= $container.position().top;
	var top=sltop+cheight;
	console.log(top);
	$('.info-slide').animate({
	    top: "+=" + top + "px"
	});
	console.log("nav button clicked");
});

$('.story_home').click(function() {
	console.log(top);
	$('.info-slide').animate({
	    top: 0
	});
	console.log("nav button clicked");
});




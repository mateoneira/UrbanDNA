// create sample dataset
  var sample_data = [
    {"name": "alpha", "size": 10},
    {"name": "beta", "size": 12},
    {"name": "gamma", "size": 30},
    {"name": "delta", "size": 26},
    {"name": "epsilon", "size": 12},
    {"name": "zeta", "size": 26},
    {"name": "theta", "size": 11},
    {"name": "eta", "size": 24}
  ]
  // create list of node positions
  var positions = [
    {"name": "alpha", "x": 10, "y": 15},
    {"name": "beta", "x": 12, "y": 24},
    {"name": "gamma", "x": 16, "y": 18},
    {"name": "delta", "x": 26, "y": 21},
    {"name": "epsilon", "x": 13, "y": 4},
    {"name": "zeta", "x": 31, "y": 13},
    {"name": "theta", "x": 19, "y": 8},
    {"name": "eta", "x": 24, "y": 11}
  ]
  // create list of node connections
  var connections = [
    {"source": "alpha", "target": "beta"},
    {"source": "alpha", "target": "gamma"},
    {"source": "beta", "target": "delta"},
    {"source": "beta", "target": "epsilon"},
    {"source": "zeta", "target": "gamma"},
    {"source": "theta", "target": "gamma"},
    {"source": "eta", "target": "gamma"}
  ]
  // instantiate d3plus
  var visualization = d3plus.viz()
    .container("#viz")  // container DIV to hold the visualization
    .type("network")    // visualization type
    .data(sample_data)  // sample dataset to attach to nodes
    .nodes(positions)   // x and y position of nodes
    .edges(connections) // list of node connections
    .size("size")       // key to size the nodes
    .id("name")         // key for which our data is unique on
    .background("transparent")
    .draw()             // finally, draw the visualization!
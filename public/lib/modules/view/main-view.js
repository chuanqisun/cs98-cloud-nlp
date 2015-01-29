define(['jquery', 'd3', 'model', 'event'], function(jQuery, d3, model, event) {
  var init = function() {
    $("body").append("<button id='concept-button' type='button'>get concept</button>");
    $("body").append("<button id='course-button' type='button'>get course</button>");

    //
    var width = 960,
    	height = 500;

    // set frame
	var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

    // init force layout
	var force = d3.layout.force()
		.size([width, height])
		.nodes([]) // initialize with a single node
		.linkDistance(50)
		.charge(-200)
		.on("tick", tick);

	// get layout properties
	var nodes = force.nodes(),
		links = force.links(),
		node = svg.selectAll(".node"),
		link = svg.selectAll(".link");

	function tick() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	}
	
	// redraw force layout
	function redraw() {

	  var graph = model.getGraph();

	  // D3 can't handle multiple nodes insertion. must do it one by one.
	  // Hence, need to get delta nodes from model and add them one by one.
	  // add new function in main-model to handle delta change

	  while (nodes.length > 0) {
	  	nodes.pop();
	  }
	 
	  for (var i = 0; i < graph.nodes.length; i++) {
	  	graph.nodes[i] = {};
	  	nodes.push(graph.nodes[i]);
	  }

	  link = link.data(links);

	  link.enter().insert("line", ".node")
	      .attr("class", "link");

	  link.exit().remove();


	  node = node.data(nodes);

	  node.enter().insert("circle")
	      .attr("class", "node")
	      .attr("r", 5)
	    .transition()
	      .duration(750)
	      .ease("elastic")
	      .attr("r", 6.5);

	  node.exit().transition()
	      .attr("r", 0)
	    .remove();
  

	  if (d3.event) {
	    // prevent browser's default behavior
	    d3.event.preventDefault();
	  }

	  force.start();
	}

	event.listen( event.modelUpdateEvent , function() { 
		redraw();

	}); 

  };
  return {
    init: init
  };
});

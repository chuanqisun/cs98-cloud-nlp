define(['jquery', 'd3', 'model', 'event'], function(jQuery, d3, model, event) {
	var init = function() {
	    $("body").append("<button id='concept-button' type='button'>get concept</button>");
	    $("body").append("<button id='course-button' type='button'>get course</button>");
	    $("body").append("<button id='more-button' type='button'>get more concept for course</button>");

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

			node
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		}
		
		function mouseclick(d) {
			if (d3.event.defaultPrevented) return; // click suppressed
			if(d.group === "concept") {
				model.insertCoursesForConcept(d.name);
			}else if(d.group === "course") {
				model.insertConceptsForCourse(d.name);
			}
		}

		// redraw force layout
		function redraw() {

			// D3 can't handle multiple nodes insertion. must do it one by one.
			// Hence, need to get delta nodes from model and add them one by one.
			// add new function in main-model to handle delta change
			// new nodes doesn't link back to old ones. need to debug
			link = link.data(links);

			link.enter().insert("line", ".node")
				.attr("class", "link");

			link.exit().remove();


			node = node.data(nodes);

			//

			node.enter().append("g")
				.attr("class", function(d){
					return "node " + d.group
				})
				// .on("mouseover", mouseover)
				// .on("mouseout", mouseout)
				.on('click', mouseclick)
				.call(force.drag);

			node.select("circle").remove();
			node.append("circle")
				.attr("r", 8);


			node.select("text").remove();
			node.append("text")
				.attr("x", 12)
				.attr("dy", ".35em")
				.text(function(d) { return d.name; });

			node.exit().remove();

			force.start();
		}

		event.listen(event.modelAddNodesEvent, function(e, data) { 
			// show data 
			for (var i = 0; i < data.nodes.length; i++){
				nodes.push(data.nodes[i]);
			}

			for (var i = 0; i < data.links.length; i++){
				links.push(data.links[i]);
			}
			redraw();
		}); 

	};

	return {
		init: init
	};
});

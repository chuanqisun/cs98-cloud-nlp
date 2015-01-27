define(['jquery', 'd3', 'model', 'event'], function(jQuery, d3, model, event) {
  var init = function() {
    $("body").append("<button id='concept-button' type='button'>get concept</button>");
    $("body").append("<button id='course-button' type='button'>get course</button>");




		event.listen( event.modelUpdateEvent , function() { 
			
			var width = 960,
  		height = 500;

			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			graph = model.getGraph();

			force = d3.layout.force()
		    .nodes(graph.nodes)
		    .links(graph.links)
		    .size([width, height])
		    .charge(-200)
		    .on("tick", tick)
		    .start();

			link = svg.selectAll(".link")
			   .data(graph.links)
			 .enter().append("line")
			   .attr("class", "link");

			node = svg.selectAll(".node")
			   .data(graph.nodes)
			 .enter().append("circle")
			   .attr("class", "node")
			   .attr("r", 4.5);

			function tick() {
			  link.attr("x1", function(d) { return d.source.x; })
			      .attr("y1", function(d) { return d.source.y; })
			      .attr("x2", function(d) { return d.target.x; })
			      .attr("y2", function(d) { return d.target.y; });

			  node.attr("cx", function(d) { return d.x; })
			      .attr("cy", function(d) { return d.y; });
			}

		}); 



	




  };
  return {
    init: init
  };
});

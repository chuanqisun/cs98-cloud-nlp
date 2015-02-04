define(['jquery', 'd3', 'model', 'event', 'config'], function(jQuery, d3, model, event, config) {

  var init = function() {


    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    $("body").append("<button id='course-button' type='button'>get course</button>");

    var width = $( window ).width(),
      height = $( window ).height(),
      root;

    var force = d3.layout.force()
        .linkDistance(config.linkDistance)
        .charge(config.charge)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("body").append("svg")
            .attr("id", "playgraph") 
            .attr("width", width)
            .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");


    event.listen(event.modelUpdateEvent, function(e, data) { 
      root = model.getGraph();
      update();
    });
  

    function update() {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes);

      console.dir(nodes);

      // Restart the force layout.
      force
          .nodes(nodes)
          .links(links)
          .start();

      // Update links.
      link = link.data(links, function(d) { return d.target.id; });

      link.exit().remove();

      link.enter().insert("line", ".node")
          .attr("class", "link");

      // Update nodes.
      node = node.data(nodes, function(d) { return d.id; });

      node.exit().remove();

      var nodeEnter = node.enter().append("g")
          .attr("class", function(d){
            return "node " + d.group
          })
          .on("click", click)
          .call(force.drag);

      nodeEnter.append("circle")
          .attr("r", function(d) { return (d.relevance - 0.6) * 80; })
          .on("mouseover", function(d) {
            d3.select(this.parentNode).moveToFront();
            d3.select(this)
             .transition().attr("r", 50);
            if(d.group === "course"){           
              d3.select(this.parentNode).select("text")
                .text(function(d) { return d.moreInfo.get('title'); });
            }
          })                  
          .on("mouseout", function(d) {     
              d3.select(this).transition()  
                .attr("r", function(d) { return (d.relevance - 0.6) * 80; }); 
              if(d.group === "course"){           
                d3.select(this.parentNode).select("text")
                  .text(function(d) { return d.name; });
              }
          });

      nodeEnter.append("text")
          .attr("dy", ".35em") // vertical align to center
          .attr("text-anchor", "middle") // horizontal align to center
          .text(function(d) { return d.name; });
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    // Toggle children on click.
    function click(d) {
      if (d3.event.defaultPrevented) return; // ignore drag

      if (d.children) { // hide children
        d._children = d.children;
        d.children = null;
      } else { // asyc load children
        d.children = d._children;
        d._children = null;
        if(!d.children) {
          if (d.group === "course") {
            model.exploreCourse(d);
          } else if (d.group === "concept") {
            model.exploreConcept(d);
          }
        }
      }

      update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = d3.selectAll(".node").size();

      function hideRecurse(node) {
        if(!node.id) {
          node.id = ++i;
        }

        if (node.children) {
          node.children.forEach(hideRecurse);
        } else if (node._children) {
          node._children.forEach(hideRecurse);
        }
      }

      function recurse(node) {
        if(!node.id) {
          node.id = ++i;
        }

        nodes.push(node);

        if (node.children) {
          node.children.forEach(recurse);
        } else if (node._children) {
          node._children.forEach(hideRecurse);
        }
      }

      recurse(root);
      return nodes;
    }

  };

  return {
    init: init
  };
});

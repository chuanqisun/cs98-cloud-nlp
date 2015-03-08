define(['jquery', 'd3', 'd3cloud', 'model', 'event', 'config', 'controller', 'service'], function(jQuery, d3, d3cloud, model, event, config, controller, service) {

  var colors = {
    "root": "#ffffff",
    "prerequisite": "#5687d1",
    "nextSteps": "#7b615c",
    "topics": "#6ab975",
    "related": "#a173d1"
  };

  var init = function() {

    event.listen(event.conceptUpdateEvent, function(e, d) {
      root = d;
      if(g) {
        g.transition().duration(500)
          .style('opacity', 0);

        setTimeout(function(){ updateConcept(); }, 500);

      }else{ //first time render
        updateConcept();
      }  
      
    });

    event.listen(event.modelUpdateEvent, function(e, d) { 
      // draw children on original graph
      root = d;
      // fade out all text elements
      if(g) {
        g.transition().duration(500)
          .style('opacity', 0);

        setTimeout(function(){ updateCourse(); }, 500);

      }else{ //first time render
        updateCourse();
      }    

    });

    event.listen(event.showCloudEvent, function(e, d) {
      if(g) {
        g.transition().duration(500)
          .style('opacity', 0);

        setTimeout(function(){ 
          hideSunburst();
          reloadCloud();
          showCloud();
        }, 500);
      } else {
        hideSunburst();
        reloadCloud();
        showCloud();
      }
      
      
    });

    event.listen(event.showSunburstEvent, function(e, d) {
      hideCloud();
      setTimeout(function(){ showSunburst();}, 500);
    })

    $("body").load("/lib/modules/template/main-view.html", function() {
      hideSunburst();
      reloadCloud();
      controller.init();
    });
    
    var width = $('.graph-container').width(),
      height = $('.graph-container').height(),
      root;

    var radius = Math.min(width, height) / 2;
    var svg, g, path, text;

    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.sqrt()
        .range([0, radius]);

    var color = d3.scale.category20c();


    var partition = d3.layout.partition()
        .sort(null)
        .value(function(d) { return d.size; }); //sizing

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

    // Keep track of the node that is currently being displayed as the root.
    var node;

    function reloadCloud() {
      $(".cloud").remove();
      loadCloud("course", ".main-left-panel");
      loadCloud("concept", ".main-right-panel");
    }

    function loadCloud(group, position) {

      // TEST DEBUG
      Parse.Cloud.run('getMostViewed', { group: group }, {
        success: function(activities) {
          width = $(position).width();
          height = $(position).height();

          var fill = d3.scale.category20();

            d3.layout.cloud().size([width, height])
                .words(activities.map(function(d) {
                  return {text: d.keyword, group: d.group, size: Math.sqrt(d.value * 500)};
                }))
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();

            function draw(words) {
              var tags = d3.select(position).append("svg")
                  .attr("class", "cloud")
                  .attr("width", width)
                  .attr("height", height)
                .append("g")
                  .attr("transform", "translate("+ width/2 +","+ height/2 +")")
                .selectAll("text")
                  .data(words)
                .enter().append("text")
                  .style("opacity", 0)
                  .style("font-size", function(d) { return d.size + "px"; })
                  .style("font-family", "Impact")
                  .style("fill", function(d, i) { return fill(i); })
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .text(function(d) { return d.text; })
                  .on("click", cloudClick)
                  .on("mouseover", cloudMouseOver)
                  .on("mouseleave", cloudMouseLeave);

              tags.transition().duration(500)
                .style("opacity", 1);
            }

            function cloudMouseOver(d) {
              d3.select(this).style("font-size", function(d) { return 1.2 * d.size + "px"; })
            }

            function cloudMouseLeave(d) {
              d3.select(this).style("font-size", function(d) { return d.size + "px"; })
            }


            function cloudClick(d) {
              
              if (d.group=="course") {
                service.putActivity(d.text, 'popular', 'course');
                model.addCourse(d.text).then(function() {
                  hideCloud();
                  setTimeout(function(){ showSunburst();}, 500);
                });
              } else if (d.group=="concept") {
                service.putActivity(d.text, 'popular', 'concept');
                model.addConcept(d.text).then(function() {
                  hideCloud();
                  setTimeout(function(){ showSunburst();}, 500);
                });
              }
            }
        }
      });

    }

    function updateConcept() {
      d3.select(".main-graph").remove();
      width = $('.graph-container').width();
      height = $('.graph-container').height();
      radius = Math.min(width, height) / 2;
      y = d3.scale.sqrt()
        .range([0, radius]);
      arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      svg = d3.select(".graph-container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "main-graph")
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      g = svg.selectAll("g")
          .data(partition.nodes(root))
        .enter().append("g")
          .style('opacity', 0)
          .attr("class", "segment");

      path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return colors[d.group]; })
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("click", click);

      var rootR = $(".segment")[0].getBoundingClientRect().width / 2;
      var padding = rootR * (1 - 1 / Math.sqrt(2));

      $(".right-panel").height(rootR * 2);
      $(".right-panel").width(rootR * 2);
      $(".right-panel").offset($(".segment")[0].getBoundingClientRect());

      mouseleave(root);
             
      text = g.append("text")
        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .text(function(d) { 
          if (d.depth) {
            return d.name;
          } else {
            return "";
          } 
        });

      g.filter(filterNonRoot).transition().duration(500)
           .style('opacity', 1);
           
      d3.select(self.frameElement).style("height", height + "px");

      function filterNonRoot (d) {
        return (d.depth > 0);
      }

      // Restore everything to full opacity when moving off the visualization.
      function mouseleave(d) {
        g.filter(filterNonRoot).style("opacity", 1);
         $(".more-info").empty();
        $(".details").empty();
        $(".details").append("<div class='topic'>" + root.name + "</div>");
      }

      function mouseover(d) {
        if (d.depth) {
          var sequenceArray = getAncestors(d);

          // Fade all the segments.
          g.filter(filterNonRoot).style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          g.filter(filterNonRoot).filter(function(node) {
            return (sequenceArray.indexOf(node) > 0);
          })
            .style("opacity", 1);
        }

        if (d.depth === 1 && d.group === "related") {
          $(".more-info").empty();
          $(".more-info").append("<div class='title'>" + d.moreInfo.get('title') + "</div>");
          $(".more-info").append("<div class='code'>" + d.moreInfo.get('code') + "</div>");
          $(".more-info").append("<div class='offered'>" + d.moreInfo.get('offered') + "</div>");
          $(".more-info").append("<div class='description'>" + d.moreInfo.get('description') + "</div>");
          $(".more-info").append("<div class='instructor'>" + d.moreInfo.get('instructor') + "</div>");
          $(".more-info").append("<div class='prerequisitestext'>" + d.moreInfo.get('prerequisitestext') + "</div>");
          $(".more-info").append("<div class='distribution'>" + d.moreInfo.get('distribution') + "</div>");
          $(".details").empty();
          $(".details").append("<div class='code'>" + d.moreInfo.get('code') + "</div>");
        }

        if (d.depth === 2 && d.group === "topics") {
          $(".details").html("<div class='topic'>" + d.name + "</div>");
        }
      }

      function click(d) {
        if(!d.children) {
          if (d.group === "related") {
            model.exploreCourse(d);
            service.putActivity(d.moreInfo.get('code'), 'explore', 'course');
          }
        }
      }
    }

    function updateCourse() {
      d3.select(".main-graph").remove();
      width = $('.graph-container').width();
      height = $('.graph-container').height();
      radius = Math.min(width, height) / 2;
      y = d3.scale.sqrt()
        .range([0, radius]);
      arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

      svg = d3.select(".graph-container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "main-graph")
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      g = svg.selectAll("g")
          .data(partition.nodes(root))
        .enter().append("g")
          .style('opacity', 0)
          .attr("class", "segment");

      path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return colors[d.group]; })
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .on("click", click);

      var rootR = $(".segment")[0].getBoundingClientRect().width / 2;
      var padding = rootR * (1 - 1 / Math.sqrt(2));

      $(".right-panel").height(rootR * 2);
      $(".right-panel").width(rootR * 2);
      $(".right-panel").offset($(".segment")[0].getBoundingClientRect());

      mouseleave(root);
             
      text = g.append("text")
        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6") // margin
        .attr("dy", ".35em") // vertical-align
        .text(function(d) { 
          if (d.depth) {
            return d.name;
          } else {
            return "";
          } 
        });

      g.filter(filterNonRoot).transition().duration(500)
           .style('opacity', 1);
           
      d3.select(self.frameElement).style("height", height + "px");

      function filterNonRoot (d) {
        return (d.depth > 0);
      }

      // Restore everything to full opacity when moving off the visualization.
      function mouseleave(d) {
        g.filter(filterNonRoot).style("opacity", 1);
        $(".more-info").empty();
        $(".more-info").append("<div class='title'>" + root.moreInfo.get('title') + "</div>");
        $(".more-info").append("<div class='code'>" + root.moreInfo.get('code') + "</div>");
        $(".more-info").append("<div class='offered'>" + root.moreInfo.get('offered') + "</div>");
        $(".more-info").append("<div class='description'>" + root.moreInfo.get('description') + "</div>");
        $(".more-info").append("<div class='instructor'>" + root.moreInfo.get('instructor') + "</div>");
        $(".more-info").append("<div class='prerequisitestext'>" + root.moreInfo.get('prerequisitestext') + "</div>");
        $(".more-info").append("<div class='distribution'>" + root.moreInfo.get('distribution') + "</div>");
        $(".details").empty();
        $(".details").append("<div class='code'>" + root.moreInfo.get('code') + "</div>");
      }

      function mouseover(d) {
        if (d.depth) {
          var sequenceArray = getAncestors(d);

          // Fade all the segments.
          g.filter(filterNonRoot).style("opacity", 0.3);

          // Then highlight only those that are an ancestor of the current segment.
          g.filter(filterNonRoot).filter(function(node) {
            return (sequenceArray.indexOf(node) > 0);
          })
            .style("opacity", 1);
        }

        if (d.depth === 2 && (d.group === "related" || d.group === "prerequisite" || d.group === "nextSteps")) {
          $(".more-info").empty();
          $(".more-info").append("<div class='title'>" + d.moreInfo.get('title') + "</div>");
          $(".more-info").append("<div class='code'>" + d.moreInfo.get('code') + "</div>");
          $(".more-info").append("<div class='offered'>" + d.moreInfo.get('offered') + "</div>");
          $(".more-info").append("<div class='description'>" + d.moreInfo.get('description') + "</div>");
          $(".more-info").append("<div class='instructor'>" + d.moreInfo.get('instructor') + "</div>");
          $(".more-info").append("<div class='prerequisitestext'>" + d.moreInfo.get('prerequisitestext') + "</div>");
          $(".more-info").append("<div class='distribution'>" + d.moreInfo.get('distribution') + "</div>");
          $(".details").empty();
          $(".details").append("<div class='code'>" + d.moreInfo.get('code') + "</div>");
        }

        if (d.depth === 1) {
          $(".details").html("<div class='categorical'>" + d.name + "</div>");
        }

        if (d.depth === 2 && d.group === "topics") {
          $(".details").html("<div class='topic'>" + d.name + "</div>");
        }
      }

      function click(d) {

        if(!d.children) {
          if (d.group === "related" || d.group === "prerequisite" || d.group === "nextSteps") {
            model.exploreCourse(d);
            service.putActivity(d.moreInfo.get('code'), 'explore', 'course');
          } else if (d.group === "topics") {
            model.exploreConcept(d);
            service.putActivity(d.name, 'explore', 'concept');
          }
        }
      }
    }

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    function getAncestors(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      path.unshift(current);
      return path;
    }

    // Interpolate the scales!
    function arcTween(d) {
      var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
          yd = d3.interpolate(y.domain(), [d.y, 1]),
          yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
      return function(d, i) {
        return i
            ? function(t) { return arc(d); }
            : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
      };
    }

    function computeTextRotation(d) {
      return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    }

  };

  var hideSunburst = function() {
    $(".graph-container").hide();
    $(".details").hide();
    $(".more-info").hide();
    $(".navigation-container").hide();
  }

  var showSunburst = function() {
    $(".graph-container").show();
    $(".details").show();
    $(".more-info").show();
    $(".navigation-container").show();
  }

  var hideCloud = function() {
    
    setTimeout(function(){ $(".cloud").hide(); }, 500);
    d3.selectAll('.cloud').transition()
      .duration(500)
      .style('opacity', 0);
  }

  var showCloud = function() {
    $(".cloud").show();
  }


  return {
    init: init
  };
});

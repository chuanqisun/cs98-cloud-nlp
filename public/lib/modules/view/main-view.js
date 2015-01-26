define(['jquery', 'd3'], function() {
  var render = function() {
    $("body").append("<button id='concept-button' type='button'>get concept</button>");
    $("body").append("<button id='course-button' type='button'>get course</button>");
    d3.select("body").style("background-color", "black");
  };
  return {
    render: render
  };
});

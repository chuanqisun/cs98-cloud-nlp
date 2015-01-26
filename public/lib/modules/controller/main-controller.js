define(['jquery', 'model'], function(jQuery, model) {
  var init = function() {
    $("#concept-button").click(function() {
      model.insertCourse("COSC 1");
  	});
  	$("#course-button").click(function() {
  	  model.insertConcept("Photography");
  	});
  };
  return {
    init: init
  };
});

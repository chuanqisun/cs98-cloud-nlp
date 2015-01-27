define(['jquery', 'model'], function(jQuery, model) {
  var init = function() {
    $("#concept-button").click(function() {
      model.insertConcept("Photography");
  	});
  	$("#course-button").click(function() {
  	  model.insertCoursesForConcept("Photography");
  	});
  };
  return {
    init: init
  };
});

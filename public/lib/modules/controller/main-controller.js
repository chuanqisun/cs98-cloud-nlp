define(['jquery', 'model'], function(jQuery, model) {
  var init = function() {
    $("#concept-button").click(function() {
      model.insertConcept("Photography");
  	});
  	$("#course-button").click(function() {
  	  model.insertCoursesForConcept("Photography");
  	});
    $("#more-button").click(function() {
      model.insertConceptsForCourse("SART 30");
    });
  };
  return {
    init: init
  };
});

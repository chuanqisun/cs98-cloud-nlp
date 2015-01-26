define(['jquery', 'data-service'], function(jQuery, dataService) {
  var init = function() {
    $("#concept-button").click(function() {
      dataService.getConceptsForCourse("COSC 1");
  	});
  	$("#course-button").click(function() {
  	  dataService.getCoursesForConcept("Photography");
  	});
  };
  return {
    init: init
  };
});

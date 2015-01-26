define(['service'], function(service) {
  var init = function() {
  	// prepare data structure for nodes and edges
  };

  var insertConcept = function(concept) {
  	  service.getCoursesForConcept(concept);
  };

  var insertCourse = function(course) {
      service.getConceptsForCourse(course);
  }

  return {
    init: init,
    insertConcept: insertConcept,
    insertCourse: insertCourse
  };
});

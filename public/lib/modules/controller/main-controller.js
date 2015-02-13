define(['jquery', 'model', 'service'], function(jQuery, model, service) {
  var init = function() {
   //  $("#concept-button").click(function() {
   //    model.insertConcept("Photography");
  	// });
  	$("#course-button").click(function() {
  	  model.addCourse("COSC 1");

      // load parse data base to speed up query
      // service.getAllCourses();
  	});
    //  $("#more-button").click(function() {
    //   model.exploreCourse("SART 30");
    // });
  };
  return {
    init: init
  };
});

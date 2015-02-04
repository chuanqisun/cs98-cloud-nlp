define(['jquery', 'model'], function(jQuery, model) {
  var init = function() {
   //  $("#concept-button").click(function() {
   //    model.insertConcept("Photography");
  	// });
  	$("#course-button").click(function() {
  	  model.addCourse("FILM 45");
  	});
    //  $("#more-button").click(function() {
    //   model.exploreCourse("SART 30");
    // });
  };
  return {
    init: init
  };
});

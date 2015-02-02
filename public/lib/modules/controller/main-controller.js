define(['jquery', 'model'], function(jQuery, model) {
  var init = function() {
   //  $("#concept-button").click(function() {
   //    model.insertConcept("Photography");
  	// });
  	$("#course-button").click(function() {
  	  model.addCourse("SART 30");
  	});
    //  $("#more-button").click(function() {
    //   model.exploreCourse("SART 30");
    // });
  };
  return {
    init: init
  };
});

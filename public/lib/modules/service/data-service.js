define(['parse'], function(parse) {
  var init = function() {
    Parse.initialize("dpfdUhCXPPBflubK1bKkI8eeUAgyLf8FQZ86h1bq", "1Ac6b4DiROlm94KJJdyDuRAUS0oOmN4r4oqxouLt");
  };

  var getConceptsForCourse = function(courseCode) {
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.equalTo("code", courseCode);
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " concepts.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          console.log(object.id + ' - ' + object.get('text'));
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };

  var getCoursesForConcept = function(concept) {
  	var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.equalTo("text", concept);
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " courses.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          console.log(object.id + ' - ' + object.get('code'));
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
  
  return {
    init: init,
    getConceptsForCourse: getConceptsForCourse,
    getCoursesForConcept: getCoursesForConcept
  };
});

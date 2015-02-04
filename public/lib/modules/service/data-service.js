define(['parse', 'config'], function(parse, config) {
  var init = function() {
    Parse.initialize("dpfdUhCXPPBflubK1bKkI8eeUAgyLf8FQZ86h1bq", "1Ac6b4DiROlm94KJJdyDuRAUS0oOmN4r4oqxouLt");
  };

  var getCourse = function(courseCode) {
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.equalTo("code", courseCode);
    query.include("courseObj");
    return query.find();
  }

  var getConceptsForCourse = function(courseCode) {
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.equalTo("code", courseCode);
    query.descending("relevance");
    query.greaterThan("relevance", config.conceptMinRelevance);
    return query.find();
  };

  var getCoursesForConcept = function(concept) {
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.equalTo("text", concept);
    query.descending("relevance");
    query.greaterThan("relevance", config.courseMinRelevance);
    query.include("courseObj");
    return query.find();
  };



  return {
    init: init,
    getCourse: getCourse,
    getConceptsForCourse: getConceptsForCourse,
    getCoursesForConcept: getCoursesForConcept
  };
});

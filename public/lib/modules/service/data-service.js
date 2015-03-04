define(['parse', 'config', 'event'], function(parse, config, event) {
  var allCourses;

  var init = function() {
    Parse.initialize("dpfdUhCXPPBflubK1bKkI8eeUAgyLf8FQZ86h1bq", "1Ac6b4DiROlm94KJJdyDuRAUS0oOmN4r4oqxouLt");
    loadAllCourses();
  };

  var getAllCourses = function () {
    return allCourses;
  }

  var loadAllCourses = function() {
    var Course = Parse.Object.extend("Course");
    var query1 = new Parse.Query(Course);
    var query2 = new Parse.Query(Course);
    var query3 = new Parse.Query(Course);
    var results = [];
    query1.limit(1000);
    query2.limit(1000);
    query2.skip(1000);
    query3.limit(1000);
    query3.skip(2000);

    query1.find().then(function(r){
      allCourses = r;
      return query2.find().then(function(r){
        allCourses = allCourses.concat(r);
        return query3.find().then(function(r){
          allCourses = allCourses.concat(r);
          event.emit(event.dataOnloadEvent, null);
        })
      })
    })
  }

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
    query.include("courseObj");
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

  var getConcepts = function(concept) {
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);
    query.contains("textLowerCase", concept.toLowerCase());
    return query.find();
  }

  var putActivity = function(keyword, type, group) {
    var UserActivity = Parse.Object.extend("UserActivity");
    var userActivity = new UserActivity();
    userActivity.set("keyword", keyword);
    userActivity.set("type", type);
    userActivity.set("group", group);
    userActivity.save();
  }

  return {
    init: init,
    loadAllCourses: loadAllCourses,
    getAllCourses: getAllCourses,
    getCourse: getCourse,
    getConceptsForCourse: getConceptsForCourse,
    getCoursesForConcept: getCoursesForConcept,
    getConcepts: getConcepts,
    putActivity: putActivity
  };
});

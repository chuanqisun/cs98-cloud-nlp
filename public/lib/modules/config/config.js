define([], function(parse) {

  var conceptMinRelevance = 0.3; // miniimum relevance for a concept to be considered
  var courseMinRelevance = 0.3;  // miniimum relevance for a course to be considered

  var similarCourseThreshold = 2.0;
  var similarCourseMaxCount = 5;

  return {
    conceptMinRelevance: conceptMinRelevance,
    courseMinRelevance: courseMinRelevance,
    similarCourseThreshold: similarCourseThreshold,
    similarCourseMaxCount: similarCourseMaxCount
  };
});

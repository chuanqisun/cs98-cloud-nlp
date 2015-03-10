define([], function() {

  var conceptMinRelevance = 0.3; // miniimum relevance for a concept to be considered
  var courseMinRelevance = 0.3;  // miniimum relevance for a course to be considered
  var similarCourseThreshold = 1.0;
  var similarCourseMaxCount = 5;
  var sunburstSizedownRatio = 2.2;

  var sunburstVerticalBufferRatio = 1.1;

  return {
    conceptMinRelevance: conceptMinRelevance,
    courseMinRelevance: courseMinRelevance,
    similarCourseThreshold: similarCourseThreshold,
    similarCourseMaxCount: similarCourseMaxCount,
    sunburstSizedownRatio: sunburstSizedownRatio,
    sunburstVerticalBufferRatio: sunburstVerticalBufferRatio
  };
});

define([], function(parse) {

  var conceptMinRelevance = 0.7; // miniimum relevance for a concept to be considered
  var courseMinRelevance = 0.7;  // miniimum relevance for a course to be considered

  var linkDistance = 100;
  var charge = -400;

  return {
    conceptMinRelevance: conceptMinRelevance,
    courseMinRelevance: courseMinRelevance,
    linkDistance: linkDistance,
    charge: charge
  };
});

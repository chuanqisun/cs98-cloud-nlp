define(['service', 'event'], function(service, event) {

  var graph;

  var getGraph = function() {
    return graph;
  }

  var init = function() {
    graph = {};
  };

  var Node = function(name, children, group, relevance, moreInfo) {
    this.name = name;
    this.children = children;
    this.group = group;
    this.relevance = relevance;
    this.moreInfo = moreInfo;
  }

  var addCourse = function(course) {

    var promise = service.getCourse(course);

    promise.then(function(results) {
      if (results.length > 0) {
        node = new Node(results[0].get('code'), null, 'course', 1, results[0].get('courseObj'));
        // temporary solution
        graph = node;
        
        event.emit(event.modelUpdateEvent, null);
      }    
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });    
  }

  var exploreConcept = function(conceptNode) {
    var promise = service.getCoursesForConcept(conceptNode.name);

    conceptNode.children = [];

    promise.then(function(results) {
      for (var i = 0; i < results.length; i++) {
        child = new Node(results[i].get('code'), null, 'course', results[i].get('relevance'), results[i].get('courseObj'));
        conceptNode.children.push(child);
      }

      event.emit(event.modelUpdateEvent, null);
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });
  }

  var exploreCourse = function(courseNode) {
    var promise = service.getConceptsForCourse(courseNode.name);

    courseNode.children = [];

    promise.then(function(results) {
      for (var i = 0; i < results.length; i++) {
        child = new Node(results[i].get('text'), null, 'concept', results[i].get('relevance'), null);
        courseNode.children.push(child);
      }

      event.emit(event.modelUpdateEvent, null);
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });
  }

  return {
    init: init,
    getGraph: getGraph,
    addCourse: addCourse,
    exploreCourse: exploreCourse,
    exploreConcept: exploreConcept
  };
});

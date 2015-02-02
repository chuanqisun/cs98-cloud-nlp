define(['service', 'event'], function(service, event) {

  var graph;

  var getGraph = function() {
    return graph;
  }

  var init = function() {
    graph = {};
  };

  var Node = function(name, children, group) {
    this.name = name;
    this.children = children;
    this.group = group;
  }

  var addCourse = function(course) {
    var node = new Node(course, null, 'course');
    var child;
    // temporary solution
    graph = node;

    //send model update message to view
    event.emit(event.modelUpdateEvent, null);
  }

  var exploreConcept = function(conceptNode) {
    var promise = service.getCoursesForConcept(conceptNode.name);

    conceptNode.children = [];

    promise.then(function(results) {
      for (var i = 0; i < results.length; i++) {
        child = new Node(results[i].get('code'), null, 'course');
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
        child = new Node(results[i].get('text'), null, 'concept');
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

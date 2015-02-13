define(['service', 'event', 'config', 'cosine'], function(service, event, config, cosine) {

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
        exploreCourse(node);
      }    
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });    
  }

  var initRoot = function(rootNode) {
    rootNode.children = [];
    rootNode.children.push(
      {name: "Prerequisite", children: []},
      {name: "Next Steps", children: []},
      {name: "Topics", children: []},
      {name: "Related", children: []}
    )
  }

  var exploreCourse = function(courseNode) {
    if (!courseNode.children) {
      initRoot(courseNode);
    }

    var p1 = getRelatedConceptsFromCourse(courseNode);
    var p2 = getRelatedCoursesFromCourse(courseNode)

    Parse.Promise.when([p1, p2]).then(function(){
      event.emit(event.modelUpdateEvent, courseNode);
    });
  
  }

  var getRelatedCoursesFromConcept = function(conceptNode, notify) {
    var promise = service.getCoursesForConcept(conceptNode.name).then(function(results) {
      conceptNode.children[3].children = [];
      for (var i = 0; i < results.length; i++) {
        var child = new Node(results[i].get('code'), null, 'course', results[i].get('relevance'), results[i].get('courseObj'));
        conceptNode.children[3].children.push(child);
      }
      return Parse.Promise.as();
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });

    return promise;
  }

  var getRelatedConceptsFromCourse = function(courseNode) {
    var promise = service.getConceptsForCourse(courseNode.name).then(function(results) {
      courseNode.children[2].children = [];
      for (var i = 0; i < results.length; i++) {
        var child = new Node(results[i].get('text'), null, 'concept', results[i].get('relevance'), null);
        courseNode.children[2].children.push(child);
      }
      return Parse.Promise.as();
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });

    return promise;
  }

  var getRelatedCoursesFromCourse = function(courseNode) {
    // Step 1 get all related concepts
    var promise = service.getConceptsForCourse(courseNode.name).then(function(results) {
      var concepts = [];
      var promises = [];

      for (var i = 0; i < results.length; i++) {
        concepts.push(results[i].get('text'))
      }

      for (var i = 0; i < concepts.length; i++) {
        promises.push(service.getCoursesForConcept(concepts[i]));
      }

      return Parse.Promise.when(promises);

    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    }).then(function() {
      var courses = {}; //dict
      // Step 2 for each concept, get related courses, insert in dictionary candidates[] and increment frequency
      for (var j = 0; j < arguments.length; j++) {       
        for (var k = 0; k < arguments[j].length; k++) { 
          if (!courses[arguments[j][k].get('code')]) {
            courses[arguments[j][k].get('code')] = {};
            courses[arguments[j][k].get('code')].conceptObj = arguments[j][k];
            courses[arguments[j][k].get('code')].conceptObj.frequency = arguments[j][k].get('relevance');
          } else {
            courses[arguments[j][k].get('code')].conceptObj.frequency += arguments[j][k].get('relevance');
          }
        }
      } 

      // Step 3 convert all courses into an array and remove self and sort
      var courseSorted = [];
      for (var property in courses) {
        if (courses.hasOwnProperty(property) && courses[property].conceptObj.frequency > config.similarCourseThreshold && courses[property].conceptObj.get('code') !== courseNode.name) {
          courseSorted.push(courses[property].conceptObj);
        }
      }

      courseSorted.sort(function(a, b){
        return b.frequency- a.frequency;
      })

      courseSorted = courseSorted.slice(0, config.similarCourseMaxCount);

      // Step 4 extra the most frequent courses as similar
      courseNode.children[3].children = [];
      
      for (var i = 0; i < courseSorted.length; i++) {
        var child = new Node(courseSorted[i].get('code'), null, 'course', courseSorted[i].get('relevance'), courseSorted[i].get('courseObj'));
        courseNode.children[3].children.push(child);
      }
      return Parse.Promise.as();
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });

    return promise;
  }

  return {
    init: init,
    initRoot: initRoot,
    getGraph: getGraph,
    addCourse: addCourse,
    exploreCourse: exploreCourse,
    getRelatedConceptsFromCourse: getRelatedConceptsFromCourse,
    getRelatedCoursesFromConcept: getRelatedCoursesFromConcept,
    getRelatedCoursesFromCourse: getRelatedCoursesFromCourse
  };
});

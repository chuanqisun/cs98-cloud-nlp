define(['service', 'event', 'config', 'cosine'], function(service, event, config, cosine) {

  var graph;

  var getGraph = function() {
    return graph;
  }

  var init = function() {
    graph = {};
  };

  var Node = function(name, children, group, relevance, size, moreInfo) {
    this.name = name;
    this.children = children;
    this.group = group;
    this.relevance = relevance;
    this.size = size;
    this.moreInfo = moreInfo;
  }

  var addCourse = function(course) {

    var promise = service.getCourse(course);

    return promise.then(function(results) {
      if (results.length > 0) {
        var node = new Node(results[0].get('code'), null, 'root', 1, 100, results[0].get('courseObj'));
        graph = node;
        return exploreCourse(node);
      }    
    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });    
  }

  var addConcept = function(concept) {
    var node = new Node(concept, null, 'root', 1, 100, null);
    graph = node;
    return exploreConcept(node);
  }

  var initRoot = function(rootNode) {
    rootNode.children = [];
    rootNode.children.push(
      {name: "Prerequisite", children: [], group: "prerequisite", size: 25},
      {name: "Next Steps", children: [], group: "nextSteps", size: 25},
      {name: "Topics", children: [], group: "topics", size: 25},
      {name: "Related", children: [], group: "related", size: 25}
    )
  }

  var exploreCourse = function(courseNode) {
    if (!courseNode.children) {
      initRoot(courseNode);
    }

    var p1 = getRelatedConceptsFromCourse(courseNode);
    var p2 = getRelatedCoursesFromCourse(courseNode)

    return Parse.Promise.when([p1, p2]).then(function(){
      event.emit(event.modelUpdateEvent, courseNode);
      return Parse.Promise.as();
    });
  }

  var exploreConcept = function(conceptNode) {
    var promise = getRelatedCoursesFromConcept(conceptNode);

    return promise.then(function(){
      event.emit(event.conceptUpdateEvent, conceptNode);
      return Parse.Promise.as();
    })
  }

  // return an array of concepts that contains the query string, ranking by the number of results
  var getRankedConcepts = function(query) {
    var promise = service.getConcepts(query);
    var conceptsDict = {};
    var conceptsArray = [];

    return promise.then(function(results){
    
      for (var i = 0; i < results.length; i++) {

        if (!conceptsDict[results[i].get('text')]) {
          conceptsDict[results[i].get('text')] = 1;
        } else {
          conceptsDict[results[i].get('text')]++;
        }
      }

      var sortable = [];
      for (var concept in conceptsDict) {
        sortable.push([concept, conceptsDict[concept]])
      }
      sortable.sort(function(a, b) {return b[1] - a[1]});

      for (var i = 0; i < sortable.length; i++) {
        conceptsArray[i] = sortable[i][0];
      }

      return Parse.Promise.as(conceptsArray);
    })
  }

  var getRelatedCoursesFromConcept = function(conceptNode) {

    var promise = service.getCoursesForConcept(conceptNode.name).then(function(results) {
      conceptNode.group = 'root';
      conceptNode.children = [];
      for (var i = 0; i < results.length; i++) {
        var child = new Node(results[i].get('code'), null, 'related', results[i].get('relevance'), 100.0 / results.length, results[i].get('courseObj'));
        conceptNode.children.push(child);
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
      courseNode.group = 'root';
      for (var i = 0; i < results.length; i++) {
        var child = new Node(results[i].get('text'), null, 'topics', results[i].get('relevance'), 25.0 / results.length, results[i].get('courseObj'));
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
      courseNode.group = 'root';
      for (var i = 0; i < courseSorted.length; i++) {
        var child = new Node(courseSorted[i].get('code'), null, 'related', courseSorted[i].get('relevance'), 25.0 / courseSorted.length, courseSorted[i].get('courseObj'));
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
    addConcept: addConcept,
    exploreCourse: exploreCourse,
    exploreConcept: exploreConcept,
    getRankedConcepts: getRankedConcepts,
    getRelatedConceptsFromCourse: getRelatedConceptsFromCourse,
    getRelatedCoursesFromConcept: getRelatedCoursesFromConcept,
    getRelatedCoursesFromCourse: getRelatedCoursesFromCourse
  };
});

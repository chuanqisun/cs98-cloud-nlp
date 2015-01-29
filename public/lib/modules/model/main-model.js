define(['service', 'event'], function(service, event) {

  var graph = {};

  var getGraph = function() {
    return graph;
  }

  var init = function() {
  	// prepare data structure for nodes and links
    graph = new Graph();
  };

  // Data Structures
  var Graph = function() {
    this.nodes = [];
    this.links = [];
    this.nodeDict = new Array(); // keep track of the indices of all nodes
    this.currentIndex = 0;
  }

  Graph.prototype.insertNode = function(node) {
    if(this.nodeDict[node.name] === undefined){
      var index = this.currentIndex;
      this.nodeDict[node.name] = index;
      this.currentIndex++;
      this.nodes.push(node);

      return index;
    }
    return -1;
  }

  Graph.prototype.insertLink = function(link) {
    this.links.push(link);
  }

  Graph.prototype.getIndex = function(key) {
    return this.nodeDict[key];
  }

  var Node = function(name, group) {
    this.name = name;
    this.group = group;
  }

  var Link = function(source, target, value) {
    this.source = source;
    this.target = target;
    this.value = value;
  }


  // Model updates

  // Only to be called at beginning
  var insertConcept = function(concept) {
    node = new Node(concept, 'concept');
    if (graph.insertNode(node) >= 0) {
      // send model update message to view
      event.emit(event.modelAddNodesEvent, {nodes:[node], links: []});
    }
  }

  // Only to be called at beginning
  var insertCourse = function(course) {
    node = new Node(course, 'course');
    if (graph.insertNode(node) >= 0) {
      // send model update message to view
      event.emit(event.modelAddNodesEvent, {nodes:[node], links: []});
    }
  }

  var insertCoursesForConcept = function(concept) {
	  var promise = service.getCoursesForConcept(concept);
    
    var node, link, nodes, links;
    updateNodes = [];
    updateLinks = [];
    promise.then(function(results) {
      var sourceId = graph.getIndex(concept);

      // insert course nodes
      for (var i = 0; i < results.length; i++) {
        node = new Node(results[i].get('code'), 'course');
        var targetId = graph.insertNode(node);
        if (targetId >= 0) {
          updateNodes.push(node);
          link = new Link(sourceId, targetId, 1);
          graph.insertLink(link);
          updateLinks.push(link);
        }
      }

      //send model update message to view
      event.emit(event.modelAddNodesEvent, {nodes:updateNodes, links:updateLinks});

    }, function(error) {
      alert("Error: " + error.code + " " + error.message);
    });
  };

  var insertConceptsForCourse = function(course) {
      var promise = service.getConceptsForCourse(course);
      promise.then(function(results) {
        alert("Successfully retrieved " + results.length + " courses.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
        }
      }, function(error) {
        alert("Error: " + error.code + " " + error.message);
      });
  };

  return {
    init: init,
    getGraph: getGraph,
    insertConcept: insertConcept,
    insertCourse: insertCourse,
    insertConceptsForCourse: insertConceptsForCourse,
    insertCoursesForConcept: insertCoursesForConcept
  };
});

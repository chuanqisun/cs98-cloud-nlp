
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");

// });
Parse.Cloud.beforeSave("Concept", function(request, response) {
  if (request.object.get("text")) {
    request.object.set("textLowerCase", request.object.get("text").toLowerCase());
  }

  response.success();
});

Parse.Cloud.job("addLowercase_concept_names", function(request, status) {
  var _ = require('underscore');
  Parse.Cloud.useMasterKey();

  var newObj = [];
  var Concept = Parse.Object.extend("Concept");
  var query = new Parse.Query(Concept);
  
  query.limit(1000);
  query.doesNotExist('textLowerCase');

  query.find().then(function(concpets) {
    _.each(concpets, function(concept) {
      concept.set("textLowerCase", concept.get("text").toLowerCase());
      newObj.push(concept);
    });

    Parse.Object.saveAll(newObj, {
      success: function(list) {
        status.success("good");
      },
      error: function(error) {
       status.error("Error: " + error.code + " " + error.message);
      },
    });

  });
});

Parse.Cloud.job("addPointer_from_concept_to_course", function(request, status) {
  // Set up to modify user data
  Parse.Cloud.useMasterKey();

  var Concept = Parse.Object.extend("Concept");
  var Course = Parse.Object.extend("Course");
  var query = new Parse.Query(Concept);
  var innerQuery = new Parse.Query(Course);

  var promises = [];
  var newObj = [];

  var _ = require('underscore');

  query.limit(1000);
  query.doesNotExist('courseObj');
 
  query.find().then(function(results) {
    // Create a trivial resolved promise as a base case.
    var promise = Parse.Promise.as();
    _.each(results, function(result) {
      // For each item, extend the promise with a function to delete it.
      promise = promise.then(function() {
        

        innerQuery.equalTo('code', result.get('code'));
        return innerQuery.find().then(function(innerResult){
          // console.log("query for " + result.get('code'));
          result.set("courseObj", innerResult[0]);
          newObj.push(result);

        });

      });
    });
    return promise;
   
  }).then(function() {
    // Every comment was deleted.
        Parse.Object.saveAll(newObj, {
          success: function(list) {
            // console.log(list);
            status.success("good");
          },
          error: function(error) {
           status.error("Error: " + error.code + " " + error.message);
          },
        });

  });
});
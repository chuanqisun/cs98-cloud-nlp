
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");

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



  // query.find().then(function(results){

  //   var promise = new Parse.Promise();
    

  //   for(var i = 0; i < results.length; i++){
  //     var obj = results[i];

  //     status.message("index: " + i);

  //     innerQuery.limit(1000);
  //     innerQuery.equalTo('code', results[i].get('code'));


  //     promises.push(innerQuery.find().then(function(innerResult){
  //       console.log("executed " + i + " " + obj.get('code'));
  //       if (innerResult.length > 0){
  //         console.log("found obj for " + i);
  //       }
  //       obj.set("courseObj", innerResult[0]);
  //       newObj.push(obj);

  //     }));


  //   }
  //   Parse.Promise.when(promises).then(function() {
  //     Parse.Object.saveAll(newObj, {
  //       success: function(list) {
  //         console.log(list);
  //         status.success("good");
  //       },
  //       error: function(error) {
  //        status.error("Error: " + error.code + " " + error.message);
  //       },
  //     });
      
  //   }, function(error) {
  //     status.error("Error: " + error.code + " " + error.message);
  //   });
    
  // });

});
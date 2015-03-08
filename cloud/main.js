
// return an array of most viewed objects
Parse.Cloud.define("getMostViewed", function(request, response) {
  var _ = require('underscore');
  var group = request.params.group;

  var UserActivity = Parse.Object.extend("UserActivity");
  var query = new Parse.Query(UserActivity);

  var d = new Date();
  var time = (1 * 24 * 3600 * 1000); // one day's time
  var startDate = new Date(d.getTime() - (time));

  query.equalTo('group', group);
  query.greaterThanOrEqualTo( "createdAt", startDate);
  query.descending("createdAt");
  query.limit(1000)
  query.find().then(function(activities){

    var aggregate = {};

    var test = [];

    _.each(activities, function(activity) {
      keyword = activity.get("keyword");

      if (!aggregate[keyword]) {
        aggregate[keyword] = 1;
      } else {
        aggregate[keyword]++;
      }
    });

    var sortable = [];
    for (var item in aggregate) {
      sortable.push({keyword: item, value: aggregate[item], group: group})
    }
    sortable.sort(function(a, b) {return b.value - a.value});


    response.success(sortable);
  })


  
});

Parse.Cloud.beforeSave("UserActivity", function(request, response) {
  if (request.object.get("group") == "course") {
    var code = request.object.get("keyword");
    var Course = Parse.Object.extend("Course");
    var query = new Parse.Query(Course);

    query.equalTo('code', code);
    query.find().then(function(innerResult){
      request.object.set("relatedCourse", innerResult[0]);
      response.success();
    });
  } else if (request.object.get("group") == "concept") {
    var concept = request.object.get("keyword");
    var Concept = Parse.Object.extend("Concept");
    var query = new Parse.Query(Concept);

    query.equalTo('text', concept);
    query.find().then(function(innerResult){
      request.object.set("relatedConcept", innerResult[0]);
      response.success();
    });
  }
});

Parse.Cloud.beforeSave("Prerequisite", function(request, response) {
    var fromCode = request.object.get("fromCode");
    var toCode = request.object.get("toCode");

    // prevent loop
    if (fromCode == toCode) {
      resonse.error("loop");
      
    } else {

      var Course = Parse.Object.extend("Course");
      var query1 = new Parse.Query(Course);
      var query2 = new Parse.Query(Course);
      query1.equalTo('code', fromCode);
      query2.equalTo('code', toCode);
      
      var promise1 = query1.find().then(function(innerResult){
        request.object.set("fromCourseObject", innerResult[0]);
      });

      var promise2= query2.find().then(function(innerResult){
        request.object.set("toCourseObject", innerResult[0]);
      });

      Parse.Promise.when([promise1, promise2]).then(function(){
        response.success();
      })
    }
});


Parse.Cloud.beforeSave("Concept", function(request, response) {
  if (request.object.get("text")) {
    request.object.set("textLowerCase", request.object.get("text").toLowerCase());
  }

  // save related obj
  var Course = Parse.Object.extend("Course");
  var query = new Parse.Query(Course);
  query.equalTo('code', request.object.get('code'));
  query.find().then(function(result){
    request.object.set("courseObj", result[0]);
    response.success();
  });  
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
define(['jquery', 'model', 'service', 'autocomplete'], function(jQuery, model, service, autocomplete) {
  var init = function() {
  
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'title',
      displayKey: 'value',
      source: getMatchTitles,
      templates: {
        header: '<h3 class="search-result-title">Title</h3>'
      }
    },
    {
      name: 'code',
      displayKey: 'value',
      source: getMatchCourses,
      templates: {
        header: '<h3 class="search-result-code">Code</h3>'
      }
    },
    {
      name: 'concept',
      displayKey: 'value',
      source: getMatchConcepts,
      templates: {
        header: '<h3 class="search-result-concept">Concept</h3>'
      }
    }).on('typeahead:selected', function (obj, datum) {
      console.dir(datum);
      if(datum.obj===null) {
        model.addConcept(datum.value);
      } else {
        model.addCourse(datum.obj.get('code'));  
      }
    });

  };

  var getMatchCourses = function(query, cb) {

    var courses = service.getAllCourses();
    substrRegex = new RegExp(query, 'i');

    matches = [];
    $.each(courses, function(i, obj) {
      if (substrRegex.test(obj.get('code'))) {
        matches.push({ value: obj.get('code'), obj: obj });
      }
    });

    cb(matches);
  }

  var getMatchTitles = function(query, cb) {
    var courses = service.getAllCourses();
    substrRegex = new RegExp(query, 'i');

    matches = [];
    $.each(courses, function(i, obj) {
      if (substrRegex.test(obj.get('title'))) {
        matches.push({ value: obj.get('title'), obj: obj});
      }
    });

    cb(matches);      
  }

  var getMatchConcepts = function(query, cb) {
    var promise = model.getRankedConcepts(query).then(function(concepts){

      matches = [];
      for(var i = 0; i < concepts.length; i++) {
        matches.push({ value: concepts[i], obj: null});
      }
   
      cb(matches);
    });
  }
  
  return {
    init: init
  };


});

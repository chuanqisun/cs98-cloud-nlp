define(['jquery', 'model', 'service', 'autocomplete', 'event'], function(jQuery, model, service, autocomplete, event) {
  var init = function() {

    $( ".home-button" ).bind( "click", function() {
      event.emit(event.showCloudEvent);
    });
  
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
      event.emit(event.showSunburstEvent);

      if(datum.obj===null) {

        service.putActivity(datum.value, 'search', 'concept');
        model.addConcept(datum.value);
      } else {
        service.putActivity(datum.obj.get('code'), 'search', 'course');
        model.addCourse(datum.obj.get('code'));  
      }
    }).on('typeahead:opened', function (obj, datum) {
      $('.tt-dataset-title').addClass('col-md-4');
      $('.tt-dataset-code').addClass('col-md-4');
      $('.tt-dataset-concept').addClass('col-md-4');
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

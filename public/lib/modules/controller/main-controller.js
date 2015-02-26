define(['jquery', 'model', 'service', 'autocomplete'], function(jQuery, model, service, autocomplete) {
  var init = function() {
  
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      displayKey: 'value',
      source: getMatchTitles,
      templates: {
        header: '<h3 class="course-title">Title</h3>'
      }
    },
    {
      name: 'states',
      displayKey: 'value',
      source: getMatchCourses,
      templates: {
        header: '<h3 class="course-code">Code</h3>'
      }
    }).on('typeahead:selected', function (obj, datum) {
      console.dir(datum);
      model.addCourse(datum.obj.get('code'));  
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


  
  return {
    init: init
  };


});

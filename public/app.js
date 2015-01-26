require.config({
  paths: {
    "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
    "d3": "http://d3js.org/d3.v3.min",
    "parse": "http://www.parsecdn.com/js/parse-1.3.4.min",
    "model": "lib/modules/model/main-model",
    "view": "lib/modules/view/main-view",
    "controller": "lib/modules/controller/main-controller",
    "data-service": "lib/modules/model/data-service"
  }
});

require(['model', 'view', 'controller'], function(model, view, controller) {  
  model.init();
  view.render();
  controller.init();
});

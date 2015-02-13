define(['jquery'], function() {
  var modelUpdateEvent = "model-update-event";
  var dataOnloadEvent = "data-onload-event";

  var emit = function(event, data) {
    $('body').trigger(event, data);
  };

  var listen = function(event, handler) {
    $("body").on(event, handler); 
  }

  return {
    emit: emit,
    listen: listen,
    modelUpdateEvent: modelUpdateEvent,
    dataOnloadEvent: dataOnloadEvent
  };
});

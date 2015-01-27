define(['jquery'], function() {
  var modelUpdateEvent = "model-update-event";

  var emit = function(event) {
    $('body').trigger(event);
  };

  var listen = function(event, handler) {
    $("body").bind( event , handler); 
  }

  return {
    emit: emit,
    listen: listen,
    modelUpdateEvent: modelUpdateEvent
  };
});

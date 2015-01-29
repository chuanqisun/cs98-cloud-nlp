define(['jquery'], function() {
  var modelAddNodesEvent = "model-add-nodes-event";

  var emit = function(event, data) {
    $('body').trigger(event, data);
  };

  var listen = function(event, handler) {
    $("body").on(event, handler); 
  }

  return {
    emit: emit,
    listen: listen,
    modelAddNodesEvent: modelAddNodesEvent
  };
});

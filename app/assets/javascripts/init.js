var $Movement = $Movement || {}


$UTIL = {
  exec:function (controller, action) {
    var ns = $Movement,
        action = ( action === undefined ) ? "init" : action;

    if (controller !== "" && ns[controller] && typeof ns[controller][action] == "function") {
      ns[controller][action]();
    }
  },

  init:function () {
    var body = $('body'),
        controller = body.attr('data-controller'),
        action = body.attr('data-action')

    $.ajaxSetup({
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      }
    });

    $UTIL.exec(controller);
    $UTIL.exec(controller, action);
  }
};

$( $UTIL.init() );

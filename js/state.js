define(function() {
  var state = {};
  /* keys pressed */
  state.keys = {
    left:false,
    rigth:false
  };
  onkeydown = function(event){
    switch (event.keyCode) {
      case 37: // left
        state.keys.left = true; break;
      case 39: // right
        state.keys.right = true; break;
    }
  };
  onkeyup = function(event) {
    switch (event.keyCode) {
      case 37: // left
        state.keys.left = false; break;
      case 39: // right
        state.keys.right = false; break;
    }
  };

  state.conf = {
    width: window.innerWidth-50,
    height: window.innerHeight-50
  };

  onresize = function(event) {
    state.conf.width= window.innerWidth-50;
    state.conf.height= window.innerHeight-50;
  };
  return state;
});
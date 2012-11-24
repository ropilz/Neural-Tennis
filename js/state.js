define(function() {
  var state = {};
  /* keys pressed */
  state.keys = {
    player: {
      left: false,
      rigth:false,
      space:false
    },
    neural: {
      left: false,
      rigth:false,
      space:false
    }
  };
  onkeydown = function(event){
    event.preventDefault();
    switch (event.keyCode) {
      case 37: // left
        state.keys.player.left = true; break;
      case 39: // right
        state.keys.player.right = true; break;
      case 32: //space
        state.keys.player.space = true; break;
      case 65: // left
        state.keys.neural.left = true; break;
      case 68: // right
        state.keys.neural.right = true; break;
      case 83: //space
        state.keys.neural.space = true; break;
    }
    console.log(event.keyCode);
  };
  onkeyup = function(event) {
    event.preventDefault();
    switch (event.keyCode) {
      case 37: // left
        state.keys.player.left = false; break;
      case 39: // right
        state.keys.player.right = false; break;
      case 32: //space
        state.keys.player.space = false; break;
      case 65: // left
        state.keys.neural.left = false; break;
      case 68: // right
        state.keys.neural.right = false; break;
      case 83: //space
        state.keys.neural.space = false; break;
    }
  };

  state.conf = {
    width: 200,
    height: 400
  };

  state.obj = {};
  state.delta = 0;
  return state;
});
define(function() {
  var state = {};

  /* configuration */
  state.conf = {
    width: 200,
    height: 400
  };

  /* time */
  state.delta = 0;

  /* Gobal objects */
  state.obj = {Player:{}};
  return state;
});
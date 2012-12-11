define(['state', 'events', 'underscore'],function(State, event, _){
  var keys = [
    {
      37: 'left',  // left
      39: 'right', // right
      32: 'fire'   // space
    },
    {
      65: 'left',  // a
      68: 'right', // d
      83: 'fire'   // s
    }
  ];
  var player = function (options){
    var number = options['number'];

    this.left = false;
    this.rigth = false;
    this.fire = false;

    if ( typeof number === 'undefined') number = 0;
    if (number < 0 || number > 1) number = 0;
    this.keys = keys[number];

    _.bindAll(this, 'onKeyUp', 'onKeyDown');
    event.onKeyDown(this.onKeyDown);
    event.onKeyUp(this.onKeyUp);
  };

  player.prototype.onKeyDown = function(event) {
    event.preventDefault();
    this[this.keys[event.keyCode]] = true;
  };

  player.prototype.onKeyUp = function(event) {
    event.preventDefault();
    this[this.keys[event.keyCode]] = false;
  };

  player.prototype.unplug = function() {
    event.onKeyDown(this.onKeyDown, true);
    event.onKeyUp(this.onKeyUp, true);
  };

  player.prototype.doService = function(){};
  player.prototype.setPlayer = function(){};

  return player;
});
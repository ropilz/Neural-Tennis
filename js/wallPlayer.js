define(["state", 'underscore'],function(State, _) {
  var throwTime = 1000;

	var wall = function(options) {
    this.left = false;
    this.right = false;
    this.fire = false;

    this.name = 'wall';
    _.bindAll(this,'hit');

    for (var opt in options){
      var val = options[opt];
      switch (opt) {
        case 'ball':
          this.ball = val;
          this.ball.onHit(this.hit);
          break;
        case 'name':
          this.name = val;
          break;
      }
    }
	};

  wall.prototype.setPlayer = function(player) {
    this.player = player;
  };

  wall.prototype.doService = function() {
    var player = this;
    setTimeout(function(){
      player.fire = true;
    },throwTime);
  };

  wall.prototype.hit = function(ball, player) {
    if (player.control === this) {
      this.fire = false;
    } else {
      var deltaY  = State.obj.Player[0].getY() - State.obj.Player[1].getY(),
          speedY  = Math.abs(ball.speed.y),
          steps   = Math.ceil(deltaY / speedY),
          deltaX  = Math.abs(steps * ball.speed.x),
          start   = ball.speed.x > 0? ball.pos.x:State.conf.width - ball.pos.x,
          bounces = Math.floor((deltaX + start) / State.conf.width),
          finalX  = Math.floor((deltaX + start) % State.conf.width);
      if (ball.speed.x < 0) bounces += 1;
      if (bounces % 2 !== 0) finalX = State.conf.width - finalX;
      this.player.moveTo(finalX);
    }
  };

  wall.prototype.unplug = function(){
    this.ball.onHit(this.hit, true);
  };
  return wall;
});
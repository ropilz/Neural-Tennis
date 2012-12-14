define(["state", 'underscore'],function(State, _){

  var player = function (options){
    var playerNum = 0;
    this.color = "blue";
    this.name = "blue";
    this.score = 0;
    this.top = false;
    this.x = State.conf.width/2 - 25;
    this.y = State.conf.height-20;
    this.width = 50;
    this.height = 10;
    this.speedX = 8;
    this.control = {
      left: false,
      right: false,
      fire: false,
      doService: function(){},
      unplug: function(){}
    };

    this.callback = {onScore:[]};

    for (var opt in options){
      var val = options[opt];
      switch (opt) {
        case 'name':
          this.name = val;
          break;
        case 'score':
          this.score = val;
          break;
        case 'color':
          this.color = val;
          break;
        case 'top':
          if (val) {
            this.y = 10;
            playerNum = 1;
          }
          this.top = val;
          break;
        case 'width':
          this.width = val;
          break;
        case 'height':
          this.height = val;
          break;
        case 'control':
          this.setControl(val);
          break;
      }
    }
    State.obj.Player[playerNum] = this;
  };

  function inRange(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
  }

  player.prototype.draw = function() {
    State.ctx.fillStyle = this.color;
    State.ctx.fillRect(this.x,this.y,this.width,this.height);
  };

  player.prototype.moveTo = function(x) {
    var oldX = this.x;
    this.x = x - this.width/2;
    this.x = inRange(this.x,0,State.conf.width - this.width);
    return oldX !== this.x;
  };

  player.prototype.getX = function() {
    return this.x + this.width/2;
  };

  player.prototype.getY = function() {
    return this.y + (this.top?10:0);
  };

  player.prototype.step = function() {
    if (this.control.left) this.x -= this.speedX;
    if (this.control.right) this.x += this.speedX;
    this.x = inRange(this.x,0,State.conf.width - this.width);

    if (this.ball) {
      this.ball.pos.x = this.x + this.width/2;
      if (this.top) {
        this.ball.pos.y = this.y + 10 + this.ball.radius;
      } else {
        this.ball.pos.y = this.y - this.ball.radius;
      }
    }
    if (this.control.fire && this.ball) {
      this.ball.setAngle(this.top?1:-1);
      this.ball.pos.y -= 2;
      this.hit(this.ball);
      this.ball = null;
    }
  };

  player.prototype.setControl = function(control) {
    if (this.control) {
      this.control.unplug();
    }
    this.control = control;
    control.setPlayer(this);
  };

  player.prototype.hit = function(ball) {
    ball.hit(this);
  };

  player.prototype.doService = function(ball) {
    this.ball = ball;
    this.ball.speed = {x:0,y:0};
    this.control.doService();
  };

  player.prototype.scoreUp = function(score) {
    if (typeof score === 'undefined') {
      score = 1;
    }
    this.score += score;
    _.each(this.callback.onScore, function(fn) {
      fn(this.score);
    }, this);
  };

  player.prototype.onScore = function(fn, remove) {
    if (remove) {
      var index = this.callback.onScore.indexOf(fn);
      if (index >= 0) {
        this.callback.onScore.splice(index,1);
      }
    } else {
      this.callback.onScore.push(fn);
    }
  };

  return player;
});

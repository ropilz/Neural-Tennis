define(["state", 'underscore'],function(State, _) {
  function inRange(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
  }

  var ball = function() {
    this.pos = {x:State.conf.width/2, y:State.conf.height/2};
    this.speed = {x:8, y:0};
    this.backUp();
    State.obj.ball = this;
    this.callback = {onHit: [], onCheck: []};
  };

  ball.prototype.backUp = function() {
    this.prev = {
      pos: {
        x:this.pos.x,
        y:this.pos.y
      },
      speed: {
        x:this.speed.x,
        y:this.speed.y
      }
    };
  };

  ball.prototype.speedV = 8;
  ball.prototype.radius = 5;

  ball.prototype.onCheck = function(fn) {
    this.callback.onCheck.push(fn);
  };

  ball.prototype.check = function(player) {
    _.each(this.callback.onCheck, function(fn) {
      fn(State.obj.ball, player);
    });
  };

  ball.prototype.onHit = function(fn, remove) {
    if (remove) {
      var index = this.callback.onHit.indexOf(fn);
      if (index >= 0) {
        this.callback.onHit.splice(index,1);
      }
    } else {
      this.callback.onHit.push(fn);
    }
  };

  ball.prototype.hit = function(player) {
    _.each(this.callback.onHit, function(fn) {
      fn(State.obj.ball, player);
    });
  };

  ball.prototype.setAngle = function(angle){
    if (typeof angle == 'undefined' || angle === 1) {
      angle = Math.PI/4*7;
    } else if (angle == -1) {
      angle = Math.PI*3/4;
    }
    this.speed =
      {
        x:Math.sin(angle)*this.speedV,
        y:Math.cos(angle)*this.speedV
      };
  };

  ball.prototype.step = function() {
    this.backUp();
    this.pos.x += this.speed.x*State.delta/1000*60;
    this.pos.y += this.speed.y*State.delta/1000*60;
    this.collide();
  };

  ball.prototype.collide = function() {
    /* wall collisions */
    if (this.pos.x < this.radius) { // left
      this.pos.x = this.radius*2 - this.pos.x;
      this.speed.x *= -1;
    }
    if (this.pos.y < this.radius) { // top
      State.obj.Player[1].doService(this);
      State.obj.Player[0].scoreUp();
    }
    if (this.pos.x > State.conf.width-this.radius) { // right
      this.pos.x = 2*State.conf.width-2*this.radius-this.pos.x;
      this.speed.x *= -1;
    }
    if (this.pos.y > State.conf.height-this.radius) { // bottom
      State.obj.Player[0].doService(this);
      State.obj.Player[1].scoreUp();
    }

    /* player collisions */
    var player = State.obj.Player[0],
        prevY = this.prev.pos.y,
        curY = this.pos.y;
    if (this.speed.y < 0) player = State.obj.Player[1];
    if (player.top && (prevY - 4 > player.getY() && player.getY() >= curY - 4)||
        !player.top && (prevY + 4 < player.getY() && player.getY() <= curY + 4))
      {
        this.check(player);
        if (player.x < this.pos.x+4  && this.pos.x-4 < player.x + player.width) {
          if (player.top) {
            this.pos.y = player.y + player.height + this.radius + 1;
          } else {
            this.pos.y = player.y - this.radius - 1;
          }
          var deltaX = this.pos.x - player.x - player.width/2;
          this.speed.x += deltaX/player.width*this.speedV/4;
          this.speed.x = inRange(this.speed.x,this.speedV*-0.8, this.speedV*0.8);
          this.speed.y = Math.sqrt( this.speedV*this.speedV-
                                    this.speed.x*this.speed.x);
          if(!player.top) this.speed.y*=-1;
          player.hit(this);
        }
    }
  };

  ball.prototype.draw = function() {
    State.ctx.fillStyle="#D6D6A0";
    State.ctx.beginPath();
    State.ctx.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2,true);
    State.ctx.fill();
  };

  return ball;
});
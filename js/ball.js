define(["state"],function(State) {
  var ball = function(ball) {
    this.pos = {x:0, y:0};
    this.setAngle(-1);
    State.obj[ball] = this;
    this.note = {};
    this.notified = false;
  };

  ball.prototype.speedV = 8;
  ball.prototype.radius = 4;
  ball.prototype.setAngle = function(angle){
    if (typeof angle == 'undefined') {
      angle = Math.PI/4*7;
    } else if (angle == -1) {
      angle = Math.PI*3/4;
    }
    this.speed =
      {x:Math.sin(angle)*this.speedV,
       y:Math.cos(angle)*this.speedV};
    this.angle = angle;
  };

  ball.prototype.step = function() {
    this.pos.x += this.speed.x*State.delta/1000*60;
    this.pos.y += this.speed.y*State.delta/1000*60;
    this.resolve();
  };

  ball.prototype.resolve = function() {
    /* wall collisions */
    if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.speed.x *= -1;
    }
    if (this.pos.y < this.radius) { // top
      State.obj.neural.doService(State.obj.ball);
      State.obj.player.score += 1;
    }
    if (this.pos.x > State.conf.width-this.radius) {
      this.pos.x = State.conf.width-this.radius;
      this.speed.x *= -1;
    }
    if (this.pos.y > State.conf.height-this.radius) { // bottom
      State.obj.player.doService(State.obj.ball);
      State.obj.neural.score += 1;
    }
    /* player collisions */
    var players = [
      {
        player:State.obj.player,
        top: false
      },
      {
        player:State.obj.neural,
        top:true
      }];
    for (var p=0, l=players.length;p<l;p+=1){
      var player = players[p].player;
      var top = players[p].top;
      if ( player.x-4 < this.pos.x && this.pos.x < player.x+player.width+4 &&
           player.y-4 < this.pos.y && this.pos.y < player.y+player.height+4 ) {
        this.speed.y *= -1;
        if (top) {
          this.pos.y = player.y+player.height+5;
        } else {
          this.pos.y = player.y-5;
        }
        var angleDelta = this.pos.x - player.x - player.width/2;
        this.speed.x += angleDelta/player.width*this.speedV/4;
        if (Math.abs(this.speed.x) > this.speedV*0.8) {
          this.speed.x = this.speed.x>0?this.speedV*0.8:this.speedV*-0.8;
        }
        this.speed.y = Math.sqrt(this.speedV*this.speedV-(this.speed.x*this.speed.x));
        if(!top) this.speed.y*=-1;
        player.hit(this);
      }
    }

    if (!this.notified && this.pos.y < State.obj.neural.y+16) {
      State.obj.neural.takeNote(this.pos.x);
      this.notified = true;
    }
    if (this.notified && this.pos.y > State.obj.neural.y+16) {
      this.notified = false;
    }


  };

  ball.prototype.draw = function() {
    State.ctx.fillStyle="black";
    State.ctx.beginPath();
    State.ctx.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2,true);
    State.ctx.fill();
    State.ctx.stroke();
  };

  return ball;
});
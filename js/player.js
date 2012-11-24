define(["state"],function(State){
  var player = function (player){
    this.x = 0;
    this.y = State.conf.height-20;
    this.score = 0;
    State.obj[player] = this;
  };
  
  player.prototype.width = 50;
  player.prototype.height = 10;

  player.prototype.draw = function() {
    State.ctx.fillStyle="blue";
    State.ctx.fillRect(this.x,this.y,this.width,this.height);
  };
  player.prototype.step = function() {
    if (State.keys.player.left) {
      this.x -= 8.5;
      if (this.x < 0) {
        this.x = 0;
      }
    }
    if (State.keys.player.right) {
      this.x += 8.5;
      if (this.x > State.conf.width-this.width) {
        this.x = State.conf.width-this.width;
      }
    }
    if (this.ball) {
      this.ball.pos.y = this.y - this.ball.radius;
      this.ball.pos.x = this.x + this.width/2;
    }
    if (State.keys.player.space && this.ball) {
      this.ball.setAngle(-1);
      this.ball.pos.y -= 2;
      this.hit(this.ball);
      this.ball = null;
    }

  };

  player.prototype.hit = function(ball) {
    State.obj.neural.catchBall(ball);
  };

  player.prototype.doService = function(ball) {
    this.ball = ball;
    this.ball.speed = {x:0,y:0};
  };
  return player;
});
define(["state"],function(State) {
	var neural = function(neural) {
		this.x = 0;
		this.y = 10;
    this.throwTime = 1000;
    this.score = 0;
    this.notes = [];
		State.obj[neural] = this;
	};
  
  neural.prototype.width = 50;
  neural.prototype.height = 10;

  neural.prototype.draw = function() {
    State.ctx.fillStyle="rgba(255,0,0,1)";
    State.ctx.fillRect(this.x,this.y,this.width,this.height);
  };
  neural.prototype.step = function() {
    if (this.ball) {
      this.throwTime -= State.delta;
      this.ball.pos.y = this.y + this.ball.radius + this.height;
      this.ball.pos.x = this.x + this.width/2;
      if(this.throwTime < 0) {
        this.ball.setAngle(-1);
        this.ball.pos.y -= 2;
        this.ball = null;
        this.throwTime = 1000;
      }
    }
  };

  neural.prototype.catchBall = function(ball) {
    this.ball = ball;
    this.x = Math.round(Math.random()*3)*50;
  };

  neural.prototype.takeNote = function(place) {
    if (this.ball) {
      var note = {
        input: {
          pos: this.ball.pos.x,
          spx: this.ball.speed.x,
          spy: this.ball.speed.y
        },
        output: {
          place: Math.round(place/50)
        }
      };
      this.notes.push(note);
      console.log(note);
    }

  };

  neural.prototype.doService = function(ball) {
    this.ball = ball;
    this.ball.speed = {x:0,y:0};
  };
  return neural;
});
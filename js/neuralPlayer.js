define(["state"],function(State) {
	var neural = function(neural) {
		this.x = 0;
		this.y = 10;
    this.throwTime = 1000;
    this.score = 0;
    this.notes = [];
		State.obj[neural] = this;

    this.net = undefined;
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
        this.ball.setAngle();
        this.ball.pos.y -= 2;
        this.ball = null;
        this.throwTime = 1000;
      }
    }
  };

  neural.prototype.catchBall = function(ball) {
    if (typeof this.net === 'undefined') {
      this.x = Math.round(Math.random()*3)*50;
    } else {
      var aux = this.net.run([ball.pos.x/150,ball.speed.x/8,ball.speed.y/8])[0]*4;
      if (aux > 3) aux = 3;
      console.log("go to: "+aux);
      this.x = aux*50;
    }
    
    this.notes.push({input:[
      ball.pos.x,
      ball.speed.x,
      ball.speed.y
    ]});
  };

  neural.prototype.takeNote = function(place) {
    var cur = this.notes[this.notes.length-1];
    if (typeof cur.output === 'undefined') {
      cur.output = [place/200];
    }
  };

  neural.prototype.hit = function(){};

  neural.prototype.doService = function(ball) {
    this.ball = ball;
    this.ball.speed = {x:0,y:0};
    this.net = new brain.NeuralNetwork({
      hiddenLayers: [4]
    });
    console.log(this.net.train(this.notes));
    State.time = new Date().getTime();
    State.delta = 0;
  };
  return neural;
});
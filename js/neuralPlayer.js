define(["state", 'underscore'],function(State, _) {
  var notes = [];
  var ball;
  var throwTime = 1000;
  var current;
  function normalize(ball, output) {
    var pos = ball.pos.x / State.conf.width;
    var speed = ball.speed.x / ball.speedV;
    var dir = 0;
    if (speed < 0) {
      dir = 1;
      speed *= -1;
    }
    if (output) {
      return [pos];
    } else {
      return [pos,speed,dir];
    }
  }

  function anotate(ball, player) {
    if (typeof current !== 'undefined') {
      var note = {
                    input: normalize(current),
                    output: normalize(ball,true)
                  };
      current = undefined;
      notes.push(note);
    }
  }

	var neural = function(options) {
    this.left = false;
    this.right = false;
    this.fire = false;

    this.name = 'neural';
    this.net = undefined;
    _.bindAll(this,'hit');
    for (var opt in options){
      var val = options[opt];
      switch (opt) {
        case 'ball':
          if (typeof ball === 'undefined') {
            ball = val;
            ball.onCheck(anotate);
          }
          ball.onHit(this.hit);
          break;
        case 'name':
          this.name = val;
          break;
      }
    }
	};

  neural.prototype.setPlayer = function(player) {
    this.player = player;
  };

  neural.prototype.doService = function() {
    var player = this;
    setTimeout(function(){
      player.fire = true;
    },throwTime);
    if (notes.length > 1) {
      this.net = new brain.NeuralNetwork({
        hiddenLayers: [5],
        learningRate: 0.1
      });
      this.net.train(notes,{
        iterations: 10000
      });
    }
  };

  neural.prototype.hit = function(ball, player) {
    if (player.control === this) {
      this.fire = false;
      current = {
        pos: {
          x: ball.pos.x,
          y: ball.pos.y
        },
        speed: {
          x: ball.speed.x,
          y: ball.speed.y
        },
        speedV: ball.speedV
      };
    } else {
      if (typeof this.net !== 'undefined') {
        var pos = this.net.run(normalize(ball))[0]*200;
        this.player.moveTo(pos);
      }
    }
  };

  neural.prototype.unplug = function(){
    ball.onHit(this.hit, true);
  };
  return neural;
});
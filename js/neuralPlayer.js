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

    this.hiddenLayers = [5];
    this.learningRate = 0.1;
    this.iterations = 1000;

    this.net = undefined;
    this.callback = {onTrain: []};
    _.bindAll(this,'hit', 'doService');
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
    this.train();
  };

  neural.prototype.train = function() {
    if (notes.length > 1) {
      this.net = new brain.NeuralNetwork({
        hiddenLayers: [this.hiddenLayers],
        learningRate: this.learningRate
      });
      var status = this.net.train(notes,{
        iterations: this.iterations
      });

      _.each(this.callback.onTrain, function(fn) {
        fn(this.net, status);
      }, this);
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

  neural.prototype.onTrain = function(fn, remove) {
    if (remove) {
      var index = this.callback.onTrain.indexOf(fn);
      if (index >= 0) {
        this.callback.onTrain.splice(index,1);
      }
    } else {
      this.callback.onTrain.push(fn);
    }
  };
  return neural;
});
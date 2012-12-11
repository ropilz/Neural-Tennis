window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

requirejs.config({
    baseUrl: 'js',
    paths: {},
    shim: {
      'underscore': {
        deps: [],
        exports: '_',
        init: function() {
          return this._.noConflict();
        }
      }
    }
});
require(["state", "player", "ball", 'underscore', 'card'],
function(State, Player, Ball, _, Card){
  var body = document.body;

  /* canvas setup */
  var canvas = document.createElement("canvas");
  canvas.width = State.conf.width;
  canvas.height = State.conf.height;
  canvas.style.float = 'left';
  body.appendChild(canvas);
  State.ctx = canvas.getContext("2d");

  /* Create objects */
  var ball  = new Ball();
  var player = new Player(
    {
      'name':'Player1',
      'color':'#F0F0FF',
      'top': false
    });
  var player2 = new Player(
    {
      'name':'Player2',
      'color':'#FFF0F0',
      'top': true
    });
  var card = Card(player, player2);
  body.appendChild(card);

  State.time = new Date().getTime();

  var first = true;
  var paused = false;
  requestAnimFrame(function loop(time) {
    State.delta = time - State.time;
    State.time = time;
    if (Card.paused) {
      paused = true;
    } else if (paused) {
      paused = false;
      State.delta = 0;
    } else if (first) {
      State.obj.Player[1].doService(ball);
      first = false;
    }

    if (!paused) {
      _.each(State.obj.Player, function(player){
        player.step();
      });
      ball.step();
    }
    State.ctx.fillStyle="#451867";
    State.ctx.fillRect(0,0,State.conf.width,State.conf.height);

    _.each(State.obj.Player, function(player){
      player.draw();
    });
    
    ball.draw();
    requestAnimFrame(loop);
  });

});
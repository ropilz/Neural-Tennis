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

  /* score setup */
  var score = document.createElement("div");
  score.style.float = 'left';
  score.style.width = '50px';
  score.style['padding-top'] = State.conf.height/2+'px';
  body.appendChild(score);
  score.innerText = "0 \n 0";

  /* Create objects */
  var ball  = new Ball();
  var player = new Player(
    {
      'name':'Player1',
      'color':'blue',
      'top': false
    });
  var player2 = new Player(
    {
      'name':'Player2',
      'color':'red',
      'top': true
    });
  var card = Card(player, player2);
  body.appendChild(card);

  State.time = new Date().getTime();
  State.obj.Player[0].doService(ball);

  requestAnimFrame(function loop(time) {
    State.delta = time - State.time;
    State.time = time;

    _.each(State.obj.Player, function(player){
      player.step();
    });
    
    ball.step();

    State.ctx.fillStyle="rgba(200,255,200,0.8)";
    State.ctx.fillRect(0,0,State.conf.width,State.conf.height);

    _.each(State.obj.Player, function(player){
      player.draw();
    });
    
    ball.draw();
    score.innerText = State.obj.Player[0].score+" \n "+State.obj.Player[1].score;
    requestAnimFrame(loop);
  });

});
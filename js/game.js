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
    paths: {}
});
require(["state", "player","ball", "neuralPlayer"],function(State, Player, Ball, Neural){
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
  var player = new Player("player");
  var ball  = new Ball("ball");
  var neural = new Neural("neural");
  State.time = new Date().getTime();
  player.doService(ball);

  requestAnimFrame(function loop(time) {
    State.delta = time - State.time;
    State.time = time;
    player.step();
    neural.step();
    ball.step();

    State.ctx.fillStyle="rgba(200,255,200,0.8)";
    State.ctx.fillRect(0,0,State.conf.width,State.conf.height);

    player.draw();
    neural.draw();
    ball.draw();
    score.innerText = neural.score+" \n "+player.score;
    requestAnimFrame(loop);
  });

});
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
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {}
});
require(["state", "player"],function(State, Player){
  var body = document.body;

  /* canvas setup */
  var canvas = document.createElement("canvas");
  canvas.width = State.conf.width;
  canvas.height = State.conf.height;
  body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  /* player setup */
  var player = new Player();
  player.setContext(ctx);

  requestAnimFrame(function loop() {
    canvas.width = State.conf.width;
    canvas.height = State.conf.height;
    ctx.fillStyle="rgba(200,255,200,1)";
    ctx.fillRect(0,0,State.conf.width,State.conf.height);

    player.draw();
    requestAnimFrame(loop);
  });

});
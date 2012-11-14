define(["state"],function(State){
  var player = function (){
    this.x = 0;
  };

  player.prototype.setContext = function(ctx) {
    this.ctx = ctx;
  };

  player.prototype.draw = function() {
    this.update();
    this.ctx.fillStyle="rgba(255,0,0,0.8)";
    this.ctx.fillRect(this.x,State.conf.height-50,150,20);
  };
  player.prototype.update = function() {
    if (State.keys.left) {
      this.x -= 8.5;
      if (this.x < 0) {
        this.x = 0;
      }
    }
    if (State.keys.right) {
      this.x += 8.5;
      if (this.x > State.conf.width-150) {
        this.x = State.conf.width-150;
      }
    }
  };
  return player;
});
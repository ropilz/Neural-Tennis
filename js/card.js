define(['state',"neuralPlayer", 'human', 'wallPlayer', 'underscore'],
function(State, Neural, Human, Wall, _){
  var Control = {
    "Neural": Neural,
    "Human": Human,
    "Wall": Wall
  };

  var onEdit = 0;
  var cardPanel = function() {
    var panel = document.createElement('div');
    panel.classList.add('info');

    _.each([arguments[1],arguments[0]], function(player, num){
      var card = document.createElement('div');
      card.classList.add('card');
      card.style.left = "-220px";
      panel.appendChild(card);

      var type = document.createElement('select');
      _.each(['Human', 'Neural', 'Wall'], function(name){
        var opt = document.createElement("option");
        opt.innerText = name;
        type.options.add(opt);
      });
      type.onchange = function(event) {
        var val = type.selectedOptions[0].value;
        player.setControl(new Control[val]({
          ball: State.obj.ball,
          number: num
        }));
        console.log(num);
      };
      card.appendChild(type);

      onEdit += 1;
      var done = document.createElement('button');
      done.classList.add('edit');
      done.innerText = "Done!";
      var editing = true;
      var timer;
      done.onclick = function (event) {
        if (editing) {
          timer = setInterval(function(){
            var val = parseInt(card.style.left,10);
            val += 40;
            if (val >= 0){
              card.style.left = "0px";
              done.innerText = "Edit";
              editing = !editing;
              clearInterval(timer);
              onEdit -= 1;
              if (onEdit === 0) {
                cardPanel.paused = false;
              }
            } else {
              card.style.left = val+"px";
            }
          },10);
        } else {
          timer = setInterval(function(){
            var val = parseInt(card.style.left,10);
            val -= 40;
            if (val <= -220){
              card.style.left = "-220px";
              done.innerText = "Done!";
              editing = !editing;
              clearInterval(timer);
              onEdit+=1;
              cardPanel.paused = true;
            } else {
              card.style.left = val+"px";
            }
          },10);
        }
      };
      card.appendChild(done);

      var score = document.createElement('div');
      score.classList.add('score');
      var points = document.createElement('span');
      points.innerText = "0";
      score.appendChild(points);
      var pts = document.createElement('span');
      pts.classList.add('pts');
      pts.innerText = 'pts';
      score.appendChild(pts);
      player.onScore(function(score){
        points.innerText = score;
      });

      card.appendChild(score);
    });
    return panel;
  };

  cardPanel.paused = true;

  return cardPanel;
});
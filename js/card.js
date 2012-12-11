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

      var neural = false;
      var type = document.createElement('select');
      _.each(['Human', 'Neural', 'Wall'], function(name){
        var opt = document.createElement("option");
        opt.innerText = name;
        type.options.add(opt);
      });
      player.setControl(new Human({
        number: num === 0? 1:0
      }));
      type.onchange = function(event) {
        var val = type.selectedOptions[0].value;
        if (neural) {
          player.control.onTrain(neuralInfo.updateRows, false);
        }
        if (val === 'Neural') {
          neural = true;
        } else {
          neural = false;
        }
        var control = new Control[val]({
          ball: State.obj.ball,
          number: num === 0? 1:0
        });
        player.setControl(control);
        if (neural) {
          control.onTrain(neuralInfo.updateRows);
        }
        neuralInfo.createRows();
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
              card.classList.add('disabled');
              type.disabled = true;
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
              card.classList.remove('disabled');
              type.disabled = false;
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

      var neuralInfo = document.createElement('div');
      neuralInfo.classList.add('neuralInfo');
      neuralInfo.rows = [];
      neuralInfo.createRows = function() {
        neuralInfo.innerHTML = "";
        if (neural) {
          var hl = player.control.hiddenLayers.length;
          var nodes = player.control.hiddenLayers;
          var lr = player.control.learningRate;
          var it = player.control.iterations;
          var c, end;
          neuralInfo.rows = [];
          for (c = 0; c<hl; c+=1) {
            neuralInfo.rows.push(document.createElement('div'));
          }
          _.each(neuralInfo.rows, function(row, pos) {
            row.classList.add('layer');
            var addBtn = document.createElement('div');
            addBtn.classList.add('addBtn');
            addBtn.innerText = '+';
            addBtn.onclick = function() {
              if (neural && row.nodes.length < 10) {
                player.control.hiddenLayers[pos] += 1;
                neuralInfo.createRows();
              }
            };
            row.appendChild(addBtn);
            row.nodes = [];
            for (c = 0, end = nodes[pos]; c < end; c+=1) {
              row.nodes.push(document.createElement('div'));
              row.nodes[c].classList.add('node');
              row.nodes[c].onclick = function() {
                if (neural) {
                  player.control.hiddenLayers[pos] -= 1;
                  neuralInfo.createRows();
                }
              };
              row.appendChild(row.nodes[c]);
            }
            neuralInfo.appendChild(row);
          });
          var addLayer = document.createElement('button');
          addLayer.classList.add('addLayer');
          addLayer.innerText = '+ Add layer';
          addLayer.onclick = function() {
            if (neural && player.control.hiddenLayers.length < 4) {
              player.control.hiddenLayers.push(player.control.hiddenLayers[0]);
              neuralInfo.createRows();
            }
          };
          neuralInfo.appendChild(addLayer);

          neuralInfo.status = document.createElement('div');
          neuralInfo.status.classList.add('status');
          neuralInfo.status.label = document.createElement('span');
          neuralInfo.status.label.innerText = 'error: ';
          neuralInfo.status.appendChild(neuralInfo.status.label);
          neuralInfo.status.error = document.createElement('span');
          neuralInfo.status.error.innerText = '0.000';
          neuralInfo.status.appendChild(neuralInfo.status.error);
          neuralInfo.appendChild(neuralInfo.status);
          player.control.train();
        }
      };

      neuralInfo.updateRows = function(net, output) {
        var weights = net.weights;
        var hiddenLayers = net.weights.length -1;
        var cap = 2;
        for (var layer = 1; layer < hiddenLayers; layer += 1) {
          var end = weights[layer].length;
          for (var node = 0; node < end; node += 1 ) {
            var red = Math.round((weights[layer][node][0] + cap) / 2 / cap * 255);
            var green = Math.round((weights[layer][node][1] + cap) / 2 / cap * 255);
            var blue = Math.round((weights[layer][node][2] + cap) / 2 / cap * 255);

            neuralInfo.rows[layer-1].nodes[node].style.backgroundColor =
              'rgba('+red+','+green+','+blue+',1)';
          }
        }
        neuralInfo.status.error.innerText = Math.round(output.error*1000)/1000;
      };

      card.appendChild(neuralInfo);
    });
    return panel;
  };

  cardPanel.paused = true;

  return cardPanel;
});
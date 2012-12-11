define(['state',"neuralPlayer", 'human', 'wallPlayer', 'underscore'],
function(State, Neural, Human, Wall, _){
  return function() {
    var panel = document.createElement('div');
    panel.classList.add('info');

    _.each(arguments, function(player){
    var card = document.createElement('div');
    card.classList.add('card');
    panel.appendChild(card);

    var type = document.createElement('select');
    _.each(['Human', 'Neural', 'Wall'], function(name){
      var opt = document.createElement("option");
      opt.innerText = name;
      type.options.add(opt);
    });
    type.onchange = function(event) {
      var val = type.selectedOptions[0].value;
    };
    card.appendChild(type);

    var score = document.createElement('p');
    score.classList.add('score');
    score.innerText = "0";
    card.appendChild(score);
    });
    return panel;
  };
});
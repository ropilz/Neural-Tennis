define(['underscore'],function(_) {
	var evt = {};
	evt.callback = {
		onKeyDown: [],
		onKeyUp: []
	};

	evt.onKeyDown = function(fn) {
		evt.callback.onKeyDown.push(fn);
	};

	evt.onKeyUp = function(fn) {
		evt.callback.onKeyUp.push(fn);
	};

	onkeydown = function(event){
		_.each(evt.callback.onKeyDown, function(fn) {
			fn(event);
		});
	};

	onkeyup = function(event){
		_.each(evt.callback.onKeyUp, function(fn) {
			fn(event);
		});
	};

	return evt;
});
define(['underscore'],function(_) {
	var evt = {};
	evt.callback = {
		onKeyDown: [],
		onKeyUp: []
	};

	evt.onKeyDown = function(fn, remove) {
		if (remove) {
			var index = evt.callback.onKeyDown.indexOf(fn);
			if (index >= 0){
				evt.callback.onKeyDown.splice(index,1);
			}
		} else {
			evt.callback.onKeyDown.push(fn);
		}
	};

	evt.onKeyUp = function(fn, remove) {
		if (remove) {
			var index = evt.callback.onKeyUp.indexOf(fn);
			if (index >= 0) {
				evt.callback.onKeyUp.splice(index,1);
			}
		} else {
			evt.callback.onKeyUp.push(fn);
		}
	};

	onkeydown = function(event){
		_.each(evt.callback.onKeyDown, function(fn) {
			fn(event);
		});
		return true;
	};

	onkeyup = function(event){
		_.each(evt.callback.onKeyUp, function(fn) {
			fn(event);
		});
		return true;
	};

	return evt;
});
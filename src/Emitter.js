function Emitter() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.color = '#ff0000';
	this.isOn = true;
	this.isPredefined = true;
	this.output = new Interface();
};
Emitter.prototype.toString = function () {return "Emitter"};

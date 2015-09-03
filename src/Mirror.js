function Mirror() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.isOn = false;
	this.isPlaced = false;
	this.inputs = [new Input(), new Input()];
};
Mirror.prototype.toString = function () {return "Mirror"};
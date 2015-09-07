function Mirror() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.isOn = false;
	this.isPlaced = false;
	this.interfaces = [new Interface(0), new Interface(1), new Interface(2), new Interface(3)];
};
Mirror.prototype.toString = function () {return "Mirror"};

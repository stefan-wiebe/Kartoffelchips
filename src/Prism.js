function Prism() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.outputColor = 0;
	this.inputs = [new Interface(1), new Interface(3)];
	this.output = new Interface(0);
	this.isPlaced = false;
};
Prism.prototype.toString = function () {return "Prism"};

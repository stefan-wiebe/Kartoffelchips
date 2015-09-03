function Prism() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.outputColor = 0;
	this.inputs = [new Input(), new Input()];
	this.isPlaced = false;
};
Prism.prototype.toString = function () {return "Prism"};
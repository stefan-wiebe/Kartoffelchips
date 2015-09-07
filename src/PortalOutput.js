function PortalOutput() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.color = 0;
	this.isOn = false;
	this.isPlaced = false;
	this.output = new Interface();
}

PortalOutput.prototype.toString = function () {return "PortalOutput"};

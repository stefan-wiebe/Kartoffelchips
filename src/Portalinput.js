function PortalInput() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.color = 0;
	this.isOn = true;
	this.isPlaced = false;
	this.input = new Input();
}

PortalInput.prototype.toString = function () {return "PortalInput"};

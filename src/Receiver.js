function Receiver() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.color = 0;
	this.isOn = false;
	this.isPredefined = true;
	this.input = new Interface(0);
}
Receiver.prototype.toString = function () {return "Receiver"};

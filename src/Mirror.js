function Mirror() {
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.isOn = false;
	this.isPlaced = false;
	this.interfaces = [new Interface(0, 0.5, 0.5, 0.5, 0), new Interface(0, 0.5, 0.5, 1, 0.5), new Interface(0, 0.5, 0.5, 0.5, 1), new Interface(0, 0.5, 0.5, 0, 0.5)];

	this.getLinkedInterface = function(interface) {
		var linkedInterface = false;

		if (typeof interface == "number" || typeof interface == "object") {
			var interfaceNumber;

			if (typeof interface == "object") {
				interfaceNumber = this.interfaces.indexOf(interface);
			} else {
				interfaceNumber = interface;
			}

			if (0 <= interfaceNumber && interfaceNumber < this.interfaces.length) {
				if (this.rotation % 2 == 0) {
					linkedInterface = interfaceNumber % 2 == 0 ? wrap(interfaceNumber + 1, 4) : wrap(interfaceNumber - 1, 4);
				} else {
					linkedInterface = interfaceNumber % 2 == 0 ? wrap(interfaceNumber - 1, 4) : wrap(interfaceNumber + 1, 4);
				}
			}
		}

		return linkedInterface;
	}
}

Mirror.prototype.toString = function () {return "Mirror"};

function Interface(offset) {
	this.color = 0;
	this.isOn = false;

	if (typeof offset == "number") {
		this.offset = offset;
	} else {
		this.offset = 0;
	}
}

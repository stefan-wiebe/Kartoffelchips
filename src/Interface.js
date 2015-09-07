function Interface(offset, startX, startY, endX, endY) {
	this.color = 0;
	this.isOn = false;

	if (typeof startX == "number" && typeof startY == "number" && typeof endX == "number" && typeof endY == "number") {
		this.start = {x: startX, y: startY};
		this.end = {x: endX, y: endY};
	} else {
		this.start = {x: 0, y: 0};
		this.end = {x: 0, y: 0};
	}

	this.offset = typeof offset == "number" ? offset : 0;
}

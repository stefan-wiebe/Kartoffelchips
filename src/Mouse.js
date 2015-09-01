var Mouse = function () {
	c.addEventListener('click', Mouse.click);
	c.addEventListener('mousemove', Mouse.move);
};
Mouse.click = function() {

	if (mouseX == 15 && mouseY > 0 && mouseY <= toolsByType.length) {
        // in inventory
        console.log('block clicked');
        selectedTool = tools.indexOf(toolsByType[mouseY-1][0]);

    }

};

Mouse.move = function(e) {
	var relativeXPosition = (e.pageX - c.offsetLeft);
    var relativeYPosition = (e.pageY - c.offsetTop);

    var x = Math.floor(relativeXPosition/spriteSize);
    var y = Math.floor(relativeYPosition/spriteSize);

    console.log('X: ' + x + ' Y: ' + y);
    mouseX = x;
    mouseY = y;
    if (selectedTool > -1) {
        tools[selectedTool].x = mouseX;
        tools[selectedTool].y = mouseY;
    }
};


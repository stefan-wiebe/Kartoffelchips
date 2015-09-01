var Mouse = function () {
	c.addEventListener('click', Mouse.click);
	c.addEventListener('mousemove', Mouse.move);
};
Mouse.click = function() {

    if (selectedTool == -1) {
	if (mouseX == 15 && mouseY > 0 && mouseY <= toolsByType.length) {
        // in inventory
        var i=0;
        for (var TL in toolsByType) {
            if (i == (mouseY+1)) {
                var string = TL;
            }
            i++;
        }
        console.log('block clicked, selected tool is  ' + string);
        selectedTool = tools.indexOf(toolsByType[string][0]);

    }
} else {
    tools[selectedTool].isPlaced = !tools[selectedTool].isPlaced;
        selectedTool = -1;

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


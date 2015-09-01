var Mouse = function() {
    c.addEventListener('mousedown', Mouse.click);
    c.addEventListener('mousemove', Mouse.move);
    document.addEventListener('mousedown', function() {return false;});
};
Mouse.click = function(e) {
    e.preventDefault();
    switch (e.which) {
        case 1:
            if (selectedTool == -1) {
                // in inventory
                if (mouseX == 15 && mouseY > 0 && mouseY <= toolsByType.length) {
                    var i = 0;
                    for (var TL in toolsByType) {
                        if (i == (mouseY + 1)) {
                            var string = TL;
                        }
                        i++;
                    }
                    console.log('block clicked, selected tool is  ' + string);
                    selectedTool = tools.indexOf(toolsByType[string][0]);
                }
                // is there a block at mouse position that we can pick up? If so, rotate
                else {}
            } else {
                tools[selectedTool].isPlaced = !tools[selectedTool].isPlaced;
                selectedTool = -1;
            }
            break;
        case 3:
            console.log('right click');
            break;
    }
                return false;

};
Mouse.move = function(e) {
    var relativeXPosition = (e.pageX - c.offsetLeft);
    var relativeYPosition = (e.pageY - c.offsetTop);
    var x = Math.floor(relativeXPosition / spriteSize);
    var y = Math.floor(relativeYPosition / spriteSize);
    console.log('X: ' + x + ' Y: ' + y);
    mouseX = x;
    mouseY = y;
    if (selectedTool > -1) {
        tools[selectedTool].x = mouseX;
        tools[selectedTool].y = mouseY;
    }
};
var Mouse = function() {
    c.addEventListener('mousedown', Mouse.click);
    c.addEventListener('mousemove', Mouse.move);
    //c.addEventListener('click', lockMouse);
};
Mouse.click = function(e) {
    switch (gameState) {
        case GameState.IS_PLAYING:
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
            break;
        case GameState.IN_MENU:
            menu[Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY)].action();
            break;
    }
    return false;
};
Mouse.getMenuItemIDForPosition = function(x, y) {
    if (fullMouseY > c.height * 0.60 && fullMouseY < c.height * 0.70) {
        // we can haz menu
        var margin = 50;
        var fullLength = 0;
        for (var i = 0; i < menu.length; i++) {
            var textLength = ctx.measureText(menu[i].title).width * 1.1;
            fullLength = fullLength + textLength + margin;
        }
        var left = (c.width - fullLength) / 2;
        for (var i = 0; i < menu.length; i++) {
            if (fullMouseX > left && fullMouseX < left + ctx.measureText(menu[i].title).width * 1.1 + margin) {
                return i;
            }
            left = left + ctx.measureText(menu[i].title).width * 1.1 + margin;
        }
    }
    return -1;
}
Mouse.move = function(e) {
    var relativeXPosition = (e.pageX - c.offsetLeft);
    var relativeYPosition = (e.pageY - c.offsetTop);
    fullMouseX = relativeXPosition;
    fullMouseY = relativeYPosition;
    var x = Math.floor(relativeXPosition / spriteSize);
    var y = Math.floor(relativeYPosition / spriteSize);
    console.log('X: ' + x + ' Y: ' + y);
    mouseX = x;
    mouseY = y;
    switch (gameState) {
        case GameState.IN_MENU:
            selectedMenuItem = Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY);
            break;
        case GameState.IS_PLAYING:
            if (selectedTool > -1) {
                tools[selectedTool].x = mouseX;
                tools[selectedTool].y = mouseY;
            }
            break;
    }
};
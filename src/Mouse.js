var Mouse = function() {
    c.addEventListener('mousedown', Mouse.click);
    c.addEventListener('mousemove', Mouse.move);
    //c.addEventListener('click', lockMouse);
};
Mouse.click = function(e) {
    if (document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c) {
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
                                i = 0;
                                while (i < toolsByType[string].length && toolsByType[string][i].isPlaced == true) {
                                    i++;
                                }
                                selectedTool = tools.indexOf(toolsByType[string][i]);
                            }
                            // is there a block at mouse position that we can pick up? If so, rotate
                            else {
                                 for (var i=0; i<tools.length; i++) {
                                    if (tools[i].x == mouseX && tools[i].y == mouseY) {
                                        if (tools[i].rotation == 3) {
                                            tools[i].rotation = 0;
                                        } else {
                                            tools[i].rotation++;
                                        }
                                        console.log('rotation is' + tools[i].rotation);
                                    }
                            }
                            }
                        } else {
							var blockExists = blockExistsAt(mouseX, mouseY, tools[selectedTool]);
							tools[selectedTool].isPlaced = !blockExists;
                            //tools[selectedTool].isPlaced = true;
                            if (!blockExists) selectedTool = -1;
                        }
                        break;
                    case 3:
                        console.log('right click');
                        for (var i=0; i<tools.length; i++) {
                            if (tools[i].x == mouseX && tools[i].y == mouseY) {
                                tools[i].x = 0; 
                                tools[i].y = 0;
                                tools[i].isPlaced = false;
                            }
                        }
                        break;
                }
                break;
            case GameState.IN_MENU:
                menu[Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY)].action();
                break;
        }
    } else {
        lockMouse();
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

    if ((fullMouseX + movementX) < c.width && (fullMouseY + movementY) < c.height && fullMouseX >= 0  && fullMouseY >= 0) {

}

      if (document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c) {
  var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
  var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

    fullMouseX += movementX;
    fullMouseY += movementY;

    var x = Math.floor(fullMouseX / spriteSize);
    var y = Math.floor(fullMouseY / spriteSize);
    mouseX = x;
    mouseY = y;
    switch (gameState) {
        case GameState.IN_MENU:
            selectedMenuItem = Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY);
            break;
        case GameState.IS_PLAYING:
            if (selectedTool > -1) {
				tools[selectedTool].isPlaced = !blockExistsAt(mouseX, mouseY, tools[selectedTool]);
                tools[selectedTool].x = mouseX;
                tools[selectedTool].y = mouseY;
            }
            break;
    }
    } 

};
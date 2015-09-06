var Mouse = function() {
    c.addEventListener('mousedown', Mouse.click);
    c.addEventListener('mousemove', Mouse.move);
    c.addEventListener('wheel', Mouse.wheel);
    //c.addEventListener('click', lockMouse);
};
Mouse.click = function(e) {
    if (document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c) {
        switch (gameState) {
            case GameState.IS_PLAYING:
                //"which" is not standardised, switched it with the "button" attribute.
                switch (e.button) {
                    //Main-button (usually the left button)
                    case 0:
                        if (currentAlert) {
                            selectedMenuItem = Mouse.getOptionIDForPosition(fullMouseX, fullMouseY);
                            console.log('selected index ' + selectedMenuItem);
                        } else if (selectedTool == -1) {
                            // in inventory
                            if (mouseIsInToolBox()) {
                                console.log('block clicked, selected tool is  ' + toolsByType[mouseY - 1]);
                                Mouse.selectTool(getToolFromToolbox(mouseY - 1));
                            }
                            if (mouseX == 15 && (mouseY < 11 && mouseY > (10 - actionButtons.length))) {
                                var blockID = mouseY - (height - actionButtons.length) + 1;
                                console.log('clicked button ' + blockID);
                                actionButtons[blockID].action();
                            }
                            // is there a block at mouse position that we can pick up? If so, rotate
                            else {
                                if (map[mouseX][mouseY].block != undefined) {
                                    if (!Keyboard.shiftKeyPressed) {
                                        rotateTool(map[mouseX][mouseY].block);
                                    } else {
                                        Mouse.selectTool(map[mouseX][mouseY].block);
                                        unplaceBlock(map[mouseX][mouseY].block, false);
                                    }
                                }
                            }
                        } else {
                            var blockExists = blockExistsAt(mouseX, mouseY, tools[selectedTool]);
                            if (!blockExists) {
                                placeBlock(tools[selectedTool]);
                                selectedTool = -1;
                            }
                        }
                        break;
                        //Secondary button (usually the right button)
                    case 2:
                        console.log('right click');
                        if (selectedTool != -1) {
                            unplaceBlock(tools[selectedTool]);
                            selectedTool = -1;
                        } else {
                            unplaceBlock(map[mouseX][mouseY].block);
                        }
                        break;
                }
                break;
            case GameState.IN_MENU:
                menu[Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY)].action();
                break;
            case GameState.HAS_WON:
                loadLevel(++levelID);
                break;
            case GameState.IN_OPTIONS:
                if (backButtonHover) {
                    gameState = GameState.IN_MENU;
                } else {
                    Mouse.toggleOption();
                }
                break;
            case GameState.IN_CREDITS:
                if (backButtonHover) {
                    gameState = GameState.IN_MENU;
                }
                window.open(credits[selectedMenuItem].link);
        }
    } else {
        lockMouse();
    }
    return false;
};
Mouse.wheel = function(e) {
    // if (mouseIsInToolBox) {
    //     if (selectedTool < 0) {
    //         hoveredBlocks = toolsByType[mouseY - 1];
    //
    //         if (hoveredBlocks == "PortalInput" || hoveredBlocks == "PortalOutput") {
    //             tools.move(tools.lastOf(toolsByType[hoveredBlocks]), 0);
    //         }
    //     }
    // }
}
Mouse.getOptionIDForPosition = function(x, y) {
    if (fullMouseX > (c.width * 0.2) && fullMouseX < (c.width * 0.7)) {
        var index = parseInt((y + 45 - c.height * 0.3) / 45);
        if (index < Object.keys(options).length) {
            return index;
        }
        return -1;
    }
};
Mouse.getCreditIDForPosition = function(x, y) {
    if (x > c.width * 0.2 && x < c.width * 0.5) {
        var index = Math.round((y - 100) / 150);
        if (index < credits.length) {
            return index;
        }
        return -1;
    }
};
Mouse.getMenuItemIDForPosition = function(x, y) {
    if (y > c.height * 0.60 && y < c.height * 0.70) {
        // we can haz menu
        var margin = 50;
        var fullLength = 0;
        for (var i = 0; i < menu.length; i++) {
            var textLength = ctx.measureText(menu[i].title).width * 1.1;
            fullLength = fullLength + textLength + margin;
        }
        var left = (c.width - fullLength) / 2;
        for (var i = 0; i < menu.length; i++) {
            if (x > left && fullMouseX < left + ctx.measureText(menu[i].title).width * 1.1 + margin) {
                return i;
            }
            left = left + ctx.measureText(menu[i].title).width * 1.1 + margin;
        }
    }
    return -1;
}
Mouse.getButtonIDForPosition = function(x, y) {
    // TODO: MATHS
    if (x > (c.width * 0.15) && x <= (c.width * 0.85) && y > (c.height * 0.8 - buttonHeight) && y < (c.height * 0.8)) {
        return Math.floor(x - (c.width * 0.15)) / (c.width * 0.7 / currentAlert.buttons.length);
    }
};
Mouse.toggleOption = function() {
    var i = 0;
    for (var key in options) {
        if (i == selectedMenuItem) {
            if (typeof options[key] == "boolean") {
                options[key] = !options[key];
                console.log('toggled ' + key);
            }
        }
        i++;
    }
    saveOptions();
};
Mouse.setBackButton = function() {
    if (fullMouseX >= 80 && fullMouseX <= 150 && fullMouseY >= 50 && fullMouseY <= 150) {
        backButtonHover = true;
    } else {
        backButtonHover = false
    }
}
Mouse.move = function(e) {
    if (document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c) {
        var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        fullMouseX += movementX;
        fullMouseY += movementY;
        if (fullMouseX < 0) fullMouseX = 0;
        if (fullMouseX > c.width - 16) fullMouseX = c.width - 16;
        if (fullMouseY < 0) fullMouseY = 0;
        if (fullMouseY > c.height - 16) fullMouseY = c.height - 16;
        var x = Math.floor(fullMouseX / spriteSize);
        var y = Math.floor(fullMouseY / spriteSize);
        mouseX = x;
        mouseY = y;
        switch (gameState) {
            case GameState.IN_MENU:
                selectedMenuItem = Mouse.getMenuItemIDForPosition(fullMouseX, fullMouseY);
                break;
            case GameState.IS_PLAYING:
                if (currentAlert) {
                    selectedMenuItem = Mouse.getOptionIDForPosition(fullMouseX, fullMouseY);
                    console.log('selected index ' + selectedMenuItem);
                } else if (selectedTool > -1) {
                    tools[selectedTool].isPlaced = !blockExistsAt(mouseX, mouseY, tools[selectedTool]);
                    tools[selectedTool].x = mouseX;
                    tools[selectedTool].y = mouseY;
                }
                break;
            case GameState.IN_OPTIONS:
                Mouse.setBackButton();
                selectedMenuItem = Mouse.getOptionIDForPosition(fullMouseX, fullMouseY);
                console.log('selected index ' + selectedMenuItem);
                break;
            case GameState.IN_CREDITS:
                Mouse.setBackButton();
                selectedMenuItem = Mouse.getCreditIDForPosition(fullMouseX, fullMouseY);
                console.log('selectedMenuItem ' + selectedMenuItem);
                // detect hyperlink
                break;
        }
    }
};
Mouse.selectTool = function(tool) {
    if (typeof tool === "object") {
        selectedTool = tools.indexOf(tool);
    } else if (typeof tool === "number" && -1 <= tool && tool < tools.length) {
        selectedTool = tool;
    }
}
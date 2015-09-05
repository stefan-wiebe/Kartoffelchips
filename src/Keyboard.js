var Keyboard = function() {
    document.addEventListener('keydown', Keyboard.keydown);
	document.addEventListener('keypress', Keyboard.keypress);
    document.addEventListener('keyup', Keyboard.keyup);

    var shiftKeyPressed = false;
};

Keyboard.keydown = function(e) {
    Util.log('Key pressed: ');
    Util.log(e);

    if (!Keyboard.shiftKeyPressed && e.shiftKey) {
        Keyboard.shiftKeyPressed = true;
    }


    if (e.ctrlKey && e.altKey) {
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

        //Attempt to unlock
        document.exitPointerLock();
    } else {
        switch (gameState) {
            case GameState.IS_PLAYING:
                if (e.keyCode == 82) {
                    if (e.shiftKey) {
                        if (selectedTool != -1) {
                            rotateTool(tools[selectedTool], -1);
                        } else {
                            rotateTool(map[mouseX][mouseY].block, -1);
                        }
                    } else if (e.keyCode == 82) {
                        if (selectedTool != -1) {
                            rotateTool(tools[selectedTool]);
                        } else {
                            rotateTool(map[mouseX][mouseY].block);
                        }
                    }
                // TODO: PLEASE USE THE MATHZS
                } else if (e.keyCode == 49) {
                    Mouse.selectTool(getToolFromToolbox(0));
                } else if (e.keyCode == 50) {
                    Mouse.selectTool(getToolFromToolbox(1));
                } else if (e.keyCode == 51) {
                    Mouse.selectTool(getToolFromToolbox(2));
                } else if (e.keyCode == 52) {
                    Mouse.selectTool(getToolFromToolbox(3));
                } else if (e.keyCode == 53) {
                    Mouse.selectTool(getToolFromToolbox(4));
                } else if (e.keyCode == 54) {
                    Mouse.selectTool(getToolFromToolbox(5));
                } else if (e.keyCode == 55) {
                    Mouse.selectTool(getToolFromToolbox(6));
                } else if (e.keyCode == 56) {
                    Mouse.selectTool(getToolFromToolbox(7));
                } else if (e.keyCode == 57) {
                    Mouse.selectTool(getToolFromToolbox(8));
                } else if (e.keyCode == 48) {
                    Mouse.selectTool(getToolFromToolbox(9));
                }
            break;
        }
    }
}

Keyboard.keyup = function (e) {
    if (Keyboard.shiftKeyPressed && !e.shiftKey) {
        Keyboard.shiftKeyPressed = false;
    }
}

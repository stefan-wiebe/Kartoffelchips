var Keyboard = function() {
    document.addEventListener('keydown', Keyboard.keydown);
	document.addEventListener('keypress', Keyboard.keypress);
    document.addEventListener('keyup', Keyboard.keyup);
};

Keyboard.keypress = function(e) {
    switch (gameState) {
        case GameState.IS_PLAYING:
            if (e.key == "r") {
                if (selectedTool != -1) {
                    rotateTool(tools[selectedTool]);
                } else {
                    rotateTool(placedBlocks[mouseX][mouseY]);
                }
            } else if (e.key == "R") {
                if (selectedTool != -1) {
                    rotateTool(tools[selectedTool], -1);
                } else {
                    rotateTool(placedBlocks[mouseX][mouseY], -1);
                }
            }
        break;
    }
}

Keyboard.keydown = function(e) {
    Util.log('Key pressed: ');
    Util.log(e);
    if (e.ctrlKey && e.altKey) {
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        
        //Attempt to unlock
        document.exitPointerLock();
    }
}

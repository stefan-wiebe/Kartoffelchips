debug = false;

function Drawing() {}
Drawing.drawBoard = function() {
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
            Drawing.drawSprite('map', map[x][y], x, y);
        }
    }
};
Drawing.drawSprite = function(spriteName, spriteIndex, x, y) {
    spriteName = spriteName.toLowerCase();
    if (sprites[spriteName]) {
        ctx.drawImage(sprites[spriteName], spriteIndex * spriteSize, 0, spriteSize, spriteSize, x * spriteSize, y * spriteSize, 64, 64);
    }
    if (debug) {
        if (spriteName != 'map') {
            ctx.font = '10px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(spriteName + ' [' + spriteIndex + ']', (spriteSize * x) + 5, (spriteSize * y) + 10);
            ctx.font = '20px Arial';
            ctx.fillText(spriteIndex, (spriteSize * x) + 5, (spriteSize * y) + 20);
            ctx.fillText(spriteIndex * spriteSize, (spriteSize * x) + 5, (spriteSize * y) + 40);
        }
    }
};

Drawing.drawCursor = function() {
    ctx.drawImage(sprites['mouse'],fullMouseX, fullMouseY);
};
Drawing.drawMouse = function() {
    if (selectedTool != -1) {
        Drawing.drawSprite(tools[selectedTool].toString(), tools[selectedTool].rotation, mouseX, mouseY);
    }
    ctx.fillStyle = "rgba(0,255,0,0.3)";
    if (blockExistsAt(mouseX, mouseY)) {
        ctx.fillStyle = "rgba(255,0,0,0.3)";
    }
    if (mouseX == 15 && mouseY > 0 && mouseY <= toolsByType.length) {
        ctx.fillStyle = "rgba(0, 0,255,0.3)";
    }
    ctx.fillRect(mouseX * spriteSize, mouseY * spriteSize, spriteSize, spriteSize);
};
Drawing.drawPredefinedBlocks = function() {
    for (var i = 0; i < predefinedBlocks.length; i++) {
        var block = predefinedBlocks[i];
        var blockType = block.toString();
        blockType = blockType.toLowerCase();
        var boolN = block.isOn ? 4 : 0;
        var index = boolN;
        if (block.hasOwnProperty('rotation')) {
            Util.log('rotation is ' + block.rotation);
            index = block.rotation + boolN;
        };
		if (blockType == "activator") {
			index = block.isOn ? 1 : 0;
		}

        if (blockType == "receiver") {
            ctx.fillStyle = Drawing.getStringFromColor(block.color);
            ctx.fillRect(block.x * spriteSize, block.y * spriteSize, spriteSize, spriteSize);
        }
        Util.log('index is ' + index);
        Drawing.drawSprite(blockType, index, block.x, block.y);
    }
};
Drawing.drawTools = function() {
    for (var i = 0; i < tools.length; i++) {
        var tool = tools[i];
        if (tool.isPlaced) {
            var toolType = tool.toString();
            switch (toolType) {
                case "Prism":
                    var boolN = tool.inputs[0].isOn || tool.inputs[1].isOn ? 4 : 0;
                    var index = boolN;
                    if (tool.hasOwnProperty('rotation')) {
                        Util.log('rotation is ' + tool.rotation);
                        index = tool.rotation + boolN;
                    }
                    Util.log('index is ' + index);
                    Drawing.drawSprite(toolType, index, tool.x, tool.y);
                    break;
                case "Mirror":
                    var boolN = tools.isOn ? 4 : 0;
                    var index = boolN;
                    if (tool.hasOwnProperty('rotation')) {
                        Util.log('rotation is ' + tool.rotation);
                        index = tool.rotation + boolN;
                    }
                    Util.log('index is ' + index);
                    Drawing.drawSprite(toolType, index, tool.x, tool.y);
                    break;
                default:
                    break;
            }
        }
    }
}
Drawing.drawLaserBeam = function() {
    for (var i = 0; i < predefinedBlocks.length; i++) {
        var emitter = predefinedBlocks[i];
        Util.log('drawing laser beam from' + emitter.toString());
        if (emitter.toString() == "Emitter") {
        	
            Drawing.drawLaserBeamFromObject(emitter);
        }
    }
};

Drawing.getStringFromColor = function(color) {
	var colorString = '';
		switch (color) {
        		case 0:
        		colorString = '#ff0000';
        		break;
        		case 1:
        		colorString = '#00ff00';
        		break;
        		case 2:
        		colorString = '#0000ff';
        		break;
        	}
	return colorString;
};

Drawing.drawHalfLaserBeamInCell = function(color, rotation, x, y) {
        ctx.strokeStyle = Drawing.getStringFromColor(color);
        ctx.strokeWidth = 4;
        ctx.beginPath();
        switch (rotation) {
            case 0:
                ctx.moveTo((x * spriteSize) + spriteSize / 2, y * spriteSize + spriteSize);
                ctx.lineTo((x * spriteSize) + spriteSize / 2, y * spriteSize / 2);
                break;
            case 1:
                ctx.moveTo(x * spriteSize / 2, y * spriteSize + spriteSize / 2);
                ctx.lineTo(x * spriteSize + spriteSize, y * spriteSize + spriteSize / 2);
                break;
            case 2:
                ctx.moveTo((x * spriteSize) + spriteSize / 2, y * spriteSize / 2);
                ctx.lineTo((x * spriteSize) + spriteSize / 2, y * spriteSize + spriteSize);
                break;
            case 3:
                ctx.moveTo(x * spriteSize + spriteSize, y * spriteSize + spriteSize / 2);
                ctx.lineTo(x * spriteSize / 2, y * spriteSize + spriteSize / 2);
                break;
        }
        ctx.stroke();
    }
    /*
        ▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄
        █                  ▀▀▄
       █                      █
      █      ▄██▀▄▄     ▄▄▄   █
     ▀ ▄▄▄  █▀▀▀▀▄▄█   ██▄▄█   █
    █ █ ▄ ▀▄▄▄▀        █        █
    █ █ █▀▄▄     █▀    ▀▄  ▄▀▀▀▄ █
     █▀▄ █▄ █▀▄▄ ▀ ▀▀ ▄▄▀    █  █
      █  ▀▄▀█▄▄ █▀▀▀▄▄▄▄▀▀█▀██ █
       █  ██  ▀█▄▄▄█▄▄█▄████ █
        █   ▀▀▄ █   █ ███████ █
         ▀▄   ▀▀▄▄▄█▄█▄█▄█▄▀  █
           ▀▄▄               █
              ▀▀▄▄            █
                  ▀▄▄▄▄▄     █
    */
Drawing.drawLaserBeamInCell = function(color, rotation, x, y) {
    var result = true;
    var i = 0;
    while (i < predefinedBlocks.length && result) {
		if (predefinedBlocks[i].toString() == "Activator") {
			if (predefinedBlocks[i].x == x && predefinedBlocks[i].y == y) predefinedBlocks[i].isOn = true;
		}
        if (predefinedBlocks[i].x == x && predefinedBlocks[i].y == y && predefinedBlocks[i].toString() != "Activator") {
            result = false;
			if (predefinedBlocks[i].toString() == "Receiver" && predefinedBlocks[i].color == color) {
				predefinedBlocks[i].isOn = true;
			}
        }
        i++;
    }
    i = 0;
    while (i < tools.length && result) {
        if (tools[i].isPlaced && tools[i].x == x && tools[i].y == y) {
            result = false;
            if (tools[i].toString() == "Mirror") {
                switch (tools[i].rotation) {
                    case 0:
						if (rotation == 0) {
                            Drawing.drawLaserBeamFromPosition(x, y, 3, color);
                        }
						if (rotation == 1) {
							Drawing.drawLaserBeamFromPosition(x, y, 0, color);
						}
                        if (rotation == 2) {
                            Drawing.drawLaserBeamFromPosition(x, y, 1, color);
                        }
						if (rotation == 3) {
							Drawing.drawLaserBeamFromPosition(x, y, 2, color);
						}
                        break;
                    case 1:
						if (rotation == 0) {
                            Drawing.drawLaserBeamFromPosition(x, y, 1, color);
                        }
						if (rotation == 1) {
							Drawing.drawLaserBeamFromPosition(x, y, 2, color);
						}
						if (rotation == 2) {
							Drawing.drawLaserBeamFromPosition(x, y, 3, color);
						}
						if (rotation == 3) {
							Drawing.drawLaserBeamFromPosition(x, y, 0, color);
						}
                        break;
                    case 2:
                        if (rotation == 0) {
                            Drawing.drawLaserBeamFromPosition(x, y, 3, color);
                        }
						if (rotation == 1) {
							Drawing.drawLaserBeamFromPosition(x, y, 0, color);
						}
                        if (rotation == 2) {
                            Drawing.drawLaserBeamFromPosition(x, y, 1, color);
                        }
		
						if (rotation == 3) {
							Drawing.drawLaserBeamFromPosition(x, y, 2, color);
						}
                        break;
                    case 3:
						if (rotation == 0) {
                            Drawing.drawLaserBeamFromPosition(x, y, 1, color);
                        }
						if (rotation == 1) {
							Drawing.drawLaserBeamFromPosition(x, y, 2, color);
						}
						if (rotation == 2) {
							Drawing.drawLaserBeamFromPosition(x, y, 3, color);
						}
						if (rotation == 3) {
							Drawing.drawLaserBeamFromPosition(x, y, 0, color);
						}
                        break;
                }
            } else if (tools[i].toString() == "Prism") {
                          }
        }
        i++;
    }
    Util.log('Drawing laser beam in cell ' + x + ', ' + y + 'with rotation of ' + (rotation * 90) + ' degrees');
    if (result) {
        switch (map[x][y]) {
            case Tiles.CLEAR:

        	ctx.strokeStyle = Drawing.getStringFromColor(color);
                ctx.strokeWidth = 4;
                ctx.beginPath();
                switch (rotation) {
                    case 0:
                        ctx.moveTo((x * spriteSize) + spriteSize / 2, y * spriteSize + spriteSize);
                        ctx.lineTo((x * spriteSize) + spriteSize / 2, y * spriteSize);
                        break;
                    case 1:
                        ctx.moveTo(x * spriteSize, y * spriteSize + spriteSize / 2);
                        ctx.lineTo(x * spriteSize + spriteSize, y * spriteSize + spriteSize / 2);
                        break;
                    case 2:
                        ctx.moveTo((x * spriteSize) + spriteSize / 2, y * spriteSize);
                        ctx.lineTo((x * spriteSize) + spriteSize / 2, y * spriteSize + spriteSize);
                        break;
                    case 3:
                        ctx.moveTo(x * spriteSize + spriteSize, y * spriteSize + spriteSize / 2);
                        ctx.lineTo(x * spriteSize, y * spriteSize + spriteSize / 2);
                        break;
                }
                ctx.stroke();
                result = true;
                break;
            default:
                result = false;
                break;
        }
    }
    return result;
};
Drawing.drawToolbox = function() {
    toolsByType = [];
    Util.log('drawing toolbox');
    for (var i = 0; i < tools.length; i++) {
        if (toolsByType[tools[i].toString()] === undefined) {
            toolsByType.push(tools[i].toString());
            toolsByType[tools[i].toString()] = new Array();
            Util.log('creating new index');
        }
        Util.log('adding tool no ' + i + ' to ' + tools[i].toString() + 's')
        toolsByType[tools[i].toString()].push(tools[i]);
    }
    for (var i = 0; i < toolsByType.length; i++) {
        Util.log('Drawing ' + toolsByType[i].toString() + ' at ' + (i + 1));
        
        ctx.fillStyle = 'white';
        ctx.font = "14px Courier New";
        var numberOfNotPlaced = 0;
        for (var j = 0; j < toolsByType[toolsByType[i]].length; j++) {
            if (toolsByType[toolsByType[i]][j].isPlaced == false) {
                numberOfNotPlaced++;
            }
        }
        if (numberOfNotPlaced > 0) {
                    Drawing.drawSprite(toolsByType[i].toString(), 0, 15, (i + 1));
        ctx.fillText(numberOfNotPlaced, (spriteSize * 16) - 20, (spriteSize * (i + 2)) - 10);

        }
        Drawing.drawSprite('inventory', 0, 15, (i + 1));
    }
};
Drawing.drawLaserBeamFromObject = function(obj) {
    Util.log('drawing laser beam from ' + obj.toString());

    // draw to next object
    var nextX = 0;
    var nextY = 0;
    switch (obj.rotation) {
        case 0:
            var i = obj.y;
            beaming = true;
            if (obj.toString() != "Mirror") Drawing.drawLaserBeamInCell(obj.color, obj.rotation, obj.x, i);
            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(obj.color, obj.rotation, obj.x, i);
                i--;
            }
            break;
        case 1:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") Drawing.drawLaserBeamInCell(obj.color, obj.rotation, i, obj.y);
            i++;
            while (i < width && beaming) {
                beaming = Drawing.drawLaserBeamInCell(obj.color, obj.rotation, i, obj.y);
                i++;
                Util.log('drawing laser at ' + i + ' ' + obj.y + ' beaming is ' + beaming);
            }
            break;
        case 2:
            var i = obj.y;
            beaming = true;
            if (obj.toString() != "Mirror") Drawing.drawLaserBeamInCell(obj.rotation, obj.rotation, obj.x, i);
            i++;
            while (i < height && beaming) {
                beaming = Drawing.drawLaserBeamInCell(obj.color, obj.rotation, obj.x, i);
                i++;
            }
            break;
        case 3:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") Drawing.drawLaserBeamInCell(obj.rotation, obj.rotation, i, obj.y);
            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(obj.color, obj.rotation, i, obj.y);
                i--;
            }
            break;
    }
}
Drawing.drawLaserBeamFromPosition = function(x, y, rotation, color) {
    // draw to next object
    var nextX = 0;
    var nextY = 0;
    switch (rotation) {
        case 0:
            var i = y;
            beaming = true;
            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, rotation, x, i);
                i--;
            }
            break;
        case 1:
            var i = x;
            beaming = true;
            i++;
            while (i < width && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, rotation, i, y);
                i++;
                Util.log('drawing laser at ' + i + ' ' + y + ' beaming is ' + beaming);
            }
            break;
        case 2:
            var i = y;
            beaming = true;
            i++;
            while (i < height && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, rotation, x, i);
                i++;
            }
            break;
        case 3:
            var i = x;
            beaming = true;
            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, rotation, i, y);
                i--;
            }
            break;
    }
}

Drawing.fillTextRotated = function(str, x, y,angle) {
    var result = angle*Math.PI/180;
    ctx.rotate(-result);
    ctx.fillText(str, x, y);
    ctx.rotate(result);

};
Drawing.fillTextCentered = function(str, y) {
    var left = (c.width - ctx.measureText(str).width)/2;
    ctx.fillText(str,left, y);

};

Drawing.drawMenuScreen = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0,0,c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width-sprites['logo'].width)/2,200);
    ctx.fillStyle = 'white';
    ctx.font = '36px TS4F';
    var margin = 50;
    var fullLength = 0;
    for (var i=0; i<menu.length; i++) {
        var textLength = ctx.measureText(menu[i].title).width*1.1;
        fullLength = fullLength + textLength + margin;
    }
    var left = (c.width - fullLength)/2;
    for (var i=0; i<menu.length; i++) {
        ctx.fillStyle = 'white';
        if (i == selectedMenuItem) {
            ctx.fillStyle = '#fda900';
        }
        Drawing.fillTextRotated(menu[i].title, left, c.height*0.68 + (i*3),5);
        ctx.fillStyle = 'white';

        left = left + ctx.measureText(menu[i].title).width*1.1 + margin;
    }
};

Drawing.drawPointerLockWarning = function() {
     ctx.fillStyle = '#394046';
    ctx.fillRect(0,0,c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width-sprites['logo'].width)/2,200);
    ctx.fillStyle = 'white';
    ctx.font = '48px TS4F';
    Drawing.fillTextCentered('CAN HAZ MOUSE?', c.height*0.65);
}
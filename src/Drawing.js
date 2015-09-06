function Drawing() {}
Drawing.drawBoard = function() {
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
            Drawing.drawSprite('map', map[x][y].tile, x, y);
        }
    }
};
Drawing.drawSprite = function(spriteName, spriteIndex, x, y) {
    spriteName = spriteName.toLowerCase();
    if (sprites[spriteName]) {
        ctx.drawImage(sprites[spriteName], spriteIndex * spriteSize, 0, spriteSize, spriteSize, x * spriteSize, y * spriteSize, 64, 64);
    }

    if (options.debug) {
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
    ctx.drawImage(sprites['mouse'], fullMouseX, fullMouseY);
};
Drawing.drawMouse = function() {
    if (selectedTool != -1) {
        Drawing.drawTool(tools[selectedTool]);
        // var offset = tools[selectedTool].isOn ? 4 : 0;
        // Drawing.drawSprite(tools[selectedTool].toString(), tools[selectedTool].rotation + offset, mouseX, mouseY);
    }

    // If in inventory or actionBlocks

    if (mouseX == 15 && ((mouseY > 0 && mouseY <= toolsByType.length) || (mouseY < 11 && mouseY > (10 - actionButtons.length)))) {
        ctx.fillStyle = "rgba(0, 0,255,0.2)";
    } else if (selectedTool < 0) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
    } else {
        if (blockExistsAt(mouseX, mouseY)) {
            // red if invalid
            ctx.fillStyle = "rgba(255,0,0,0.3)";
        } else {
            // green if valid
            ctx.fillStyle = "rgba(0,255,0,0.3)";
        }
    }

    ctx.fillRect(mouseX * spriteSize, mouseY * spriteSize, spriteSize, spriteSize);
};

Drawing.drawPredefinedBlocks = function() {
    for (var i = 0; i < predefinedBlocks.length; i++) {
        var block = predefinedBlocks[i];
        var blockType = block.toString();
        blockType = blockType.toLowerCase();
        var offset = block.isOn ? 4 : 0;
        var index = offset;

        if (block.hasOwnProperty('rotation')) {
            Util.log('rotation is ' + block.rotation);
            index = block.rotation + offset;
        }

        if (blockType == "activator") {
            offset = block.isOn ? 1 : 0;
            index = offset;
        }

        if (blockType == "receiver") {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x * spriteSize, block.y * spriteSize, spriteSize, spriteSize);
        }

        Util.log('index is ' + index);

        Drawing.drawSprite(blockType, index - offset, block.x, block.y);
        Drawing.fillAlphaOfBlock(block);
        Drawing.drawSprite(blockType, index, block.x, block.y);
    }
};

Drawing.drawTools = function() {
    for (var i = 0; i < tools.length; i++) {
        Drawing.drawTool(tools[i]);
    }
}

Drawing.drawTool = function(tool) {
    if (typeof tool == "object") {
        var toolType = tool.toString();
        var offset = 0;
        var index = 0;

        switch (toolType) {
            case "Prism":
                offset = tool.inputs[0].isOn || tool.inputs[1].isOn ? 4 : 0;
                index = offset;

                if (tool.hasOwnProperty('rotation')) {
                    Util.log('rotation is ' + tool.rotation);
                    index = tool.rotation + offset;
                }

                break;
            default:
                offset = tool.isOn ? 4 : 0;
                index = offset;

                if (tool.hasOwnProperty('rotation')) {
                    Util.log('rotation is ' + tool.rotation);
                    index = tool.rotation + offset;
                }

                break;
        }

        Util.log('index is ' + index);

        Drawing.drawSprite(toolType, index - offset, tool.x, tool.y);

        if (toolType == "PortalInput" || toolType == "PortalOutput") {
            var x = tool.x;
            var y = tool.y;

            var startX = x * spriteSize;
            var halfX = x * spriteSize + spriteSize / 2;
            var fullX = startX + spriteSize;

            var startY = y * spriteSize;
            var halfY = y * spriteSize + spriteSize / 2;
            var fullY = startY + spriteSize;
            ctx.fillStyle = tool.color;

            switch (tool.rotation) {
                case 0:
                    ctx.fillRect(startX, halfY, spriteSize, spriteSize / 2);
                    break;
                case 1:
                    ctx.fillRect(startX, startY, spriteSize / 2, spriteSize);
                    break;
                case 2:
                    ctx.fillRect(startX, startY, spriteSize, spriteSize / 2);
                    break;
                case 3:
                    ctx.fillRect(halfX, startY, spriteSize / 2, spriteSize);
                    break;
            }
        }

        Drawing.fillAlphaOfBlock(tool);
        Drawing.drawSprite(toolType, index, tool.x, tool.y);
    }
}

Drawing.drawLaserBeam = function() {
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].toString() == "Emitter") {
            var emitter = predefinedBlocks[i];
            Util.log('drawing laser beam from' + emitter.toString());
            Drawing.drawLaserBeamFromObject(emitter);
        } else if (blocks[i].toString() == "PortalOutput" && blocks[i].isPlaced) {
            var j = 0;
            var found = false;

            if (portalInputs[blocks[i].color] != undefined && portalInputs[blocks[i].color].input.isOn) {
                Drawing.drawLaserBeamFromPosition(blocks[i].x, blocks[i].y, blocks[i].rotation, portalInputs[blocks[i].color].input.color);
                blocks[i].isOn = true;
            }
        }
    }


};

Drawing.fillAlphaOfBlocks = function() {
	for (var i = 0; i < blocks.length; i++) {
		fillAlphaOfTool(blocks[i]);
	}

}

Drawing.fillAlphaOfBlock = function(block) {
    if (typeof block == "object" && block.isOn && block.isPlaced) {
        ctx.lineWidth = 2;

        var blockName = block.toString();
        var rotation = block.rotation;
        var x = block.x;
        var y = block.y;

        var startX = x * spriteSize;
        var halfX = x * spriteSize + spriteSize / 2;
        var fullX = startX + spriteSize;

        var startY = y * spriteSize;
        var halfY = y * spriteSize + spriteSize / 2;
        var fullY = startY + spriteSize;

        if (blockName == "Emitter") {
            if (rotation == 0 || rotation == 2) {
                ctx.beginPath();
                ctx.strokeStyle = block.color;
                ctx.moveTo(halfX, startY);
                ctx.lineTo(halfX, fullY);
                ctx.stroke();
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.strokeStyle = block.color;
                ctx.moveTo(startX, halfY);
                ctx.lineTo(fullX, halfY);
                ctx.stroke();
                ctx.closePath();
            }
        } else if (blockName == "Receiver") {
            ctx.fillStyle = block.color;
            ctx.fillRect(startX + 18, startY + 18, 30, 30);

            ctx.beginPath();
            ctx.strokeStyle = block.color;

            if (rotation == 0 || rotation == 2) {
                ctx.moveTo(halfX, startY);
                ctx.lineTo(halfX, fullY);
            } else {
                ctx.moveTo(startX, halfY);
                ctx.lineTo(fullX, halfY);
            }

            ctx.stroke();
            ctx.closePath();
        } else if (blockName == "Mirror") {
            if (rotation == 0 || rotation == 2) {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(halfX, startY);
                    ctx.lineTo(halfX, halfY - 1);
                    ctx.moveTo(halfX + 1, halfY);
                    ctx.lineTo(fullX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(halfX, fullY);
                    ctx.lineTo(halfX, halfY);
                    ctx.lineTo(startX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
            } else {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(halfX, startY);
                    ctx.lineTo(halfX, halfY - 1);
                    ctx.moveTo(halfX - 1, halfY);
                    ctx.lineTo(startX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(halfX, fullY);
                    ctx.lineTo(halfX, halfY);
                    ctx.lineTo(fullX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        } else if (blockName == "Prism") {
            if (rotation == 0) {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(startX, halfY);
                    ctx.lineTo(halfX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(fullX, halfY);
                    ctx.lineTo(halfX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }

                ctx.beginPath();
                ctx.strokeStyle = mixColors(block.inputs[0].color, block.inputs[1].color);
                ctx.moveTo(halfX, halfY);
                ctx.lineTo(halfX, startY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 1) {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(halfX, startY);
                    ctx.lineTo(halfX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(halfX, halfY);
                    ctx.lineTo(halfX, fullY);
                    ctx.stroke();
                    ctx.closePath();
                }

                ctx.beginPath();
                ctx.strokeStyle = mixColors(block.inputs[0].color, block.inputs[1].color);
                ctx.moveTo(halfX, halfY);
                ctx.lineTo(fullX, halfY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 2) {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(fullX, halfY);
                    ctx.lineTo(halfX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(halfX, halfY);
                    ctx.lineTo(startX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }

                ctx.beginPath();
                ctx.strokeStyle = mixColors(block.inputs[0].color, block.inputs[1].color);
                ctx.moveTo(halfX, halfY);
                ctx.lineTo(halfX, fullY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 3) {
                if (block.inputs[0].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[0].color;
                    ctx.moveTo(halfX, halfY);
                    ctx.lineTo(halfX, fullY);
                    ctx.stroke();
                    ctx.closePath();
                }
                if (block.inputs[1].isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = block.inputs[1].color;
                    ctx.moveTo(halfX, startY);
                    ctx.lineTo(halfX, halfY);
                    ctx.stroke();
                    ctx.closePath();
                }

                ctx.beginPath();
                ctx.strokeStyle = mixColors(block.inputs[0].color, block.inputs[1].color);
                ctx.moveTo(startX, halfY);
                ctx.lineTo(halfX, halfY);
                ctx.stroke();
                ctx.closePath();
            }
        } else if (blockName == "PortalInput" || blockName == "PortalOutput") {
            ctx.beginPath();

            if (blockName == "PortalInput") {
                ctx.strokeStyle = block.input.color;
            } else {
                ctx.strokeStyle = portalInputs[block.color].input.color;
            }

            if (rotation == 0) {
                ctx.moveTo(halfX, startY);
                ctx.lineTo(halfX, halfY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 1) {
                ctx.moveTo(halfX, halfY);
                ctx.lineTo(fullX, halfY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 2) {
                ctx.moveTo(halfX, halfY);
                ctx.lineTo(halfX, fullY);
                ctx.stroke();
                ctx.closePath();
            } else if (rotation == 3) {
                ctx.moveTo(startX, halfY);
                ctx.lineTo(halfX, halfY);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
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
    rotation = (rotation + 2) % 4;

    var block = map[x][y].block;

    if (block == undefined && selectedTool != -1 && tools[selectedTool].x === x && tools[selectedTool].y === y) {
        block = tools[selectedTool];
    }

    if (block != undefined && block.isPlaced) {
		var blockName = block.toString();

        if (block.isPredefined == true) {
    		if (blockName == "Activator") {
    			block.isOn = true;
    		} else if (blockName == "Receiver" && block.color == color  && block.rotation == rotation) {
    			result = false;
    			block.isOn = true;
    		} else {
                result = false;
            }
        } else {
            result = false;

            if (block.toString() == "Mirror") {
                switch (block.rotation) {
                    case 0:
                    case 2:
    					if (rotation == 0 || rotation == 1) {
    						block.inputs[0].isOn = true;
    						block.inputs[0].color = color;
    					} else if (rotation == 2 || rotation == 3) {
    						block.inputs[1].isOn = true;
    						block.inputs[1].color = color;
    					}
                        Drawing.drawLaserBeamFromPosition(x, y, (5 - rotation) % 4, color);
                        break;
                    case 1:
                    case 3:
    					if (rotation == 0 || rotation == 3) {
    						block.inputs[0].isOn = true;
    						block.inputs[0].color = color;
    					} else if (rotation == 1 || rotation == 2) {
    						block.inputs[1].isOn = true;
    						block.inputs[1].color = color;
    					}
                        Drawing.drawLaserBeamFromPosition(x, y, (3 - rotation), color);
                        break;
                }

    			block.isOn = true;
            } else if (block.toString() == "Prism") {
                switch (block.rotation) {
                    case 0:
                    case 2:
                        if (rotation == 3 - block.rotation) {
                            block.inputs[0].isOn = true;
                            block.inputs[0].color = color;
                        }
                        if (rotation == 1 + block.rotation) {
                            block.inputs[1].isOn = true;
                            block.inputs[1].color = color;
                        }
                        break;
                    case 1:
                    case 3:
                        if (rotation == (3 + block.rotation) % 4) {
                            block.inputs[0].isOn = true;
                            block.inputs[0].color = color;
                        }
                        if (rotation == 3 - block.rotation) {
                            block.inputs[1].isOn = true;
                            block.inputs[1].color = color;
                        }
                        break;
                }

                if (block.inputs[0].isOn && !block.inputs[1].isOn) {
                    Drawing.drawLaserBeamFromPosition(x, y, block.rotation, block.inputs[0].color);
                } else if (!block.inputs[0].isOn && block.inputs[1].isOn) {
                    Drawing.drawLaserBeamFromPosition(x, y, block.rotation, block.inputs[1].color);
                } else if (block.inputs[0].isOn && block.inputs[1].isOn) {
                    Drawing.drawLaserBeamFromPosition(x, y, block.rotation, mixColors(block.inputs[0].color, block.inputs[1].color));
                }

    			block.isOn = true;
            } else if (block.toString() == "PortalInput") {
                if (rotation == block.rotation) {
                    block.isOn = true;
                    block.input.isOn = true;
                    block.input.color = color;
                }
            }
        }
    }

    Util.log('Drawing laser beam in cell ' + x + ', ' + y + 'with rotation of ' + (rotation * 90) + ' degrees');
    if (result) {
        switch (map[x][y].tile) {
            case Tiles.CLEAR:
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();

                switch (rotation) {
                    case 0:
                    case 2:
                        ctx.moveTo((x * spriteSize) + spriteSize / 2, y * spriteSize + spriteSize);
                        ctx.lineTo((x * spriteSize) + spriteSize / 2, y * spriteSize);
                        break;
                    case 1:
                    case 3:
                        ctx.moveTo(x * spriteSize, y * spriteSize + spriteSize / 2);
                        ctx.lineTo(x * spriteSize + spriteSize, y * spriteSize + spriteSize / 2);
                        break;
                }
                ctx.stroke();
                ctx.closePath();

                result = true;
                break;
            default:
                result = false;
                break;
        }
    }

    return result;
};

Drawing.drawToolbar = function() {
    for (var y = 0; y < height; y++) {
        Drawing.drawSprite('inventory', 1, 15, y);
    }
}

Drawing.drawToolbox = function() {
    Util.log('drawing toolbox');

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

        Drawing.drawSprite('inventory', 0, 15, (i + 1));

        if (numberOfNotPlaced > 0) {
            ctx.fillText(numberOfNotPlaced, (spriteSize * 15.75), (spriteSize * (i + 2)) - spriteSize * 0.15);
        }
    }
};
Drawing.drawLaserBeamFromObject = function(obj) {
    Util.log('drawing laser beam from ' + obj.toString());
    // draw to next object
    var nextX = 0;
    var nextY = 0;
    var color = obj.color;

    switch (obj.rotation) {
        case 0:
            var i = obj.y;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(color, obj.rotation, obj.x, i);
            }

            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, obj.rotation, obj.x, i);
                i--;
            }
            break;
        case 1:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(color, obj.rotation, i, obj.y);
            }

            i++;
            while (i < width && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, obj.rotation, i, obj.y);
                i++;
                Util.log('drawing laser at ' + i + ' ' + obj.y + ' beaming is ' + beaming);
            }
            break;
        case 2:
            var i = obj.y;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(obj.rotation, obj.rotation, obj.x, i);
            }

            i++;
            while (i < height && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, obj.rotation, obj.x, i);
                i++;
            }
            break;
        case 3:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(obj.rotation, obj.rotation, i, obj.y);
            }

            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, obj.rotation, i, obj.y);
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
Drawing.fillTextRotated = function(str, x, y, angle) {
    var result = angle * Math.PI / 180;
    ctx.rotate(-result);
    ctx.fillText(str, x, y);
    ctx.rotate(result);
};
Drawing.fillTextCentered = function(str, y) {
    var left = (c.width - ctx.measureText(str).width) / 2;
    ctx.fillText(str, left, y);
};
Drawing.drawTitle = function(str) {
    var oldFont = ctx.font;
    ctx.font = '48px TS4F';
    ctx.fillStyle = 'white';
    var left = (c.width - ctx.measureText(str).width) / 2;
    var result = 3 * Math.PI / 180;
    ctx.rotate(-result);
    ctx.fillText(str, left, 120);
    ctx.rotate(result);
    ctx.font = oldFont;
}
Drawing.drawMenuScreen = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width - sprites['logo'].width) / 2, 200);
    ctx.fillStyle = 'white';
    ctx.font = '36px TS4F';
    var margin = 50;
    var fullLength = 0;
    for (var i = 0; i < menu.length; i++) {
        var textLength = ctx.measureText(menu[i].title).width * 1.1;
        fullLength = fullLength + textLength + margin;
    }
    var left = (c.width - fullLength) / 2;
    for (var i = 0; i < menu.length; i++) {
        ctx.fillStyle = 'white';
        if (i == selectedMenuItem) {
            ctx.fillStyle = '#fda900';
        }
        Drawing.fillTextRotated(menu[i].title, left, c.height * 0.68 + (i * 3), 5);
        ctx.fillStyle = 'white';
        left = left + ctx.measureText(menu[i].title).width * 1.1 + margin;
    }
};
Drawing.drawPointerLockWarning = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width - sprites['logo'].width) / 2, 200);
    ctx.fillStyle = 'white';
    ctx.font = '48px TS4F';
    Drawing.fillTextCentered('CAN HAZ MOUSE?', c.height * 0.65);
};
Drawing.drawWinScreen = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px TS4F';
    ctx.drawImage(sprites['wonPotato'], (c.width - sprites['wonPotato'].width) / 2, 200);
    Drawing.fillTextCentered('YOU HAZ WON! CLICK TO CONTINUE!', c.height * 0.65);
        ctx.font = '36px TS4F';

    Drawing.fillTextCentered('Level completed in ' + Util.getDateString(timerElapsed), c.height * 0.8);

};
// draw boolean
Drawing.drawBoolean = function(x, y, bool) {
    ctx.fillStyle = "white";
    var label = "OFF";
    if (bool) {
        label = "ON"
    }
    ctx.fillText(label, x, y);
};
// Draws slider for options
Drawing.drawSlider = function(x, y, width, height, number) {
    // first draw slider line
    Util.log('drawing line from ' + x + ' to ' + (x + width));
    var sliderWidth = 8 * scaleFactor;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2.5 * scaleFactor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    // then draw block
    ctx.fillStyle = "white";
    var sliderX = x + (number * width);
    ctx.fillRect(sliderX, y - (height / 2), sliderWidth, height);
};
Drawing.drawBackButton = function() {
    var oldFont = ctx.font;
    ctx.font = '72px TS4F';
    if (backButtonHover) {
        ctx.fillStyle = "#fda900";
    }
    ctx.fillText('<', 100, 100);
    ctx.font = oldFont;
    ctx.fillStyle = 'width';
}
Drawing.drawOptions = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0, 0, c.width, c.height);
    var i = 0;
    ctx.fillStyle = 'white';
    ctx.font = '36px TS4F';
    Drawing.drawTitle('Options');
    Drawing.drawBackButton();
    for (var key in options) {
        ctx.fillStyle = "white"
        if (selectedMenuItem == i) {
            ctx.fillStyle = "#fda900";
        }
        ctx.fillText(key.toUpperCase(), c.width * 0.2, (c.height * 0.3) + (i * 45));
        // TODO (?): STRINGS
        switch (typeof options[key]) {
            case 'string':
                break;
            case 'boolean':
                Drawing.drawBoolean(c.width - (c.width * 0.3), (c.height * 0.3) + (i * 45), options[key]);
                break;
            case 'number':
                Drawing.drawSlider(c.width - (c.width * 0.3), (c.height * 0.3) + (i * 45), 100, 20, options[key]);
                break;
        }
        i++;
    }
};
Drawing.drawActionButtons = function() {
    for (var i = 0; i < actionButtons.length; i++) {
        Drawing.drawSprite('menu', i,15, (height-4)+i);
        Drawing.drawSprite('inventory', 0, 15, (height - 4) + i);
    }
};

Drawing.drawCredits = function() {
    ctx.fillStyle = '#394046';
    ctx.fillRect(0, 0, c.width, c.height);
    Drawing.drawTitle('CREDITS');
    Drawing.drawBackButton();

    for (var i=0; i<credits.length; i++) {
        ctx.font = '40px TS4F';
        ctx.fillStyle = 'white';

        ctx.fillText(credits[i].name, c.width*0.2, c.height*0.3 + (i*80));

        ctx.font = '24px TS4F';
        ctx.fillStyle = '#365ec4';

        if (i == selectedMenuItem) {
            ctx.fillStyle = '#80a0fe';
        }

        ctx.fillText(credits[i].link, c.width*0.2, c.height*0.3 + (i*80) + 30);
    }
};



Drawing.drawAlert = function() {
    // draw background for ligthbox-like alert window
   // ctx.fillStyle = '#39404655';
   // ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = '#515b63';

    ctx.fillRect(c.width*0.15, c.height*0.2, c.width*0.7, c.height*0.6);


// borders

// inner border
    ctx.strokeStyle = '#2f352e';



    // TOP BORDER

    ctx.beginPath();
    ctx.moveTo(c.width*0.15, c.height*0.2-1);
    ctx.lineTo(c.width*0.85+1, c.height*0.2-1);
    ctx.stroke();
    ctx.closePath();


    // BOTTOM BORDER

    ctx.beginPath();
    ctx.moveTo(c.width*0.15, c.height*0.8);
    ctx.lineTo(c.width*0.85, c.height*0.8);
    ctx.stroke();
    ctx.closePath();


    // LEFT BORDER
    ctx.beginPath();
    ctx.moveTo(c.width*0.15-1, c.height*0.2);
    ctx.lineTo(c.width*0.15-1, c.height*0.8+1);
    ctx.stroke();
    ctx.closePath();

    // RIGHT BORDER
    ctx.beginPath();
    ctx.moveTo(c.width*0.85+1, c.height*0.2);
    ctx.lineTo(c.width*0.85+1, c.height*0.8+2);
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = '#252a25';


    // TOP BORDER
    ctx.beginPath();
    ctx.moveTo(c.width*0.15+2, c.height*0.2-2);
    ctx.lineTo(c.width*0.85+2, c.height*0.2-2);
    ctx.stroke();
    ctx.closePath();

    // BOTTOM BORDER


    ctx.beginPath();
    ctx.moveTo((c.width*0.15)+2, c.height*0.8+2);
    ctx.lineTo((c.width*0.85), c.height*0.8+2);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = 'white';

    // DRAW TITLE
    ctx.font = '48px TS4F';

    var boxWidth = c.width *0.7;

    ctx.fillText(currentAlert.title, (c.width - ctx.measureText(currentAlert.title).width) / 2, c.height*0.2 + 48);

    ctx.font = '28px TS4F';

    // TODO:

    // draw lines of text in alert

    var words = currentAlert.message.split(' ');
    var maxLineWidth = boxWidth * 0.8;

    var lines = [];

    var currentLine = '';
    for (var i =0; i < words.length; i++) {
        if (ctx.measureText(currentLine + words[i] + ' ').width < maxLineWidth) {
            currentLine += words[i] + ' ';
        } else {
            lines.push(currentLine);
            currentLine = words[i] + ' ';
        }
    }
    lines.push(currentLine);

    lines[lines.length-1] = lines[lines.length-1].substring(0, lines[lines.length - 1].length -1);

    var textTop = c.height * 0.2 + 96;

    for (var i=0; i < lines.length; i++) {
        // draw each line
        ctx.fillText(lines[i], (c.width - maxLineWidth) / 2, textTop + (i*36));
    }

    // first split by word

    // then check if lineWidth already exceeds 80% of box width

    // if so, start new line there




    // DRAW BUTTONS
    var buttonWidth = (c.width * 0.7) / currentAlert.buttons.length;
    var buttonHeight = 80;
    ctx.font = '36px TS4F';

    for (var i=0; i<currentAlert.buttons.length; i++) {
        ctx.fillStyle = '#434b52';
        if (i == selectedMenuItem) {
                    ctx.fillStyle = '#515b63';
        }
        ctx.fillRect(c.width*0.15 + (i*buttonWidth), c.height*0.8 - buttonHeight, buttonWidth, buttonHeight);
        ctx.fillStyle = 'white';
        Util.log('drawing text at x ' + (c.width*0.15 + (i*buttonWidth) + 10) + ' y ' + (c.height*0.8 - 10));
        ctx.fillText(currentAlert.buttons[i].title,c.width*0.15 + (i*buttonWidth) + (buttonWidth - ctx.measureText(currentAlert.buttons[i].title).width)/2, c.height*0.8 - (buttonHeight/2 - 18));

    }


}

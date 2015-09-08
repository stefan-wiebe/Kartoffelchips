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

    if (Mouse.isInToolBox() || Mouse.isInActionButtonArea()) {
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

Drawing.drawToolTip = function(x, y, text, xAlign, yAlign) {
    var backgroundColor = 'rgba(81, 91, 99, 0.8)';
    var textColor = 'white';
    var padding = 5;
    ctx.font = "14px Courier New";
    var width = ctx.measureText(text).width + 2 * padding;
    var height = 14 + 2 * padding;
    if (xAlign == "center") {
        x -= width / 2;
    } else if (xAlign == "right") {
        x -= width;
    }
    if (yAlign == "center") {
        y-= height / 2;
    } else if (yAlign == "bottom") {
        y -= height;
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
    ctx.textBaseline = "top";
    ctx.fillStyle = textColor;
    ctx.fillText(text, x + padding, y + padding);
    ctx.textBaseline = "alphabetic";
}

Drawing.drawToolTipForToolBoxTool = function() {
    if (Mouse.isInToolBox()) {
        Drawing.drawToolTip(mouseX * spriteSize - 5, mouseY * spriteSize + spriteSize / 2, translations[toolsByType[mouseY - 1].toUpperCase()], "right", "center");
    }
}

Drawing.drawToolTipForActionButton = function() {
    if (Mouse.isInActionButtonArea()) {
        Drawing.drawToolTip(mouseX * spriteSize - 5, mouseY * spriteSize + spriteSize / 2, translations[actionButtons[mouseY - (height - 4)].title.toUpperCase()], "right", "center");
    }
}

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
    for (var i = 0; i < predefinedBlocksByType[Emitter.prototype.toString()].length; i++) {
        var emitter = predefinedBlocksByType[Emitter.prototype.toString()][i];
        Util.log('drawing laser beam from' + emitter.toString());
        Drawing.drawLaserBeamFromObject(emitter);
    }
};

Drawing.fillAlphaOfBlocks = function() {
	for (var i = 0; i < blocks.length; i++) {
		fillAlphaOfTool(block);
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
            drawFromInterfacesToCenter(block);
        } else if (blockName == "Receiver") {
            ctx.fillStyle = block.color;
            ctx.fillRect(startX + 18, startY + 18, 30, 30);

            drawFromInterfacesToCenter(block);
        } else if (blockName == "Activator") {
            ctx.fillStyle = block.color;
            ctx.fillRect(startX, startY, spriteSize / 2 - 1, spriteSize / 2 - 1);
            ctx.fillRect(halfX + 1, startY, spriteSize / 2 - 1, spriteSize / 2 - 1);
            ctx.fillRect(startX, halfY + 1, spriteSize / 2 - 1, spriteSize / 2 - 1);
            ctx.fillRect(halfX + 1, halfY + 1, spriteSize / 2 - 1, spriteSize / 2 - 1);
        } else if (blockName == "Mirror") {
            drawFromInterfacesToCenter(block, true);
        } else if (blockName == "Prism") {
            drawFromInterfacesToCenter(block);
        } else if (blockName == "PortalInput" || blockName == "PortalOutput") {
            drawFromInterfacesToCenter(block);
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
    //rotation = (rotation + 2) % 4;

    var block = map[x][y].block;

    if (block == undefined && selectedTool != -1 && tools[selectedTool].x === x && tools[selectedTool].y === y) {
        block = tools[selectedTool];
    }

    if (block != undefined && block.isPlaced) {
		var blockName = block.toString();

        if (block.isPredefined == true) {
    		if (blockName == "Activator") {
                block.color = color;
    			block.isOn = true;
    		} else if (blockName == "Receiver") {
                result = false;

                if (rotation == (block.rotation + block.input.offset) % 4) {
                    block.input.isOn = true;
        			block.input.color = color;
                }
    		} else {
                result = false;
            }
        } else {
            result = false;

            if (block.toString() == "Mirror") {
                for (var i = 0; i < block.interfaces.length; i++) {
                    // if (rotation == i && block.interfaces[i].isOn == false) {
                    if (rotation == i) {
                        block.isOn = true;
                        block.interfaces[i].isOn = true;
                        block.interfaces[i].color = color;

                        // if (block.interfaces[block.getLinkedInterface(i)].isOn == false)
                        block.interfaces[block.getLinkedInterface(i)].isOn = true;
                        block.interfaces[block.getLinkedInterface(i)].color = color;

                        Drawing.drawLaserBeamFromPosition(x, y, block.getLinkedInterface(i), color);
                    }
                }
            } else if (block.toString() == "Prism") {
                var drawLaser = false;

                for (var i = 0; i < block.inputs.length; i++) {
                    // if (rotation == (block.rotation + block.inputs[i].offset) % 4 && block.inputs[i].isOn == false) {
                    if (rotation == (block.rotation + block.inputs[i].offset) % 4) {
                        block.isOn = true;
                        block.inputs[i].isOn = true;
                        block.inputs[i].color = color;
                        drawLaser = true;
                    }
                }

                if (drawLaser) {
                    if (block.inputs[0].isOn && block.inputs[1].isOn) {
                       block.output.isOn = true;
                       block.output.color = mixColors(block.inputs[0].color, block.inputs[1].color);
                    } else if (block.inputs[0].isOn && !block.inputs[1].isOn) {
                        block.output.isOn = true;
                        block.output.color = block.inputs[0].color;
                    } else if (block.inputs[1].isOn) {
                        block.output.isOn = true;
                        block.output.color = block.inputs[1].color;
                    }

                    Drawing.drawLaserBeamFromPosition(block.x, block.y, block.rotation, block.output.color);
                }
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

Drawing.drawPortalOutputs = function() {
    // if (toolsByType[PortalOutput.prototype.toString()] != undefined) {
    //     for (var i = 0; i < toolsByType[PortalOutput.prototype.toString()].length; i++) {
    //         var block = toolsByType[PortalOutput.prototype.toString()][i];
    //
    //         if (portalInputs[block.color] != undefined) {
    //             block.output.color = portalInputs[block.color].input.color;
    //             // console.log("block.output.color = portalInputs[block.color].input.color");
    //             // console.log(block.output.color + " = " + portalInputs[block.color].input.color);
    //             block.output.isOn = portalInputs[block.color].input.isOn;
    //             // console.log("block.output.isOn = portalInputs[block.color].input.isOn");
    //             // console.log(block.output.isOn + " = " + portalInputs[block.color].input.isOn);
    //
    //             if (block.isPlaced && block.output.isOn) {
    //                 block.isOn = true;
    //                 Drawing.drawLaserBeamFromPosition(block.x, block.y, block.rotation, block.output.color);
    //             }
    //         }
    //     }
    // }

    if (toolsByType[PortalOutput.prototype.toString()] != undefined) {
        for (var i = 0; i < toolsByType[PortalOutput.prototype.toString()].length; i++) {
            block = toolsByType[PortalOutput.prototype.toString()][i];

            // console.log(i + ": isPlaced = " + block.isPlaced + ", isOn = " + block.output.isOn);
            if (block.isPlaced && block.output.isOn) {
                block.isOn = true;
                Drawing.drawLaserBeamFromPosition(block.x, block.y, block.rotation, block.output.color);
            }
        }
    }
}

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
                Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, obj.x, i);
            }

            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, obj.x, i);
                i--;
            }
            break;
        case 1:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, i, obj.y);
            }

            i++;
            while (i < width && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, i, obj.y);
                i++;
                Util.log('drawing laser at ' + i + ' ' + obj.y + ' beaming is ' + beaming);
            }
            break;
        case 2:
            var i = obj.y;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(obj.rotation, (obj.rotation + 2) % 4, obj.x, i);
            }

            i++;
            while (i < height && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, obj.x, i);
                i++;
            }
            break;
        case 3:
            var i = obj.x;
            beaming = true;
            if (obj.toString() != "Mirror") {
                Drawing.drawLaserBeamInCell(obj.rotation, (obj.rotation + 2) % 4, i, obj.y);
            }

            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (obj.rotation + 2) % 4, i, obj.y);
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
                beaming = Drawing.drawLaserBeamInCell(color, (rotation + 2) % 4, x, i);
                i--;
            }
            break;
        case 1:
            var i = x;
            beaming = true;
            i++;
            while (i < width && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (rotation + 2) % 4, i, y);
                i++;
                Util.log('drawing laser at ' + i + ' ' + y + ' beaming is ' + beaming);
            }
            break;
        case 2:
            var i = y;
            beaming = true;
            i++;
            while (i < height && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (rotation + 2) % 4, x, i);
                i++;
            }
            break;
        case 3:
            var i = x;
            beaming = true;
            i--;
            while (i > 0 && beaming) {
                beaming = Drawing.drawLaserBeamInCell(color, (rotation + 2) % 4, i, y);
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
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width - sprites['logo'].width) / 2, 200);
    ctx.fillStyle = 'white';
    ctx.font = '36px TS4F';
    var margin = 50;
    var fullLength = 0;
    for (var i = 0; i < menu.length; i++) {
        var textLength = ctx.measureText(translations[menu[i].title]).width * 1.1;
        fullLength = fullLength + textLength + margin;
    }
    var left = (c.width - fullLength) / 2;
    for (var i = 0; i < menu.length; i++) {
        ctx.fillStyle = 'white';
        if (i == selectedMenuItem) {
            ctx.fillStyle = Colors.MENU_HOVER;
        }
        Drawing.fillTextRotated(translations[menu[i].title], left, c.height * 0.68 + (i * 3), 5);
        ctx.fillStyle = Colors.TEXT_COLOR;
        left = left + ctx.measureText(translations[menu[i].title]).width * 1.1 + margin;
    }
};
Drawing.drawPointerLockWarning = function() {
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(sprites['logo'], (c.width - sprites['logo'].width) / 2, 200);
    ctx.fillStyle = 'white';
    ctx.font = '48px TS4F';
    Drawing.fillTextCentered(translations.LOCKWARN, c.height * 0.65);
};
Drawing.drawWinScreen = function() {
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = Colors.TEXT_COLOR;
    ctx.font = '48px TS4F';
    ctx.drawImage(sprites['wonPotato'], (c.width - sprites['wonPotato'].width) / 2, 200);
    Drawing.fillTextCentered(translations.WIN, c.height * 0.65);
        ctx.font = '36px TS4F';

    Drawing.fillTextCentered(translations.TIME + Util.getDateString(timerElapsed), c.height * 0.8);

};
// draw boolean
Drawing.drawBoolean = function(x, y, bool) {
    ctx.fillStyle = "white";
    var label = translations["OFF"];
    if (bool) {
        label = translations["ON"];
    }
    ctx.fillText(label, x, y);
};
// Draws slider for options
Drawing.drawSlider = function(x, y, width, height, number) {
    // first draw slider line
    Util.log('drawing line from ' + x + ' to ' + (x + width));
    var sliderWidth = 8;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2.5;
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
        ctx.fillStyle = Colors.MENU_HOVER;
    }
    ctx.fillText('<', 100, 100);
    ctx.font = oldFont;
    ctx.fillStyle = 'width';
}
Drawing.drawOptions = function() {
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    var i = 0;
    ctx.fillStyle = Colors.TEXT_COLOR;
    ctx.font = '36px TS4F';
    Drawing.drawTitle(translations.OPTIONS);
    Drawing.drawBackButton();
    for (var key in options) {
        ctx.fillStyle = Colors.TEXT_COLOR;
        if (selectedMenuItem == i) {
            ctx.fillStyle = Colors.MENU_HOVER;
        }
        ctx.fillText(translations[key.toUpperCase()], c.width * 0.2, (c.height * 0.3) + (i * 45));
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
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    Drawing.drawTitle(translations.CREDITS);
    Drawing.drawBackButton();

    for (var i=0; i<credits.length; i++) {
        ctx.font = '40px TS4F';
        ctx.fillStyle = Colors.TEXT_COLOR;

        credits[i].pos[0] = c.width * 0.2;
        credits[i].pos[1] = c.height * 0.3 + i * 80;
        credits[i].size[0] = ctx.measureText(credits[i].name).width;
        credits[i].size[1] = 30;

        ctx.fillText(credits[i].name, credits[i].pos[0], credits[i].pos[1]);

        ctx.font = '24px TS4F';
        ctx.fillStyle = Colors.CREDITS_LINK;

        if (i == selectedMenuItem) {
            ctx.fillStyle = Colors.CREDITS_HOVER;
        }

        ctx.fillText(credits[i].link, credits[i].pos[0], credits[i].pos[1] + credits[i].size[1]);
    }
};



Drawing.drawAlert = function() {
    // draw background for ligthbox-like alert window
   // ctx.fillStyle = '#39404655';
   // ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = Colors.ALERT_BACKGROUND;

    ctx.fillRect(c.width*0.15, c.height*0.2, c.width*0.7, c.height*0.6);


// borders

// inner border
    ctx.strokeStyle = Colors.ALERT_INNER_BORDER;



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

    ctx.strokeStyle = Colors.ALERT_OUTER_BORDER;


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

    ctx.font = '16px Open Sans';

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

    //Draw author
    ctx.textBaseline = "bottom";
    ctx.fillText(currentAlert.subtext, (c.width * 0.85) - ctx.measureText(currentAlert.subtext).width - 10, c.height * 0.7 - 10);
    ctx.textBaseline = "alphabetic";

    // DRAW BUTTONS
    var buttonWidth = (c.width * 0.7) / currentAlert.buttons.length;
    var buttonHeight = 80;
    ctx.font = '36px TS4F';

    for (var i=0; i<currentAlert.buttons.length; i++) {
        ctx.fillStyle = Colors.ALERT_BUTTON_BACKGORUND;
        if (i == selectedMenuItem) {

                    ctx.fillStyle = Colors.ALERT_HOVER
        }
        ctx.fillRect(c.width*0.15 + (i*buttonWidth), c.height*0.8 - buttonHeight, buttonWidth, buttonHeight);
        ctx.fillStyle = Colors.TEXT_COLOR;
        Util.log('drawing text at x ' + (c.width*0.15 + (i*buttonWidth) + 10) + ' y ' + (c.height*0.8 - 10));
        ctx.fillText(currentAlert.buttons[i].title,c.width*0.15 + (i*buttonWidth) + (buttonWidth - ctx.measureText(currentAlert.buttons[i].title).width)/2, c.height*0.8 - (buttonHeight/2 - 18));

    }


}

Drawing.drawFPS = function () {
	if(!lastCalledTime) {
 		lastCalledTime = Date.now();
 		fps = 0;
		}
		delta = (new Date().getTime() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		fps = parseInt (1/delta);

		if (new Date().getTime() >= lastFpsDraw + 1000) {
			lastShownFps = fps;
			lastFpsDraw = Date.now();
		}

		if (options.showFPS == true) {
			ctx.fillStyle = gameState == GameState.IS_PLAYING ? '#394046' : 'white';
			ctx.font = "bold "+(36)+"px Open Sans";
			ctx.fillText(lastShownFps, c.width - ctx.measureText(fps).width - 5, 32);
		}
};

Drawing.drawLegend = function() {
    ctx.fillStyle = Colors.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, c.width, c.height);
    Drawing.drawTitle(translations.LEGEND);
    Drawing.drawBackButton();

    for (var i=0; i<allTypes.length; i++) {
        Drawing.drawSprite(allTypes[i].toString(), 0, 1, i+3);
        ctx.fillStyle = Colors.TEXT_COLOR;
    ctx.font = '36px TS4F';

        ctx.fillText(translations[allTypes[i].toString().toUpperCase()], 140, ((i+4)*64) - 18);
            ctx.font = '16px Open Sans';
var key = allTypes[i].toString().toUpperCase() + "_DESCRIPTION";
        ctx.fillText(translations[key],140, ((i+4)*64) + 7);


    }

};

debug = false;
function Drawing() {}
Drawing.drawBoard = function () {
	for (var x = 0; x < map.length; x++) {
		for (var y = 0; y <map[x].length; y++) {
			Drawing.drawSprite('map', map[x][y], x, y);
		}
	}
};
Drawing.drawSprite = function(spriteName, spriteIndex, x, y) {
	spriteName = spriteName.toLowerCase();
	if (sprites[spriteName]) {
	ctx.drawImage(sprites[spriteName], spriteIndex * spriteSize,0, spriteSize, spriteSize, x*spriteSize, y*spriteSize, 64, 64);
	}
	if (debug) {
		if (spriteName != 'map') {
		ctx.font = '10px Arial';
		ctx.fillStyle = 'red';
		ctx.fillText(spriteName + ' [' + spriteIndex + ']', (spriteSize*x) + 5, (spriteSize*y) + 10);
		ctx.font = '20px Arial';

		ctx.fillText(spriteIndex, (spriteSize*x) + 5, (spriteSize*y) + 20);
		ctx.fillText(spriteIndex * spriteSize, (spriteSize*x) + 5, (spriteSize*y) + 40);
}
	}
};
Drawing.drawMouse = function() {
	ctx.fillStyle = "rgba(0,255,0,0.5)";
	if (blockExistsAt(mouseX, mouseY)) {
	ctx.fillStyle = "rgba(255,0,0,0.5)";

	}
	ctx.fillRect(mouseX * spriteSize, mouseY * spriteSize, spriteSize, spriteSize);
};
Drawing.drawPredefinedBlocks = function() {
	for (var i=0; i<predefinedBlocks.length; i++) {
		var block = predefinedBlocks[i];
		var blockType = block.toString();
		blockType = blockType.toLowerCase();
		var boolN = block.isOn ? 4 : 0;
		var index = boolN;
		if (block.hasOwnProperty('rotation')) {
			Util.log('rotation is ' + block.rotation);
			index = block.rotation + boolN;
		};
		Util.log('index is ' + index);

			Drawing.drawSprite(blockType, index, block.x, block.y);
		}
};
Drawing.drawLaserBeam = function() {

	for (var i=0; i<predefinedBlocks.length; i++) {
		var emitter = predefinedBlocks[i];
			Util.log('drawing laser beam from' + emitter.toString());

		if (emitter.toString() == "Emitter") {
			Drawing.drawLaserBeamFromObject(emitter);
		}
	}

};

Drawing.drawLaserBeamInCell = function(color,rotation, x, y) {
    var result = true;
	 Util.log('Drawing laser beam in cell ' + x + ', ' +y + 'with rotation of ' + (rotation*90) + ' degrees');
	switch (map[x][y]) {
		case Tiles.CLEAR:
			ctx.strokeStyle = 'red';
			ctx.strokeWidth = 4;
			ctx.beginPath();
			switch (rotation) {
				case 0:
					ctx.moveTo((x*spriteSize) + spriteSize/2, y*spriteSize + spriteSize);
					ctx.lineTo((x*spriteSize) + spriteSize/2, y*spriteSize);
					break;
				case 1:
					ctx.moveTo(x*spriteSize, y*spriteSize + spriteSize/2);
					ctx.lineTo(x*spriteSize + spriteSize,  y*spriteSize + spriteSize/2);	
					break;
				case 2:
					ctx.moveTo((x*spriteSize) + spriteSize/2, y*spriteSize);
					ctx.lineTo((x*spriteSize) + spriteSize/2, y*spriteSize + spriteSize);
					break;
				case 3:
					ctx.moveTo(x*spriteSize + spriteSize,  y*spriteSize + spriteSize/2);
					ctx.lineTo(x*spriteSize, y*spriteSize + spriteSize/2);
					break;
			}
			ctx.stroke();
            result = true;
			break;
        default:
            result = false;
            break;
	}
    var i = 0;
    while (i < predefinedBlocks.length && result) {
        if (predefinedBlocks[i].x == x && predefinedBlocks[i].y == y) {
            result = false;
        }
        i++;
    }
	i = 0;
    while (i < tools.length && result) {
        if (tools[i].isPlaced && tools[i].x == x && tools[i].y == y && tools[i].toString() != "Activator") {
            result = false;
        }
        i++;
    }
    return result;
};

Drawing.drawToolbox = function() {
	toolsByType = [];
			Util.log('drawing toolbox');

	for (var i=0; i<tools.length; i++) {
		if (toolsByType[tools[i].toString()] === undefined) {
			toolsByType.push(tools[i].toString());
			toolsByType[tools[i].toString()] = new Array();
			Util.log('creating new index');
		}
		Util.log('adding tool no ' + i + ' to ' + tools[i].toString() + 's') 
		toolsByType[tools[i].toString()].push(tools[i]);
	}

	for (var i=0; i<toolsByType.length; i++) {
		Util.log('Drawing ' + toolsByType[i].toString() + ' at ' + (i+1));
		Drawing.drawSprite(toolsByType[i].toString(), 0, 15, (i+1));
	}
};

Drawing.drawLaserBeamFromObject = function(obj) {
	Util.log('drawing laser beam from ' + obj.toString());
	switch (obj.toString()) {
		case "Emitter":
			// draw to next object
			var nextX = 0;
			var nextY = 0;
			switch (obj.rotation) {
				case 0:
                    var i = obj.y;
                    beaming = true;
                    Drawing.drawLaserBeamInCell('red', obj.rotation, obj.x, i);
                    i--;
                    while (i > 0 && beaming) {
                        beaming = Drawing.drawLaserBeamInCell('red', obj.rotation, obj.x, i);
                        i--;
                    }
					break;
				case 1:
                    var i = obj.x;
                    beaming = true;
                    Drawing.drawLaserBeamInCell('red', obj.rotation, i, obj.y);
                    i++;
                    while (i < width && beaming) {
                        beaming = Drawing.drawLaserBeamInCell('red', obj.rotation, i, obj.y);
                        i++;
                        console.log('drawing laser at ' + i + ' ' + obj.y + ' beaming is ' + beaming);
                    }
					break;
				case 2:
                    var i = obj.y;
                    beaming = true;
                    Drawing.drawLaserBeamInCell('red', obj.rotation, obj.x, i);
                    i++;
                    while (i < height && beaming) {
                        beaming = Drawing.drawLaserBeamInCell('red', obj.rotation, obj.x, i);
                        i++;
                    }
					break;
				case 3:
                    var i = obj.x;
                    beaming = true;
                    Drawing.drawLaserBeamInCell('red', obj.rotation, i, obj.y);
                    i--;
                    while (i > 0 && beaming) {
                        beaming = Drawing.drawLaserBeamInCell('red', obj.rotation, i, obj.y);
                        i--;
                    }
					break;
			}
			break;
	}
		
}
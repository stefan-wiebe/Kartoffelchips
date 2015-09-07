function rotateTool(tool, value) {
	if(tool != undefined && !tool.isPredefined) {
		value = (!value) ? 1 : value;
		if (value < 0) {
			var rotation = value;

			while (tool.rotation + rotation < 0) {
				rotation += 4;
			}

			tool.rotation += rotation;
		} else if (value > 0) {
			tool.rotation = (tool.rotation + value) % 4;
		}

		console.log('rotation is' + tool.rotation);
	}
}

function placeBlock(block, x, y) {
	x = (x == undefined) ? block.x : x;
	y = (y == undefined) ? block.y : y;

	block.x = x;
	block.y = y;
	block.isPlaced = true;

	map[x][y].block = block;
}

function unplaceBlock(block, moveBack) {
	if (block != undefined && block.isPredefined != true) {
		map[block.x][block.y].block = undefined;
		if (moveBack != false) {
			pos = getToolPosInToolBox(block);
			block.x = pos[0];
			block.y = pos[1];
			block.rotation = 0;
			block.isOn = false;
			block.isPlaced = false;
		}
	}
}

function drawFromInterfacesToCenter(block, ignoreRotation) {
	interfaces = [];

	if (block.interfaces == undefined) {
		if (block.inputs != undefined) {
			interfaces = interfaces.concat(block.inputs);
		} else if (block.input != undefined) {
			interfaces.push(block.input);
		}

		if (block.outputs != undefined) {
			interfaces = interfaces.concat(block.outputs);
		} else if (block.output != undefined) {
			interfaces.push(block.output);
		}
	} else {
		interfaces = block.interfaces;
	}

	for (var i = 0; i < interfaces.length; i++) {
		if (interfaces[i].isOn) {
			ctx.beginPath();
			ctx.strokeStyle = interfaces[i].color;
			var condition;

			if (ignoreRotation == true) {
				condition = (i + interfaces[i].offset) % 4;
			} else {
				condition = (block.rotation + interfaces[i].offset) % 4;
			}

			switch (condition) {
				case 0:
					ctx.moveTo((block.x + 0.5) * spriteSize, (block.y + 0.5) * spriteSize);
					ctx.lineTo((block.x + 0.5) * spriteSize, block.y * spriteSize);
					break;
				case 1:
					ctx.moveTo((block.x + 0.5) * spriteSize, (block.y + 0.5) * spriteSize);
					ctx.lineTo((block.x + 1) * spriteSize, (block.y + 0.5) * spriteSize);
					break;
				case 2:
					ctx.moveTo((block.x + 0.5) * spriteSize, (block.y + 0.5) * spriteSize);
					ctx.lineTo((block.x + 0.5) * spriteSize, (block.y + 1) * spriteSize);
					break;
				case 3:
					ctx.moveTo((block.x + 0.5) * spriteSize, (block.y + 0.5) * spriteSize);
					ctx.lineTo(block.x * spriteSize, (block.y + 0.5) * spriteSize);
					break;
			}

			ctx.stroke();
			ctx.closePath();
		}
	}
}

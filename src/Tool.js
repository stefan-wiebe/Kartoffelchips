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

	placedBlocks[x][y] = block;
}

function unplaceBlock(block) {
	if (block != undefined) {
		placedBlocks[block.x][block.y] = undefined;
		block.x = 0;
		block.y = 0;
		block.rotation = 0;
		block.isOn = false;
		block.isPlaced = false;
	}
}

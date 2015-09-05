function getToolFromToolbox(tool) {
	if (typeof tool === "number") {
		tool = toolsByType[tool];
	}

	if (tool != undefined && typeof tool === "string") {
		i = 0;
		while (i < toolsByType[tool].length && toolsByType[tool][i].isPlaced == true) {
			i++;
		}

		if (!toolsByType[tool][i].isPlaced) {
			return tools.indexOf(toolsByType[tool][i]);
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function getToolPosInToolBox(tool) {
	if (typeof tool == "object") {
		pos = [width - 1, toolsByType.indexOf(tool.toString()) + 1];
		return pos;
	} else {
		return false;
	}

}

function initToolBox() {
	toolsByType = [];
    for (var i = 0; i < tools.length; i++) {
        if (toolsByType[tools[i].toString()] === undefined) {
            toolsByType.push(tools[i].toString());
            toolsByType[tools[i].toString()] = new Array();
            Util.log('Creating new index');
        }

        Util.log('Adding tool no ' + i + ' to ' + tools[i].toString() + 's')
        toolsByType[tools[i].toString()].push(tools[i]);

		pos = getToolPosInToolBox(tools[i]);
		tools[i].x = pos[0];
		tools[i].y = pos[1];
    }
}

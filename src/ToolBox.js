function getToolFromToolbox(tool) {
	if (typeof tool === "number") {
		tool = toolsByType[tool];
	}
	
	if (tool != undefined && typeof tool === "number" || typeof tool === "string") {
		i = 0;
		while (i < toolsByType[tool].length && toolsByType[tool][i].isPlaced == true) {
			i++;
		}

		return tools.indexOf(toolsByType[tool][i])
	} else {
		return false;
	}
}

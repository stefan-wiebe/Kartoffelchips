var fps = 30;	//FPS Limit
var g;			//Graphics Interface zu Canvas Element
var c;			//Canvas Element

function initGame() {
	c = document.getElementById('gameCanvas');
	g = c.getContext("2d");
	setInterval(function() {
		update();
		draw();
	}, 1000/fps);
}

function update() {
	
}

function draw() {
	g.fillStyle = '#FFFFFF';
	g.fillRect(0, 0, c.width, c.height);
}
var Mouse = function () {
	c.addEventListener('click', Mouse.click);
	c.addEventListener('mousemove', Mouse.move);
};
Mouse.click = function() {
	

};

Mouse.move = function(e) {
	var relativeXPosition = (e.pageX - c.offsetLeft);
    var relativeYPosition = (e.pageY - c.offsetTop);

    var x = Math.floor(relativeXPosition/spriteSize);
    var y = Math.floor(relativeYPosition/spriteSize);

    console.log('X: ' + x + ' Y: ' + y);
    mouseX = x;
    mouseY = y;
};


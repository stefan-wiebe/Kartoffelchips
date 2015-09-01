var ctx;			//Graphics Interface zu Canvas Element
var c;			//Canvas Element
var sprites = [];
var spriteSize = 64;
var width = 16;
var height = 12;
var level;
var map = [];
var tools = [];
var predefinedBlocks = [];
var mouseX = 0;
var mouseY = 0;



function initGame() {
    for(var i=0;i<16;i++){
        map[i] = [];
    }
    
    
	c = document.getElementById('game');
	ctx = c.getContext("2d");

	loadSprite('emitter');
	loadSprite('map');
	loadSprite('prism');
	loadSprite('receiver');
  loadSprite('inventory');
  var mHandler = new Mouse();
	requestAnimationFrame(tick);

}

function loadSprite(spriteName) {
	var newSprite = new Image();
	newSprite.src = 'textures/' + spriteName + '.png';
	sprites[spriteName] = newSprite;
	
}

function tick() {
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0, 0, c.width, c.height);
	Drawing.drawBoard();
	Drawing.drawLaserBeam();
	Drawing.drawPredefinedBlocks();
  Drawing.drawMouse();
	Drawing.drawToolbox();
	requestAnimationFrame(tick);
}

function blockExistsAt(x, y) {
	var blockFound = false;
	var i = 0;
	while (i < predefinedBlocks.length && !blockFound) {
		blockFound = predefinedBlocks[i].x == x && predefinedBlocks[i].y == y;
		i++;
	}
	i = 0;
	while (i < tools.length && !blockFound) {
		blockFound = tools[i].isPlaced && tools[i].x == x && tools[i].y == y;
		i++;
	}
	return blockFound;
}

function loadLevel(id) {
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange=function() {
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        var lines = xmlhttp.responseText.match(/[^\r\n]+/g);
        for (var i=1; i<lines.length; i++) {
			var firstChar = lines[i].charAt(0);
			Util.log('first char is ' + firstChar  + ' and we still have ' + lines.length + ' lines and i is ' + i);
            if(firstChar == "#"){
                for (var j=0; j<lines[i].length; j++) {
                	if (lines[i].charAt(j) == "#") {
                		switch (i) {
                			// FIRST LINE
                			case 1:
                				switch (j) {
                					case 0:
                						map[j][i-1] = TILES.CORNER_LEFT_TOP;
                						break;
                					case 15:
										map[j][i-1] = TILES.CORNER_RIGHT_TOP;
										break;
									default:
										map[j][i-1] = TILES.BORDER_TOP;
										break;
                				}
                				break;
                			// LAST LINE
                			case 12:
                				switch (j) {
                					case 0:
                						map[j][i-1] = TILES.CORNER_LEFT_BOTTOM;
                						break;
                					case 15:
               						    map[j][i-1] = TILES.CORNER_RIGHT_BOTTOM;
               						    break;
               						default:
										map[j][i-1] = TILES.BORDER_BOTTOM;
										break;
               					}
               					break;
               				// EVERYTHING ELSE
               				default:
               					switch(j) {
               						case 0:
               							map[j][i-1] = TILES.BORDER_LEFT;
               							break;
               						case 15:
               							map[j][i-1] = TILES.BORDER_RIGHT;
               							break;
               						default:
               							map[j][i-1] = TILES.FULL;
               							break;
               					}
                				break;
                		}
                	} else {
                		map[j][i-1] = TILES.CLEAR;
                	}
                }
            }
            if(firstChar == "L") {
                var emitter = new Emitter();
                var split = lines[i].split(" ");
                emitter.x = parseInt(split[1]);
                emitter.y = parseInt(split[2]);
                emitter.color = parseInt(split[3]);
                emitter.rotation = parseInt(split[4]);
				predefinedBlocks.push(emitter);
            }
            if(firstChar == "X") {
                var receiver = new Receiver();
                var split = lines[i].split(" ");
                receiver.x = parseInt(split[1]);
                receiver.y = parseInt(split[2]);
                receiver.color = parseInt(split[3]);
                receiver.rotation = parseInt(split[4]);
				predefinedBlocks.push(receiver);
            }
            if(firstChar == "A") {
                var activator = new Activator();
                var split = lines[i].split(" ");
                activator.x = parseInt(split[1]);
                activator.y = parseInt(split[2]);
				predefinedBlocks.push(activator);
            }
            if(firstChar == "M") {
                var split = lines[i].split(" ");
                var count = parseInt(split[1]);
                for(var k = 0;k<count;k++){
                    var mirror = new Mirror();
                    tools.push(mirror);
                }
                
            }
            if(firstChar == "P") {
                var split = lines[i].split(" ");
                var count = parseInt(split[1]);
                for(var k = 0;k<count;k++){
                    var prism = new Prism();
                    tools.push(prism);
                }
            }    
        }
		Util.log('level parsed');

	}
}
xmlhttp.overrideMimeType('text/plain');
xmlhttp.open("GET",'levels/level' + id + '.txt',true);
xmlhttp.send();
}


var ctx; //Graphics Interface zu Canvas Element
var c; //Canvas Element
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
var selectedTool = -1;
var fullMouseX = 0;
var fullMouseY = 0;
var selectedMenuItem = -1;
var gameState;
var backButtonHover = false;
var currentAlert;

var menu = [
{
    title: "START GAME",
    action: startGame
},
{
    title: "OPTIONS",
    action: showOptions
},
{
    title: "CREDITS",
    action: showCredits
}
];

var actionBlocks = [
{
title: 'resetLevel',
  action: resetLevel
},
{
    title: 'helpButton',
    action: showHelpMessage

},
{
    title: 'backToMenu',
    action: backToMenu
}
];

var credits = [
    {
        name: 'Dejan Brinker',
        link: 'https://github.com/Dede98'
    },
    {
        name: 'Timon Ringwald',
        link: 'http://tordarus.net'
    },
    {
        name: 'Tobias Timpe',
        link: 'http://tobias.tim.pe',
    },
    {
        name: 'Stefan Wiebe',
        link: 'http://5tefan.net'
    }
];



function initGame() {
    if (checkBrowserCompatibility) {

    for (var i = 0; i < 16; i++) {
        map[i] = [];
    }
    c = document.getElementById('game');
    ctx = c.getContext("2d");
    loadSprite('emitter');
    loadSprite('map');
    loadSprite('prism');
    loadSprite('receiver');
    loadSprite('inventory');
    loadSprite('mirror');
    loadSprite('activator');
    loadSprite('mouse');
    loadSprite('logo');
    loadSprite('rottenPotato');
    loadSprite('wonPotato');
    loadSprite('portalinput');
    loadSprite('portaloutput');

    gameState = GameState.IN_MENU;
    var mHandler = new Mouse();

    requestAnimationFrame(tick);
} else {
    document.body.innerHTML = '<h1>This browser is not supported. Please upgrade!</h1>';
}
}

function startGame() {
  loadLevel(1);
}
function showOptions() {
    selectedMenuItem = -1;
    gameState = GameState.IN_OPTIONS;
}

function showCredits() {
    selectedMenuItem = -1;
    gameState = GameState.IN_CREDITS;
}


function checkWin() {
    if (hasWon()) {
        gameState = GameState.HAS_WON;
    }
}
function hasWon () {
     if (gameState == GameState.IS_PLAYING && selectedTool == -1) {
    for (var i =0; i<predefinedBlocks.length; i++) {
        if (predefinedBlocks[i].toString() == "Activator" || predefinedBlocks[i].toString() == "Receiver") {
            if (predefinedBlocks[i].isOn == false) {
                return false;
            }
        }
    }
    return true;
}
}

function resetLevel() {
    for (obj in tools) {
        obj.x = 0;
        obj.y = 0;
        obj.isPlaced = 0;
        obj.rotation = 0;
    }
}
function backToMenu() {
    level = null;
    predefinedBlocks = [];
    tools = [];
}
function showHelpMessage() {

}

function checkBrowserCompatibility() {
if (!!('onpointerlockchange' in document || 'onmozpointerlockchange' in document || 'onwebkitpointerlockchange' in document)) {
    return false;
}
if (!!window.HTMLCanvasElement) {
    return false;
}
return true;
}

function lockMouse() {
  c.requestPointerLock = c.requestPointerLock ||
           c.mozRequestPointerLock ||
           c.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
         document.mozExitPointerLock ||
         document.webkitExitPointerLock;
    c.requestPointerLock();
}

function loadSprite(spriteName) {
    var newSprite = new Image();
    newSprite.src = 'textures/' + spriteName + '.png';
    sprites[spriteName] = newSprite;
}

function showAlert(message, title, buttons) {
    currentAlert = new Alert();
    currentAlert.message = message;
    currentAlert.title = title;
    currentAlert.buttons = buttons;
}


function tick() {
    // CLEAR CANVAS
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,c.width, c.height);
checkWin();

if(document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c || options.mouseDebug == true) {
      switch (gameState) {
        case GameState.IN_MENU:
            Drawing.drawMenuScreen();
        break;
        case GameState.IS_PLAYING:
            Drawing.drawBoard();
			Drawing.fillAlphaInCells();
            Drawing.drawPredefinedBlocks();
			Drawing.drawToolbox();
            Drawing.drawActionButtons();
<<<<<<< HEAD
		    turnOffAllElements();
=======
			disableAllElements();
>>>>>>> 781c5450e17ae709ecbcd9119a0b562ad8628d11
            Drawing.drawLaserBeam();
			Drawing.drawTools();
            Drawing.drawMouse();
            if (currentAlert) {
                Drawing.drawAlert();
            }
            break;
        case GameState.HAS_WON:
            Drawing.drawWinScreen();
            break;
        case GameState.IN_OPTIONS:
            Drawing.drawOptions();
            break;
        case GameState.IN_CREDITS:
            Drawing.drawCredits();
            break;
    }
} else {
    Drawing.drawPointerLockWarning();
}
    Drawing.drawCursor();
    requestAnimationFrame(tick);
}

<<<<<<< HEAD
function turnOffAllElements() {
=======
function disableAllElements() {
>>>>>>> 781c5450e17ae709ecbcd9119a0b562ad8628d11
	for (var i = 0; i < predefinedBlocks.length; i++) {
		if (predefinedBlocks[i].toString() != "Emitter") {
			predefinedBlocks[i].isOn = false
		}
	}
	for (var i = 0; i < tools.length; i++) {
		if (tools[i].toString() == "Mirror") {
			tools[i].isOn = false;
			tools[i].inputs[0].isOn = false;
			tools[i].inputs[1].isOn = false;
			tools[i].inputs[0].color = "";
			tools[i].inputs[1].color = "";
		} else if (tools[i].toString() == "Prism") {
			tools[i].inputs[0].isOn = false;
			tools[i].inputs[1].isOn = false;
			tools[i].inputs[0].color = "";
			tools[i].inputs[1].color = "";
		}
	}
}

function blockExistsAt(x, y, obj) {
    var blockFound = x > 0 && y > 0 && x < width && y < height && map[x][y] != Tiles.CLEAR;
    var i = 0;
    while (i < predefinedBlocks.length && !blockFound) {
        blockFound = predefinedBlocks[i].x == x && predefinedBlocks[i].y == y;
        i++;
    }
    i = 0;
    while (i < tools.length && !blockFound) {
        blockFound = tools[i].isPlaced && tools[i].x == x && tools[i].y == y && obj != undefined && obj != tools[i];
        i++;
    }
    return blockFound;
}


function getStringFromColor(color) {
	var colorString = '';
		switch (color) {
        		case 0:
        		colorString = '#ff0000';
        		break;
        		case 1:
        		colorString = '#00ff00';
        		break;
        		case 2:
        		colorString = '#0000ff';
        		break;
        	}
	return colorString;
};

function mixColors(color1, color2) {
	var r1 = parseInt(color1.substring(1, 3), 16);
	var g1 = parseInt(color1.substring(3, 5), 16);
	var b1 = parseInt(color1.substring(5, 7), 16);

	var r2 = parseInt(color2.substring(1, 3), 16);
	var g2 = parseInt(color2.substring(3, 5), 16);
	var b2 = parseInt(color2.substring(5, 7), 16);

	var r3 = parseInt((r1 + r2) / 2);
	var g3 = parseInt((g1 + g2) / 2);
	var b3 = parseInt((b1 + b2) / 2);

	var factor = 255 / Math.max(r3, g3, b3);

	r3 *= factor;
	g3 *= factor;
	b3 *= factor;

	return "#" + ("00" + r3.toString(16)).slice(-2) + ("00" + g3.toString(16)).slice(-2) + ("00" + b3.toString(16)).slice(-2);

}

function loadLevel(id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var lines = xmlhttp.responseText.match(/[^\r\n]+/g);
			predefinedBlocks = [];
			tools = [];
            for (var i = 1; i < lines.length; i++) {
                var firstChar = lines[i].charAt(0);
                Util.log('first char is ' + firstChar + ' and we still have ' + lines.length + ' lines and i is ' + i);
                if (firstChar == "#") {
                    for (var j = 0; j < lines[i].length; j++) {
                        if (lines[i].charAt(j) == "#") {
                            switch (i) {
                                // FIRST LINE
                                case 1:
                                    switch (j) {
                                        case 0:
                                            map[j][i - 1] = Tiles.CORNER_LEFT_TOP;
                                            break;
                                        case 15:
                                            map[j][i - 1] = Tiles.CORNER_RIGHT_TOP;
                                            break;
                                        default:
                                            map[j][i - 1] = Tiles.BORDER_TOP;
                                            break;
                                    }
                                    break;
                                    // LAST LINE
                                case 12:
                                    switch (j) {
                                        case 0:
                                            map[j][i - 1] = Tiles.CORNER_LEFT_BOTTOM;
                                            break;
                                        case 15:
                                            map[j][i - 1] = Tiles.CORNER_RIGHT_BOTTOM;
                                            break;
                                        default:
                                            map[j][i - 1] = Tiles.BORDER_BOTTOM;
                                            break;
                                    }
                                    break;
                                    // EVERYTHING ELSE
                                default:
                                    switch (j) {
                                        case 0:
                                            map[j][i - 1] = Tiles.BORDER_LEFT;
                                            break;
                                        case 15:
                                            map[j][i - 1] = Tiles.BORDER_RIGHT;
                                            break;
                                        default:
                                            map[j][i - 1] = Tiles.FULL;
                                            break;
                                    }
                                    break;
                            }
                        } else {
                            map[j][i - 1] = Tiles.CLEAR;
                        }
                    }
                }
                if (firstChar == "L") {
                    var emitter = new Emitter();
                    var split = lines[i].split(" ");
                    emitter.x = parseInt(split[1]);
                    emitter.y = parseInt(split[2]);
                    emitter.rotation = parseInt(split[3]);
					emitter.color = getStringFromColor(parseInt(split[4]));
                    predefinedBlocks.push(emitter);
                }
                if (firstChar == "X") {
                    var receiver = new Receiver();
                    var split = lines[i].split(" ");
                    receiver.x = parseInt(split[1]);
                    receiver.y = parseInt(split[2]);
                    receiver.rotation = parseInt(split[3]);
					receiver.color = split[4];
                    predefinedBlocks.push(receiver);
                }
                if (firstChar == "A") {
                    var activator = new Activator();
                    var split = lines[i].split(" ");
                    activator.x = parseInt(split[1]);
                    activator.y = parseInt(split[2]);
                    predefinedBlocks.push(activator);
                }
                if (firstChar == "M") {
                    var split = lines[i].split(" ");
                    var count = parseInt(split[1]);
                    for (var k = 0; k < count; k++) {
                        var mirror = new Mirror();
                        tools.push(mirror);
                    }
                }
				if (firstChar == "I") {
					var split = lines[i].split(" ");
					var count = parseInt(split[1]);
					for (var k = 0; k < count; k++) {
						var portalinput = new PortalInput();
						tools.push(portalinput);
					}
				}
				if (firstChar == "O") {
					var split = lines[i].split(" ");
					var count = parseInt(split[1]);
					for (var k = 0; k < count; k++) {
						var portaloutput = new PortalOutput();
						tools.push(portaloutput);
					}
				}
                if (firstChar == "P") {
                    var split = lines[i].split(" ");
                    var count = parseInt(split[1]);
                    for (var k = 0; k < count; k++) {
                        var prism = new Prism();
                        tools.push(prism);
                    }
                }
            }
            Util.log('level parsed');
                level = id;
                gameState = GameState.IS_PLAYING;

        }
    }
    xmlhttp.overrideMimeType('text/plain');
    xmlhttp.open("GET", 'levels/level' + id + '.txt', true);
    xmlhttp.send();
}

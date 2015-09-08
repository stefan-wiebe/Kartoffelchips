var ctx; //Graphics Interface zu Canvas Element
var c; //Canvas Element
var sprites = [];
var spriteSize = 64;
var width = 16;
var height = 12;
var levelID;
var level;
var map = [];
var tools = [];
var toolsByType = [];
var predefinedBlocks = [];
var predefinedBlocksByType = [];
var blocks = [];
var blocksByType = [];
var portalInputs = [];
var mouseX = 0;
var mouseY = 0;
var selectedTool = -1;
var fullMouseX = 0;
var fullMouseY = 0;
var selectedMenuItem = -1;
var gameState;
var backButtonHover = false;
var currentAlert;
var startTime = 0;
var timerRunning = false;
var timerElapsed = 0;
var lastCalledTime;
var fps;
var lastShownFps = 0;
var lastFpsDraw = Date.now();
var score = 0;

var menu = [{
    title: 'START_GAME',
    action: startGame
}, {
    title: 'OPTIONS',
    action: showOptions
},{
    title: 'LEGEND',
    action: showLegend
},
{
    title: 'CREDITS',
    action: showCredits
}];
var actionButtons = [new Button('resetLevel', resetLevel), new Button('helpButton', showHelpMessage), new Button('backToMenu', backToMenu)];
var allTypes = [new Emitter(), new Receiver(),new Mirror(), new Prism(), new Activator(), new PortalInput(), new PortalOutput()];
var credits = [{
    name: 'Dejan Brinker',
    link: 'https://github.com/Dede98',
    pos: [0, 0],
    size: [0, 0]
}, {
    name: 'Timon Ringwald',
    link: 'http://tordarus.net',
    pos: [0, 0],
    size: [0, 0]
}, {
    name: 'Tobias Timpe',
    link: 'http://tobias.tim.pe',
    pos: [0, 0],
    size: [0, 0]
}, {
    name: 'Stefan Wiebe',
    link: 'http://5tefan.net',
    pos: [0, 0],
    size: [0, 0]
}];

function initGame() {
    c = document.getElementById('game');
    if (checkBrowserCompatibility) {
        for (var i = 0; i < 16; i++) {
            map[i] = [];

            for (var j = 0; j < 12; j++) {
                map[i][j] = new Cell();
            }
        }

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
        loadSprite('menu');
        loadSound('select');
        loadSound('laser');
        sounds["laser"].loop = true; // <= Doesn't work.
        // SoundEffects.loop("laser");

        checkOptions();

        gameState = GameState.IN_MENU;
        var mHandler = new Mouse();
        var kHandler = new Keyboard();
        requestAnimationFrame(tick);
    } else {
        c.remove();
        document.body.appendChild("<h1>Dein Browser mag keine Kartoffelchips :(</h1>");
    }
}

function startTimer() {
    timerElapsed = 0;
    startTime = new Date().getTime() / 1000;
    timerRunning = true;
}
function stopTimer() {
    if (timerRunning) {
        timerRunning = false;
        timerElapsed = (new Date().getTime() / 1000) - startTime;
        score = Math.min(Math.floor(10000 / timerElapsed), 10000);
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


function showLegend() {
    selectedMenuItem = -1;
    gameState = GameState.IN_LEGEND;

};


function checkWin() {
    if (hasWon()) {
        gameState = GameState.HAS_WON;
        stopTimer();

    }
}

function hasWon() {
    pauseSounds();

    if (gameState == GameState.IS_PLAYING && selectedTool == -1) {
        for (var i = 0; i < predefinedBlocks.length; i++) {
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
    // TODO: Unplace all blocks
    // for (obj in tools) {
    //     obj.x = 0;
    //     obj.y = 0;
    //     obj.isPlaced = 0;
    //     obj.rotation = 0;
    // }
    // (We do all this anyway)
    loadLevel(levelID); //:D
}

function backToMenu() {
    pauseSounds();

    gameState = GameState.IN_MENU;
    level = null;
    levelID = null;
    predefinedBlocks.length = 0;
    tools.length = 0;
    blocks.length = 0;
}

function showHelpMessage() {
    showAlert(level.hint, level.name, [new Button('OKAY', dismissAlert)], translations["AUTHOR"] + ": " + level.author);
}


function dismissAlert() {
    currentAlert = null;
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
    c.requestPointerLock = c.requestPointerLock || c.mozRequestPointerLock || c.webkitRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    c.requestPointerLock();
}

function loadSprite(spriteName) {
    var newSprite = new Image();
    newSprite.src = 'textures/' + spriteName + '.png';
    sprites[spriteName] = newSprite;
}

function showAlert(message, title, buttons, subtext) {
    currentAlert = new Alert();
    currentAlert.message = message;
    currentAlert.title = title;
    currentAlert.buttons = buttons;
    currentAlert.subtext = subtext;
}

function tick() {
    // CLEAR CANVAS
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height);
    checkWin();
    if (document.pointerLockElement === c || document.mozPointerLockElement === c || document.webkitPointerLockElement === c || options.mouseDebug == true) {
        switch (gameState) {
            case GameState.IN_MENU:
                // SoundEffects.stopLaserSoundEffect();
                Drawing.drawMenuScreen();
                break;
            case GameState.IS_PLAYING:
                // SoundEffects.startLaserSoundEffect();
                Drawing.drawBoard();
                Drawing.drawPredefinedBlocks();
                disableAllElements();
                Drawing.drawLaserBeam();
                // F THIS Drawing.drawToolbar();
                Drawing.drawActionButtons();
                Drawing.drawPortalOutputs();
                Drawing.drawTools();
                Drawing.drawToolbox();
                Drawing.drawToolTipForToolBoxTool();
                Drawing.drawToolTipForActionButton();
                Drawing.drawMouse();

                laterUpdate();

                if (currentAlert) {
                    Drawing.drawAlert();
                }

                break;
            case GameState.HAS_WON:
                Drawing.drawWinScreen();
                // SoundEffects.stopLaserSoundEffect();

                break;
            case GameState.IN_OPTIONS:
                Drawing.drawOptions();
                break;
            case GameState.IN_CREDITS:
                Drawing.drawCredits();
                break;
            case GameState.IN_LEGEND:
                Drawing.drawLegend();
                break;
        }
    } else {
        Drawing.drawPointerLockWarning();
    }
    Drawing.drawCursor();
    Drawing.drawFPS();
    requestAnimationFrame(tick);
}

// function lateUpdate() {
//     for (var i = 0; i < blocks.length; i++) {
//         if (blocks[i].isPlaced) {
//             if (blocks[i].toString() == "Prism") {
//                 if (blocks[i].inputs[0].isOn && blocks[i].inputs[1].isOn) {
//                    blocks[i].output.isOn = true;
//                    blocks[i].output.color = mixColors(blocks[i].inputs[0].color, blocks[i].inputs[1].color);
//                 } else if (blocks[i].inputs[0].isOn && !blocks[i].inputs[1].isOn) {
//                     blocks[i].output.isOn = true;
//                     blocks[i].output.color = blocks[i].inputs[0].color;
//                 } else if (blocks[i].inputs[1].isOn) {
//                     blocks[i].output.isOn = true;
//                     blocks[i].output.color = blocks[i].inputs[1].color;
//                 }
//
//                 if (blocks[i].output.isOn) {
//                     Drawing.drawLaserBeamFromPosition(blocks[i].x, blocks[i].y, blocks[i].rotation, blocks[i].output.color);
//                 }
//             }
//         }
//     }
// }

function laterUpdate() {
    for (var i = 0; i < predefinedBlocks.length; i++) {
        if (predefinedBlocks[i].toString() == "Receiver") {
            if (predefinedBlocks[i].input.color == predefinedBlocks[i].color && predefinedBlocks[i].input.isOn == true) {
                predefinedBlocks[i].isOn = true;
            } else {
                predefinedBlocks[i].isOn = false;
            }
        }
    }
}

function disableAllElements() {
    for (var i = 0; i < predefinedBlocks.length; i++) {
        if (predefinedBlocks[i].toString() == "Receiver") {
            predefinedBlocks[i].input.isOn = false;
            predefinedBlocks[i].input.color = "";
        } else if (predefinedBlocks[i].toString() != "Emitter") {
            predefinedBlocks[i].isOn = false;
        }
    }

    for (var i = 0; i < tools.length; i++) {
        if (tools[i].toString() == "Mirror") {
            tools[i].isOn = false;
            for (var j = 0; j < tools[i].interfaces.length; j++) {
                tools[i].interfaces[j].isOn = false;
                tools[i].interfaces[j].color = "";
            }
        } else if (tools[i].toString() == "Prism") {
            for (var j = 0; j < tools[i].inputs.length; j++) {
                tools[i].inputs[j].isOn = false;
                tools[i].inputs[j].color = "";
            }
            tools[i].output.isOn = false;
            tools[i].output.color = "";
        } else if (tools[i].toString() == "PortalInput") {
            tools[i].isOn = false;
            tools[i].input.isOn = false;
            tools[i].input.color = "";
        } else if (tools[i].toString() == "PortalOutput") {
            tools[i].isOn = false;
        }
    }
}

function blockExistsAt(x, y, obj) {
    var blockFound = 0 <= x && 0 <= y && x < width && y < height && map[x][y].tile != Tiles.CLEAR;
    if (!blockFound) {
        blockFound = map[x][y].block != undefined && map[x][y].block != obj;
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
    color1 = Colors.parseFromString(color1);
    color2 = Colors.parseFromString(color2);
    var color3 = {r: 0, g: 0, b:0};
    color3.r = parseInt((color1.r + color2.r) / 2);
    color3.g = parseInt((color1.g + color2.g) / 2);
    color3.b = parseInt((color1.b + color2.b) / 2);
    var factor = 255 / Math.max(color3.r, color3.g, color3.b);
    color3.r *= factor;
    color3.g *= factor;
    color3.b *= factor;
    return "#" + ("00" + color3.r.toString(16)).slice(-2) + ("00" + color3.g.toString(16)).slice(-2) + ("00" + color3.b.toString(16)).slice(-2);
}

function loadLevel(id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var lines = xmlhttp.responseText.match(/[^\r\n]+/g);

            if (toolsByType[PortalOutput.prototype.toString()] != undefined) {
                for (var i = 0; i < toolsByType[PortalOutput.prototype.toString()].length; i++) {
                    toolsByType[PortalOutput.prototype.toString()][i].output.isOn = false;
                    delete toolsByType[PortalOutput.prototype.toString()][i].output;
                }
            }

            predefinedBlocks.length = 0;
            predefinedBlocksByType.length = 0;
            tools.length = 0;
            toolsByType.length = 0;
            blocks.length = 0;
            blocksByType.length = 0;
            portalInputs.length = 0;

            predefinedBlocksByType.push(Emitter.prototype.toString());
            predefinedBlocksByType[Emitter.prototype.toString()] = new Array();
            predefinedBlocksByType.push(Receiver.prototype.toString());
            predefinedBlocksByType[Receiver.prototype.toString()] = new Array();
            predefinedBlocksByType.push(Activator.prototype.toString());
            predefinedBlocksByType[Activator.prototype.toString()] = new Array();

            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 12; j++) {
                    map[i][j] = new Cell();
                }
            }
            level = JSON.parse(lines[0]);

            for (var y = 1; y < lines.length; y++) {
                var split = lines[y].split(" ");

                Util.log('The first word is ' + split[0] + ', we still have ' + lines.length + ' lines and i is ' + i);

                var finished = false;
                var x = 0;
                while (!finished && x < lines[y].length) {
                    if (lines[y].charAt(x) == '#') {
                        switch (y) {
                            // FIRST LINE
                            case 1:
                                switch (x) {
                                    case 0:
                                        map[x][y - 1].tile = Tiles.CORNER_LEFT_TOP;
                                        break;
                                    case 15:
                                        map[x][y - 1].tile = Tiles.CORNER_RIGHT_TOP;
                                        break;
                                    default:
                                        map[x][y - 1].tile = Tiles.BORDER_TOP;
                                        break;
                                }
                                break;
                                // LAST LINE
                            case 12:
                                switch (x) {
                                    case 0:
                                        map[x][y - 1].tile = Tiles.CORNER_LEFT_BOTTOM;
                                        break;
                                    case 15:
                                        map[x][y - 1].tile = Tiles.CORNER_RIGHT_BOTTOM;
                                        break;
                                    default:
                                        map[x][y - 1].tile = Tiles.BORDER_BOTTOM;
                                        break;
                                }
                                break;
                            // EVERYTHING ELSE
                            default:
                                switch (x) {
                                    case 0:
                                        map[x][y - 1].tile = Tiles.BORDER_LEFT;
                                        break;
                                    case 15:
                                        map[x][y - 1].tile = Tiles.BORDER_RIGHT;
                                        break;
                                    default:
                                        map[x][y - 1].tile = Tiles.FULL;
                                        break;
                                }
                                break;
                        }
                    } else if (lines[y].charAt(0) == '#') {
                        map[x][y - 1].tile = Tiles.CLEAR;
                    } else {
                        finished = true;
                    }

                    x++;
                }

                switch (split[0]) {
                    case 'L':
                        var emitter = new Emitter();
                        placeBlock(emitter, parseInt(split[1]), parseInt(split[2]));
                        emitter.rotation = parseInt(split[3]);
                        emitter.color = getStringFromColor(parseInt(split[4]));
                        emitter.output.color = emitter.color;
                        emitter.output.isOn = true;
                        predefinedBlocks.push(emitter);
                        predefinedBlocksByType[Emitter.prototype.toString()].push(emitter);
                        break;
                    case 'X':
                        var receiver = new Receiver();
                        placeBlock(receiver, parseInt(split[1]), parseInt(split[2]));
                        receiver.rotation = parseInt(split[3]);
                        receiver.color = split[4];
                        predefinedBlocks.push(receiver);
                        predefinedBlocksByType[Receiver.prototype.toString()].push(receiver);
                        break;
                    case 'A':
                        var activator = new Activator();
                        placeBlock(activator, parseInt(split[1]), parseInt(split[2]));
                        predefinedBlocks.push(activator);
                        predefinedBlocksByType[Activator.prototype.toString()].push(activator);
                        break;
                    case 'M':
                        var count = parseInt(split[1]);
                        for (var k = 0; k < count; k++) {
                            var mirror = new Mirror();
                            tools.push(mirror);
                        }
                        break;
                    case 'PL-I':
                        var portalinput = new PortalInput();
                        portalinput.color = split[1];

                        portalInputs[portalinput.color] = portalinput;
                        tools.push(portalinput);
                        break;
                    case 'PL-O':
                        var count = parseInt(split[1]);
                        for (var k = 0; k < count; k++) {
                            var portaloutput = new PortalOutput();
                            portaloutput.color = split[2];
                            tools.push(portaloutput);
                        }
                        break;
                    case 'P':
                        var count = parseInt(split[1]);
                        for (var k = 0; k < count; k++) {
                            var prism = new Prism();
                            tools.push(prism);
                        }
                        break;
                }
            }
            blocks = blocks.concat(predefinedBlocks);
            blocks = blocks.concat(tools);

            initToolBox();

            blocksByType = blocksByType.concat(predefinedBlocksByType);
            blocksByType = blocksByType.concat(toolsByType);

            Util.log('level parsed');
            levelID = id;

            gameState = GameState.IS_PLAYING;
            if (options.showHints) {
                showHelpMessage();
            }
            startTimer();
            // sounds["laser"].play();

            //Link portals
            if (portalInputs != undefined && toolsByType[PortalOutput.prototype.toString()] != undefined) {
                for (var color in portalInputs) {
                    for (var i = 0; i < toolsByType[PortalOutput.prototype.toString()].length; i++) {
                        if (color == toolsByType[PortalOutput.prototype.toString()][i].color) {
                            toolsByType[PortalOutput.prototype.toString()][i].output = portalInputs[color].input;
                        }
                    }
                }
            }
        }
    }
    xmlhttp.overrideMimeType('text/plain');
    xmlhttp.open("GET", 'levels/level' + id + '.txt', true);
    xmlhttp.send();
}

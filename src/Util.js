var Util = function(){};

Util.log = function(str){
    if(debug == true){
        console.log(str);
    }
}


document.addEventListener('keydown', function (e) {
	console.log('key pressed');
	if (e.ctrlKey && e.altKey) {
		document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

// Attempt to unlock
document.exitPointerLock();
	}
});
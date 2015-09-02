var Util = function(){};

Util.log = function(str){
    if(debug == true){
        console.log(str);
    }
}


c.addEventListener('onkeypress', function (e) {
	if (e.ctrlKey && e.altKey) {
		document.exitPointerLock = document.exitPointerLock    ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

// Attempt to unlock
document.exitPointerLock();
	}
});
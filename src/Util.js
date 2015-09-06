var Util = function(){};

Util.log = function(str){
    if(options.debug == true){
        console.log(str);
    }
}

Util.getDateString = function(seconds) {
		var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
}

// document.addEventListener('keydown', function (e) {
// 	console.log('key pressed');
// 	if (e.ctrlKey && e.altKey) {
// 		document.exitPointerLock = document.exitPointerLock    ||
//                            document.mozExitPointerLock ||
//                            document.webkitExitPointerLock;
//
// // Attempt to unlock
// document.exitPointerLock();
// 	}
// });

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

wrap = function(number, max, min) {
    var wrappedNumber = undefined;

    if (typeof number == "number" && typeof max == "number") {
        min = typeof min != number ? 0 : min;

        wrappedNumber = number;

        if (number < min) {
            do {
                wrappedNumber += max;
            } while (wrappedNumber + max < min);
        } else if (number > min) {
            wrappedNumber = wrappedNumber % max;
        }
    }

    return wrappedNumber;
}

rotatePos = function(pos) {
    if (typeof pos == object) {

        return pos;
    }
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

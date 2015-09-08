// Options.js
options = {
	"debug": false,
	"showFPS": true,
	"mouseDebug": false,
	"fullscreen": true,
	"showHints": true,
	"showScore": true,
};

if (localStorage.getItem('options') != null) {
	Util.log('Loading options from localStorage');
	var loadedOptions = JSON.parse(localStorage.getItem('options'));

	for (var key in options) {
		if (loadedOptions[key] != undefined) {
			options[key] = loadedOptions[key];
		}
	}
}
function saveOptions() {
	Util.log('Saving options to localStorage');
	localStorage.setItem('options', JSON.stringify(options));
}

function checkOptions() {
	if (options['fullscreen'] == false) {
		c.style.height = 'auto';
	} else {
		c.style.height = '100%';
	}
}

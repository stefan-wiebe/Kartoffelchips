// Options.js
options = {
	"debug": false,
	"showFPS": true,
	"mouseDebug": false
};

if (localStorage.getItem('options') != null) {
	Util.log('Loading options from localStorage');
	options = JSON.parse(localStorage.getItem('options'));
}
function saveOptions() {
	Util.log('Saving options to localStorage');
	localStorage.setItem('options', JSON.stringify(options));
}
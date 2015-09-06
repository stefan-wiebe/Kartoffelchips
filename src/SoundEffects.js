// SoundEffects.js
var SoundEffects = function () {

};
window.ac = new AudioContext();

SoundEffects.startLaserSoundEffect = function() {
	var filter = ac.createBiquadFilter();
	filter.type = 'bandpass';
	filter.Q.value = 0.75390625;
	filter.frequency.value = 350;
	var osc = ac.createOscillator();
	osc.type = 'sawtooth';
	osc.frequency.value = 95;
	osc.connect(filter);
	filter.connect(ac.destination);
	osc.start();

};

SoundEffects.playRotationSoundEffect = function(rotation) {
	var osc = window.ac.createOscillator();
	osc.type = 'sawtooth';
	osc.frequency.value = 300 + (rotation * 30);
	osc.connect(window.ac.destination);
	var time = ac.currentTime;
	osc.start(time);
	osc.stop(0.5);
}
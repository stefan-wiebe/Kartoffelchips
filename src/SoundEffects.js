// SoundEffects.js
var SoundEffects = function () {
	this.ac = new AudioContext();

};
SoundEffects.prototype.startLaserSoundEffect = function() {
	var filter = this.ac.createBiquadFilter();
	filter.type = 'bandpass';
	filter.Q.value = 0.75390625;
	filter.frequency.value = 350;
	var osc = this.ac.createOscillator();
	osc.type = 'sawtooth';
	osc.frequency.value = 95;
	osc.connect(filter);
	filter.connect(this.ac.destination);
	osc.start();



};
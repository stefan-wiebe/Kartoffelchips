// SoundEffects.js
var SoundEffects = function () {
	this.ac = new AudioContext();

};
SoundEffects.startLaserSoundEffect = function() {
	var osc = this.ac.createOscillator();
	osc.type = 'sawtooth';
	
};
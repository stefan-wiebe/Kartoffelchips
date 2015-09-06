// SoundEffects.js
var sounds = [];
var soundNames = [];

function loadSound (soundName) {
	var newSound = new Audio('sounds/' + soundName + '.wav');
	sounds[soundName] = newSound;
	soundNames.push(soundName);
}

function pauseSounds() {
	for (var i = 0; i < soundNames.length; i++) {
		sounds[soundNames[i]].pause();
	}
}

var SoundEffects = function () {
};

// window.ac = new AudioContext();
// var laserOSC;
// SoundEffects.startLaserSoundEffect = function() {
// 	if (laserOSC == null) {
// 	var filter = ac.createBiquadFilter();
// 	filter.type = 'bandpass';
// 	filter.Q.value = 0.75390625;
// 	filter.frequency.value = 350;
// 	laserOSC = ac.createOscillator();
// 	laserOSC.type = 'sawtooth';
// 	laserOSC.frequency.value = 95;
// 	laserOSC.connect(filter);
// 	filter.connect(ac.destination);
// 	laserOSC.start();
// }


SoundEffects.stopLaserSoundEffect = function(){
	if (laserOSC != null) {
	laserOSC.stop();
	laserOSC = null;
}
}
SoundEffects.playSoundEffect = function(note) {
	var osc = window.ac.createOscillator();
	osc.type = 'sawtooth';
	osc.frequency.value = Math.pow(1.0594630943592953, note-49) * 440
	osc.connect(window.ac.destination);
	var time = ac.currentTime;
	osc.start(time);
	osc.stop(time + 0.1);
}

// SoundEffects.loop = function(sound) {
// 	sounds[sound].addEventListener('timeupdate', loopSound, false)
// }

// Doesn't work.
// function loopSound (event) {
// 	var buffer = .005;
// 	if (this.duration - buffer <= this.currentTime) {
// 		this.currentTime = 0;
// 		this.play();
// 	}
//  }

module.exports = function(grunt) {
grunt.initConfig({
  uglify: {
      options : {
        sourceMap : true,
        sourceMapName : 'sourceMap.map',
        mangle:true
      },
      build: {
							 src: ['lang/en.js',
							 'src/Translation.js',
							 'src/FunctionExtensions.js',
							 'src/Cell.js',
							 'src/Laser.js',
							 'src/Button.js',
							 'src/GameState.js',
							 'src/Util.js',
							 'src/Options.js',
							 'src/Alert.js',
							 'src/Level.js',
							 'src/SoundEffects.js',
							 'src/Block.js',
							 'src/ToolBox.js',
							 'src/Emitter.js',
							 'src/Receiver.js',
							 'src/Activator.js'.
							 'src/Mirror.js',
							 'src/PortalInput.js',
							 'src/PortalOutput.js',
							 'src/Input.js',
							 'src/Prism.js',
							 'src/Colors.js',
							 'src/Drawing.js',
							 'src/Keyboard.js',
							 'src/Mouse.js',
							 'src/Main.js'],
		 					 dest: 'kartoffelchips.min.js'
    	}
	}		
});
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.registerTask('default', ['uglify']);
};

module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'dist/sourceMap.map',
                mangle: true
            },
            build: {
                src: ['lang/en.js', 'src/Translation.js', 'src/FunctionExtensions.js', 'src/Cell.js', 'src/Laser.js', 'src/Button.js', 'src/GameState.js', 'src/Util.js', 'src/Options.js', 'src/Alert.js', 'src/Level.js', 'src/SoundEffects.js', 'src/Block.js', 'src/ToolBox.js', 'src/Emitter.js', 'src/Receiver.js', 'src/Activator.js', 'src/Mirror.js', 'src/PortalInput.js', 'src/PortalOutput.js', 'src/Interface.js', 'src/Prism.js', 'src/Colors.js', 'src/Drawing.js', 'src/Keyboard.js', 'src/Mouse.js', 'src/Main.js'],
                dest: 'dist/kartoffelchips.min.js'
            }
        },
        imagemin: {
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'textures/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/textures' // Destination path prefix
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.registerTask('default', ['imagemin', 'uglify']);
};
module.exports = function(grunt) {
        grunt.initConfig({
                uglify: {
                    options: {
                        sourceMap: true,
                        sourceMapName: 'dist/sourceMap.map',
                        mangle: true
                    },
                    build: {
                        src: ['lang/en.js', 'src/Translation.js', 'src/FunctionExtensions.js','src/Tiles.js', 'src/Cell.js', 'src/Laser.js', 'src/Button.js', 'src/GameState.js', 'src/Util.js', 'src/Options.js', 'src/Alert.js', 'src/Level.js', 'src/SoundEffects.js', 'src/Block.js', 'src/ToolBox.js', 'src/Emitter.js', 'src/Receiver.js', 'src/Activator.js', 'src/Mirror.js', 'src/PortalInput.js', 'src/PortalOutput.js', 'src/Interface.js', 'src/Prism.js', 'src/Colors.js', 'src/Drawing.js', 'src/Keyboard.js', 'src/Mouse.js', 'src/Main.js', 'src/init.js'],
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
                },
                cssmin: {
                    options: {
                        shorthandCompacting: true,
                        roundingPrecision: -1
                    },
                    target: {
                        files: {
                            'dist/main.css': ['main.css']
                        }
                    }
                },
                copy: {
                    main: {
                        files: [{
                            expand: true,
                            src: ['sounds/*'],
                            dest: 'dist/'
                        }, {
                            expand: true,
                            src: ['fonts/*'],
                            dest: 'dist/'
                        }, {
                            expand: true,
                            src: ['levels/*'],
                            dest: 'dist/'
                        }, {
                            expand: true,
                            src: ['lang/*'],
                            dest: 'dist/'
                        }, {
                            src: 'index.prod.html',
                            dest: 'dist/index.html'
                        }
                        ]
                    }
                }
                }); grunt.loadNpmTasks('grunt-contrib-uglify'); grunt.loadNpmTasks('grunt-contrib-imagemin'); grunt.loadNpmTasks('grunt-contrib-cssmin'); grunt.loadNpmTasks('grunt-contrib-copy'); grunt.registerTask('default', ['imagemin', 'uglify', 'cssmin', 'copy']);
        };
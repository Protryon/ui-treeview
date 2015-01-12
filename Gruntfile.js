
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    var config = {
        package: require('./package.json'),
        uglify: {
            csp: {
                files: {
                    '<%= package.name %>-csp.js': ['<%= package.name %>-csp.js']
                }
            }
        },
        vulcanize: {
            options: {
                inline: true,
                excludes: {
                    imports: [
                        "polymer.html$"
                    ]
                }
            },
            main: {
                src: "<%= package.name %>-csp.html",
                dest: "<%= package.name %>.html"
            },
            csp: {
                src: "components/src/component.html",
                dest: "<%= package.name %>-csp.html",
                options: {
                    csp: true
                }
            }
        }
    };


    grunt.initConfig(config);

    grunt.registerTask('default', [ 'vulcanize:csp', 'uglify:csp', 'vulcanize:main' ]);

};

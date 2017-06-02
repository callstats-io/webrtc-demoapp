module.exports = function(grunt) {
  var envTarget = process.env.TARGET || 'production';
  var appid = process.env.APPID || '';
  var appsecret = process.env.APPSECRET || '';
  var jwt = process.env.JWT || 'false';
  var csjsURL = process.env.CSJSURL;

  grunt.initConfig({
    env: {
      dev: {
        NODE_ENV: envTarget
      }
    },
    config: {
      local: {
        options: {
          variables: {
            csjs: csjsURL || 'http://192.168.99.100:3000/static/callstats.js',
            appid: appid,
            appsecret: appsecret,
            jwt: jwt
          }
        }
      },
      production: {
        options: {
          variables: {
            csjs: csjsURL || 'https://api.callstats.io/static/callstats.min.js',
            appid: appid,
            appsecret: appsecret,
            jwt: jwt
          }
        }
      }
    },
    replace: {
      indexjs: {
        options: {
          patterns: [
            {
              match: 'APPID',
              replacement: '<%= grunt.config.get("appid") %>'
            },
            {
              match: 'APPSECRET',
              replacement: '<%= grunt.config.get("appsecret") %>'
            },
            {
              match: 'JWT',
              replacement: '<%= grunt.config.get("jwt") %>'
            }
          ]
        },
        src: 'app/index.js',
        dest: 'build/index.r.js'
      },
      indexhtml: {
        options: {
          patterns: [
            {
              match: 'CSJS',
              replacement: '<%= grunt.config.get("csjs") %>'
            }
          ]
        },
        src: 'app/index.html',
        dest: 'build/index.html'
      },
      indexcss: {
        options: {
          patterns: []
        },
        src: 'app/index.css',
        dest: 'build/index.css'
      }
    },
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      target: ['library/*.js', 'app/*.js']
    },
    browserify: {
      library: {
        src: ['library/main.js'],
        dest: 'build/csio-webrtc-app.js',
        options: {
          transform: [['babelify', {'presets': ['es2015']}]],
          browserifyOptions: {
            standalone: 'CsioWebrtcApp'
          }
        }
      },
      app: {
        src: ['build/index.r.js'],
        dest: 'build/index.js',
        options: {
          transform: [['babelify', {'presets': ['es2015','react']}]]
        }
      },
    },
    uglify: {
      options: {
        banner: '/*! Grunt Uglify <%= grunt.template.today("yyyy-mm-dd") %> */ '
      },
      build: {
        files: {
          'build/csio-webrtc-app.min.js': ['build/csio-webrtc-app.js'],
          'build/index.min.js': ['build/index.js']
        }
      }
    },
    watch: {
      files: ['<%= eslint.target %>'],
      tasks: ['eslint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('linter', ['eslint']);
  grunt.registerTask('build',
    ['config:'+envTarget,
      'env',
      'replace',
      'browserify',
      'uglify']);
};

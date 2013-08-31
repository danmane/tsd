module.exports = function (grunt) {
	'use strict';

	var gtx = require('gruntfile-gtx').wrap(grunt);

	gtx.loadNpm([
		'grunt-contrib-jshint',
		'grunt-contrib-copy',
		'grunt-contrib-clean',
		'grunt-tslint',
		'grunt-typescript',
		'grunt-execute',
		'grunt-shell',
		'grunt-mocha-test'
	]);
	// gtx.autoNpmPkg();
	// gtx.autoNpm();
	// gtx.loadTasks('tasks');

	//defaults and one-off tasks
	gtx.addConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			support: ['Gruntfile.js', 'tasks/*.js', 'test/*.js']
		},
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json')
			},
			source: ['src/**/*.ts']
		},
		clean: {
			tmp: ['tmp/**/*', 'test/tmp/**/*'],
			build: ['build/*.js', 'build/*.js.map']
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter',
				timeout: 3000
			},
			integrity: ['test/integrity.js']
		},
		typescript: {
			options: {
				module: 'commonjs',
				target: 'es5',
				base_path: 'src/',
				declaration: false,
				// should be on but is buggy
				sourcemap: false
			},
			api: {
				src: ['src/api.ts'],
				dest: 'build/api.js'
			},
			cli: {
				src: ['src/cli.ts'],
				dest: 'build/cli.js'
			},
			dev: {
				src: ['src/dev.ts'],
				dest: 'tmp/dev.js'
			}
		},
		shell: {
			cli: {
				command: 'node ./build/cli --help',
				options: {
					stdout: true
				}
			}
		},
		execute: {
			dev: {
				before: function (grunt) {
					grunt.log.writeln('devdevedvedv');
				},
				src: ['tmp/dev.js']
			}
		}
	});

	// module tester
	gtx.define('moduleTest', function (macro, id) {

		var testPath = 'test/modules/' + id + '/';

		macro.newTask('clean', [testPath + 'tmp/**/*']);

		macro.newTask('tslint', {
			src: [testPath + '**/*.ts']
		});
		macro.newTask('typescript', {
			options: {
				base_path: testPath
			},
			src: [testPath + '**/*.ts'],
			dest: testPath + 'tmp/' + id + '.test.js'
		});
		macro.newTask('mochaTest', {
			options: {
				timeout: macro.getParam('timeout', 3000)
			},
			src: [testPath + '**/*.test.js']
		});
		macro.tag('test');
		macro.tag('module');
	});

	// assemble!

	gtx.alias('prep', ['clean:tmp', 'jshint:support']);

	// cli commands
	gtx.alias('build', ['prep', 'clean:build', 'typescript:api', 'typescript:cli', 'tslint:source', 'mochaTest:integrity']);
	gtx.alias('test', ['build', 'gtx-group:test']);
	gtx.alias('default', 'test');


	// modules
	gtx.create('api,cli,tsd', 'moduleTest', null, 'core');
	gtx.create('xm,git', 'moduleTest', null, 'lib');

	gtx.alias('run', ['build', 'shell:cli']);
	gtx.alias('dev', ['prep', 'typescript:dev', 'execute:dev']);

	// additional editor toolbar mappings
	gtx.alias('edit_01', 'gtx:tsd');
	gtx.alias('edit_02', 'gtx:api');
	gtx.alias('edit_03', 'build', 'gtx:cli');
	gtx.alias('edit_04', 'gtx:git');
	gtx.alias('edit_05', 'gtx:xm');

	// build and send to grunt.initConfig();
	gtx.finalise();
};
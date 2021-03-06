var gulp = require("gulp"), 
	uglify = require('gulp-uglify'),
	del = require('del'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint'),
	jsdoc = require('gulp-jsdoc3'),
	stylish = require('jshint-stylish'),
	concat = require('gulp-concat');

var Server = require('karma').Server; 

/**
 * 
 */
gulp.task('clean', function() {
	del(['./dist']).then(function(){
		gulp.start('copy-dependancies');
	});
});

/**
 * copy all dependencies
 */
gulp.task('copy-dependancies', function() {
	
	gulp.src(['./lib/forms2.js', './app.js'])
	   .pipe(concat('marketoWrapper.js'))
	   .pipe(uglify({preserveComments: "license"}))
	   .pipe(gulp.dest('./dist'));
	
	gulp.src(['./node_modules/jquery/dist/jquery.min.js', './lib/marketoUtil.js'])
		.pipe(uglify({preserveComments: "license"}))
		.pipe(gulp.dest('./dist'));
	
	gulp.start('jshint');
	gulp.start('test');
	
});

gulp.task('jshint', function () {
    return gulp.src(['app.js'])
            .pipe(jshint({}))
            .pipe(jshint.reporter(stylish));
});

/**
 * run all jasmine tests
 */
gulp.task('test', function(done){
	return new Server({
	    configFile: __dirname + '/karma.conf.js',
	    singleRun: true
	  }, done).start();
})

gulp.task('generateDoc', function (cb) {
    gulp.src(['README.md', 'app.js', './lib/marketoUtil.js'], {read: false})
        .pipe(jsdoc(cb));
});

gulp.task('default', ['clean', 'generateDoc']);
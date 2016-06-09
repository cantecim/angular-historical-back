var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var header = require('gulp-header');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('javascript', function () {
	var b = browserify({
		entries: './source.js',
		debug: true
	});

	return b.bundle()
		.pipe(source('dist.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./'))
		.pipe(rename('dist.min.js'))
		.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
		.pipe(uglify())
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'));
});

gulp.task('banner', function () {
	var bower = require('./bower.json'),
		banner = ['/**',
			' * <%= bower.name %> - <%= bower.description %>',
			' * @version v<%= bower.version %>',
			' * @author <%= bower.authors[0].name %>, <%= bower.authors[0].email %>',
			' * @license <%= bower.license %>',
			' */',
			''].join('\n');

	return gulp.src(['./index.js'])
		.pipe(header(banner, {bower: bower}))
		.pipe(rename('source.js'))
		.pipe(gulp.dest('./'))

});

gulp.task('build', function() {
	runSequence(['bump', 'javascript']);
});
gulp.task('default', ['build']);

gulp.task('bump', function (cb) {
	var type = gutil.env.type || 'patch';

	// gulp bump --type [major|minor|patch]
	gutil.log("Bumping " + type + " version")
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({
			type: type
		}))
		.pipe(gulp.dest('./')).
		on('end', function() {
			runSequence('banner');
		});
});
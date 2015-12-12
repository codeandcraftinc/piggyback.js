var gulp = require('gulp');
var header = require('gulp-header');
var pkg = require('../package.json');

/**
 *
 */
var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' *',
  ' * @version <%= pkg.version %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

/**
 *
 */
module.exports = function () {
  return gulp.src('dist/*.js')
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('dist'));
};

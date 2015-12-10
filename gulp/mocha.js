var gulp = require('gulp');
var argv = require('yargs').argv;
var mocha = require('gulp-mocha');

/**
 *
 */
module.exports = function fn() {
  var src = argv.f ? argv.f : 'test/**/*.js';
  src = Array.isArray(src) ? src : [src];

  src = [
    'test/helpers.js'
  ].concat(src);

  return gulp.src(src)
    .pipe(mocha({
      bail: true
    })).once('end', function () {
      process.exit();
    });
};

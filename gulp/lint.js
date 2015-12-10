var gulp = require('gulp');
var jscs = require('gulp-jscs');

module.exports = function () {
  return gulp.src(['lib/**/*', 'test/**/*'])
    .pipe(jscs())
    .pipe(jscs.reporter());
};

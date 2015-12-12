var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

module.exports = function () {
  return gulp.src('dist/piggyback.js')
    .pipe(uglify())
    .pipe(rename('piggyback.min.js'))
    .pipe(gulp.dest('dist'));
};

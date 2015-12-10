var gulp = require('gulp');

module.exports = function () {
  gulp.watch(['lib/*.js', 'webpack.config.js'], ['webpack']);
};

module.exports.dependencies = ['webpack'];

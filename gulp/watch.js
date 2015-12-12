var gulp = require('gulp');

module.exports = function () {
  gulp.watch(['lib/*.js', 'webpack.config.js'], ['build']);
};

module.exports.dependencies = ['build'];

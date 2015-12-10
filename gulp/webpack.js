var gutil = require('gulp-util');
var webpack = require('webpack');
var config = require(__dirname + '/../webpack.config.js');

module.exports = function (done) {
  webpack(config, function (err, stats) {
    if (err) {
      return done(new gutil.PluginError('webpack', 'compilation error', err));
    }

    stats.toString({ colors: true }).split('\n').forEach(function (line) {
      gutil.log(line);
    });

    done();
  });
};

var run = require('run-sequence');

module.exports = function (done) {
  run('clean', 'webpack', 'uglify', 'banner', done);
};

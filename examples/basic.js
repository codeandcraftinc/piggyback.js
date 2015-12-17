var piggyback = require('../dist/piggyback');

function fn(done) {
  piggyback(function (cb) {
    console.log('fn executing...')
    setTimeout(cb.bind(null, null, Math.random()), 1000)
  }, done)
}

fn(console.log.bind(console, 'fn1'))
fn(console.log.bind(console, 'fn2'))

// fn executing...
// fn1 null 0.8684732124675065
// fn2 null 0.8684732124675065

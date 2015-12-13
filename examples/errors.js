import piggyback from '../lib'

let fn = (done) => setTimeout(done.bind(null, 'err'), 3000)

piggyback(fn, (err) => console.log('cb err'))
  .then(function one() {})
  // .then(function two() {})
  // .then(function thr() {})


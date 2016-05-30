import Promise from 'bluebird'
import piggyback from '../lib'

function fn() {
  return piggyback(() => {
    return new Promise((resolve) => {
      console.log('fn executing...')
      setTimeout(resolve.bind(null, Math.random()), 1000)
    })
  })
}

fn().then(console.log.bind(console, 'fn1'))
fn().then(console.log.bind(console, 'fn2'))

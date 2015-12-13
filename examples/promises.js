import Promise from 'lie'
import piggyback from '../lib'

/**
 *
 */
function slowFn() {
  return new Promise((resolve) => {
    let sieve = [], i, j, primes = []

    for (i = 2; i <= 1000000; ++i) {
      if (!sieve[i]) {
        primes.push(i)
        for (j = i << 1; j <= 1000000; j += i) {
          sieve[j] = true
        }
      }
    }

    resolve(primes)
  })
}

/**
 *
 */
function piggied() {
  return piggyback(slowFn)
}

/**
 *
 */
function handleResults(str) {
  return (results) => {
    results.forEach((v, k) => {
      console.log('%s:%s - %s primes found', str, k, v.length)
    })

    console.timeEnd(str)
  }
}

console.time('slowFn')
Promise.all([slowFn(), slowFn()]).then(handleResults('slowFn'))

console.time('piggied')
Promise.all([piggied(), piggied()]).then(handleResults('piggied'))

import Promise from 'lie'
import { md5 } from 'blueimp-md5'

/**
 * @todo
 */
const STATE = {}

/**
 * Convert a promise's resolve and reject functions into a node-style
 * callback.
 *
 * @param {function} resolve A Promise resolution function.
 * @param {function} reject A Promise rejection function.
 * @returns {function} A node-style callback that wraps the resolve/reject functions.
 */
export function generateCallback(resolve, reject) {
  return function (err, result) {
    if (err) {
      return reject(err)
    }

    resolve(result)
  }
}

/**
 * Invoke the given function and return a `Promise`. `fn` must either return
 * a `Promise` or accept a single callback that it will invoke upon
 * completion.
 *
 * @param {function} fn A function to invoke and wrap in a `Promise`.
 * @returns {mixed} The return value from `fn`.
 */
export function invoke(fn) {
  return new Promise((resolve, reject) => {
    let done = generateCallback(resolve, reject)
    Promise.resolve(fn(done)).then(resolve).catch(reject)
  })
}

/**
 * Iterates over `fns` and invokes `apply()` using `args`
 *
 * @param {function[]} fns An array of functions.
 * @param {*[]} args An array of args to invoke each function in `fns` with.
 * @returns {undefined}
 */
export function notify(fns, args) {
  fns.forEach((done) => done.apply(null, args))
}

/**
 * Wrap a function to prevent it from processing simultaneously
 *
 * @param {string} key A unique identifier.
 * @param {function} fn The function to wrap.
 * @param {function} [done] An optional callback that will be invoked upon `fn` completion.
 * @returns {Promise} A `Promise` that resolves or rejects based on `fn` resolving, rejecting, returning, or throwing.
 */
export function wrap(key, fn, done) {
  if (typeof key === 'function') {
    [done, fn, key] = [fn, key, `pb:${md5(key.toString())}`]
  }

  let state = STATE[key]

  if (!state) {
    let promise = invoke(fn).then((result) => {
      notify(state.notify, [null, result])
      delete STATE[key]
      return result
    }).catch((err) => {
      notify(state.notify, [err])
      delete STATE[key]

      if (state.promise.queue.length) {
        throw err
      }
    })

    STATE[key] = state = {
      notify: [],
      promise: promise
    }
  }

  if (done) {
    state.notify.push(done)
  }

  return state.promise
}

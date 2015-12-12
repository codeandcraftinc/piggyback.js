import Promise from 'lie'

/**
 * @todo
 */
const STATE = {}

/**
 * @todo
 */
export function generateCallback(resolve, reject) {
  return function (err) {
    if (err) {
      return reject(err)
    }

    resolve.apply(null, ...arguments)
  }
}

/**
 *
 */
export function hasCallback(fn) {
  return /^function \([\w\s,]+\)/.test(fn.toString())
}

/**
 * @todo
 */
export function invoke(fn) {
  return new Promise((resolve, reject) => {
    if (hasCallback(fn)) {
      fn(generateCallback(resolve, reject))
    } else {
      Promise.resolve(fn()).then(resolve).catch(reject)
    }
  })
}

/**
 * @todo
 */
export function notify(state, args) {
  state.notify.forEach((done) => done.apply(null, args))
}

/**
 * @todo
 */
export function wrap(key, fn, done) {
  let state = STATE[key]

  if (!state) {
    let promise = invoke(fn).then((result) => {
      notify(state, [null, result])
      delete STATE[key]
      return result
    }).catch((err) => {
      notify(state, [err])
      delete STATE[key]

      if (state.promise.queue) {
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

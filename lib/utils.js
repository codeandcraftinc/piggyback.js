import Promise from 'lie'

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
export function wrap(fn) {
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

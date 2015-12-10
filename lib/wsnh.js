import Promise from 'lie'
import { notify, wrap } from './utils'

/**
 * @todo
 */
const STATE = {}

/**
 * @todo
 */
export default function (key, fn, done) {
  let state = STATE[key]

  if (!state) {
    let promise = wrap(fn).then((result) => {
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

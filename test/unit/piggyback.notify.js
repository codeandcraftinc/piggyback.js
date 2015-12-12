import Promise from 'lie'
import sinon from 'sinon'
import { expect } from 'chai'
import { notify } from '../../lib/piggyback'

describe('piggyback.notify', () => {

  it('should be a function', () => {
    expect(notify).to.be.a('function')
  })

  it('should invoke all fns in state.notify once', () => {
    let cb = sinon.spy()
    notify({ notify: [cb, cb, cb] })
    expect(cb.calledThrice).to.be.true
  })

  it('should pass args to all fns in state.notify', () => {
    let cb = sinon.spy()
    notify({ notify: [cb, cb, cb] }, [1, 2, 3])
    expect(cb.alwaysCalledWithExactly(1, 2, 3)).to.be.true
  })

})

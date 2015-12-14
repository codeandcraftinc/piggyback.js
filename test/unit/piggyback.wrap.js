import Promise from 'lie'
import sinon from 'sinon'
import { expect } from 'chai'
import { wrap } from '../../lib/piggyback'

describe('piggyback.wrap', () => {

  it('should be a function', () => {
    expect(wrap).to.be.a('function')
  })

  it('should return a Promise', () => {
    expect(wrap('1', () => {})).to.be.an.instanceOf(Promise)
  })

  it('should accept a fn as the first param', () => {
    expect(wrap(() => {})).to.be.an.instanceOf(Promise)
  })

  it('should invoke the wrapped fn once when invoked quickly', (done) => {
    let spy = sinon.spy()

    let wrapped = () => {
      return wrap('2', () => {
        return new Promise((resolve, reject) => {
          spy()
          setTimeout(resolve, 500)
        })
      })
    }

    Promise.all([wrapped(), wrapped()]).then(() => {
      expect(spy.calledOnce).to.be.true
      done()
    })
  })

  it('should invoke the wrapped fn twice when invoked slowly', (done) => {
    let spy = sinon.spy()

    let wrapped = () => {
      return wrap('3', () => {
        return new Promise((resolve, reject) => {
          spy()
          setTimeout(resolve, 500)
        })
      })
    }

    wrapped().then(wrapped).then(() => {
      expect(spy.calledTwice).to.be.true
      done()
    })
  })

  it('should be fulfilled if the promise interface is used and the main fn succeeds', (done) => {
    let promise = wrap('4', () => {
      return Promise.resolve()
    })

    expect(promise).to.eventually.be.fulfilled.and.notify(done)
  })

  it('should be rejected if the promise interface is used and the main fn rejects', (done) => {
    let promise = wrap('5', () => {
      return Promise.reject()
    })

    expect(promise).to.eventually.be.rejected.and.notify(done)
  })

  it('should invoke the callback with a truthy first param if main fn throws', (done) => {
    let spy = sinon.spy()

    wrap('6', () => {
      throw 'callback err'
    }, spy)

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.alwaysCalledWithExactly('callback err')).to.be.true
      done()
    }, 0)
  })

  it('should invoke the callback with a falsy first param if main fn succeeds', (done) => {
    let spy = sinon.spy()
    wrap('7', (cb) => cb(), spy)

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0]).to.not.be.ok
      done()
    }, 0)
  })

})

import Promise from 'lie'
import sinon from 'sinon'
import { expect } from 'chai'
import wsnh from '../lib'

describe('wsnh', () => {

  it('should export a function', () => {
    expect(wsnh).to.be.a('function')
  })

  it('should return a Promise', () => {
    expect(wsnh('1', () => {})).to.be.an.instanceOf(Promise)
  })

  it('should invoke the wrapped fn once when invoked quickly', () => {
    let spy = sinon.spy()

    let wrapped = () => {
      return wsnh('uniquekey', () => {
        return new Promise((resolve, reject) => {
          spy()
          setTimeout(resolve, 500)
        })
      })
    }

    Promise.all([wrapped(), wrapped()]).then(() => {
      expect(spy.calledOnce).to.be.true
    })
  })

  it('should invoke the wrapped fn twice when invoked slowly', () => {
    let spy = sinon.spy()

    let wrapped = () => {
      return wsnh('uniquekey', () => {
        return new Promise((resolve, reject) => {
          spy()
          setTimeout(resolve, 500)
        })
      })
    }

    wrapped().then(wrapped).then(() => {
      expect(spy.calledTwice).to.be.true
    })
  })

  it('should be rejected if the promise interface is used and the main fn throws', () => {
    let promise = wsnh('1', () => {
      throw 'err'
    }).then(() => {})

    expect(promise).to.be.rejected
  })

  it('should be fulfilled if the promise interface is NOT used and the main fn throws', () => {
    let promise = wsnh('1', () => {
      throw 'err'
    })

    expect(promise).to.be.fulfilled
  })

  it('should invoke the callback with a truthy first param if main fn throws', () => {
    let spy = sinon.spy()

    wsnh('1', () => {
      throw 'err'
    }, spy)

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.alwaysCalledWithExactly('err')).to.be.true
    }, 0)
  })

  it('should invoke the callback with a falsey first param if main fn succeeds', () => {
    let spy = sinon.spy()
    wsnh('1', () => {}, spy)

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0]).to.be.an('undefined')
    }, 0)
  })

})

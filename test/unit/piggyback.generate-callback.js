import Promise from 'lie'
import { expect } from 'chai'
import { generateCallback } from '../../lib/piggyback'

describe('piggyback.generateCallback', () => {

  it('should be a function', () => {
    expect(generateCallback).to.be.a('function')
  })

  it('should return a function when invoked', () => {
    expect(generateCallback()).to.be.a('function')
  })

  it('should reject if result is invoked with a truthy first param', (done) => {
    let promise = new Promise((resolve, reject) => {
      let cb = generateCallback(resolve, reject)
      setTimeout(cb.bind(null, new Error('error')), 500)
    })

    expect(promise).to.be.rejected.and.notify(done)
  })

  it('should resolve if result is invoked with a falsey first param', (done) => {
    let promise = new Promise((resolve, reject) => {
      let cb = generateCallback(resolve, reject)
      setTimeout(cb.bind(null, null), 500)
    })

    expect(promise).to.be.fulfilled.and.notify(done)
  })

})

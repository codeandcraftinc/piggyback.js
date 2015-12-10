import Promise from 'lie'
import { expect } from 'chai'
import { wrap } from '../lib/utils'

describe('utils.wrap', () => {

  it('should export a function', () => {
    expect(wrap).to.be.a('function')
  })

  it('should return a Promise if fn does not expect a callback', () => {
    expect(wrap(() => {})).to.be.an.instanceOf(Promise)
  })

  it('should resolve if fn does not expect a callback and returns', () => {
    expect(wrap(() => true)).to.be.fulfilled
  })

  it('should reject if fn does not expect a callback and throws', () => {
    expect(wrap(() => {
      throw 'err'
    })).to.be.rejected
  })

  it('should return a Promise if fn expects a callback', () => {
    expect(wrap((done) => {})).to.be.an.instanceOf(Promise)
  })

  it('should resolve if fn expects a callback and invokes with falsey first param', () => {
    expect(wrap((done) => done(null))).to.be.fulfilled
  })

  it('should reject if fn expects a callback and invokes with truthy first param', () => {
    expect(wrap((done) => done(true))).to.be.rejected
  })

  it('should reject if fn expects a callback and throws', () => {
    expect(wrap((done) => {
      throw 'err'
    })).to.be.rejected
  })

})

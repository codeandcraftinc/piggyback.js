import Promise from 'lie'
import { expect } from 'chai'
import { invoke } from '../../lib/wayne'

describe('wayne.invoke', () => {

  it('should be a function', () => {
    expect(invoke).to.be.a('function')
  })

  it('should return a Promise if fn does not expect a callback', () => {
    expect(invoke(() => {})).to.be.an.instanceOf(Promise)
  })

  it('should resolve if fn does not expect a callback and returns', () => {
    expect(invoke(() => true)).to.be.fulfilled
  })

  it('should reject if fn does not expect a callback and throws', () => {
    expect(invoke(() => {
      throw 'err'
    })).to.be.rejected
  })

  it('should return a Promise if fn expects a callback', () => {
    expect(invoke((done) => {})).to.be.an.instanceOf(Promise)
  })

  it('should resolve if fn expects a callback and invokes with falsey first param', () => {
    expect(invoke((done) => done(null))).to.be.fulfilled
  })

  it('should reject if fn expects a callback and invokes with truthy first param', () => {
    expect(invoke((done) => done(true))).to.be.rejected
  })

  it('should reject if fn expects a callback and throws', () => {
    expect(invoke((done) => {
      throw 'err'
    })).to.be.rejected
  })

})

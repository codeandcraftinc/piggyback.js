import Promise from 'lie'
import { expect } from 'chai'
import { hasCallback } from '../../lib/piggyback'

describe('piggyback.hasCallback', () => {

  it('should be a function', () => {
    expect(hasCallback).to.be.a('function')
  })

  it('should return true if fn expects a callback', () => {
    expect(hasCallback((done) => {})).to.be.true
  })

  it('should return false if fn does not expect a callback', () => {
    expect(hasCallback(() => {})).to.be.false
  })

})
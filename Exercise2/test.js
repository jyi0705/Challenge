const { expect, should } = require('chai')
const fs = require('fs')
require('./index.js')

describe('Exercise 2 Test', () => {

  it('myRequire and myDefine should live in the global namespace', () => {
    expect(global.myDefine).to.not.equal(undefined)
    expect(global.myRequire).to.not.equal(undefined)

  })
  it('myRequire and myDefine should be typeof function', () => {
    expect((typeof global.myDefine)).to.equal('function')
    expect((typeof global.myRequire)).to.equal('function')
  })
  it('myDefine should create a modules.json file when defining a function if modules.json does not exist and add the function to the module', () => {
    let isFile = fs.existsSync('modules.json')
    setTimeout(() => {
      if(isFile) {
        fs.unlinkSync('modules.json')
      }
      setTimeout(() => {
        expect(isFile).to.equal(false)
        myDefine('sum', (a, b) => a + b)
        setTimeout(() => {
          expect(fs.existsSync('modules.json')).to.equal(true)
        }, 5000)
      }, 5000)
    }, 5000)

  })
  it('myRequire should return a function', () => {
    myDefine('func', (a, b) => a * b)
    setTimeout(() => {
      expect(typeof func).to.equal('function')
    })
  })
  it('subtract function should be available for use through myDefine and myRequire', () => {
    let subtract
    myDefine('subtract', (a, b) => a - b)
    setTimeout(() => {
      subtract = myRequire('subtract')
      const result = subtract(4,2)
      expect(result).to.equal(2)
    }, 5000)
  })
  it('should throw an error if module already exists', () => {
    myDefine('subtract', (a,b) => a - b )
    setTimeout(() => {
      expect(() => myDefine('subtract', (a,b) => a - b )).to.throw()
    }, 5000)
  })
  it('should throw an error if module does not exist', () => {
    expect(() => myRequire('fakeMod')).to.throw()
  })
})
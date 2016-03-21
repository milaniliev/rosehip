let EventEmitter = require('eventemitter2').EventEmitter2
let Promise = require('bluebird')

module.exports = class Test extends EventEmitter {
  constructor(options){
    super()
    options = options || {}
    this.name = options.name
    this.parent = options.parent
    this.test_function = options.test_function
    this.runnable = options.runnable
    this.async_timeout = options.async_timeout || 60000
    this.state = 'not_started'
    this.nested_tests = []
  }

  describe(name, block_definition) {
    let nested_test = this.create_nested_test({name: name, parent: this})
    block_definition(nested_test)
  }

  it(name, options, test_function) {
    if(test_function === undefined){
      test_function = options
      options = {}
    }
    this.create_nested_test({name: name, runnable: true, test_function: test_function, parent: this, async_timeout: options.async_timeout})
  }

  create_nested_test(test_options){
    let nested_test = new Test(test_options)
    nested_test.on('success', (options) => {
      if (this.overall_state === 'passed') { this.pass() }
    })
    nested_test.on('failure', (options) => {
      if (this.state         !== 'failed' ){ this.fail() }
    })
    nested_test.on('finished', () => {
      if (this.isFinished) { this.emit('finished') }
    })

    this.nested_tests.push(nested_test)
    return nested_test
  }

  get isFinished(){
    let finished = null
    if(this.runnable){
      finished = false
      if(this.state === 'passed' || this.state === 'failed'){ finished = true }
    } else {
      finished = true
      this.nested_tests.forEach((test) => {
        if(!test.isFinished){ finished = false }
      })
    }
    return finished
  }

  get overall_state(){
    let current_status = 'passed'
    this.nested_tests.forEach((test) => {
      if (test.state === 'failed')  { current_status = 'failed' }
      if (test.state === 'running' && current_status !== 'failed') { current_status = 'running' }
      if (test.state === 'not_started' && current_status !== 'failed' && current_status !== 'running') { current_status = 'not_started' }
    })
    return current_status
  }

  run() {
    if(this.runnable){
      if(this.test_function.length > 0){
        return this.run_async_test_function()
      } else {
        return this.run_sync_test_function()
      }
    } else {
      this.nested_tests.forEach((nested_test) => {
        nested_test.run()
      })
    }
  }

  fail(error){
    if(this.state !== 'failed'){
      this.state = 'failed'
      this.error = error
      this.emit('failure', {error: error})
      if (this.isFinished) { this.emit('finished') }
    }
  }

  pass(){
    this.state = 'passed'
    this.emit('success')
    if (this.isFinished) { this.emit('finished') }
  }

  run_async_test_function() {
    let error = null
    this.state = 'running'
    this.emit('start')
    this.test_promise = Promise.try(() => {
      let timeout = setTimeout(() => {
        throw new Error(`Async function is not done after ${this.async_timeout}ms.`)
      }, this.async_timeout)
      return new Promise((reject, resolve) => {
        return this.test_function((error) => {
          clearTimeout(timeout)
          if (error) { reject(error) } else { resolve () }
        })
      })
    }).then(() => {
      this.pass()
    }).catch((error) => {
      fail(error)
    })
  }

  run_sync_test_function() {
    let error = null
    try {
      this.state = 'running'
      this.emit('start')
      this.test_function()
    } catch (exception) {
      error = exception
    } finally {
      if(error){
        this.fail(error)
      } else {
        this.pass()
      }
    }
  }
}

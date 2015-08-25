let EventEmitter = require('eventemitter2').EventEmitter2

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

  describe (name, block_definition) {
    let nested_test = new Test({name: name, parent: this})
    nested_test.on('nested:success', (options) => this.emit('nested:success', options))
    nested_test.on('nested:failure', (options) => this.emit('nested:failure', options))
    block_definition(nested_test)
    this.nested_tests.push(nested_test)
  }

  it (name, options, test_function) {
    if(test_function === undefined){
      test_function = options
      options = {}
    }
    let nested_test = new Test({name: name, runnable: true, test_function: test_function, parent: this, async_timeout: options.async_timeout})
    nested_test.on('success', (options) => this.emit('nested:success', {test: nested_test}))
    nested_test.on('failure', (options) => this.emit('nested:failure', {test: nested_test, error: options.error}))
    this.nested_tests.push(nested_test)
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
    this.state = 'failed'
    this.emit('failure', {error: error})
  }

  pass(){
    this.state = 'succeeded'
    this.emit('success')
  }

  run_async_test_function() {
    let error = null
    try {
      this.state = 'running'
      this.emit('start')
      let timeout = setTimeout(() => {
        this.fail(new Error(`Async function is not done after ${this.async_timeout}ms.`))
      }, this.async_timeout)
      this.test_function(() => {
        clearTimeout(timeout)
        this.pass()
      })
    } catch (exception) {
      error = exception
    } finally {
      if(error){
        this.fail(error)
      }
    }
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

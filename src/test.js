let EventEmitter = require('eventemitter2').EventEmitter2

module.exports = class Test extends EventEmitter {
  constructor(text){
    super()
    this.text = text
  }

  describe (block_name, block_definition) {
    let nested_test = new Test(`${this.text} ${block_name}`)
    nested_test.on('success', (options) => this.emit('success', options))
    nested_test.on('failure', (options) => this.emit('failure', options))
    block_definition(nested_test)
  }

  it (test_name, test_function) {
    let failure = null
    try {
      test_function()
    } catch (exception) {
      failure = exception
    } finally {
      if(failure){
        this.emit('failure', {name: `${this.text} ${test_name}`, error: failure})
      } else {
        this.emit('success', {name: `${this.text} ${test_name}`})
      }
    }
  }
}

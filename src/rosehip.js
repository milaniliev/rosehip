let EventEmitter = require('eventemitter2').EventEmitter2

let style = require('./rosehip.css')

let Test =  class extends EventEmitter {
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

module.exports = {
  ConsoleReporter: class {
    success (options) {
      console.log(options.name, "passed!")
    }

    failure (options){
      console.log(options.name, "failed:", options.error)
    }
  },

  WebReporter: class {
    constructor (element) {
      this.element = element
      this.element.classList.add('rosehip')
    }

    success (options) {
      let indicator = document.createElement('test_indicator')
      indicator.classList.add('success')
      indicator.innerHTML = `<status>PASS</status> <test_name>${options.name}</test_name>`

      this.element.appendChild(indicator)
    }

    failure (options){
      let indicator = document.createElement('test_indicator')
      indicator.classList.add('failure')
      indicator.innerHTML = `<status>FAIL</status> <test_name>${options.name}</test_name>
        <stack_trace>${options.error.stack.replace(/\n/g,'<br/>')}</stack_trace>
      `

      this.element.appendChild(indicator)
    }
  },

  TestSuite: class {
    describe(text, block){
      this.test = new Test(text)
      this.block = block
      this.test.on('success', (options) => this.reporter.success(options))
      this.test.on('failure', (options) => this.reporter.failure(options))
    }

    run(){
      this.block(this.test)
    }
  }
}

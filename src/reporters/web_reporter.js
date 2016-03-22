class TestDisplay {
  constructor (test, container_element) {
    if(test.runnable){
      this.element = document.createElement('rosehip_test')
      this.element.innerHTML = `<status>PENDING</status><test_name>${test.name}</test_name><stack_trace></stack_trace>`
      this.status_indicator = this.element.querySelector('status')
      this.stack_trace = this.element.querySelector('stack_trace')
      this.stack_trace.style.display = 'none'

      container_element.appendChild(this.element)
      test.on('start', (options) => {
        this.element.classList.add('running')
        this.status_indicator.textContent = 'RUNNING'
      })
      test.on('success', (options) => {
        this.element.classList.remove('running')
        this.element.classList.add('success')
        this.status_indicator.textContent = 'P A S S'
      })
      test.on('failure', (options) => {
        this.element.classList.remove('running')
        this.element.classList.add('failure')
        this.status_indicator.textContent = 'F A I L'
        this.stack_trace.innerHTML = options.error.stack.replace(/\n/g,'<br/>')
        this.stack_trace.style.display = ''
      })
    } else {
      this.element = document.createElement('rosehip_test_suite')
      if(test.name){
        this.element.innerHTML = `<suite_name>${test.name}</suite_name>`
      }
      container_element.appendChild(this.element)
      test.nested_tests.forEach((nested_test) => {
        let display = new TestDisplay(nested_test, this.element)
      })
      
      test.onTestAdded = function(new_test){
        let display = new TestDisplay(new_test, this.element)
      }.bind(this)
    }
  }
}

module.exports = class WebReporter {
  constructor (element, test) {
    let style = require('../rosehip.css') // auto-included on the page by cssify
    this.element = element
    this.element.classList.add('rosehip')
    this.test = test
    this.display = new TestDisplay(test, this.element)
  }
}

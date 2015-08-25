module.exports = class WebReporter {
  constructor (element) {
    this.element = element
    this.element.classList.add('rosehip')
  }

  success (options) {
    let indicator = document.createElement('test_indicator')
    indicator.classList.add('success')
    indicator.innerHTML = `<status>P A S S</status><test_name>${options.name}</test_name>`

    this.element.appendChild(indicator)
  }

  failure (options){
    let indicator = document.createElement('test_indicator')
    indicator.classList.add('failure')
    indicator.innerHTML = `<status>F A I L</status> <test_name>${options.name}</test_name>
      <stack_trace>${options.error.stack.replace(/\n/g,'<br/>')}</stack_trace>
    `
    this.element.appendChild(indicator)
  }
}

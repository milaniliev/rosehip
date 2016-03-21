var colors = require('ansicolors')
var styles = require('ansistyles')

class TestResult {
  constructor(test, depth = 0){
    this.test = test
    this.depth = depth
  }

  render(){
    if (this.test.runnable) {

      if (this.test.state === 'passed') {
        this.print(colors.brightGreen("PASS") + ` ${this.test.name}`)
      }
      if (this.test.state === 'failed') {
        this.print(colors.brightRed("FAIL") + ` ${this.test.name}`)
        this.print(this.test.error.stack)
      }
    } else {

      if (this.test.name){
        console.log(" ")
        this.print(`${styles.bright(this.test.name)}`)
      }
    }

    this.test.nested_tests.forEach((nested_test) => {
      (new TestResult(nested_test, this.depth + 1)).render()
    })
  }

  buffer(){
    let buffer = ""
    let depth = this.depth
    while(depth > 0){
      buffer = buffer + "  "
      depth = depth - 1
    }
    return buffer
  }

  print(text){
    console.log(`${this.buffer()}${text}`)
  }
}

module.exports = class ConsoleReporter {
  constructor(test){
    this.test = test
    test.on('finished', () => {
      this.render_results()
    })
    console.log(styles.dim("Running tests..."))
  }

  render_results(){
    (new TestResult(this.test)).render()
  }
}

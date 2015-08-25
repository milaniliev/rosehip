let Test = require('./test.js')

module.exports = class TestSuite {
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

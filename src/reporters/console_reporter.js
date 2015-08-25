module.exports = class ConsoleReporter {
  success (options) {
    console.log(options.name, "passed!")
  }

  failure (options){
    console.log(options.name, "failed:", options.error)
  }
}

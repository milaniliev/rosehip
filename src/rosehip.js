var Rosehip = {
  ConsoleReporter: require('./reporters/console_reporter.js'),
  WebReporter: require('./reporters/web_reporter.js'),
  Test: require('./test.js')
}

Rosehip.TestSuite = Rosehip.Test

module.exports = Rosehip
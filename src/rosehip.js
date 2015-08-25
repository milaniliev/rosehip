let style = require('./rosehip.css') // auto-included on the page by cssify

module.exports = {
  ConsoleReporter: require('./reporters/console_reporter.js'),
  WebReporter: require('./reporters/web_reporter.js'),
  Test: require('./test.js')
}

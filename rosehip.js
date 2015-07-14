'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = require('eventemitter2').EventEmitter2;

var Test = (function (_EventEmitter) {
  _inherits(Test, _EventEmitter);

  function Test(text) {
    _classCallCheck(this, Test);

    _get(Object.getPrototypeOf(Test.prototype), 'constructor', this).call(this);
    this.text = text;
  }

  _createClass(Test, [{
    key: 'describe',
    value: function describe(block_name, block_definition) {
      var _this = this;

      var nested_test = new Test(this.text + ' ' + block_name);
      nested_test.on('success', function (options) {
        return _this.emit('success', options);
      });
      nested_test.on('failure', function (options) {
        return _this.emit('failure', options);
      });
      block_definition(nested_test);
    }
  }, {
    key: 'it',
    value: function it(test_name, test_function) {
      var failure = null;
      try {
        test_function();
      } catch (exception) {
        failure = exception;
      } finally {
        if (failure) {
          this.emit('failure', { name: this.text + ' ' + test_name, error: failure });
        } else {
          this.emit('success', { name: this.text + ' ' + test_name });
        }
      }
    }
  }]);

  return Test;
})(EventEmitter);

module.exports = {
  ConsoleReporter: (function () {
    function ConsoleReporter() {
      _classCallCheck(this, ConsoleReporter);
    }

    _createClass(ConsoleReporter, [{
      key: 'success',
      value: function success(options) {
        console.log(options.name, 'passed!');
      }
    }, {
      key: 'failure',
      value: function failure(options) {
        console.log(options.name, 'failed:', options.error);
      }
    }]);

    return ConsoleReporter;
  })(),

  TestSuite: (function () {
    function TestSuite() {
      _classCallCheck(this, TestSuite);
    }

    _createClass(TestSuite, [{
      key: 'describe',
      value: function describe(text, block) {
        var _this2 = this;

        this.test = new Test(text);
        this.block = block;
        this.test.on('success', function (options) {
          return _this2.reporter.success(options);
        });
        this.test.on('failure', function (options) {
          return _this2.reporter.failure(options);
        });
      }
    }, {
      key: 'run',
      value: function run() {
        this.block(this.test);
      }
    }]);

    return TestSuite;
  })()
};

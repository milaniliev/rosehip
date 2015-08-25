(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rosehip = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],2:[function(_dereq_,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || !!this._all;
    }
    else {
      return !!this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    exports.EventEmitter2 = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],3:[function(_dereq_,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = (function () {
  function ConsoleReporter() {
    _classCallCheck(this, ConsoleReporter);
  }

  _createClass(ConsoleReporter, [{
    key: "success",
    value: function success(options) {
      console.log(options.name, "passed!");
    }
  }, {
    key: "failure",
    value: function failure(options) {
      console.log(options.name, "failed:", options.error);
    }
  }]);

  return ConsoleReporter;
})();

},{}],4:[function(_dereq_,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TestDisplay = function TestDisplay(test, container_element) {
  var _this = this;

  _classCallCheck(this, TestDisplay);

  if (test.runnable) {
    this.element = document.createElement('rosehip_test');
    this.element.innerHTML = '<status>PENDING</status><test_name>' + test.name + '</test_name><stack_trace></stack_trace>';
    this.status_indicator = this.element.querySelector('status');
    this.stack_trace = this.element.querySelector('stack_trace');
    this.stack_trace.style.display = 'none';

    container_element.appendChild(this.element);
    test.on('start', function (options) {
      _this.element.classList.add('running');
      _this.status_indicator.textContent = 'RUNNING';
    });
    test.on('success', function (options) {
      _this.element.classList.remove('running');
      _this.element.classList.add('success');
      _this.status_indicator.textContent = 'P A S S';
    });
    test.on('failure', function (options) {
      _this.element.classList.remove('running');
      _this.element.classList.add('failure');
      _this.status_indicator.textContent = 'F A I L';
      _this.stack_trace.innerHTML = options.error.stack.replace(/\n/g, '<br/>');
      _this.stack_trace.style.display = '';
    });
  } else {
    this.element = document.createElement('rosehip_test_suite');
    this.element.textContent = test.name;
    container_element.appendChild(this.element);
    test.nested_tests.forEach(function (nested_test) {
      var display = new TestDisplay(nested_test, _this.element);
    });
  }
};

module.exports = function WebReporter(element, test) {
  _classCallCheck(this, WebReporter);

  this.element = element;
  this.element.classList.add('rosehip');
  this.test = test;
  this.display = new TestDisplay(test, this.element);
};

},{}],5:[function(_dereq_,module,exports){
var css = ".rosehip {\n  padding: 10px;\n  border: 1px solid #DDD;\n  box-shadow: 1px 1px 2px 0px #DDD\n}\n\n.rosehip rosehip_test_suite {\n  display: block;\n  padding: 10px;\n}\n\n.rosehip rosehip_test {\n  font-family: Helvetica, Arial, sans-serif;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  border-radius: 3px;\n  margin: 10px;\n  border: 1px solid rgba(0,0,0,0.3);\n}\n\n.rosehip rosehip_test > * {\n  padding: 10px;\n}\n\n.rosehip rosehip_test status {\n  display: inline-block;\n  width: 5em;\n  text-align: center;\n  font-weight: bold;\n  font-size: 12px;\n  line-height: 18px;\n  text-shadow: 0px 0px 1px #000;\n}\n.rosehip rosehip_test test_name {\n  display: inline-block;\n  font-weight: normal;\n  text-shadow: 0px 0px 1px rgba(0,0,0,0.4);\n}\n\n.rosehip rosehip_test stack_trace {\n  /*padding-top: 1em;\n  padding-bottom: 1em;*/\n  padding-left: 1em;\n  display: block;\n  font-family: Monaco, Consolas, \"Courier New\", Courier, monospace;\n  font-size: 90%;\n  line-height: 1.5em;\n  border-left: 1px dashed rgb(237, 74, 4);\n  background-color: rgb(255, 243, 237);\n}\n\n.rosehip rosehip_test {\n  border-color: #777;\n  background-color: #EEE;\n}\n\n.rosehip rosehip_test status {\n  border-color: #777;\n  color: white;\n  background-color: #777;\n}\n\n.rosehip rosehip_test.running {\n  border-color: #ffed00;\n  background-color: #fffeeb;\n}\n\n.rosehip rosehip_test.running status {\n  border-color: #ffed00;\n  color: white;\n  background-color: #ffed00;\n}\n\n.rosehip rosehip_test.success {\n  border-color: rgb(90, 191, 0);\n  background-color: rgb(244, 255, 217);\n}\n\n.rosehip rosehip_test.success status {\n  border-color: rgb(91, 194, 0);\n  color: white;\n  background-color: rgb(90, 191, 0);\n}\n\n.rosehip rosehip_test.failure {\n  border-color: rgb(237, 74, 4);\n  background-color: rgb(255, 243, 237);\n}\n\n.rosehip rosehip_test.failure status {\n  border-color: rgb(237, 45, 4);\n  color: white;\n  background-color: rgb(237, 74, 4);\n}\n"; (_dereq_("./../node_modules/cssify"))(css); module.exports = css;
},{"./../node_modules/cssify":1}],6:[function(_dereq_,module,exports){
'use strict';

var style = _dereq_('./rosehip.css'); // auto-included on the page by cssify

module.exports = {
  ConsoleReporter: _dereq_('./reporters/console_reporter.js'),
  WebReporter: _dereq_('./reporters/web_reporter.js'),
  Test: _dereq_('./test.js')
};

},{"./reporters/console_reporter.js":3,"./reporters/web_reporter.js":4,"./rosehip.css":5,"./test.js":7}],7:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var EventEmitter = _dereq_('eventemitter2').EventEmitter2;

module.exports = (function (_EventEmitter) {
  _inherits(Test, _EventEmitter);

  function Test(options) {
    _classCallCheck(this, Test);

    _get(Object.getPrototypeOf(Test.prototype), 'constructor', this).call(this);
    options = options || {};
    this.name = options.name;
    this.parent = options.parent;
    this.test_function = options.test_function;
    this.runnable = options.runnable;
    this.async_timeout = options.async_timeout || 60000;
    this.state = 'not_started';
    this.nested_tests = [];
  }

  _createClass(Test, [{
    key: 'describe',
    value: function describe(name, block_definition) {
      var _this = this;

      var nested_test = new Test({ name: name, parent: this });
      nested_test.on('nested:success', function (options) {
        return _this.emit('nested:success', options);
      });
      nested_test.on('nested:failure', function (options) {
        return _this.emit('nested:failure', options);
      });
      block_definition(nested_test);
      this.nested_tests.push(nested_test);
    }
  }, {
    key: 'it',
    value: function it(name, options, test_function) {
      var _this2 = this;

      if (test_function === undefined) {
        test_function = options;
        options = {};
      }
      var nested_test = new Test({ name: name, runnable: true, test_function: test_function, parent: this, async_timeout: options.async_timeout });
      nested_test.on('success', function (options) {
        return _this2.emit('nested:success', { test: nested_test });
      });
      nested_test.on('failure', function (options) {
        return _this2.emit('nested:failure', { test: nested_test, error: options.error });
      });
      this.nested_tests.push(nested_test);
    }
  }, {
    key: 'run',
    value: function run() {
      if (this.runnable) {
        if (this.test_function.length > 0) {
          return this.run_async_test_function();
        } else {
          return this.run_sync_test_function();
        }
      } else {
        this.nested_tests.forEach(function (nested_test) {
          nested_test.run();
        });
      }
    }
  }, {
    key: 'fail',
    value: function fail(error) {
      this.state = 'failed';
      this.emit('failure', { error: error });
    }
  }, {
    key: 'pass',
    value: function pass() {
      this.state = 'succeeded';
      this.emit('success');
    }
  }, {
    key: 'run_async_test_function',
    value: function run_async_test_function() {
      var _this3 = this;

      var error = null;
      try {
        (function () {
          _this3.state = 'running';
          _this3.emit('start');
          var timeout = setTimeout(function () {
            _this3.fail(new Error('Async function is not done after ' + _this3.async_timeout + 'ms.'));
          }, _this3.async_timeout);
          _this3.test_function(function () {
            clearTimeout(timeout);
            _this3.pass();
          });
        })();
      } catch (exception) {
        error = exception;
      } finally {
        if (error) {
          this.fail(error);
        }
      }
    }
  }, {
    key: 'run_sync_test_function',
    value: function run_sync_test_function() {
      var error = null;
      try {
        this.state = 'running';
        this.emit('start');
        this.test_function();
      } catch (exception) {
        error = exception;
      } finally {
        if (error) {
          this.fail(error);
        } else {
          this.pass();
        }
      }
    }
  }]);

  return Test;
})(EventEmitter);

},{"eventemitter2":2}]},{},[6])(6)
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
var rosehip = require('../../')

var test_suite = new rosehip.Test()

// A carrot
var carrot = {
  type: "vegetable",
  color: "yellow", // this carrot is weird
  wind: function(callback){
    var self = this // setTimeout steals 'this'
    setTimeout(function(){
      self.exploded = true
      callback()
    }, 10000)
  } // I knew it. Yellow carrots?
}

test_suite.describe("A carrot", function(test){
  test.it("is a vegetable", function(){
    expect(carrot.type).to.equal("vegetable")
  })

  test.it("is orange", function(){
    expect(carrot.color).to.equal("orange")
  })

  test.describe("that explodes", function(test){
    test.it("explodes after 10 seconds", function(done){
      carrot.wind(function(){
        expect(carrot.exploded).to.equal(true)
        done()
      })
    })
  })
})

var reporter = new rosehip.WebReporter(document.getElementById('rosehip_report'), test_suite)
setTimeout(function(){
  test_suite.run()
}, 1000)

},{"../../":1}]},{},[2]);

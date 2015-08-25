# Rosehip

An uncomplicated, no-frills unit JavaScript testing library you can use in Node.JS, the browser, or any other JS environment.

## Install

### Node.JS / Browserify:

`npm install --save-dev rosehip`

### Browser standalone:

Download `rosehip.js` (and `rosehip.css`!) and include it:

```html
<link rel="stylesheet" href="rosehip.css"/>
<script type="application/javascript" src="rosehip.js"></script>
```

## Setup
### Node.JS / Browserify:

```javascript
var rosehip = require('rosehip')
var expect = require('expect.js') // Optional; you can use Node's assert or should.js or anything else
```

### Both Node.JS and standalone:

``` javascript
var test_suite = new rosehip.Test()
```
### Reporters

Output to `console.log`:
```javascript
  var reporter = new rosehip.ConsoleReporter(test_suite)
```

Or, if running in a browser:
```javascript
  var element = document.getElementById('test_report')
  var reporter = new rosehip.WebReporter(element, test_suite)
```

## Defining Tests
```javascript
  test_suite.describe("Carrot", function(test){
    test.describe("is a fruit", function(test){
      test.it("which contains vitamin A", function(){
        expect(false).to.equal(true) // With expect.js; change it for your favorite assertion library.
      })
    })
  })
```

Also take a look at these examples:

Standalone: (test/standalone.html)
Browserify: (test/src/test.js)

## Running

```javascript
test_suite.run()
```

# Rosehip

An uncomplicated, no-frills unit JavaScript testing library you can use in Node.JS, the browser, or any other JS environment.

## Install

### Node.JS / Browserify:

`npm install --save-dev rosehip`

### Browser standalone:

Download `rosehip.standalone.js` and include it:

```html
<script type="application/javascript" src="rosehip.standalone.js"></script>
```

## Setup
### Node.JS / Browserify:

```javascript
var rosehip = require('rosehip')
var expect = require('expect.js') // Optional; you can use Node's assert or should.js or anything else
```

### Both Node.JS and standalone:

``` javascript
var test_suite = new rosehip.TestSuite()
test_suite.reporter = new rosehip.ConsoleReporter()
```

## Defining Tests
```javascript
  test_suite.describe("Carrot", function(test){
    test.describe("is a fruit", function(test){
      test.it("which contains vitamin A", function(){
        expect(false).to.be.ok() // With expect.js; change it for your favorite assertion library.
      })
    })
  })
```


## Running

```javascript
test_suite.run()
```

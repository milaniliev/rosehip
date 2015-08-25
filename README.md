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

```

Also take a look at these examples:

* Standalone: [test/standalone.html](test/standalone.html)
* Browserify: [test/src/test.js](test/src/test.js)

## Running

```javascript
test_suite.run()
```

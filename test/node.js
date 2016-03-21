var rosehip = require('../')
var assert = require('assert')

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
    assert.equal(carrot.type, "vegetable")
  })

  test.it("is orange", function(){
    assert.equal(carrot.color, "orange")
  })

  test.describe("that explodes", function(test){
    test.it("explodes after 10 seconds", function(done){
      carrot.wind(function(){
        assert.equal(carrot.exploded, true)
        done() // if this is not called after 60 seconds, test fails.
      })
    })

    test.it("un-explodes after 15 seconds", function(done){
      carrot.wind(function(){
          assert.equal(carrot.exploded, false, "carrot is still exploded")
          done()
      })
    })
  })
})

var reporter = new rosehip.ConsoleReporter(test_suite)
setTimeout(function(){
  test_suite.run()
}, 1000)

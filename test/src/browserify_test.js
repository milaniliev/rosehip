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
        done() // if this is not called after 60 seconds, test fails.
      })
    })
  })
})

var reporter = new rosehip.WebReporter(document.getElementById('rosehip_report'), test_suite)
setTimeout(function(){
  test_suite.run() // delay on purpose to simulate tests running
}, 1000)

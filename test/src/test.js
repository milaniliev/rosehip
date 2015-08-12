var rosehip = require('../../')

var test_suite = new rosehip.TestSuite()
test_suite.reporter = new rosehip.WebReporter(document.getElementById('rosehip_report'))

test_suite.describe("Carrot", function(test){
  test.it("is orange", function(){
    expect("yellow").to.equal("orange")
  })

  test.it("is a vegetable", function(){
    expect("vegetable").to.equal("vegetable")
  })
})

test_suite.run()

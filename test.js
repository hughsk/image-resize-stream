var createStream = require('./')
var path = require('path')
var fs = require('fs')

function visualTest(name, width, height, options) {
  return (
    fs.createReadStream(path.resolve(__dirname, 'fixtures/image.png'))
      .pipe(createStream(width, height, options))
      .pipe(fs.createWriteStream(path.resolve(__dirname + '/test_output', name)))
  )
}

failingTest()
function failingTest() {
  var errored = false
  return (
    fs.createReadStream(__filename)
      .pipe(createStream(200))
      .once('error', function(err) { errored = !!err })
      .once('end', function() { throw new Error('should not emit "end" when failing') })
      .once('close', function() {
        if (errored) return
        throw new Error('failing test did not emit an error')
      })
  )
}

visualTest('100-wide.png', 100, null, { crop: false })
visualTest('100-high.png', null, 100, { crop: false })
visualTest('nocrop-400-300.png', 400, 300, { crop: false })
visualTest('nocrop-800-450.png', 800, 450, { crop: false })
visualTest('crop-400-300.png', 400, 300, { crop: true })
visualTest('crop-800-450.png', 800, 450, { crop: true })

visualTest('crop-10-10.png', 10, 10, { crop: true })
visualTest('crop-25-25.png', 25, 25, { crop: true })
visualTest('crop-50-50.png', 50, 50, { crop: true })
visualTest('crop-75-75.png', 75, 75, { crop: true })
visualTest('crop-100-100.png', 100, 100, { crop: true })
visualTest('crop-250-250.png', 250, 250, { crop: true })

visualTest('thin-horizontal.png', 400, 100, { crop: true })
visualTest('thin-vertical.png', 100, 400, { crop: true })

visualTest('low-quality.jpg', 300, 300, { format: 'jpg', quality: 30 })
visualTest('reasonable-quality.jpg', 300, 300, { format: 'jpg', quality: 60 })
visualTest('high-quality.jpg', 300, 300, { format: 'jpg', quality: 100 })

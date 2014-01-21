var resize = require('resize-logic')
var through2 = require('through2')
var Canvas = require('canvas')
var bl = require('bl')

module.exports = createStream

function createStream(width, height, options) {
  width  = typeof width  === 'number' && width
  height = typeof height === 'number' && height

  var stream = through2(write, flush)
  var concat = bl()

  if (!width && !height) {
    throw new Error(
      'At least one of "width" or "height" must be supplied'
    )
  }

  options = options || {}
  options.format = String(
    options.format || 'png'
  ).toLowerCase()

  if (!/^png|jpg$/g.test(options.format)) {
    throw new Error(
      'Invaild format supplied: "' + options.format + '". ' +
      'Must be either "png" or "jpg"'
    )
  }

  return stream

  function write(chunk, enc, next) {
    concat.append(chunk)
    next()
  }

  function flush() {
    var image = new Canvas.Image

    image.onerror = onerror
    image.onload = onload
    image.src = concat.slice()

    function onerror(err) {
      stream.emit('error', err)
      stream.emit('close')
    }

    function onload() {
      var dims = resize({
          original: [image.width, image.height]
        , width:    width || null
        , height:   height || null
        , crop:     !!options.crop
        , smaller:  !!options.smaller
      })

      var canvas = new Canvas(
          dims.canvasDimensions[0]
        , dims.canvasDimensions[1]
      )

      var ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(image
        , dims.drawPosition[0]
        , dims.drawPosition[1]
        , dims.drawDimensions[0]
        , dims.drawDimensions[1]
      )

      ;(options.format !== 'jpg'
        ? canvas.pngStream()
        : canvas.jpegStream({
            quality: options.quality
          , progressive: options.progressive
        })
      ).on('data', function(data) {
        stream.push(data)
      }).once('end', function() {
        stream.push(null)
      })
    }
  }
}

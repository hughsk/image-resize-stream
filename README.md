# image-resize-stream [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/image-resize-stream&title=image-resize-stream&description=hughsk/image-resize-stream%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

A streaming interface for resizing image buffers in node.

Internally, this is actually buffering the stream input before creating the
resized image using the [canvas](http://github.com/learnboost/node-canvas)
module and pushing out the new image buffer synchronously. So there's room
for improvement - pull requests welcome :)

## Usage ##

[![image-resize-stream](https://nodei.co/npm/image-resize-stream.png?mini=true)](https://nodei.co/npm/image-resize-stream)

### `createStream(width, height[, options])` ###

Creates a transform stream which will take an image buffer as input, streaming
out a resized image buffer as output. Both `width` and `height` are optional
parameters, but you must specify at least one of them. You can omit them by
passing in `null`, e.g. to resize to fit 100 pixels high:

``` javascript
var resize = require('image-resize-stream')
var fs = require('fs')

fs.createReadStream('original.png')
  .pipe(resize(null, 100))
  .pipe(fs.createWriteStream('original-100.png'))
```

The stream's options are as follows:

* `crop`: either `true` or `false`, defaulting to `false`.
* `format`: may be either `png` or `jpg`.
* `quality`: if creating a jpg image, this should be a number between 0 and 100
  to determine the quality of the output image.
* `smaller`: whether to scale to handle the smallest of width/height
  or heighest, when both are supplied. Defaults to `false`.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/image-resize-stream/blob/master/LICENSE.md) for details.

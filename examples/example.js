// Copyright (c)2012 The Obvious Corporation

/**
 * @fileoverview Very basic example showing usage of `nodesoy`.  Try changing message.soy while
 * running this example to see the effects of dynamic recompilation.
 */

var nodesoy = require('../lib/nodesoy')

var USER = process.env.USER || 'Stranger'

nodesoy.setOptions({
    outputDir: '/tmp/nodesoy-example'
  , uniqueDir: true
  , allowDynamicRecompile: true
  , eraseTemporaryFiles: true
})

nodesoy.compileTemplates(__dirname, function (err) {
  if (err) throw err

  console.log('Templates are ready, Ctrl-C to exit')

  setInterval(function () {
    console.log(nodesoy.render('example.message.hello', {
        name: USER
      , date: new Date().toLocaleTimeString()
      , variantToUse: Date.now() % 2 ? 'alpha' : 'beta'
    }))
  }, 1000)

  process.on('SIGINT', function () {
    console.log(nodesoy.render('example.message.bye', {
        name: USER
    }))
    process.exit(0)
  })

})

// Copyright (c)2015. Unreal.

/**
 * @fileoverview Public interface exposed to users of `soynode`.
 */

var SoyCompiler = require('./SoyCompiler')

// Public API.  See function declarations for JSDoc.
module.exports = new SoyCompiler()
module.exports.SoyCompiler = SoyCompiler

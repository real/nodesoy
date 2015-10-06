nodesoy
=======

[![Build Status](https://travis-ci.org/real/nodesoy.svg)](https://travis-ci.org/real/nodesoy)

Utility for working with [Closure Templates](https://developers.google.com/closure/templates/),
aka Soy, from within a node.js application.  Supports dynamic recompilation and loading for fast
iteration during development.


Installing
----------

Either:

1. Fork, clone or download the source from GitHub, or
2. Install via NPM using `npm install nodesoy`


Usage
-----

```js
var nodesoy = require('../lib/nodesoy')

nodesoy.setOptions({
    outputDir: '/tmp/nodesoy-example'
  , allowDynamicRecompile: true
})

nodesoy.compileTemplates(__dirname, function (err) {
  if (err) throw err
  // Templates are now ready to use.
  console.log(nodesoy.render('example.message.hello', {
      name: process.env.USER
    , date: new Date().toLocaleTimeString()
  }))
})
```

Also, see `examples/example.js`.

`nodesoy.get(templatename)` - Returns a JS function corresponding to the template name.

`nodesoy.render(templatename, data)` - Returns a string that results from executing a template.

`nodesoy.setOptions(opts)` - Change the options, see section below.

`nodesoy.compileTemplates(dir, callback)` - Compiles and loads all `.soy` files in the directory.

`nodesoy.compileTemplateFiles(files, callback)` - Compiles and loads all `.soy` files.

`nodesoy.loadCompiledTemplates(dir, callback)` - Loads already compiled templates.

`nodesoy.loadCompiledTemplateFiles(files, callback)` - Loads already compiled templates.

Where "template name" is referred to, it means the namespace + template name as defined in the Soy
file, and the full JS name that the Soy Compiler generates, for example `project.section.screen`.
See the [Hello World JS](https://developers.google.com/closure/templates/docs/helloworld_js) doc on
the Closure site for more background.

Options
-------

Options can be set via `nodesoy.setOptions(options)`. Most of these mirror 
[the command-line arguments](https://developers.google.com/closure/templates/docs/javascript_usage)
for `SoyToJsSrcCompiler`. The keys can contain the following:

- `tmpDir` {string} Path to a directory where temporary files will be written during compilation. {Deprecated: use outputDir}
  [Default: /tmp/nodesoy]
- `inputDir` {string} Optional path to a directory where files will be read. When compiled from a directory, this option will be overwritten with the caller inputDir. [Default: process.cwd()]
- `outputDir` {string} Path to a directory where files will be written. [Default: null]
- `uniqueDir` {boolean} Determines whether the compiled files will be placed in a unique directory. [Default: true]
- `allowDynamicRecompile` {boolean} Whether to watch for changes to the templates. [Default: false]
- `loadCompiledTemplates` {boolean} Whether or not to load the compiled templates. Relevant when you only need to build templates. [Default: true]
- `eraseTemporaryFiles` {boolean} Whether to erase temporary files after a compilation.
[Default: false]
- `concatOutput` {boolean} Whether the compiled soy.js files should be joined into a single file. This is helpful for loading templates in a browser and simplest to use when `outputDir` is explicitly set and `uniqueDir` is false. [Default: false]
- `concatFileName` {string} File name used for concatenated files, only relevant when concatOutput is true, ".soy.concat.js" is appended, so don't include ".js" yourself. [Default: compiled]
- `locales` {Array.<string>} List of locales to translate the templates to.
- `messageFilePathFormat` {string} Path to the translation file to use, which can contain any of the placeholders allowed on the --messageFilePathFormat option of SoyToJsSrcCompiler.jar.
- `cssHandlingScheme` {string} Processing options for the `css` command. [More info](https://developers.google.com/closure/templates/docs/commands#css)

**NOTE: Options should be set before templates are loaded or compiled.**

Internationalizion
--------------------

To take advantage of soy's [translation](https://developers.google.com/closure/templates/docs/translation) features through nodesoy, you should set the `locales` and `messageFilePathFormat` options, like in the example below:

```js
var nodesoy = require('../lib/nodesoy')

nodesoy.setOptions({
    locales: ['pt-BR', 'es'],
    messageFilePathFormat: '/tmp/nodesoy-example/translations.xlf',
    outputDir: '/tmp/nodesoy-example'
})

nodesoy.compileTemplates(__dirname, function (err) {
  if (err) throw err
  // Templates are now ready to use, render specifying the desired locale.
  console.log(nodesoy.render('example.message.hello', {}, {}, 'pt-BR'))
  console.log(nodesoy.render('example.message.hello', {}, {}, 'es'))
})
```

Implementation Notes
--------------------

The templates are loaded using Node's [VM Module](http://nodejs.org/api/vm.html).  This allows us to
execute the generated `.soy.js` files as is without a post processing step and without leaking the
template functions into the global scope.

Calling `nodesoy.get` executes code which returns a reference to the template function within the
VM Context.  The reference is cached, providing a 10x speed up over fetching the template function
each time, or evaluating it in place and returning the template output over the VM boundary.

Contributing
------------

Questions, comments, bug reports, and pull requests are all welcome. Submit them at
[the project on GitHub](https://github.com/real/nodesoy/).

Bug reports that include steps-to-reproduce (including code) are the best. Even better, make them in
the form of pull requests.

Author
------

[Ariel Saldana](https://github.com/arielsaldana)
([personal website](http://ahhriel.com)), supported by
[Unreal](http://unreal.io/).

License
-------

Copyright 2015 [Unreal](http://unreal.io/).

Licensed under the Apache License, Version 2.0.
See the top-level file `LICENSE.txt` and
(http://www.apache.org/licenses/LICENSE-2.0).

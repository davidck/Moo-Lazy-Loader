/*
--- 
description: LazyLoader
authors: 
- David Chan CK (http://www.reol.com)
license:
- MIT-style license
requires: 
- core/1.2.4: '*'
- more/1.2.4.2: [Utilities.Assets]
provides: [LazyLoader]
...
*/
var LazyLoader = new Class(
{
  Implements: [Events, Options],
  options:
  {
  /*
    onLoad: $empty(thisElement, event),
    onProcessStart: $empty(thisElement, event),
    onProcessEnd: $empty(thisElement, event),
  */
    autoStart: true,
    path: '{Klass}.js',
  },
  initialize: function(klass, args, options)
  {
    this.setOptions(options);
    var opts = this.options;
    
    this.klass = klass;
    this.args = args;
    
    this.load();
  },
  load: function()
  {
    var opts = this.options, script = opts.path.substitute({Klass: this.klass});
    new Asset.javascript(script,
    {
      'onload': this.loaded.bind(this)
    });
  },
  loaded: function()
  {
    this.fireEvent('load');
    if (this.options.autoStart)
    {
      this.process();
    }
  },
  process: function()
  {
    var klass = null;
    this.fireEvent('processStart');
    if (!$defined(this.instance))
    {
      eval('this.Klass = '+this.klass);
    }
    this.instance = this.instantiate(this.Klass);
    this.fireEvent('processEnd');
  },
  /*
    If you have more than six parameters in your constructor, then something's probably wrong with your design.
    However, the root of the issue is not being able to transform an array to parameters.
    If you absolutely need more than six params, then override this method.
  */
  instantiate: function(Klass)
  {
    var args = this.args;
    return new Klass(args[0], args[1], args[2], args[3], args[4], args[5]);
  }.protect(),
  getInstance: function()
  {
    return this.instance;
  }
});
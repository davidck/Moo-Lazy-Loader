/*
--- 
description: LazyLoader
authors: 
- David Chan CK (http://www.reol.com)
license:
- MIT-style license
requires: 
- core/1.3: '*'
- more/1.3.1: [Utilities.Assets]
provides: [LazyLoader]
...
*/
var LazyLoader = new Class
({
  Implements: [Events, Options],
  options:
  {
  /*
    onLoad: $empty(thisElement, event),
    onProcessStart: $empty(thisElement, event),
    onProcessEnd: $empty(thisElement, event),
  */
    autoStart: true,
    path: '{Klass}.js'
  },
  initialize: function(klass, args, options)
  {
    this.setOptions(options);
    var opts = this.options;
    
    this.klass = klass;
    this.args = args;
    this.instance;
    
    this.load();
  },
  instantiate: function(Klass)
  {
    var args = this.args;
    return new Klass(args[0], args[1], args[2], args[3], args[4], args[5]);
  }.protect(),
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
    if (this.instance == undefined)
      eval('this.Klass = '+this.klass);
    this.instance = this.instantiate(this.Klass);
    this.fireEvent('processEnd');
  },
  getInstance: function()
  {
    return this.instance;
  }
});

LazyLoader.Multiple = new Class (
{
  Implements: [Events, Options],
  Extends: LazyLoader,
  initialize: function(klasses, options)
  {
    this.setOptions(options);
    var opts = this.options;

    this.klasses = klasses;

    this.load(0);
  },
  load: function(i)
  {
    var opts = this.options, script;

    if (i > this.klasses.length-1)
    {
      this.fireEvent('load');
      return;
    }

    script = opts.path.substitute({Klass: this.klasses[i]});

    new Asset.javascript(script,
    {
      'onload': this.load.bind(this, i+1)
    });
  }
});
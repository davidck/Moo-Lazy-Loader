
/*
--- 
description: ScriptLoader
authors: 
- David Chan CK (http://www.davidchan.com)
license:
- MIT-style license
requires: 
- core/1.5.2: '*'
- more/1.5.2: [Utilities.Assets]
- more/1.5.2: [Class.Refactor]
provides: [ScriptLoader]
...
*/
var ScriptLoader = new Class
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
  emulate: function()
  {
    var args = arguments;
  },
  instantiate: function()
  {
    var Klass = this.Klass;
    Class.refactor(Klass,
    {
      initialize: function()
      {
        this.previous.apply(this, arguments[0]);
      }
    });
    return new Klass(arguments);
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
    this.instance = this.instantiate.apply(this, this.args);
    this.fireEvent('processEnd');
  },
  getInstance: function()
  {
    return this.instance;
  }
});

ScriptLoader.Multiple = new Class (
{
  Implements: [Events, Options],
  Extends: ScriptLoader,
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
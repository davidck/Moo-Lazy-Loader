var Dummy = new Class(
{
  initialize: function(a, b)
  {
    alert ('init');
    this.h = h;
  },
  getArgs: function()
  {
    return a+' and '+b;
  }
});
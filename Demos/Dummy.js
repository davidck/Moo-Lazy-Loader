var Dummy = new Class(
{
  initialize: function(h)
  {
		alert ('init');
    this.h = h;
  },
	getH: function()
	{
		return this.h;
	}
});
var CharacterModel = Backbone.Model.extend({
	defaults: {
    correct: null,
	  dirty: false,
    isCurrent: false
	},
  initialize: function (params) {
    //console.log(params.char)
    //this.set('char', params.char);
  }

});

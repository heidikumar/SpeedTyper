var AppModel = Backbone.Model.extend({

  /*
  * Initializes backbone models to be used in views.
  */
  initialize: function(params) {
    this.set('gameDisplay', new GameDisplayModel());
    this.set('speedTyper', new SpeedTyperModel());
    this.set('keyPressModel', new KeyPressModel());
  }

});
var WordCollection = Backbone.Collection.extend({
  model: CharacterModel,
  initialize: function (params) {
    // console.log(params.word)
    // console.log(this.models)
    this.isCurrentWord = false;
    this.listenTo(this, 'add', this.updateListeners);
  },
  checkWordCorrectness: function (lastChar, isCharCurrent) {
    console.log('Checkcorrect');
    if(!this.isCurrentWord) {
      return;
    }
    if(isCharCurrent) {
      return;
    }
    if(this.every(correct)){
      console.log('correct');
      this.trigger('correct', this);
    }

    function correct (char) {
      return char.get('correct')
    }
  },
  checkIfCurrent: function (firstChar, isCurrentChar) {
    if(this.every(notCurrent) && this.isCurrentWord) {
      console.log('not current')
      this.trigger('decrementCurrentWord', this);
    }

    function notCurrent (char) {
      return !char.get('isCurrent');
    }
  },
  updateListeners: function () { 
    this.stopListening();
    this.listenTo(this.first(), 'change:isCurrent', this.checkIfCurrent);
    this.listenTo(this.last(), 'change:isCurrent', this.checkWordCorrectness);
  }
});
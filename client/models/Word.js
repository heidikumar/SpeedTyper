var Word = Backbone.Model.extend({
  defaults: {
    isCurrentWord: false,
    wasScored:false
  },
  initialize: function (params) {
    // console.log(params.word)
    // console.log(this.models)
    this.set('chars', new CharactersCollection);
    this.listenTo(this.get('chars'), 'add', this.updateListeners);
  },
  checkWordCorrectness: function (lastChar, isCharCurrent) {
    if(isCharCurrent) {
      return;
    }
    if(!this.get('isCurrentWord')) {
      return;
    }
    if(this.get('chars').every(correct)){
      this.trigger('correct', this);
    }

    function correct (char) {
      return char.get('correct')
    }
  },
  checkIfCurrent: function () {
    if(this.get('chars').every(notCurrent) && this.get('isCurrentWord') ){
      //this.set('inFocus', false);
      this.trigger('decrementCurrentWord', this);
    }

    function notCurrent (char) {
      return !char.get('isCurrent');
    }
  },
  updateListeners: function (char, chars) { 
    this.stopListening();
    this.listenTo(chars.first(), 'change:isCurrent', this.checkIfCurrent);
    this.listenTo(chars.last(), 'change:isCurrent', this.checkWordCorrectness);
  }
});
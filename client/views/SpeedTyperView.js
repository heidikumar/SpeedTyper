/*
* SpeedTyperView is a container for the interactive player portion of the
*  game, which exist in statsView, inputView and paragraphView.
*/
var SpeedTyperView = Backbone.View.extend({
  
  tagName: "div",
  id: "textContainer",

  initialize: function ( params ) {
    this.keyModel = params.keyModel;
    window.animatingScroll = false;
    //window.topPos;
    window.scrolled = false;
    this.words = [];
    this.wordsViews = [];

    this.currentWordIdx = 0;
    this.currentCharIdx = 0;

    this.allChars = new CharactersCollection();
    
    var chars = params.text.trim().split('');
    var word = [];
    for(var i=0; i< chars.length; i++) {
      var newChar = new CharacterModel({char: chars[i]});
      this.allChars.add(newChar);
      if(chars[i] === ' ' || i === chars.length-1){
        word.push(newChar);
        var newWord =  new Word
        newWord.get('chars').add(word);
        this.words.push( newWord );
        word = [];
      } else {
        word.push(newChar);
      }
    }
    this.render();
    this.allChars.models[0].set('isCurrent', true);
    this.words[0].set('isCurrentWord', true);
    this.listenTo(this.words[0], 'correct', this.setNextWord);
    this.listenTo(this.words[0], 'decrementCurrentWord', this.decrementCurrentWord);

    this.lineNum =0;
    this.animating = false;
    this.top = 0;
    $(document).on('keydown', this.keyDownEventHandler.bind(this) );
    this.$('#input_bar').focus();
  },

  render: function () {
    var $speedTyper = $('<div/>', {id:'text'});
    _.each(this.words, function (word) {
      $speedTyper.append(new WordView({model: word}).$el);
    });
    this.$el.append($speedTyper);

    var $hiddenInput = $('<input>', {type:'text', class: 'hidden', id: 'input_bar'});
    $('#appContainer').append($hiddenInput);
    $hiddenInput.blur(function () {
      $hiddenInput.focus();
    });
    
    return this.$el;
  }, 

  keyDownEventHandler: function (e) {
    var BACKSPACE = 8;
    var SHIFT = 16;
    
    e.preventDefault();

    var c = e.which;
    if(c === SHIFT){
      return;
    }
    var currentCharModel = this.allChars.models[this.currentCharIdx];
    var currChar = currentCharModel.get('char');
    if(c === BACKSPACE) {
      if (this.currentCharIdx === 0) { return; }

      currentCharModel.set('correct', null);
      this.currentCharIdx--;
      currentCharModel.set('isCurrent', false);
      this.allChars.models[this.currentCharIdx].set('isCurrent', true);
      return;
    }
    // var keypress = {
    //     time: e.timestamp,
    //     key: key,
    //     correct: checkCorrect(key)
    //   };
    c = convertKeydownToChar(c, e);
    if(typeof c === 'number') { return; }

    if(c === currChar){
      currentCharModel.set('correct', true);
      this.keyModel.updateOneKeyPress(currChar, true);
    } else {
      currentCharModel.set('correct', false);
      currentCharModel.set('dirty', true);
      this.keyModel.updateOneKeyPress(currChar, false);
    }
    if (this.currentCharIdx === this.allChars.length-1) { return; }
    this.currentCharIdx++;
    this.allChars.models[this.currentCharIdx].set('isCurrent', true);
    currentCharModel.set('isCurrent', false);
    this.$('#input_bar').focus();
  },
  setNextWord: function (word) {
    console.log('next');
    this.stopListening();
    this.currentWordIdx++;
    if(this.currentWordIdx === this.words.length) {

    }

    this.listenTo(this.words[this.currentWordIdx], 'correct', this.setNextWord);
    this.listenTo(this.words[this.currentWordIdx], 'decrementCurrentWord', this.decrementCurrentWord);
    this.words[this.currentWordIdx].set('isCurrentWord', true);
    word.set('isCurrentWord', false);
    if(!word.get('wasScored')) {
      this.trigger('correctWord');
      word.set('wasScored', true);
    }
  },
  decrementCurrentWord: function (word) {
    console.log('dec')
    this.stopListening();

    this.currentWordIdx = this.currentWordIdx > 0 ? --this.currentWordIdx : this.currentWordIdx;

    this.listenTo(this.words[this.currentWordIdx], 'correct', this.setNextWord);
    this.listenTo(this.words[this.currentWordIdx], 'decrementCurrentWord', this.decrementCurrentWord);
    this.words[this.currentWordIdx].set('isCurrentWord', true);
    word.set('isCurrentWord', false);
  }

});
function convertKeydownToChar (c, e) {
  //Using code from 
  //http://stackoverflow.com/questions/2220196/how-to-decode-character-pressed-from-jquerys-keydowns-event-handler 
  var _to_ascii = {
    '188': '44',
    '109': '45',
    '190': '46',
    '191': '47',
    '192': '96',
    '220': '92',
    '222': '39',
    '221': '93',
    '219': '91',
    '173': '45',
    '187': '61', //IE Key codes
    '186': '59', //IE Key codes
    '189': '45'  //IE Key codes
  }

  var shiftUps = {
    "96": "~",
    "49": "!",
    "50": "@",
    "51": "#",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "48": ")",
    "45": "_",
    "61": "+",  
    "91": "{",
    "93": "}",
    "92": "|",
    "59": ":",
    "39": "\"",
    "44": "<",
    "46": ">",
    "47": "?"
  };
  if (_to_ascii.hasOwnProperty(c)) {
      c = _to_ascii[c];
  }

  if (!e.shiftKey && (c >= 65 && c <= 90)) {
      c = String.fromCharCode(c + 32);
  } else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
      //get shifted keyCode value
      c = shiftUps[c];
  } else {
      c = String.fromCharCode(c);
  }
  return c;
}
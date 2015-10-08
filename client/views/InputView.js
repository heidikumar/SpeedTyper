/*
* InputView contains the html input field and its handlers when the
* user types.
*/
var InputView = Backbone.View.extend({

  tagName: "input",
  id: "input_bar",
  className: "noOutline form-control",

  initialize: function () {
    this.render();

    /*
    * Initially the input box is disabled to prevent user typing. When the
    * beginGame trigger is detected, the view will enable the user to type.
    */
    this.model.bind("beginGame", this.beginGame.bind(this));
    this.$el.prop("disabled", true);

    /*
    * Add a game over event listener to disable the input box so they cannot
    * type
    */
    this.model.on('change:gameOver', this.disableInput, this);
  },

  events: {
    /*
    * html input event handler is fired every time a user enters a new character
    *   into the input box. The handler does two things:
    * Calls space handler if the last button pressed was space
    * Otherwise calls spell checker with the current input to determine if the
    *   user typed an incorrect letter.
    */
    'input': function (e) {
      var currentInput = e.target.value;
      if( currentInput[currentInput.length-1] === " " ){
        this.spacePressHandler(e);
      }
      else {
        this.$el.removeClass(this.model.get("prevResult"));
        this.$el.addClass("noOutline");
        this.spellChecker(currentInput);
      }
    },
  },

  render: function () {
    return this.$el;
  },

  /*
  * beginGame removes the 'disabled' property from the input box once the game
  *   has begun, allowing the user to begin typing.
  */
  beginGame: function () {
    // alert('begin');
    this.$el.prop("disabled", false);
  },

  /*
  * spacePressHandler grabs the input text and calls the model handler with it,
  *   then removes any styling and adds the appropriate styling class based on the
  *   correctness of the word submitted.
  */
  spacePressHandler: function (e) {
    var currentInput = e.target.value;
    this.model.spaceHandler(currentInput.substring(0, currentInput.length-1));
    this.$el.removeClass("warning noOutline");
    this.$el.addClass(this.model.get("prevResult"));
    e.target.value = "";
    this.$el.attr('placeholder', this.model.getCurrentWord());
  },

  /*
  * spellChecker checks if the current input is incorrect and attaches
  *   styling to the input box to notify the user.
  */
  spellChecker: function (currentInput) {
    var currentWord = this.model.getCurrentWord();
    if( currentInput !== currentWord.substring(0, currentInput.length)) {
      this.$el.addClass("warning");
    } else {
      this.$el.removeClass("warning");
    }
  },

  /*
  * disableInput turns the "disabled" property on the input element to true so
  * user cannot type
  */
  disableInput: function () {
    this.$el.prop("disabled", true);
  }

});
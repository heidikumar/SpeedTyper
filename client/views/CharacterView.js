var CharacterView = Backbone.View.extend({

  className: "char",
  initialize: function () {
    this.render();
    this.listenTo(this.model, 'change:isCurrent', this.renderCursor);
    this.listenTo(this.model, 'change:correct', this.renderCorrect);
  },
  render: function (){
    var char = this.model.get('char');
    if (char === ' ') {
      this.$el = $('<span/>').html('&nbsp;');
    } else {
      this.$el = $('<span/>').text(char);
    }
    return this.$el;
  },
  renderCursor: function () {
    if(!window.topPos) {
      window.topPos = 0;
      window.startPos = this.$el.parent().parent().position().top;
    }
    if (this.model.get('isCurrent')) {
      this.$el.addClass('cursor');

      var parentPos = this.$el.parent().position().top;
      if (parentPos > window.startPos + 37 && !window.animatingScroll){
        window.animatingScroll = true;
        window.scrolled = true;

        window.topPos += (window.startPos - parentPos)/2;
        
        $('#text').animate({'margin-top':window.topPos }, 300, function () {
          console.log('animate')
          window.animatingScroll = false;
        });
      } else if (parentPos < window.startPos + 8 && !window.animatingScroll && window.scrolled) {
        window.animatingScroll = true;
        window.topPos += (window.startPos - parentPos);
        
        $('#text').animate({'margin-top':window.topPos }, 300, function () {
          console.log('animate')
          window.animatingScroll = false;
        });
      }
    } else {
      this.$el.removeClass('cursor');
    }
  },
  renderCorrect: function (char, correct) {
    this.$el.removeClass();
    if (correct) {
      var type = this.model.get('dirty') ? 'corrected' : 'correct';
      this.$el.addClass('correct');
    } else if (correct === false){
      this.$el.addClass('incorrect');
    } else if (correct === null){
      this.$el.removeClass('correct corrected incorrect');
    }
  }
});
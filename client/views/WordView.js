var WordView = Backbone.View.extend({
  tagName: 'span',
  className: 'word',
  initialize: function () {
    this.render();
    this.listenTo(this.model.get('chars'), 'change:isCurrent', this.renderCurrentWord);
    this.listenTo(this.model, 'change:isCurrentWord', this.renderCurrentWord);
  },
  render: function (){
    var $chars = this.model.get('chars').map(function (char) {
      return new CharacterView({model: char}).$el;
    });
    this.$el.append($chars);
    return this.$el;
  },
  renderCurrentWord: function () {
    this.$el.removeClass('current-word skipped');

    if(this.model.get('isCurrentWord')) {
      this.$el.addClass('current-word');
      if(!this.model.get('chars').some(function(char){ 
          return char.get('isCurrent'); 
        })
      ){
        this.$el.addClass('skipped');
      }
    } else {
      this.$el.removeClass('current-word skipped');
    }
  }
});
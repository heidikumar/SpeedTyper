var AppView = Backbone.View.extend({
  tagName: 'div',
  id: 'appContainer',

  initialize: function(params) {
    /*
    * Initialize socket, set it on the model and put
    * a connect handler on it.
    */
    this.socket =  io.connect();
    this.socket.on('connect', function () {
      console.log('Connected!');
    })

    /*
    * Add event listeners for the socket object. The handlers:
    * match: emmitted from socket when two players are connected and the
    *   game client should begin.
    * update: emitted from socket when the opponents score has changed.
    * win: emmitted from socket when this player has a winning score differential
    * lose: emmitted from socket when opponent has a winning score differential
    */
    this.socket.on('update', this.updateOpponentScore.bind(this));
    this.socket.on('win', this.gameWin.bind(this));
    this.socket.on('lose', this.gameLose.bind(this));
    this.socket.on('match', this.beginGame.bind(this));
    this.renderLogin();
  },

  renderLogin: function(){
    this.$el.append($('<h1>Speed Typer</h1>').addClass('title'));
    //this.$el.append($('<h3>Enter Username</h3>'));
    $input = $('<input>', {type:'text', placeholder: 'Enter Username', class: 'nameInput'});
    $form = $('<form/>').append($input);
    this.$el.append($form);
    var that = this;
    $form.submit(function (e) {
      e.preventDefault();
      that.username = $input.val();
      that.socket.emit('login', {username: that.username});
      console.log(that.username)
      that.renderJoinScreen();
    });
  },
  renderJoinScreen: function () {
    this.$el.empty();
    this.$el.append($('<h1>Speed Typer</h1>').addClass('title'));
    var $btn = $('<button>Join Game</button>').addClass('btn');
    this.$el.append($btn);

    $btn.click(this.joinGame.bind(this));
  },
  joinGame: function () {
    $('button').remove();
    this.$el.append($('<h3>Searching for game...</h3>').addClass('subHeading'));
    this.socket.emit('requestJoinGame', {username: this.username});
  },
  beginGame: function (data){
    console.log('FoundGame!');
    $('h3').remove();
    this.$el.append($('<h3>Starting Game</h3>').addClass('subHeading'));
    this.playerScore = 0;
    this.opponentScore = 0;
    this.opponentName = data.opponentName;
    this.fetchText();
  },
  fetchText: function() {
    var that = this;

    $.get('/text', function(data, response) {
        that.renderGame(data.text);
    });
  },
  renderGame: function (text){
    this.$el.empty();

    this.$el.append($('<div/>', {class:'player'}).text(this.username) );
    this.$el.append($('<div/>', {class:'opponent'}).text(this.opponentName) );
    this.game = new GameScreen(window.innerWidth, 100, 40);
    this.game.initialize();
    this.game.render(0,0);

    this.gameView = new SpeedTyperView({text: text});
    this.$el.append(this.gameView.$el);

    this.listenTo(this.gameView, 'correctWord', this.updatePlayerScore);
  },
  updatePlayerScore: function () {
    console.log('updateScore')
    this.playerScore++;
    this.socket.emit('update', {score: this.playerScore});
    this.game.render(this.playerScore, this.opponentScore);
  },
  updateOpponentScore: function (data) {
    this.opponentScore = data.score;
    this.game.render(this.playerScore, this.opponentScore);
  },
  gameWin: function () {

  },
  gameLose: function () {

  },
  renderStats: function () {

  }
});
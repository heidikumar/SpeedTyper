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
    var $findbtn = $('<button>Find Game</button>').addClass('btn');
    this.$el.append($findbtn);

    $findbtn.click(this.joinGame.bind(this));

    var $joinPrivatebtn = $('<button>Private Game</button>').addClass('btn');
    this.$el.append($joinPrivatebtn);

    $joinPrivatebtn.click(this.joinPrivateGame.bind(this));
  },
  joinGame: function () {
    $('button').remove();
    this.$el.append($('<h3>Searching for game...</h3>').addClass('subHeading'));
    this.socket.emit('requestJoinGame', {username: this.username});
  },
  beginGame: function (data){
    console.log('FoundGame!');
    $('h3').remove();
    $('h4').remove();
    $('h5').remove();
    $('input').remove();
    this.$el.append($('<h3>Starting Game</h3>').addClass('subHeading'));

    this.playerScore = 0;
    this.opponentScore = 0;
    this.opponentName = data.opponentName;

    this.keyPressModel = new KeyPressModel;
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

    this.gameView = new SpeedTyperView({text: text, keyModel: this.keyPressModel});
    this.$el.append(this.gameView.$el);

    //var graph = new KeyPress_BarGraphView({model: this.keyPressModel, domID:'#bargraph'});
    this.keyboard = new KeyboardView({model: this.keyPressModel});

    this.listenTo(this.gameView, 'correctWord', this.updatePlayerScore);
    this.startTime = Date.now();
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
    var wpm = Math.round(this.calculateWPM(this.startTime, Date.now(), this.playerScore));

    this.stopListening();
    $('#input_bar').off('keydown');
    $('#input_bar').remove();
    $('body').animate({opacity: 0}, (function () {

    this.$el.empty();
    $('#keyboard').remove();
    this.keyboard.remove();
    this.gameView.remove();

    this.$el.append($('<h1>You Win!</h1>').addClass('end'));
    this.graph = new KeyPress_BarGraphView({model: this.keyPressModel, domID:'#bargraph'});
    this.graph.reanimateBarGraphs();

    this.$el.append($('<h3>WPM: ' + wpm + '</h3>').addClass('score'));

    var $btn = $('<button>New Game</button>').addClass('end-btn');
    this.$el.append($btn);
    $btn.click(this.newGame.bind(this));


    $('body').css({opacity: 0});
    $('body').animate({opacity: 1});

    }).bind(this));
  },
  gameLose: function () {
    var wpm = Math.round(this.calculateWPM(this.startTime, Date.now(), this.playerScore));

    this.stopListening();
    $('#input_bar').off('keydown');
    $('#input_bar').remove();
    $('#input_bar').off('keydown');
    
    $('body').animate({opacity: 0}, (function () {

    this.$el.empty();
    $('#keyboard').remove();
    this.keyboard.remove();
    this.gameView.remove();

    this.$el.append($('<h1>You Lose</h1>').addClass('end'));
    this.graph = new KeyPress_BarGraphView({model: this.keyPressModel, domID:'#bargraph'});
    this.graph.reanimateBarGraphs();

    this.$el.append($('<h3>WPM: ' + wpm + '</h3>').addClass('score'));

    var $btn = $('<button>New Game</button>').addClass('end-btn');
    this.$el.append($btn);
    $btn.click(this.newGame.bind(this));


    $('body').css({opacity: 0});
    $('body').animate({opacity: 1});
    }).bind(this));
  },
  newGame: function () {
    $('#bargraph').remove();
    this.graph.remove();
    //$('body').empty();
    this.renderJoinScreen();
  },
  calculateWPM: function (startTime, endTime, words){
    return words/( (endTime - startTime)/1000/60 );
  },
  joinPrivateGame: function () {
    var that = this;
    this.socket.on('waitForFriend', function (data) {
      that.renderPrivateJoin(data.id);
    });
    this.socket.emit('requestJoinPrivateGame', {});
  },
  renderPrivateJoin: function (mySocket) {
    this.$el.empty();
    this.$el.append($('<h1>Speed Typer</h1>').addClass('title'));
    this.$el.append($('<h3>Your game ID is <b>' + mySocket + '</b></h3>'));
    this.$el.append($('<h4>Give friend your ID or enter friends game ID below</h4>').css({'margin-top':'40px'}));
    $input = $('<input>', {type:'text', placeholder: 'Enter gameID to join', class: 'nameInput'}).css({'margin-top':'1%'});
    $form = $('<form/>').append($input);
    this.$el.append($form);

    var $message = $('<h5/>').addClass('warn');
    this.$el.append($message);

    var that = this;
    $form.submit(function (e) {
      e.preventDefault();
      that.socket.emit('requestJoinPrivateGame', {friendId: $input.val()});
      $input.val('');
    });
    this.socket.on('joinPrivateGameDenied', function (data) {
      $message.text(data.message);
    });
  }
});
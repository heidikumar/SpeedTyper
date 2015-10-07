var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var handlers = require('./request-handlers');
var socketHandlers = require('./socket-handlers');


// Middleware
var parser = require('body-parser');

var port = process.env.PORT || 3000;

// Set what we are listening on.
app.set("port", port);

// Logging and parsing
app.use(parser.json());

// Serve the client files
app.use(express.static(__dirname + "/../client"));


// If we are being run directly, run the server.
if (!module.parent) {
  http.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}

/*----------  Server Cache  ----------*/

var users = { numberOfUsers: 0 };

/*----------  Socket listeners  ----------*/

io.on('connection', function (socket) {

  // 'login' listener for 'login' event, emitted from AppView
  socket.on('login', function() {
    socketHandlers.loginUser(socket);
    users.numberOfUsers++;

    console.log('There are ' + users.numberOfUsers + ' users connected.');
    console.log('This is the users object:\n', users);

    // If there are enough users to play, emit 'match' event to all sockets
    if (users.numberOfUsers === 2) {
      console.log('\nThere are two users, emitting "match" event.\n');
      io.emit('match');
    }
  });

  socket.on('update', function (data) {
    // update the opponent with this user's data
    // pass in anonymous function to be executed upon update completion
    socketHandlers.updateScore(socket, data, function () {
      // save the result of checkForEndGame to see if it
      // is necessary to emit an update event
      socket.broadcast.emit('update', data);
      var endGameStatus = socketHandlers.checkForEndGame(socket);

    });
  });

});


/*----------  Routes  ----------*/


// request user data from database
app.use('/user', handlers.user);

// login user and create session
app.use('/login', handlers.login);

// register a new user to the databse
app.use('/register', handlers.register);

// serve passage to the client
app.use('/text', handlers.text);

module.exports.users = users;

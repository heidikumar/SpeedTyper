var server = require('./server');

/*----------  Server Cache  ----------*/

exports.users = { count: 0 };
var waiting = [];

/*----------  Handler Functions  ----------*/

exports.loginUser = function (data, socketId) {
  // Save a new user to the server's users cache
  exports.users[socketId] = { score: 0, opponent: null };
  exports.users.count++;
  console.log('This is the users object:\n', exports.users);
};

exports.joinGameOrWait = function (socketId) {
  // Check if opponent is available
  if (waiting.length > 0) {
    var opponentId = waiting.shift();
    // Set the opponent of each player
    exports.users[socketId].opponent = opponentId;
    exports.users[opponentId].opponent = socketId;
    console.log('\nPlayer ' + socketId + ' is matched with ' + opponentId);
    return opponentId;
  } else {
    // User joins the waiting queue
    waiting.push(socketId);
    console.log('\nPlayer ' + socketId + ' is waiting for an opponent');
    return null;
  }
};

exports.updateScore = function (socketId, data) {
  // Update player's score
  exports.users[socketId].score = data.score;
  // socket.userData.score = data.score;
  console.log('\n\n Server cache after socket update: \n', exports.users);
};

exports.checkForEndGame = function (socketId, opponentId) {

  // Get current scores
  var playerScore = exports.users[socketId].score;
  var opponentScore = exports.users[opponentId].score;

  // If game over, reset data in server's users cache and return winner/loser
  if (Math.abs(playerScore - opponentScore) >= 20) {
    exports.users[socketId].opponent = null;
    exports.users[socketId].score = 0;
    exports.users[opponentId].opponent = null;
    exports.users[opponentId].score = 0;

    if (playerScore > opponentScore) {
      return { winner: socketId, loser: opponentId };
    } else {
      return { winner: opponentId, loser: socketId };
    }
  } else {
    return null;   // not game over yet
  }
};

exports.removePlayer = function (socketId, opponentId) {
  // If user has an opponent
  if (opponentId) {
    exports.users[opponentId].opponent = null;
  }
  // If user is in waiting queue, remove it
  for (var i = 0; i < waiting.length; i++) {
    if (waiting[i] === socketId) {
      waiting.splice(i, 1);
    }
  }
  // Remove user from the server's users cache
  delete exports.users[socketId];
  exports.users.count--;
};
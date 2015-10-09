var server = require('./server');

/*----------  Server Cache  ----------*/


exports.users = { count: 0 };
var waiting = []; // socket ids of all users waiting to play a game

/* users object

Contains all users who are currently logged in
{
  count: 2,
  'hgCYB0Z-swGY4pwmAAAB':   // socket id
    {
      username: balls,
      score: 15,
      opponent: 'JtMFxG3tAiXwcl2DAAAC'   // null if not currently playing
    },
  'JtMFxG3tAiXwcl2DAAAC':
    {
      username: speedy,
      score: 0,
      opponent: 'hgCYB0Z-swGY4pwmAAAB'
    }
}

*/


/*----------  Handler Functions  ----------*/

exports.loginUser = function (data, socketId) {
  // Save a new user to the server's users cache
  exports.users[socketId] =
    { username: data.username, score: 0, opponent: null };
  exports.users.count++;
  console.log('This is the users object:\n', exports.users);
};

exports.waitForGame = function (socketId) {
  waiting.push(socketId);
};

exports.matchPlayers = function() {
  console.log("\nin waiting room: " + waiting);
  var matches = [];
  while (waiting.length >= 2) {
    var player1 = waiting.shift();
    var player2 = waiting.shift();
    matches.push([player1, player2]);
    // Set the opponent of each player
    exports.users[player1].opponent = player2;
    exports.users[player2].opponent = player1;
    console.log('\nServer matched player ' + player1 + ' with ' + player2);
  }
  console.log("\nTell players these matches: " + matches);
  return matches;
};

// exports.joinGameOrWait = function (socketId) {
//   // Check if opponent is available
//   if (waiting.length > 0) {
//     // Get the opponent data
//     var opponentId = waiting.shift();
//     // Set the opponent of each player
//     exports.users[socketId].opponent = opponentId;
//     exports.users[opponentId].opponent = socketId;
//     console.log('\nPlayer ' + socketId + ' is matched with ' + opponentId);
//     return opponentId;
//   } else {
//     // User joins the waiting queue
//     waiting.push(socketId);
//     console.log('\nPlayer ' + socketId + ' is waiting for an opponent');
//     return null;
//   }
// };

exports.updateScore = function (socketId, data) {
  // Update player's score
  exports.users[socketId].score = data.score;
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
  // If user has an opponent, reset its opponent in users cache
  if (opponentId) {
    exports.users[opponentId].opponent = null;
    exports.users[opponentId].score = 0;
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
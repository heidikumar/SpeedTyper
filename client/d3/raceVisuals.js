var GameScreen = function (width, height, threshold) {
  this.width = width;
  this.height = height;
  this.threshold = threshold;

  // this.player = new Racer(player);
  // this.opponent = new Racer(opponent);
}

GameScreen.prototype.initialize = function () {
  var div = d3.select('#appContainer')
              // .append('div')
              // .attr('id', 'competition')
              .append('svg:svg')
              .attr('width', this.width)
              .attr('height', this.height)

  var svg = d3.select('svg');

  svg.selectAll('rect')
    .data([
      [this.threshold/2, '#C477E2', 0],
      [this.threshold/2, '#77D7E2', this.threshold/2]
    ])
    .enter()
    .append('rect')
}

GameScreen.prototype.render = function (playerScore, oppScore) { 

  // var total = this.player.model.get('numCorrect') + this.opponent.model.get('numCorrect');

  // function to scale the score based on the width of the svg
  var scale = d3.scale.linear().domain([0, this.threshold]).range([0, this.width]);

  // var difference = this.player.model.get('numCorrect') - this.opponent.model.get('numCorrect')
  var difference = playerScore - oppScore;

  var playerData = [scale(this.threshold/2 + difference), '#C477E2', 0];
  var opponentData = [scale(this.threshold - (this.threshold/2 + difference)), '#77D7E2', scale(this.threshold/2 + difference)];

  var data = []
  data.push(playerData);
  data.push(opponentData);

  var svg = d3.select('svg')

  svg.selectAll('rect')
    .data(data)
    .transition()
    .duration(400)
    .attr('width', function(d){
      return d[0];
    })
    .attr('height', 20)
    .attr('fill', function(d){
      return d[1];
    })
    .attr('x', function(d){
      return d[2];
    });
}

//pass in backbone syntax new Racer({model: model})
var Racer = function (player) {
  this.model = player.model;
}

var RacerModel = function(correct){
  this.model = {
    numCorrect: correct,
    get: function(key){
      return this[key];
    }
  }
}

// var player = new RacerModel(20);
// var opponent = new RacerModel(20);
// var count = 0;

// var game = new GameScreen(600, 300, 60, player, opponent);
// game.initialize();
// game.render();

// setInterval(function(){
//   if(count % 3 === 0){
//     player.model.numCorrect += 4;
//     opponent.model.numCorrect += 1;
//   }
//   else if (count % 5 === 0){
//     player.model.numCorrect += 1;
//     opponent.model.numCorrect += 9; 
//   }
//   else {
//     player.model.numCorrect += 2;
//     opponent.model.numCorrect += 3;
//   }
//   count++;
// }, 100);

// setInterval(function(){
//   game.render();
// }, 500)

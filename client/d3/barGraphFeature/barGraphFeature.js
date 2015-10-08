// Bar Graph Feature Object
var BarGraphFeature = function () {
  // Heat map colors used for graph
  this.heatMapColors = {
    goodColor: {
      r: 0x00,
      g: 0x66,
      b: 0xff,
      color: '#0066ff'
    },
    badColor: {
      r: 0xcc,
      g: 0x00,
      b: 0x00,
      color: '#cc0000'
    }
  }
  // Initialize
  this.initialize();
};

// Initialize function
BarGraphFeature.prototype.initialize = function () {
  // Select body and append div for letters
  d3.select('body')
    .append('div')
    .attr('id', 'barGraphFeature_Letters')
    .style('position', 'relative')
    .style('width', '100%')
    .style('height', '250px')
    .style('background-color', '#111111')
    .style('font-size', '16px')
    .style('padding-left', '10px')
    .style('top', '' + window.innerHeight/8 + 'px')
    .style('transform', 'rotatex(180deg)')
    .style('-ms-transform', 'rotatex(180deg)')
    .style('-webkit-transform', 'rotatex(180deg)');

  // Select body and append div for letters
  d3.select('body')
    .append('div')
    .attr('id', 'barGraphFeature_NonLetters')
    .style('position', 'relative')
    .style('width', '100%')
    .style('height', '250px')
    .style('background-color', '#aaaaaa')
    .style('font-size', '16px')
    .style('padding-left', '10px')
    .style('top', '' + window.innerHeight/8 + 'px')
    .style('transform', 'rotatex(180deg)')
    .style('-ms-transform', 'rotatex(180deg)')
    .style('-webkit-transform', 'rotatex(180deg)');

  // Initialize mock data
  this.initializeMockData();

  // Initialize bar graph
  this.initializeBarGraph();
};

// Initializes random mock data for keypresses
BarGraphFeature.prototype.initializeMockData = function () {
  // Make data randomly based off of ASCII
  this.mockData = {};
  for (var i = 32; i < 127; ++i) {
    var totalPresses = Math.floor(Math.random() * 100);
    var goodPresses = Math.floor(Math.random() * totalPresses);
    this.mockData[String.fromCharCode(i)] = {
      // Correct key press
      goodPresses: /*0*/goodPresses,
      // Incorrect key press
      badPresses: /*0*/totalPresses - goodPresses
    }
  }
};

// Filters mock data for only letters
BarGraphFeature.prototype.filterMockData = function (filterStr) {
  // If the filter string is letters
  var letters = filterStr === 'letters';
  // Resulting keys
  var result = [];
  // Get all of the letters
  for (var key in this.mockData) {
    // Letter match
    if (letters && key.search(/[a-zA-Z]/) !== -1) {
      result.push(key);
    }
    // Non letter match
    else if (!letters && key.search(/[^a-zA-Z]/) !== -1) {
      result.push(key);
    }
  }
  // Return all keys (used for d3 data)
  return result;
};

// Initializes the bar graph for keypresses
BarGraphFeature.prototype.initializeBarGraph = function () {
  var that = this;
  var dataset = this.mockData;

  // Visualize letters data
  var datasetLetters = this.filterMockData('letters');
  var parentBottom = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', '')) + window.innerHeight;
  var parentHeight = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', ''));
  d3.select('body #barGraphFeature_Letters').selectAll('div')
    .data(datasetLetters)
    .enter()
    .append('div')
    .attr('class', 'bar_letters')
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      if (!totalPresses) {
        console.log('TP_Letter:', totalPresses);
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    })
    .style('color', '#eeeeee')
    .style('text-align', 'center')
    .transition()
    .duration(1000)
    .text('_')
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    .each('end', function () {
      d3.select(this)
        .append('p')
        .text(function (d) {return d;})
        .style('transform', 'rotatex(180deg)')
        .style('-ms-transform', 'rotatex(180deg)')
        .style('-webkit-transform', 'rotatex(180deg)')
        .style('margin', '0px');
    });
  
  // Visualize non letters data
  var datasetNonLetters = this.filterMockData('notLetters');
  d3.select('body #barGraphFeature_NonLetters').selectAll('div')
    .data(datasetNonLetters)
    .enter()
    .append('div')
    .attr('class', 'bar_nonLetters')
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      if (!totalPresses) {
        console.log('TP_NonLetter:', d, totalPresses);
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    })
    .style('color', '#eeeeee')
    .style('text-align', 'center')
    .transition()
    .duration(1000)
    .text('_')
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    .each('end', function () {
      d3.select(this)
        .append('p')
        .text(function (d) {
          if (d === ' ') {
            return '" "';
          } else {
            return d;
          }
        })
        .style('transform', 'rotatex(180deg)')
        .style('-ms-transform', 'rotatex(180deg)')
        .style('-webkit-transform', 'rotatex(180deg)')
        .style('margin', '0px');
    });
};

// Interprets a ratio to a fixed range of colors
// (red, blue)
BarGraphFeature.prototype.interpretToColor = function (ratio) {
  var colorRatio = 0xff * ratio;
  var redHex = Math.round(colorRatio) << 16;
  var blueHex = Math.round(0xff - colorRatio);
  var result = (redHex + blueHex).toString(16);
  // Pad with 0s in front
  while (result.length < 6) {
    result = "0" + result;
  }
  result = "#" + result;
  return result;
};

// Interprets a ratio to a dynamic color range
BarGraphFeature.prototype.interpretToColor_Dynamic = function (ratio) {
  // Get colors from heatmap
  var goodColor = this.heatMapColors.goodColor;
  var badColor = this.heatMapColors.badColor;

  // Get red difference
  var redVal = goodColor.r;
  var redDiff = Math.abs(badColor.r - goodColor.r) * ratio;
  if (goodColor.r < badColor.r) {
    redVal += redDiff;
  } else {
    // badColor.r <= goodColor.r
    redVal -= redDiff;
  }

  // Get green difference
  var greenVal = goodColor.g;
  var greenDiff = Math.abs(badColor.g - goodColor.g) * ratio;
  if (goodColor.g < badColor.g) {
    greenVal += greenDiff;
  } else {
    // badColor.g <= goodColor.g
    greenVal -= greenDiff;
  }

  // Get blue difference
  var blueVal = goodColor.b;
  var blueDiff = Math.abs(badColor.b - goodColor.b) * ratio;
  if (goodColor.b < badColor.b) {
    blueVal += blueDiff;
  } else {
    // badColor.b <= goodColor.b
    blueVal -= blueDiff;
  }

  // Get result as string in CSS hex format
  var result = ''
    + (Math.round((redVal << 16) + (greenVal << 8) + blueVal)).toString(16);
  // Pad with preceding 0s
  while (result.length < 6) {
    result = '0' + result;
  }
  // Add # for css style string
  result = '#' + result;
  return result;
};

// Interprets a bar chart ratio and returns a height
BarGraphFeature.prototype.interpretToHeight = function (count) {
  return 25 * count/100;
};

// Reanimates all bar graph heights
BarGraphFeature.prototype.reanimateHeights = function () {
  var that = this;
  var dataset = this.mockData;
  var parentBottom = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', '')) + window.innerHeight;
  var parentHeight = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', ''));

  // Visualize letters data
  var datasetLetters = this.filterMockData('letters');
  d3.select('body')
    .selectAll('#barGraphFeature_Letters .bar_letters')
    .data(datasetLetters)
    .transition()
    .duration(1000)
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      if (!totalPresses) {
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    });

  // Visualize non letters data
  var datasetNonLetters = this.filterMockData('notLetters');
  d3.select('body')
    .selectAll('#barGraphFeature_NonLetters .bar_nonLetters')
    .data(datasetNonLetters)
    .transition()
    .duration(1000)
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      if (!totalPresses) {
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    });
};

// Updates mockData[key]'s press variables based on boolean
BarGraphFeature.prototype.addOneKeypressStat = function (key, bool) {
  bool ? this.mockData[key].goodPresses++
    : this.mockData[key].badPresses++;
  // Re animate
  this.reanimateHeights();
};

$(document).ready(function () {
  // Initialize instance
  var barGraphFeature = new BarGraphFeature();

  // Animate bars randomly
  setInterval(function () {
    barGraphFeature.initializeMockData();
    barGraphFeature.reanimateHeights();
  }, 1500);

  // Populate data with keypresses
  /*$('body').keydown(function (e) {
    console.log('called');
    e.preventDefault();
    console.log(e.isDefaultPrevented());
    var key = String.fromCharCode(e.which);
    console.log(key);
    var trueOrFalse = Math.round(Math.random()) === 1;
    barGraphFeature.addOneKeypressStat(key, trueOrFalse);
  });*/
});

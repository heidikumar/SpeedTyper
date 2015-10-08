// Bar Graph Feature Object
var BarGraphFeature = function () {
  // Heat map colors used for graph
  this.heatMapColors = {
    // Color used when user gets 100% correct
    goodColor: {
      r: 0x00,
      g: 0x66,
      b: 0xff,
      color: '#0066ff'
    },
    // Color used when user gets 0% correct
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
  // filterStr should be 'letters' if looking for letters
  // 'notLetters' if looking for all other characters
  var letters = (filterStr === 'letters');
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
  // Get reference to this, and it's dataset
  var that = this;
  var dataset = this.mockData;

  // Parent div parameters used for sizing
  var parentHeight = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', ''));
  
  // Get keys for all letters
  var datasetLetters = this.filterMockData('letters');

  // Visualize letters data
  d3.select('body #barGraphFeature_Letters').selectAll('div')
    // Use letters data
    .data(datasetLetters)
    .enter()
    // Add div
    .append('div')
    // Add .bar_letters
    .attr('class', 'bar_letters')
    // Heatmap background-color
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      // Avoid 0/0 in code after if statement
      if (!totalPresses) {
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    })
    // Animate
    .transition()
    .duration(1000)
    // Bars animate improperly without text value ...
    // Whitespace doesn't work
    .text('_')
    // Set height based on occurence
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    // Add text for each bar's associated key
    // When finished with transition
    .each('end', function () {
      d3.select(this)
        .append('p')
        // CSS magic to make text right-side up
        .text(function (d) {return d;})
        .style('transform', 'rotatex(180deg)')
        .style('-ms-transform', 'rotatex(180deg)')
        .style('-webkit-transform', 'rotatex(180deg)')
        .style('margin', '0px');
    });

  // Calculate individual bar widths and margin widths
  var parentWidth = Number(d3
    .select('body #barGraphFeature_Letters')
    .style('width').replace('px', ''));

  // Get percentage widths for this chart
  var percentageWidths = this.getPercentageWidths({
    totalWidth: parentWidth,
    barCount: datasetLetters.length,
    totalBarPercentage: .9,
    totalMarginPercentage: .1
  });

  // Set margin left and right using jQuery
  $('.bar_letters').css('width',
    percentageWidths.oneBarWidth);
  $('.bar_letters').css('margin',
    percentageWidths.halfMarginWidth);

  // Get keys for all non letters
  var datasetNonLetters = this.filterMockData('notLetters');

  // Visualize non letters data (same as above, differnet data)
  d3.select('body #barGraphFeature_NonLetters').selectAll('div')
    .data(datasetNonLetters)
    .enter()
    .append('div')
    .attr('class', 'bar_nonLetters')
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      if (!totalPresses) {
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    })
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
            return '';
          } else {
            return d;
          }
        })
        .style('transform', 'rotatex(180deg)')
        .style('-ms-transform', 'rotatex(180deg)')
        .style('-webkit-transform', 'rotatex(180deg)')
        .style('margin', '0px');
    });

  // Calculate individual bar widths and margin widths
  parentWidth = Number(d3
    .select('body #barGraphFeature_NonLetters')
    .style('width').replace('px', ''));

  // Get percentage widths for this chart
  percentageWidths = this.getPercentageWidths({
    totalWidth: parentWidth,
    barCount: datasetNonLetters.length,
    totalBarPercentage: .9,
    totalMarginPercentage: .1
  });

  // Set margin left and right using jQuery
  $('.bar_nonLetters').css('width',
    percentageWidths.oneBarWidth);
  $('.bar_nonLetters').css('margin',
    percentageWidths.halfMarginWidth);
};

// A function that calculates the % widths and margins
// for the bars
BarGraphFeature.prototype.getPercentageWidths = function (data) {
  // Assign parameters
  var totalWidth = data.totalWidth;
  var barCount = data.barCount;
  var totalBarPercentage = data.totalBarPercentage;
  var totalMarginPercentage = data.totalMarginPercentage;

  // Width for bars (percentage of containing div)
  var totalBarWidth = totalWidth * totalBarPercentage;
  var oneBarWidth = 100 * (totalBarWidth / barCount) / totalWidth;
  oneBarWidth = '' + oneBarWidth + '%';

  // Width for margins (1/2 left, 1/2 right)
  // (percentage of containing div)
  var totalMarginWidth = totalWidth * totalMarginPercentage;
  var halfMarginWidth
    = 100 * (totalMarginWidth / (2 * barCount)) / totalWidth;
  halfMarginWidth = '' + halfMarginWidth + '%';

  // Return result
  return {
    oneBarWidth: oneBarWidth,
    halfMarginWidth: halfMarginWidth
  };
};

// Interprets a ratio to a fixed range of colors
// (red === 0% correct, blue === 100% correct)
BarGraphFeature.prototype.interpretToColor = function (ratio) {
  // Binary magic
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
  // Reference to this and the required dataset
  var that = this;
  var dataset = this.mockData;

  // Parent height
  var parentHeight = Number(d3
    .selectAll('#barGraphFeature_Letters')
    .style('height').replace('px', ''));

  // Visualize letters data
  var datasetLetters = this.filterMockData('letters');
  // Select all .bar_letters
  d3.select('body')
    .selectAll('#barGraphFeature_Letters .bar_letters')
    // Assign data
    .data(datasetLetters)
    // Animate
    .transition()
    .duration(1000)
    // Calculate height based off of occurence
    .style('height', function (d) {
      var totalPresses = dataset[d].goodPresses
        + dataset[d].badPresses;
      var barHeight
        = (dataset[d].goodPresses/totalPresses * .7 + .3 )
            * parentHeight;
      return barHeight + 'px';
    })
    // Heatmap background-color
    .style('background-color', function (d) {
      var totalPresses = dataset[d].badPresses
        + dataset[d].goodPresses;
      // Avoid 0/0 in following code after if block
      if (!totalPresses) {
        return that.heatMapColors.goodColor.color;
      }
      var badPresses
        = dataset[d].badPresses;
      return that.interpretToColor_Dynamic(badPresses/totalPresses);
    });

  // Visualize non letters data (same as above, different data)
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
  // If the user was supposed to press 'key' and did
    // Increment good presses
  // Otherwise, the user was supposed to press 'key' and did not
    // Increment bad presses
  bool ? this.mockData[key].goodPresses++
    : this.mockData[key].badPresses++;
  // Re animate heatmaps and heights
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

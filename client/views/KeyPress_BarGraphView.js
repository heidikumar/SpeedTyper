// Bar graph view for the KeyPressModel
var KeyPress_BarGraphView = Backbone.View.extend({

  // Set DOM tag
  tagName: 'div',

  // Initialize
  /*data: {
      domID: '#someID',
      model: some_KeyPressModel_instance
    }
   */
  initialize: function (data) {
    // Set domID
    this.domID = data.domID;
    // Set graph ids
    this.graphIDs = [
      '#barGraphView_Graph_Letters',
      '#barGraphView_Graph_NonLetters'
    ];
    // Graph titles
    this.graphTitles = ['Letters', 'Non-Letters'];
    // Set bar classes
    this.graphBarClasses = [
      '.barGraphView_Graph_Letters_GraphBar',
      '.barGraphView_Graph_NonLetters_GraphBar'
    ];

    // Key filters for bar graphs
    this.filters = {
      // Letter keys
      letterKeys: [],
      // Non letter keys
      nonLetterKeys: []
    };
    // Initialize filters
    this.initializeFilters();

    // Add listeners
    this.initializeListeners();

    // Initialize view
    this.initializeGraphViews();
    // Initialize variable params
    this.initializeBarGraphViewParams();

    // Constantly reanimate
    var that = this;
    /*setInterval(function () {
      that.reanimateBarGraphs();
      that.model.initializeKeyPressData();
    }, 1100);*/

    // Randomly generate individual key presses
    this.model.simulateKeyPresses(10, .5);
  },

  // Makes filters for data for letters and ~letters
  initializeFilters: function () {
    // References
    var letterKeys = this.filters.letterKeys;
    var nonLetterKeys = this.filters.nonLetterKeys;
    var keyPressData = this.model.get('keyPressData');
    // For all keys in mock data
    for (var key in keyPressData) {
      // Letter match
      if (key.search(/[a-zA-Z]/) !== -1) {
        letterKeys.push(key);
      } else {
        // Non letter match
        nonLetterKeys.push(key);
      }
    }
  },

  // Initialize all listeners for model changes
  initializeListeners: function () {
    // On a keypress change, animate the data
    var that = this;
    this.model.on('updateOneKeyPress', function (key) {
      // Animate an individual bar
      that.reanimateOneBar(key);
    });
  },

  // Initialize graphs
  initializeGraphViews: function () {
    // Make initial element
    d3.select('body')
      .append(this.tagName)
      .attr('id', this.domID.replace('#', ''))
      .style('text-align', 'center')
      .style('color', 'black')
      .style('border', '5px solid black')
      .style('border-radius', '.5em')
      .style('margin-top', '20px')
      .style('width', '50%')
      .style('margin-left', '25%')
      // Append title
      .append('h2')
      .text('Keyboard Accuracy Graph')
    
    // Append scale text
    var scaleVars = ['Poor', 'Good'];
    d3.select('body ' + this.domID)
      .append('ul')
      .style('list-style-type', 'none')
      .style('margin', '0')
      .style('padding', '0')
      .selectAll('li')
      .data(scaleVars)
      .enter()
      .append('li')
      .attr('class', 'barGraphView_ScaleTitle')
      .text(function (d) {
        return d;
      });

    // Append gradient scale
    d3.select('body ' + this.domID)
      .append('div')
      // Background image gradient
      .style('background-image',
        'linear-gradient(to right, '
          + this.model.get('heatMapColors').badColor.color
          + ', '
          + this.model.get('heatMapColors').goodColor.color
          + ')')
      // Safari
      .style('background-image',
        '-webkit-linear-gradient(left, '
          + this.model.get('heatMapColors').badColor.color
          + ', '
          + this.model.get('heatMapColors').goodColor.color
          + ')')
      // Opera
      .style('background-image',
        '-o-linear-gradient(right, '
          + this.model.get('heatMapColors').badColor.color
          + ', '
          + this.model.get('heatMapColors').goodColor.color
          + ')')
      // Firefox
      .style('background-image',
        '-moz-linear-gradient(right, '
          + this.model.get('heatMapColors').badColor.color
          + ', '
          + this.model.get('heatMapColors').goodColor.color
          + ')')
      // General styling
      .style('width', '25%')
      .style('height', '20px')
      .style('margin', '1% auto')
      .style('border-radius', '5px');

    // Iterate over graph ids
    var graphIDs = this.graphIDs;
    for (var i = 0; i < graphIDs.length; ++i) {
      // Select parent in DOM
      d3.select('body ' + this.domID)
        // Add div
        .append('div')
        // Add class
        .attr('class', 'barGraphView_Graph')
        // Add id
        .attr('id', graphIDs[i].replace('#', ''));
      // Add bottom margin to last element
      if(i === graphIDs.length - 1) {
        d3.select('body ' + graphIDs[i])
          .style('margin-bottom', '2%');
      }
    }
  },

  // Initialize individual bar parameters
  initializeBarGraphViewParams: function () {
    // Mock data
    var keyPressData = this.model.get('keyPressData');

    // Height of containing div
    var containerHeight = Number(d3
      .selectAll(this.graphIDs[0])
      .style('height').replace('px', ''));
    // Width of containing div
    var containerWidth = Number(d3
      .selectAll(this.graphIDs[0])
      .style('width').replace('px', ''));

    // Dataset filters
    var filters = [
      this.filters.letterKeys,
      this.filters.nonLetterKeys
    ];

    // Visualize data for each filter
    for (var i = 0; i < filters.length; ++i) {
      // Select corresponding graph
      d3.select('body ' + this.graphIDs[i])
        // All inner divs
        .selectAll('div')
        // Filter keys for mock data
        .data(filters[i])
        .enter()
        // Add div
        .append('div')
        // Add general and specific bar class
        .attr('class', 'barGraphView_Graph_Bar '
          + this.graphBarClasses[i].replace('.', ''))
        // Add specific id based on key's char code
        .attr('id', function (d) {
          return 'barGraphView_Graph_BarID_'
            + d.charCodeAt(0);
        })
        // Add text
        .text('_')
        // Add text to each bar
        .each(function (d) {
          d3.select(this)
            .append('p')
            .text(function () {
              // Special for whitespace
              if (d === ' ') {
                return '()';
              }
              // Otherwise return d
              return d;
            });
        });

      // Get percentage widths for this char
      var percentageWidths = this.getPercentageBarWidths({
        totalWidth: containerWidth,
        barCount: filters[i].length,
        totalBarPercentage: .9,
        totalMarginPercentage: .1
      });

      // Set margins and width
      d3.selectAll(this.graphIDs[i] + ' ' + this.graphBarClasses[i])
        .style('width', percentageWidths.oneBarWidth)
        .style('margin', '0 '
          + percentageWidths.halfMarginWidth);
    }
  },

  // Calculates % widths and margins for a
  // specified graph
  getPercentageBarWidths: function (data) {
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
  },

  // Reanimates bar heights based on new data
  reanimateBarGraphs: function () {
    // Reference to current this
    var that = this;

    // Mock data
    var keyPressData = this.model.get('keyPressData');

    // Height of containing div
    var containerHeight = Number(d3
      .selectAll(this.graphIDs[0])
      .style('height').replace('px', ''));
    // Width of containing div
    var containerWidth = Number(d3
      .selectAll(this.graphIDs[0])
      .style('width').replace('px', ''));

    // Dataset filters
    var filters = [
      this.filters.letterKeys,
      this.filters.nonLetterKeys
    ];

    // Visualize data for each filter
    for (var i = 0; i < filters.length; ++i) {
      // Select corresponding graph
      d3.selectAll(this.graphIDs[i] + ' ' + this.graphBarClasses[i])
        // Assign data
        .data(filters[i])
        // Animate
        .transition()
        .duration(1000)
        // Calculate height based off of occurence
        .style('height', function (d) {
          var totalPresses = keyPressData[d].goodPresses
            + keyPressData[d].badPresses;
          var barHeight
            = (keyPressData[d].goodPresses/totalPresses * .7 + .3)
              * containerHeight;
          return barHeight + 'px';
        })
        // Calculate color based on heat mapping
        .style('background-color', function (d) {
          // Get all presses
          var totalPresses = keyPressData[d].badPresses
            + keyPressData[d].goodPresses;
          // Avoid division by 0
          if (!totalPresses) {
            return that.model.get('heatMapColors').goodColor.color;
          }
          // Get bad press ratio mapping
          var badPressRatio = keyPressData[d].badPresses / totalPresses;
          return that.model.interpretToColor_Dynamic(badPressRatio);
        });
    }
  },

  // Reanimate an individual bar height
  reanimateOneBar: function (key) {
    // This binding
    var that = this;

    // Get keyPressData
    var keyPressData = this.model.get('keyPressData');

    // Height of containing div
    var containerHeight = Number(d3
      .selectAll(this.graphIDs[0])
      .style('height').replace('px', ''));

    // Bar DOM id
    var barID = '#barGraphView_Graph_BarID_'
      + key.charCodeAt(0);

    // Animate the bar
    d3.select('body ' + barID)
      // Transition
      .transition()
      .duration(100)
      // Calculate height based off of occurence
      .style('height', function () {
        var totalPresses = keyPressData[key].goodPresses
          + keyPressData[key].badPresses;
        var barHeight
          = (keyPressData[key].goodPresses/totalPresses * .6 + .3)
            * containerHeight;
        return barHeight + 'px';
      })
      // Calculate color based on heat mapping
      .style('background-color', function () {
        // Get all presses
        var totalPresses = keyPressData[key].badPresses
          + keyPressData[key].goodPresses;
        // Avoid division by 0
        if (!totalPresses) {
          return that.model.get('heatMapColors').goodColor.color;
        }
        // Get bad press ratio mapping
        var badPressRatio
          = keyPressData[key].badPresses / totalPresses;
        return that.model.interpretToColor_Dynamic(badPressRatio);
      });
  }
});
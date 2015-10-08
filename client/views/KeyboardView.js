var KeyboardView = Backbone.View.extend({

  tagName: "div",

  className: "keyboardContainer",

  defaults: {
    keyboardPathLibrary: {
      ' ': '#path185','a': '#path65','b': '#path93','c': '#path91','d': '#path69',
      'e': '#path45','f': '#path71','g': '#path73','h': '#path75','i': '#path55',
      'j': '#path77','k': '#path79','l': '#path81','m': '#path97','n': '#path95',
      'o': '#path57','p': '#path59','q': '#path41','r': '#path47','s': '#path67',
      't': '#path49','u': '#path53','v': '#path65','w': '#path43','x': '#path89',
      'y': '#path51','z': '#path87','A': '#path65','B': '#path93','C': '#path91',
      'D': '#path69','E': '#path45','F': '#path71','G': '#path73','H': '#path75',
      'I': '#path55','J': '#path77','K': '#path79','L': '#path81','M': '#path97',
      'N': '#path95','O': '#path57','P': '#path59','Q': '#path41','R': '#path47',
      'S': '#path67','T': '#path49','U': '#path53','V': '#path65','W': '#path43',
      'X': '#path89','Y': '#path51','Z': '#path87'
    }
  },

  initialize: function () {
    that = this;
    this.options = _.extend({}, this.defaults, this.options);
    this.mock = this.initializeMockData();

    var keyboardFull = d3.xml("https://upload.wikimedia.org/wikipedia/commons/3/3a/Qwerty.svg",
      "image/svg+xml", function(xml) {
        that.makeKeyboard(xml);
    });

  },

  makeKeyboard : function (xml) {
      document.body
      .appendChild(xml.documentElement)
      .setAttribute("id", "keyboard");

      var toClearOut = ["#path781", "#path783", "#path785", "#path817", "#path799",
        "#path801", "#path803", "#path805", "#path819"];
      //Paths for legend text
      var textToClear = ["#g805", "#g809", "#g813", "#g787", "#g791", "#g795",
        "#g821", "#g825"];

      var fill = "#97c5d5";

      $("body").on('keypress', '#input_bar', function (event) {
        var keyCode = event.keyCode;
        var letter = String.fromCharCode(keyCode);
        that.typeOnKey(letter, "#d3d3d3");
      });

      $("body").on('keyup', '#input_bar', function (event) {
        var keyCode = event.keyCode;
        var letter = String.fromCharCode(keyCode);
        that.typeOnKey(letter, "#97c5d5");    //binding error: this is reset within function.
      });

      //clearing out the colors from the legend
      for (var i=0; i<toClearOut.length; i++) {
        d3.select('#keyboard')
          .selectAll("g")
          .select(toClearOut[i])
          .style("fill", "#eeeeee");
      };

      //clearing out the text from the legend
      for (var j=0; j<textToClear.length; j++) {
        d3.select('#keyboard')
          .selectAll("g")
          .selectAll(textToClear[j])
          .remove();
      };
  },

  interpretToColor : function (ratio) {
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
  },

  interpretToColor_Dynamic : function (ratio) {
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
  },

  initializeMockData : function () {
    var mockData = {};
    // Make data randomly based off of ASCII
    for (var i = 32; i < 127; ++i) {
      var totalPresses = Math.floor(Math.random() * 100);
      var goodPresses = Math.floor(Math.random() * totalPresses);
      mockData[String.fromCharCode(i)] = {
        // Correct key press
        goodPresses: goodPresses,
        // Incorrect key press
        badPresses: totalPresses - goodPresses
      };
    };
    return mockData;
  },

  calculateRatio : function (good, bad) {
    var total = good + bad;
    return bad/total;
  },

  typeOnKey : function (letter, color) {
    var path = this.defaults.keyboardPathLibrary;
    path = path[letter];

    //use letter to fetch ratio of correct/total
    var ratio = this.calculateRatio(this.mock[letter].goodPresses, this.mock[letter].badPresses);
    //calculate color using interpretToColor(ratio)
    var color = this.interpretToColor(ratio);

    d3.select('#keyboard')
      .selectAll("g")
      .select(path)
      .transition().duration(250)
      .style("fill", color);
  },

  render: function () {
    return this.$el.html([
      '<h3>The Keyboard Should Be Here...</h3>'
    ]);
  }

});
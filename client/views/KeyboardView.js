var KeyboardView = Backbone.View.extend({

  tagName: "div",

  className: "keyboardContainer",

  defaults: {
    keyboardPathLibrary: {
      ' ': '#path185','a': '#path65','b': '#path93','c': '#path91','d': '#path69',
      'e': '#path45','f': '#path71','g': '#path73','h': '#path75','i': '#path55',
      'j': '#path77','k': '#path79','l': '#path81','m': '#path97','n': '#path95',
      'o': '#path57','p': '#path59','q': '#path41','r': '#path47','s': '#path67',
      't': '#path53','u': '#path195','v': '#path65','w': '#path43','x': '#path89',
      'y': '#path51','z': '#path87','A': '#path65','B': '#path93','C': '#path91',
      'D': '#path69','E': '#path45','F': '#path71','G': '#path73','H': '#path75',
      'I': '#path55','J': '#path77','K': '#path79','L': '#path81','M': '#path97',
      'N': '#path95','O': '#path57','P': '#path59','Q': '#path41','R': '#path47',
      'S': '#path67','T': '#path49','U': '#path53','V': '#path195','W': '#path43',
      'X': '#path89','Y': '#path51','Z': '#path87','~': '#path11','`': '#path11',
      '1': '#path13','!': '#path13','2': '#path15','@': '#path15','3': '#path17',
      '#': '#path17','4': '#path19','$': '#path19','5': '#path21','%': '#path21',
      '6': '#path23','^': '#path23','7': '#path25','&': '#path25','8': '#path27',
      '*': '#path27','9': '#path29','(': '#path29','0': '#path31',')': '#path31',
      '-': '#path33','_': '#path33','=': '#path35','+': '#path35','\\': '#path37',
      '|': '#path37','{': '#path61','[': '#path61','}': '#path63',']': '#path63',
      ';': '#path83',':': '#path83','\'': '#path85', '\"': '#path85', ',': '#path99',
      '<': '#path99','.': '#path101','>': '#path101', '.':'#path101','/': '#path103',
      '?': '#path103'
    },

    //Paths for top row of keyboard
    keyboardTopRow: [
      "#path105", "#path107", "#path109", "#path111", "#path113", "#path115",
      "#path117", "#path119", "#path119", "#path121", "#path123", "#path125",
      "#path127", "#path129", "#path131"
    ],

    //Paths for the right side extra keys
    keyboardArrowsAndNumberBlock: [
      "#path131", "#path133", "#path135", "#path137", "#path139", "#path141",
      "#path143", "#path145", "#path147", "#path149", "#path151", "#path153",
      "#path155", "#path157", "#path159", "#path161", "#path163", "#path165",
      "#path167", "#path169", "#path171", "#path173", "#path175", "#path177",
      "#path179", "#path181", "#path183", "#path191", "#path193", "#path373",
      "#path407", "#path417"
    ],

    //Paths for the side of the main keyboard
    keyboardSideKeys: [
      "#path189", "#path567", "#path565", "#path559", "#path561", "#path563",
      "#path553", "#path39", "#path187", "#path865", "#path199", "#path197",
      "#path551"],

    //Paths for legend colors
    legendClearOut: ["#path781", "#path783", "#path785", "#path817", "#path799",
        "#path801", "#path803", "#path805", "#path819"],

    //Paths for legend text
    textToClear : ["#g805", "#g809", "#g813", "#g787", "#g791", "#g795",
        "#g821", "#g825"]

  },

  initialize: function () {
    that = this;
    this.options = _.extend({}, this.defaults, this.options);
    this.mock = this.initializeMockData();

    this.model.on('updateOneKeyPress', '#input_bar', function(key) {
      //find ratio first
      var ratio = this.calculateRatio(this.model.keyPressData.key.goodPresses,
        this.model.keyPressData.key.badPresses);
      //then change key color
      this.typeOnKey(key, ratio);
    }, this);

    var keyboardFull = d3.xml("https://upload.wikimedia.org/wikipedia/commons/3/3a/Qwerty.svg",
      "image/svg+xml", function(xml) {
        that.makeKeyboard(xml);
    });

  },

  makeKeyboard : function (xml) {
    var library = that.defaults.keyboardPathLibrary;
    console.log(library);

      document.body
      .appendChild(xml.documentElement)
      .setAttribute("id", "keyboard");

      var fill = "#97c5d5";

      //I don't need this, but I'm not deleting it until testing is complete.

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
      that.modifyKeyboardColor(that.defaults.legendClearOut, "#FFFFFF");

      //clearing out the text from the legend
      for (var j=0; j<that.defaults.textToClear.length; j++) {
        d3.select('#keyboard')
          .selectAll("g")
          .selectAll(that.defaults.textToClear[j])
          .remove();
      };

      //turning MAIN keyboard keys to slate grey
      for (var key in library) {
        d3.select('#keyboard')
          .selectAll("g")
          .selectAll(library[key])
          .style("fill", "#A8A8A8");
      };

      //turning TOP ROW keyboard keys to light grey
      that.modifyKeyboardColor(that.defaults.keyboardTopRow, "#AEBECD");

      //turning ARROWS AND NUMBERS BLOCK keyboard keys to other color
      that.modifyKeyboardColor(that.defaults.keyboardArrowsAndNumberBlock, "#CACAD4");

      //turning KEYS ON SIDE OF KEYBOARD to other color
      that.modifyKeyboardColor(that.defaults.keyboardSideKeys, "#CEC8C8");
  },

  modifyKeyboardColor: function (array, hexColor) {
    for (var i=0; i<array.length; i++) {
        d3.select('#keyboard')
          .selectAll("g")
          .selectAll(array[i])
          .style("fill", hexColor);
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
    var color = this.model.interpretToColor_Dynamic(ratio);

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
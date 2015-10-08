var KeyboardModel = Backbone.Model.extend({

  defaults: {
    idLibrary: {
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

  initialize : function () {
    this.set('mock', this.initializeMockData());
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
    var path = this.get('idLibrary');
    path = path[letter];

    //use letter to fetch ratio of correct/total
    var ratio = calculateRatio(mock[letter].goodPresses, mock[letter].badPresses);
    //calculate color using interpretToColor(ratio)
    var color = interpretToColor(ratio);

    d3.select('#keyboard')
      .selectAll("g")
      .select(path)
      .transition().duration(250)
      .style("fill", color);
  },

  makeKeyboard : function () {
    d3.xml("https://upload.wikimedia.org/wikipedia/commons/3/3a/Qwerty.svg",
      "image/svg+xml", function(xml) {
        // d3.select("body")
        // .select(".keyboardContainer")
        $('.keyboardContainer')
        .appendTo(xml.documentElement)
        .attr("id", "keyboard");

        var textToClear = ["#g805", "#g809", "#g813", "#g787", "#g791", "#g795",
          "#g821", "#g825"];
        var toClearOut = ["#path781", "#path783", "#path785", "#path817", "#path799",
          "#path801", "#path803", "#path805"];

        var fill = "#97c5d5";
        $(".noOutline form-control").keypress(function(event){
          var keyCode = event.keyCode;
          var letter = String.fromCharCode(keyCode);
          typeOnKey(letter, "#d3d3d3");
        });

        $(".noOutline form-control").keyup(function(event){
          var keyCode = event.keyCode;
          var letter = String.fromCharCode(keyCode);
          typeOnKey(letter, "#97c5d5");
        });

        //clearing out the colors from the legend
        for (var i=0; i<toClearOut.length; i++){
          d3.select('#keyboard')
            .selectAll("g")
            .select(toClearOut[i])
            .style("fill", "#FFFFFF");
        };

        //clearing out the text from the legend
        for (var j=0; j<textToClear.length; j++){
          d3.select('#keyboard')
            .selectAll("g")
            .selectAll(textToClear[j])
            .remove();
        };
      });
    }

});
  //referencing id path for the svg keyboard img
  var idLibrary = {
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

//Paths for legend colors
var toClearOut = ["#path781", "#path783", "#path785", "#path817", "#path819",
  "#path799", "#path801", "#path803", "#path805"];
//Paths for legend text
var textToClear = ["#g805", "#g809", "#g813", "#g787", "#g791", "#g795",
  "#g821", "#g825"];

//~~~~~HEAT MAP~~~~~~~//

//changing between red and blue
var interpretToColor = function (ratio) {
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

function lightenColor (hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;
  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }
  return rgb;
}

// Makes an object with mock data
var initializeMockData = function () {
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
};

var calculateRatio = function (good, bad) {
  var total = good + bad;
  return bad/total;
};

var mock = initializeMockData();

var typeOnKey = function (letter, color) {
  var path = idLibrary[letter];

  //use letter to fetch ratio of correct/total
  var ratio = calculateRatio(mock[letter].goodPresses, mock[letter].badPresses);
  //calculate color using interpretToColor(ratio)
  var color = interpretToColor(ratio);

  d3.select('#keyboard')
    .selectAll("g")
    .select(path)
    .transition().duration(250)
    .style("fill", color);
};

d3.xml("https://upload.wikimedia.org/wikipedia/commons/3/3a/Qwerty.svg",
  "image/svg+xml", function(xml) {
    document.body.appendChild(xml.documentElement).setAttribute("id", "keyboard");

    var fill = "#97c5d5";
    $("#input_bar").keypress(function(event){
      var keyCode = event.keyCode;
      var letter = String.fromCharCode(keyCode);
      typeOnKey(letter, "#d3d3d3");
    });

    $("#input_bar").keyup(function(event){
      var keyCode = event.keyCode;
      var letter = String.fromCharCode(keyCode);
      typeOnKey(letter, "#97c5d5");
    });

    //clearing out the colors from the legend
    for (var i=0; i<toClearOut.length; i++){
      d3.select('#keyboard')
        .selectAll("g")
        .select(toClearOut[i])
        .style("fill", "#eeeeee");
    };

    //clearing out the text from the legend
    for (var j=0; j<textToClear.length; j++){
      d3.select('#keyboard')
        .selectAll("g")
        .selectAll(textToClear[j])
        .remove();
    };
  });
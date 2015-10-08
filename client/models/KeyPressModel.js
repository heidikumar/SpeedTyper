// A model that stores all of the data
// about the user's key presses throughout
// the typing race
var KeyPressModel = Backbone.Model.extend({

  // Set defaults
  defaults: {

    // Colors for heat mapping
    heatMapColors: {
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
    },

    // Key Press Data
    keyPressData: {}
  },

  // Initialize
  initialize: function () {
    // Initialize the data (true indicates make mock data)
    this.initializeKeyPressData(true);
  },

  // Initializes mock data
  initializeKeyPressData: function (makeMockData) {
    // Make data randomly based off of ASCII
    var keyPressData = this.get('keyPressData');
    // If making mock data
    if (makeMockData) {
      for (var i = 32; i < 127; ++i) {
        var totalPresses = Math.floor(Math.random() * 100);
        var goodPresses = Math.floor(Math.random() * totalPresses);
        keyPressData[String.fromCharCode(i)] = {
          // Correct key press
          goodPresses: /*0*/goodPresses,
          // Incorrect key press
          badPresses: /*0*/totalPresses - goodPresses
        }
      }
    } else {
      // Initialized to 0 data
      for (var i = 32; i < 127; ++i) {
        keyPressData[String.fromCharCode(i)] = {
          goodPresses: 0,
          badPresses: 0
        }
      }
    }
  },

  // Yields a color ratio-amount percent from
  // goodColor to badColor (ratio is percent bad)
  interpretToColor_Dynamic: function (ratio) {
    // Get colors from heatmap
    var goodColor = this.get('heatMapColors').goodColor;
    var badColor = this.get('heatMapColors').badColor;

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
  }
});

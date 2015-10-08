var KeyboardView = Backbone.View.extend({

  tagName: "div",

  className: "keyboardContainer",

  initialize: function () {
    // this.$el.appendChild('h1').text('Attach me!');
    // this.model.makeKeyboard();

    var keyboardFull = d3.xml("https://upload.wikimedia.org/wikipedia/commons/3/3a/Qwerty.svg",
      "image/svg+xml", function(xml) {document.body
      .appendChild(xml.documentElement)
      .setAttribute("id", "keyboard");

      var toClearOut = ["#path781", "#path783", "#path785", "#path817", "#path799",
        "#path801", "#path803", "#path805", "#path819"];
      //Paths for legend text
      var textToClear = ["#g805", "#g809", "#g813", "#g787", "#g791", "#g795",
        "#g821", "#g825"];

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

  },

  render: function () {
    return this.$el.html([
      '<h3>The Keyboard Should Be Here...</h3>'
    ]);
  }

});
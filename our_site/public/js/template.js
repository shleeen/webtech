( function(window){

  "use strict";
  var exports = {
    render : render
  };

  function render(templateID, replacements, iterations) {
    var html = document.getElementById(templateID).innerHTML;
    var values = getDynamicValues(html);
    var new_html = applyDynamicValues(html, values, replacements, iterations);
    return new_html;
  }
  
  function getDynamicValues(str_html) {
    // Regex Explanation:  In JavaScript, [^] represents a valid character class. Should be the same as .
    // Regex Explanation:  ([^]*?) -> +? or *?  means it will consume as few characters 
    // as possible instead of as many as possible (as is the default)
  
    var result = str_html.match(/{{([^]*?)}}/g);
    if (result !== null) {
      // Filter the results to remove duplicates
      // Then use map to remove brackets in the matches
      return result.filter(function(item, pos) {
        return result.indexOf(item) === pos;
      }).map(function(x) { return x.replace(/({{|}})/g,""); });
    } else {
      return [];
    }
  }
  
  // We create a function to replace the curly braces with data values
  function applyDynamicValues(str_html, values, replacements, iterations) {
    var value, regexp, old_html;
    var new_html = "";
    if (iterations) {
      for (var i = 0; i < iterations; i++) {
        old_html = str_html;
        for (value of values) {  
          regexp = new RegExp("{{" + value + "}}", "g");
          old_html = old_html.replace(regexp, replacements[i][value]);
        }
        new_html += old_html;
      }
    }
    else {
      for (value of values) {
        regexp = new RegExp("{{" + value + "}}", "g");
        str_html = str_html.replace(regexp, replacements[value]);
      }
      new_html = str_html;
    }
    return new_html;
  }

  window.template = exports;

})(window); 
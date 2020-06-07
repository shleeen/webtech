// This template module was orginally based on the tutorial given here:
//   http://blog.ibanyez.info/blogs/coding/20190126-create-your-own-framework/
// But has many changes/simplifications

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

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
    var v, regexp, old_html;
    var new_html = "";
    if (iterations !== undefined) {
      for (var i = 0; i < iterations; i++) {
        old_html = str_html;
        for (v in values) {  
          regexp = new RegExp("{{" + values[v] + "}}", "g");
          old_html = old_html.replace(regexp, escapeHtml(replacements[i][values[v]].toString()));
        }
        new_html += old_html;
      }
    }
    else {
      for (v in values) {
        if (replacements[values[v]] !== undefined) {
          regexp = new RegExp("{{" + values[v] + "}}", "g");
          str_html = str_html.replace(regexp, escapeHtml(replacements[values[v]].toString()));
        }
      }
      new_html = str_html;
    }
    return new_html;
  }

  window.template = exports;

})(window); 
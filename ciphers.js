$(function() {
  $(".js-encrypt").each(function() {
    var e = $(this);
    var target = $("#" + e.data("target"));
    var cipher = e.data("cipher");
    var impl = Ciphers[cipher];
    if(target.length > 0 && impl) {
      var implObj = new impl(e.data());
      var update = function() {
        target.text(implObj.encrypt(e.val()));
      };
      e.change(update);
      e.keyup(update);
    }
    console.log(this);
  });

  $(".js-cryptanalysis-input").change(analyze).keyup(analyze);
});

const A = 0x41;
const Z = 0x5a;
const a = 0x61;
const z = 0x7a;

window.Ciphers = {};

// Change "az" into "1 26"
//
//     new NumberSubstituion();
//
// Change "az" into "2 1"
//
//     new NumberSubstitution({offset: 1});
Ciphers.NumberSubstitution = function(config) {
  var offset = config.offset || 0;
  var lookup = { " ": "   " };
  for (var i = 0; i < 26; i++) {
    var letter = String.fromCharCode(a + i);
    var n = ((i + offset) % 26) + 1;
    lookup[letter] = ("   " + n).slice(-3);
  }
  this.encrypt = function(plain) {
    return substitute(plain, lookup);
  };
  return this;
}

// Change "az" into "BA"
//
//     new Caesar({a: "b"});
Ciphers.Caesar = function(config) {
  var offset = (config.a || "a").toUpperCase().charCodeAt(0) - A;
  var lookup = {};
  for (var i = 0; i < 26; i++) {
    var from = String.fromCharCode(a + i);
    var to = String.fromCharCode(A + (offset + i) % 26);
    lookup[from] = to;
  }
  this.encrypt = function(plain) {
    return substitute(plain, lookup);
  };
  return this;
}


function substitute(plain, lookup) {
  var result = "";
  for(var i = 0; i < plain.length; i++) {
    var c = plain[i].toLowerCase();
    var ec = lookup[c];
    result = result + (ec || c);
  }
  return result;
}

function analyze() {
  var counts = {};
  var text = $(this).val();
  for(var i = 0; i < text.length; i++) {
    var c = text[i];
    counts[c] = (counts[c] || 0) + 1;
  }
  console.log(counts);
  //window.counts = counts;
  counts = $.map(counts, function(n, c) { return {char: c, count: n}; });
  console.log(counts);
  counts.sort(function(a, b) { return b.count - a.count; });
  console.log(counts);
  $(".js-cryptanalysis-frequency").text(JSON.stringify(counts));
}

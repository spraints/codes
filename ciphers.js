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
});

window.Ciphers = {};

Ciphers.NumberSubstitution = function(config) {
  console.log(config);
  var offset = config.offset || 0;
  var lookup = { " ": "   " };
  for (var i = 0; i < 26; i++) {
    var letter = String.fromCharCode(97 + i);
    var n = ((i + offset) % 26) + 1;
    lookup[letter] = ("   " + n).slice(-3);
  }
  this.encrypt = function(plain) {
    var result = "";
    for(var i = 0; i < plain.length; i++) {
      var c = plain[i].toLowerCase();
      var ec = lookup[c];
      result = result + (ec || c);
    }
    return result;
  }
}

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
  const lookup = { " ": "   ", a: "  1", b: "  2", c: "  3", d: "  4", e: "  5", f: "  6", g: "  7", h: "  8", i: "  9", j: " 10", k: " 11", l: " 12", m: " 13", n: " 14", o: " 15", p: " 16", q: " 17", r: " 18", s: " 19", t: " 20", u: " 21", v: " 22", w: " 23", x: " 24", y: " 25", z: " 26" };
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

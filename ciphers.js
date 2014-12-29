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
  this.encrypt = function(plain) {
    return "todo: encrypt " + plain;
  }
}

$(function() {
  $(".js-cryptanalysis-input").change(analyze).keyup(analyze);
});

function analyze() {
  var counts = {};
  var text = $(this).val();
  for(var i = 0; i < text.length; i++) {
    var c = text[i];
    counts[c] = (counts[c] || 0) + 1;
  }
  $(".js-cryptanalysis-frequency").text(JSON.stringify(counts));
}

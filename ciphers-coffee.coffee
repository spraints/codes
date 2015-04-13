---
---

$ ->
  $(document).on "change keyup", ".js-encrypt", encrypt
  $(document).on "change keyup", ".js-cryptanalysis-input", encrypt
  $(document).on "change keyup", ".js-cipherconfig", encrypt

encrypt = ->
  e = $ this
  target = $ "##{e.data "target"}"
  cipher = e.data "cipher"
  impl = Ciphers[cipher]
  if target.length > 0 && impl
    implObj = new impl e.data()
    target.text implObj.encrypt(e.val())

applyconfig = ->
  enc = $ ".js-encrypt"
  enc.data this.name, $(this).val()
  enc.each encrypt

A = 0x41
Z = 0x5a
a = 0x61
z = 0x7a

window.Ciphers = {}

# Change "az" into "1 26"
#
#     new NumberSubstituion();
#
# Change "az" into "2 1"
#
#     new NumberSubstitution({offset: 1});
Ciphers.NumberSubsitution = (config) ->
  offset = config.offset || 0
  lookup =
    " ": "   "
  for i in [0..25]
    letter = String.fromCharCode(a + i)
    n = ((i + offset) % 26) + 1
    lookup[letter] = "   #{n}".slice(-3)
  this.encrypt = (plain) -> substitute(plain, lookup)
  this

# Change "az" into "BA"
#
#     new Caesar({a: "b"});
Ciphers.Caesar = (config) ->
  offset = (config.a || "a").toUpperCase().charCodeAt(0) - A
  lookup = {}
  for i in [0..25]
    from = String.fromCharCode(a + i)
    to = String.fromCharCode(A + (offset + i) % 26)
    lookup[from] = to
  this.encrypt = (plain) -> substitute(plain, lookup)
  this

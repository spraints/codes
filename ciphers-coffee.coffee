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

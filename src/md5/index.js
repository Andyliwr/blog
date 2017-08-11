var hexcase = 0,
  b64pad = '',
  chrsz = 8;
var md5 = {
  hex_md5: function (a) {
    return this.binl2hex(this.core_md5(this.str2binl(a), a.length * chrsz))
  },
  b64_md5: function (a) {
    return this.binl2b64(this.core_md5(this.str2binl(a), a.length * chrsz))
  },
  str_md5: function (a) {
    return this.binl2str(this.core_md5(this.str2binl(a), a.length * chrsz))
  },
  hex_hmac_md5: function (a, b) {
    return this.binl2hex(this.core_hmac_md5(a, b))
  },
  b64_hmac_md5: function (a, b) {
    return this.binl2b64(this.core_hmac_md5(a, b))
  },
  str_hmac_md5: function (a, b) {
    return this.binl2str(this.core_hmac_md5(a, b))
  },
  md5_vm_test: function () {
    return "900150983cd24fb0d6963f7d28e17f72" == this.hex_md5("abc")
  },
  core_md5: function (a, b) {
    a[b >> 5] |= 128 << b % 32, a[(b + 64 >>> 9 << 4) + 14] = b;
    for (var c = 1732584193, d = -271733879, e = -1732584194, f = 271733878, g = 0; g < a.length; g += 16) {
      var h = c,
        i = d,
        j = e,
        k = f;
      c = this.md5_ff(c, d, e, f, a[g + 0], 7, -680876936), f = this.md5_ff(f, c, d, e, a[g + 1], 12, -389564586), e = this.md5_ff(e, f, c, d, a[g + 2], 17, 606105819), d = this.md5_ff(d, e, f, c, a[g + 3], 22, -1044525330), c = this.md5_ff(c, d, e, f, a[g + 4], 7, -176418897), f = this.md5_ff(f, c, d, e, a[g + 5], 12, 1200080426), e = this.md5_ff(e, f, c, d, a[g + 6], 17, -1473231341), d = this.md5_ff(d, e, f, c, a[g + 7], 22, -45705983), c = this.md5_ff(c, d, e, f, a[g + 8], 7, 1770035416), f = this.md5_ff(f, c, d, e, a[g + 9], 12, -1958414417), e = this.md5_ff(e, f, c, d, a[g + 10], 17, -42063), d = this.md5_ff(d, e, f, c, a[g + 11], 22, -1990404162), c = this.md5_ff(c, d, e, f, a[g + 12], 7, 1804603682), f = this.md5_ff(f, c, d, e, a[g + 13], 12, -40341101), e =this.md5_ff(e, f, c, d, a[g + 14], 17, -1502002290), d = this.md5_ff(d, e, f, c, a[g + 15], 22, 1236535329), c = this.md5_gg(c, d, e, f, a[g + 1], 5, -165796510), f = this.md5_gg(f, c, d, e, a[g + 6], 9, -1069501632), e = this.md5_gg(e, f, c, d, a[g + 11], 14, 643717713), d = this.md5_gg(d, e, f, c, a[g + 0], 20, -373897302), c = this.md5_gg(c, d, e, f, a[g + 5], 5, -701558691), f = this.md5_gg(f, c, d, e, a[g + 10], 9, 38016083), e = this.md5_gg(e, f, c, d, a[g + 15], 14, -660478335), d = this.md5_gg(d, e, f, c, a[g + 4], 20, -405537848), c =this.md5_gg(c, d, e, f, a[g + 9], 5, 568446438), f = this.md5_gg(f, c, d, e, a[g + 14], 9, -1019803690), e = this.md5_gg(e, f, c, d, a[g + 3], 14, -187363961), d = this.md5_gg(d, e, f, c, a[g + 8], 20, 1163531501), c = this.md5_gg(c, d, e, f, a[g + 13], 5, -1444681467), f = this.md5_gg(f, c, d, e, a[g + 2], 9, -51403784), e = this.md5_gg(e, f, c, d, a[g + 7], 14, 1735328473), d = this.md5_gg(d, e, f, c, a[g + 12], 20, -1926607734), c = this.md5_hh(c, d, e, f, a[g + 5], 4, -378558), f = this.md5_hh(f, c, d, e, a[g + 8], 11, -2022574463), e = this.md5_hh(e, f, c, d, a[g + 11], 16, 1839030562), d = this.md5_hh(d, e, f, c, a[g + 14], 23, -35309556), c = this.md5_hh(c, d, e, f, a[g + 1], 4, -1530992060), f =this.md5_hh(f, c, d, e, a[g + 4], 11, 1272893353), e = this.md5_hh(e, f, c, d, a[g + 7], 16, -155497632), d = this.md5_hh(d, e, f, c, a[g + 10], 23, -1094730640), c = this.md5_hh(c, d, e, f, a[g + 13], 4, 681279174), f = this.md5_hh(f, c, d, e, a[g + 0], 11, -358537222), e = this.md5_hh(e, f, c, d, a[g + 3], 16, -722521979), d = this.md5_hh(d, e, f, c, a[g + 6], 23, 76029189), c = this.md5_hh(c, d, e, f, a[g + 9], 4, -640364487), f = this.md5_hh(f, c, d, e, a[g + 12], 11, -421815835), e = this.md5_hh(e, f, c, d, a[g + 15], 16, 530742520), d = this.md5_hh(d, e, f, c, a[g + 2], 23, -995338651), c = this.md5_ii(c, d, e, f, a[g + 0], 6, -198630844), f = this.md5_ii(f, c, d, e, a[g + 7], 10, 1126891415), e = this.md5_ii(e, f, c, d, a[g + 14], 15, -1416354905), d = this.md5_ii(d, e, f, c, a[g + 5], 21, -57434055), c = this.md5_ii(c, d, e, f, a[g + 12], 6, 1700485571), f = this.md5_ii(f, c, d, e, a[g + 3], 10, -1894986606), e = this.md5_ii(e, f, c, d, a[g + 10], 15, -1051523), d = this.md5_ii(d, e, f, c, a[g + 1], 21, -2054922799), c = this.md5_ii(c, d, e, f, a[g + 8], 6, 1873313359), f = this.md5_ii(f, c, d, e, a[g + 15], 10, -30611744), e = this.md5_ii(e, f, c, d, a[g + 6], 15, -1560198380), d = this.md5_ii(d, e, f, c, a[g + 13], 21, 1309151649), c = this.md5_ii(c, d, e, f, a[g + 4], 6, -145523070), f = this.md5_ii(f, c, d, e, a[g + 11], 10, -1120210379), e =this.md5_ii(e, f, c, d, a[g + 2], 15, 718787259), d = this.md5_ii(d, e, f, c, a[g + 9], 21, -343485551), c = this.safe_add(c, h), d = this.safe_add(d, i), e = this.safe_add(e, j), f = this.safe_add(f, k)
    }
    return Array(c, d, e, f)
  },
  md5_cmn: function (a, b, c, d, e, f) {
    return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(b, a), this.safe_add(d, f)), e), c)
  },
  md5_ff: function (a, b, c, d, e, f, g) {
    return this.md5_cmn(b & c | ~b & d, a, b, e, f, g)
  },
  md5_gg: function (a, b, c, d, e, f, g) {
    return this.md5_cmn(b & d | c & ~d, a, b, e, f, g)
  },
  md5_hh: function (a, b, c, d, e, f, g) {
    return this.md5_cmn(b ^ c ^ d, a, b, e, f, g)
  },
  md5_ii: function (a, b, c, d, e, f, g) {
    return this.md5_cmn(c ^ (b | ~d), a, b, e, f, g)
  },
  core_hmac_md5: function (a, b) {
    var c = this.str2binl(a);
    c.length > 16 && (c = this.core_md5(c, a.length * chrsz));
    for (var d = Array(16), e = Array(16), f = 0; 16 > f; f++) d[f] = 909522486 ^ c[f], e[f] = 1549556828 ^ c[f];
    var g = this.core_md5(d.concat(this.str2binl(b)), 512 + b.length * chrsz);
    return this.core_md5(e.concat(g), 640)
  },
  safe_add: function (a, b) {
    var c = (65535 & a) + (65535 & b),
      d = (a >> 16) + (b >> 16) + (c >> 16);
    return d << 16 | 65535 & c
  },
  bit_rol: function (a, b) {
    return a << b | a >>> 32 - b
  },
  str2binl: function (a) {
    for (var b = Array(), c = (1 << chrsz) - 1, d = 0; d < a.length * chrsz; d += chrsz) b[d >> 5] |= (a.charCodeAt(d / chrsz) & c) << d % 32;
    return b
  },
  binl2str: function (a) {
    for (var b = "", c = (1 << chrsz) - 1, d = 0; d < 32 * a.length; d += chrsz) b += String.fromCharCode(a[d >> 5] >>> d % 32 & c);
    return b
  },
  binl2hex: function (a) {
    for (var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", c = "", d = 0; d < 4 * a.length; d++) c += b.charAt(a[d >> 2] >> d % 4 * 8 + 4 & 15) + b.charAt(a[d >> 2] >> d % 4 * 8 & 15);
    return c
  },
  binl2b64: function (a) {
    for (var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = "", d = 0; d < 4 * a.length; d += 3)
      for (var e = (a[d >> 2] >> 8 * (d % 4) & 255) << 16 | (a[d + 1 >> 2] >> 8 * ((d + 1) % 4) & 255) << 8 | a[d + 2 >> 2] >> 8 * ((d + 2) % 4) & 255, f = 0; 4 > f; f++) c += 8 * d + 6 * f > 32 * a.length ? b64pad : b.charAt(e >> 6 * (3 - f) & 63);
    return c
  },
}

export default md5;
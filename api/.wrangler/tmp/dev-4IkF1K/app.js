var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-2Kfb2C/checked-fetch.js
function checkURL(request, init2) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init2) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-2Kfb2C/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init2] = argArray;
        checkURL(request, init2);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@prisma/client/runtime/wasm.js
var require_wasm = __commonJS({
  "node_modules/@prisma/client/runtime/wasm.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var Uo = Object.create;
    var kt = Object.defineProperty;
    var qo = Object.getOwnPropertyDescriptor;
    var Bo = Object.getOwnPropertyNames;
    var $o = Object.getPrototypeOf;
    var Vo = Object.prototype.hasOwnProperty;
    var se = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "se");
    var De = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "De");
    var Mt = /* @__PURE__ */ __name((e, t) => {
      for (var r in t) kt(e, r, { get: t[r], enumerable: true });
    }, "Mt");
    var rn = /* @__PURE__ */ __name((e, t, r, n) => {
      if (t && typeof t == "object" || typeof t == "function") for (let i of Bo(t)) !Vo.call(e, i) && i !== r && kt(e, i, { get: /* @__PURE__ */ __name(() => t[i], "get"), enumerable: !(n = qo(t, i)) || n.enumerable });
      return e;
    }, "rn");
    var Fe = /* @__PURE__ */ __name((e, t, r) => (r = e != null ? Uo($o(e)) : {}, rn(t || !e || !e.__esModule ? kt(r, "default", { value: e, enumerable: true }) : r, e)), "Fe");
    var jo = /* @__PURE__ */ __name((e) => rn(kt({}, "__esModule", { value: true }), e), "jo");
    function gr(e, t) {
      if (t = t.toLowerCase(), t === "utf8" || t === "utf-8") return new y(Wo.encode(e));
      if (t === "base64" || t === "base64url") return e = e.replace(/-/g, "+").replace(/_/g, "/"), e = e.replace(/[^A-Za-z0-9+/]/g, ""), new y([...atob(e)].map((r) => r.charCodeAt(0)));
      if (t === "binary" || t === "ascii" || t === "latin1" || t === "latin-1") return new y([...e].map((r) => r.charCodeAt(0)));
      if (t === "ucs2" || t === "ucs-2" || t === "utf16le" || t === "utf-16le") {
        let r = new y(e.length * 2), n = new DataView(r.buffer);
        for (let i = 0; i < e.length; i++) n.setUint16(i * 2, e.charCodeAt(i), true);
        return r;
      }
      if (t === "hex") {
        let r = new y(e.length / 2);
        for (let n = 0, i = 0; i < e.length; i += 2, n++) r[n] = parseInt(e.slice(i, i + 2), 16);
        return r;
      }
      on(`encoding "${t}"`);
    }
    __name(gr, "gr");
    function Qo(e) {
      let r = Object.getOwnPropertyNames(DataView.prototype).filter((a) => a.startsWith("get") || a.startsWith("set")), n = r.map((a) => a.replace("get", "read").replace("set", "write")), i = /* @__PURE__ */ __name((a, u) => function(g = 0) {
        return B(g, "offset"), Y(g, "offset"), V(g, "offset", this.length - 1), new DataView(this.buffer)[r[a]](g, u);
      }, "i"), o = /* @__PURE__ */ __name((a, u) => function(g, T = 0) {
        let C = r[a].match(/set(\w+\d+)/)[1].toLowerCase(), O = Go[C];
        return B(T, "offset"), Y(T, "offset"), V(T, "offset", this.length - 1), Jo(g, "value", O[0], O[1]), new DataView(this.buffer)[r[a]](T, g, u), T + parseInt(r[a].match(/\d+/)[0]) / 8;
      }, "o"), s = /* @__PURE__ */ __name((a) => {
        a.forEach((u) => {
          u.includes("Uint") && (e[u.replace("Uint", "UInt")] = e[u]), u.includes("Float64") && (e[u.replace("Float64", "Double")] = e[u]), u.includes("Float32") && (e[u.replace("Float32", "Float")] = e[u]);
        });
      }, "s");
      n.forEach((a, u) => {
        a.startsWith("read") && (e[a] = i(u, false), e[a + "LE"] = i(u, true), e[a + "BE"] = i(u, false)), a.startsWith("write") && (e[a] = o(u, false), e[a + "LE"] = o(u, true), e[a + "BE"] = o(u, false)), s([a, a + "LE", a + "BE"]);
      });
    }
    __name(Qo, "Qo");
    function on(e) {
      throw new Error(`Buffer polyfill does not implement "${e}"`);
    }
    __name(on, "on");
    function It(e, t) {
      if (!(e instanceof Uint8Array)) throw new TypeError(`The "${t}" argument must be an instance of Buffer or Uint8Array`);
    }
    __name(It, "It");
    function V(e, t, r = zo + 1) {
      if (e < 0 || e > r) {
        let n = new RangeError(`The value of "${t}" is out of range. It must be >= 0 && <= ${r}. Received ${e}`);
        throw n.code = "ERR_OUT_OF_RANGE", n;
      }
    }
    __name(V, "V");
    function B(e, t) {
      if (typeof e != "number") {
        let r = new TypeError(`The "${t}" argument must be of type number. Received type ${typeof e}.`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(B, "B");
    function Y(e, t) {
      if (!Number.isInteger(e) || Number.isNaN(e)) {
        let r = new RangeError(`The value of "${t}" is out of range. It must be an integer. Received ${e}`);
        throw r.code = "ERR_OUT_OF_RANGE", r;
      }
    }
    __name(Y, "Y");
    function Jo(e, t, r, n) {
      if (e < r || e > n) {
        let i = new RangeError(`The value of "${t}" is out of range. It must be >= ${r} and <= ${n}. Received ${e}`);
        throw i.code = "ERR_OUT_OF_RANGE", i;
      }
    }
    __name(Jo, "Jo");
    function nn(e, t) {
      if (typeof e != "string") {
        let r = new TypeError(`The "${t}" argument must be of type string. Received type ${typeof e}`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(nn, "nn");
    function Yo(e, t = "utf8") {
      return y.from(e, t);
    }
    __name(Yo, "Yo");
    var y;
    var Go;
    var Wo;
    var Ko;
    var Ho;
    var zo;
    var b;
    var hr;
    var c = se(() => {
      "use strict";
      y = class e extends Uint8Array {
        static {
          __name(this, "e");
        }
        constructor() {
          super(...arguments);
          this._isBuffer = true;
        }
        get offset() {
          return this.byteOffset;
        }
        static alloc(r, n = 0, i = "utf8") {
          return nn(i, "encoding"), e.allocUnsafe(r).fill(n, i);
        }
        static allocUnsafe(r) {
          return e.from(r);
        }
        static allocUnsafeSlow(r) {
          return e.from(r);
        }
        static isBuffer(r) {
          return r && !!r._isBuffer;
        }
        static byteLength(r, n = "utf8") {
          if (typeof r == "string") return gr(r, n).byteLength;
          if (r && r.byteLength) return r.byteLength;
          let i = new TypeError('The "string" argument must be of type string or an instance of Buffer or ArrayBuffer.');
          throw i.code = "ERR_INVALID_ARG_TYPE", i;
        }
        static isEncoding(r) {
          return Ho.includes(r);
        }
        static compare(r, n) {
          It(r, "buff1"), It(n, "buff2");
          for (let i = 0; i < r.length; i++) {
            if (r[i] < n[i]) return -1;
            if (r[i] > n[i]) return 1;
          }
          return r.length === n.length ? 0 : r.length > n.length ? 1 : -1;
        }
        static from(r, n = "utf8") {
          if (r && typeof r == "object" && r.type === "Buffer") return new e(r.data);
          if (typeof r == "number") return new e(new Uint8Array(r));
          if (typeof r == "string") return gr(r, n);
          if (ArrayBuffer.isView(r)) {
            let { byteOffset: i, byteLength: o, buffer: s } = r;
            return "map" in r && typeof r.map == "function" ? new e(r.map((a) => a % 256), i, o) : new e(s, i, o);
          }
          if (r && typeof r == "object" && ("length" in r || "byteLength" in r || "buffer" in r)) return new e(r);
          throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
        }
        static concat(r, n) {
          if (r.length === 0) return e.alloc(0);
          let i = [].concat(...r.map((s) => [...s])), o = e.alloc(n !== void 0 ? n : i.length);
          return o.set(n !== void 0 ? i.slice(0, n) : i), o;
        }
        slice(r = 0, n = this.length) {
          return this.subarray(r, n);
        }
        subarray(r = 0, n = this.length) {
          return Object.setPrototypeOf(super.subarray(r, n), e.prototype);
        }
        reverse() {
          return super.reverse(), this;
        }
        readIntBE(r, n) {
          B(r, "offset"), Y(r, "offset"), V(r, "offset", this.length - 1), B(n, "byteLength"), Y(n, "byteLength");
          let i = new DataView(this.buffer, r, n), o = 0;
          for (let s = 0; s < n; s++) o = o * 256 + i.getUint8(s);
          return i.getUint8(0) & 128 && (o -= Math.pow(256, n)), o;
        }
        readIntLE(r, n) {
          B(r, "offset"), Y(r, "offset"), V(r, "offset", this.length - 1), B(n, "byteLength"), Y(n, "byteLength");
          let i = new DataView(this.buffer, r, n), o = 0;
          for (let s = 0; s < n; s++) o += i.getUint8(s) * Math.pow(256, s);
          return i.getUint8(n - 1) & 128 && (o -= Math.pow(256, n)), o;
        }
        readUIntBE(r, n) {
          B(r, "offset"), Y(r, "offset"), V(r, "offset", this.length - 1), B(n, "byteLength"), Y(n, "byteLength");
          let i = new DataView(this.buffer, r, n), o = 0;
          for (let s = 0; s < n; s++) o = o * 256 + i.getUint8(s);
          return o;
        }
        readUintBE(r, n) {
          return this.readUIntBE(r, n);
        }
        readUIntLE(r, n) {
          B(r, "offset"), Y(r, "offset"), V(r, "offset", this.length - 1), B(n, "byteLength"), Y(n, "byteLength");
          let i = new DataView(this.buffer, r, n), o = 0;
          for (let s = 0; s < n; s++) o += i.getUint8(s) * Math.pow(256, s);
          return o;
        }
        readUintLE(r, n) {
          return this.readUIntLE(r, n);
        }
        writeIntBE(r, n, i) {
          return r = r < 0 ? r + Math.pow(256, i) : r, this.writeUIntBE(r, n, i);
        }
        writeIntLE(r, n, i) {
          return r = r < 0 ? r + Math.pow(256, i) : r, this.writeUIntLE(r, n, i);
        }
        writeUIntBE(r, n, i) {
          B(n, "offset"), Y(n, "offset"), V(n, "offset", this.length - 1), B(i, "byteLength"), Y(i, "byteLength");
          let o = new DataView(this.buffer, n, i);
          for (let s = i - 1; s >= 0; s--) o.setUint8(s, r & 255), r = r / 256;
          return n + i;
        }
        writeUintBE(r, n, i) {
          return this.writeUIntBE(r, n, i);
        }
        writeUIntLE(r, n, i) {
          B(n, "offset"), Y(n, "offset"), V(n, "offset", this.length - 1), B(i, "byteLength"), Y(i, "byteLength");
          let o = new DataView(this.buffer, n, i);
          for (let s = 0; s < i; s++) o.setUint8(s, r & 255), r = r / 256;
          return n + i;
        }
        writeUintLE(r, n, i) {
          return this.writeUIntLE(r, n, i);
        }
        toJSON() {
          return { type: "Buffer", data: Array.from(this) };
        }
        swap16() {
          let r = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let n = 0; n < this.length; n += 2) r.setUint16(n, r.getUint16(n, true), false);
          return this;
        }
        swap32() {
          let r = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let n = 0; n < this.length; n += 4) r.setUint32(n, r.getUint32(n, true), false);
          return this;
        }
        swap64() {
          let r = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let n = 0; n < this.length; n += 8) r.setBigUint64(n, r.getBigUint64(n, true), false);
          return this;
        }
        compare(r, n = 0, i = r.length, o = 0, s = this.length) {
          return It(r, "target"), B(n, "targetStart"), B(i, "targetEnd"), B(o, "sourceStart"), B(s, "sourceEnd"), V(n, "targetStart"), V(i, "targetEnd", r.length), V(o, "sourceStart"), V(s, "sourceEnd", this.length), e.compare(this.slice(o, s), r.slice(n, i));
        }
        equals(r) {
          return It(r, "otherBuffer"), this.length === r.length && this.every((n, i) => n === r[i]);
        }
        copy(r, n = 0, i = 0, o = this.length) {
          V(n, "targetStart"), V(i, "sourceStart", this.length), V(o, "sourceEnd"), n >>>= 0, i >>>= 0, o >>>= 0;
          let s = 0;
          for (; i < o && !(this[i] === void 0 || r[n] === void 0); ) r[n] = this[i], s++, i++, n++;
          return s;
        }
        write(r, n, i, o = "utf8") {
          let s = typeof n == "string" ? 0 : n ?? 0, a = typeof i == "string" ? this.length - s : i ?? this.length - s;
          return o = typeof n == "string" ? n : typeof i == "string" ? i : o, B(s, "offset"), B(a, "length"), V(s, "offset", this.length), V(a, "length", this.length), (o === "ucs2" || o === "ucs-2" || o === "utf16le" || o === "utf-16le") && (a = a - a % 2), gr(r, o).copy(this, s, 0, a);
        }
        fill(r = 0, n = 0, i = this.length, o = "utf-8") {
          let s = typeof n == "string" ? 0 : n, a = typeof i == "string" ? this.length : i;
          if (o = typeof n == "string" ? n : typeof i == "string" ? i : o, r = e.from(typeof r == "number" ? [r] : r ?? [], o), nn(o, "encoding"), V(s, "offset", this.length), V(a, "end", this.length), r.length !== 0) for (let u = s; u < a; u += r.length) super.set(r.slice(0, r.length + u >= this.length ? this.length - u : r.length), u);
          return this;
        }
        includes(r, n = null, i = "utf-8") {
          return this.indexOf(r, n, i) !== -1;
        }
        lastIndexOf(r, n = null, i = "utf-8") {
          return this.indexOf(r, n, i, true);
        }
        indexOf(r, n = null, i = "utf-8", o = false) {
          let s = o ? this.findLastIndex.bind(this) : this.findIndex.bind(this);
          i = typeof n == "string" ? n : i;
          let a = e.from(typeof r == "number" ? [r] : r, i), u = typeof n == "string" ? 0 : n;
          return u = typeof n == "number" ? u : null, u = Number.isNaN(u) ? null : u, u ??= o ? this.length : 0, u = u < 0 ? this.length + u : u, a.length === 0 && o === false ? u >= this.length ? this.length : u : a.length === 0 && o === true ? (u >= this.length ? this.length : u) || this.length : s((g, T) => (o ? T <= u : T >= u) && this[T] === a[0] && a.every((O, A) => this[T + A] === O));
        }
        toString(r = "utf8", n = 0, i = this.length) {
          if (n = n < 0 ? 0 : n, r = r.toString().toLowerCase(), i <= 0) return "";
          if (r === "utf8" || r === "utf-8") return Ko.decode(this.slice(n, i));
          if (r === "base64" || r === "base64url") {
            let o = btoa(this.reduce((s, a) => s + hr(a), ""));
            return r === "base64url" ? o.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : o;
          }
          if (r === "binary" || r === "ascii" || r === "latin1" || r === "latin-1") return this.slice(n, i).reduce((o, s) => o + hr(s & (r === "ascii" ? 127 : 255)), "");
          if (r === "ucs2" || r === "ucs-2" || r === "utf16le" || r === "utf-16le") {
            let o = new DataView(this.buffer.slice(n, i));
            return Array.from({ length: o.byteLength / 2 }, (s, a) => a * 2 + 1 < o.byteLength ? hr(o.getUint16(a * 2, true)) : "").join("");
          }
          if (r === "hex") return this.slice(n, i).reduce((o, s) => o + s.toString(16).padStart(2, "0"), "");
          on(`encoding "${r}"`);
        }
        toLocaleString() {
          return this.toString();
        }
        inspect() {
          return `<Buffer ${this.toString("hex").match(/.{1,2}/g).join(" ")}>`;
        }
      };
      Go = { int8: [-128, 127], int16: [-32768, 32767], int32: [-2147483648, 2147483647], uint8: [0, 255], uint16: [0, 65535], uint32: [0, 4294967295], float32: [-1 / 0, 1 / 0], float64: [-1 / 0, 1 / 0], bigint64: [-0x8000000000000000n, 0x7fffffffffffffffn], biguint64: [0n, 0xffffffffffffffffn] }, Wo = new TextEncoder(), Ko = new TextDecoder(), Ho = ["utf8", "utf-8", "hex", "base64", "ascii", "binary", "base64url", "ucs2", "ucs-2", "utf16le", "utf-16le", "latin1", "latin-1"], zo = 4294967295;
      Qo(y.prototype);
      b = new Proxy(Yo, { construct(e, [t, r]) {
        return y.from(t, r);
      }, get(e, t) {
        return y[t];
      } }), hr = String.fromCodePoint;
    });
    var h;
    var m = se(() => {
      "use strict";
      h = { nextTick: /* @__PURE__ */ __name((e, ...t) => {
        setTimeout(() => {
          e(...t);
        }, 0);
      }, "nextTick"), env: {}, version: "", cwd: /* @__PURE__ */ __name(() => "/", "cwd"), stderr: {}, argv: ["/bin/node"] };
    });
    var x;
    var p = se(() => {
      "use strict";
      x = globalThis.performance ?? (() => {
        let e = Date.now();
        return { now: /* @__PURE__ */ __name(() => Date.now() - e, "now") };
      })();
    });
    var E;
    var d = se(() => {
      "use strict";
      E = /* @__PURE__ */ __name(() => {
      }, "E");
      E.prototype = E;
    });
    var w;
    var f = se(() => {
      "use strict";
      w = class {
        static {
          __name(this, "w");
        }
        constructor(t) {
          this.value = t;
        }
        deref() {
          return this.value;
        }
      };
    });
    function un(e, t) {
      var r, n, i, o, s, a, u, g, T = e.constructor, C = T.precision;
      if (!e.s || !t.s) return t.s || (t = new T(e)), U ? D(t, C) : t;
      if (u = e.d, g = t.d, s = e.e, i = t.e, u = u.slice(), o = s - i, o) {
        for (o < 0 ? (n = u, o = -o, a = g.length) : (n = g, i = s, a = u.length), s = Math.ceil(C / N), a = s > a ? s + 1 : a + 1, o > a && (o = a, n.length = 1), n.reverse(); o--; ) n.push(0);
        n.reverse();
      }
      for (a = u.length, o = g.length, a - o < 0 && (o = a, n = g, g = u, u = n), r = 0; o; ) r = (u[--o] = u[o] + g[o] + r) / Q | 0, u[o] %= Q;
      for (r && (u.unshift(r), ++i), a = u.length; u[--a] == 0; ) u.pop();
      return t.d = u, t.e = i, U ? D(t, C) : t;
    }
    __name(un, "un");
    function le(e, t, r) {
      if (e !== ~~e || e < t || e > r) throw Error(Oe + e);
    }
    __name(le, "le");
    function ae(e) {
      var t, r, n, i = e.length - 1, o = "", s = e[0];
      if (i > 0) {
        for (o += s, t = 1; t < i; t++) n = e[t] + "", r = N - n.length, r && (o += Pe(r)), o += n;
        s = e[t], n = s + "", r = N - n.length, r && (o += Pe(r));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    __name(ae, "ae");
    function cn(e, t) {
      var r, n, i, o, s, a, u = 0, g = 0, T = e.constructor, C = T.precision;
      if ($2(e) > 16) throw Error(br + $2(e));
      if (!e.s) return new T(Z);
      for (t == null ? (U = false, a = C) : a = t, s = new T(0.03125); e.abs().gte(0.1); ) e = e.times(s), g += 5;
      for (n = Math.log(Se(2, g)) / Math.LN10 * 2 + 5 | 0, a += n, r = i = o = new T(Z), T.precision = a; ; ) {
        if (i = D(i.times(e), a), r = r.times(++u), s = o.plus(ye(i, r, a)), ae(s.d).slice(0, a) === ae(o.d).slice(0, a)) {
          for (; g--; ) o = D(o.times(o), a);
          return T.precision = C, t == null ? (U = true, D(o, C)) : o;
        }
        o = s;
      }
    }
    __name(cn, "cn");
    function $2(e) {
      for (var t = e.e * N, r = e.d[0]; r >= 10; r /= 10) t++;
      return t;
    }
    __name($2, "$");
    function yr(e, t, r) {
      if (t > e.LN10.sd()) throw U = true, r && (e.precision = r), Error(re + "LN10 precision limit exceeded");
      return D(new e(e.LN10), t);
    }
    __name(yr, "yr");
    function Pe(e) {
      for (var t = ""; e--; ) t += "0";
      return t;
    }
    __name(Pe, "Pe");
    function it(e, t) {
      var r, n, i, o, s, a, u, g, T, C = 1, O = 10, A = e, M = A.d, S = A.constructor, I = S.precision;
      if (A.s < 1) throw Error(re + (A.s ? "NaN" : "-Infinity"));
      if (A.eq(Z)) return new S(0);
      if (t == null ? (U = false, g = I) : g = t, A.eq(10)) return t == null && (U = true), yr(S, g);
      if (g += O, S.precision = g, r = ae(M), n = r.charAt(0), o = $2(A), Math.abs(o) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; ) A = A.times(e), r = ae(A.d), n = r.charAt(0), C++;
        o = $2(A), n > 1 ? (A = new S("0." + r), o++) : A = new S(n + "." + r.slice(1));
      } else return u = yr(S, g + 2, I).times(o + ""), A = it(new S(n + "." + r.slice(1)), g - O).plus(u), S.precision = I, t == null ? (U = true, D(A, I)) : A;
      for (a = s = A = ye(A.minus(Z), A.plus(Z), g), T = D(A.times(A), g), i = 3; ; ) {
        if (s = D(s.times(T), g), u = a.plus(ye(s, new S(i), g)), ae(u.d).slice(0, g) === ae(a.d).slice(0, g)) return a = a.times(2), o !== 0 && (a = a.plus(yr(S, g + 2, I).times(o + ""))), a = ye(a, new S(C), g), S.precision = I, t == null ? (U = true, D(a, I)) : a;
        a = u, i += 2;
      }
    }
    __name(it, "it");
    function sn(e, t) {
      var r, n, i;
      for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
      for (i = t.length; t.charCodeAt(i - 1) === 48; ) --i;
      if (t = t.slice(n, i), t) {
        if (i -= n, r = r - n - 1, e.e = Ue(r / N), e.d = [], n = (r + 1) % N, r < 0 && (n += N), n < i) {
          for (n && e.d.push(+t.slice(0, n)), i -= N; n < i; ) e.d.push(+t.slice(n, n += N));
          t = t.slice(n), n = N - t.length;
        } else n -= i;
        for (; n--; ) t += "0";
        if (e.d.push(+t), U && (e.e > Lt || e.e < -Lt)) throw Error(br + r);
      } else e.s = 0, e.e = 0, e.d = [0];
      return e;
    }
    __name(sn, "sn");
    function D(e, t, r) {
      var n, i, o, s, a, u, g, T, C = e.d;
      for (s = 1, o = C[0]; o >= 10; o /= 10) s++;
      if (n = t - s, n < 0) n += N, i = t, g = C[T = 0];
      else {
        if (T = Math.ceil((n + 1) / N), o = C.length, T >= o) return e;
        for (g = o = C[T], s = 1; o >= 10; o /= 10) s++;
        n %= N, i = n - N + s;
      }
      if (r !== void 0 && (o = Se(10, s - i - 1), a = g / o % 10 | 0, u = t < 0 || C[T + 1] !== void 0 || g % o, u = r < 4 ? (a || u) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : a > 5 || a == 5 && (r == 4 || u || r == 6 && (n > 0 ? i > 0 ? g / Se(10, s - i) : 0 : C[T - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !C[0]) return u ? (o = $2(e), C.length = 1, t = t - o - 1, C[0] = Se(10, (N - t % N) % N), e.e = Ue(-t / N) || 0) : (C.length = 1, C[0] = e.e = e.s = 0), e;
      if (n == 0 ? (C.length = T, o = 1, T--) : (C.length = T + 1, o = Se(10, N - n), C[T] = i > 0 ? (g / Se(10, s - i) % Se(10, i) | 0) * o : 0), u) for (; ; ) if (T == 0) {
        (C[0] += o) == Q && (C[0] = 1, ++e.e);
        break;
      } else {
        if (C[T] += o, C[T] != Q) break;
        C[T--] = 0, o = 1;
      }
      for (n = C.length; C[--n] === 0; ) C.pop();
      if (U && (e.e > Lt || e.e < -Lt)) throw Error(br + $2(e));
      return e;
    }
    __name(D, "D");
    function mn(e, t) {
      var r, n, i, o, s, a, u, g, T, C, O = e.constructor, A = O.precision;
      if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new O(e), U ? D(t, A) : t;
      if (u = e.d, C = t.d, n = t.e, g = e.e, u = u.slice(), s = g - n, s) {
        for (T = s < 0, T ? (r = u, s = -s, a = C.length) : (r = C, n = g, a = u.length), i = Math.max(Math.ceil(A / N), a) + 2, s > i && (s = i, r.length = 1), r.reverse(), i = s; i--; ) r.push(0);
        r.reverse();
      } else {
        for (i = u.length, a = C.length, T = i < a, T && (a = i), i = 0; i < a; i++) if (u[i] != C[i]) {
          T = u[i] < C[i];
          break;
        }
        s = 0;
      }
      for (T && (r = u, u = C, C = r, t.s = -t.s), a = u.length, i = C.length - a; i > 0; --i) u[a++] = 0;
      for (i = C.length; i > s; ) {
        if (u[--i] < C[i]) {
          for (o = i; o && u[--o] === 0; ) u[o] = Q - 1;
          --u[o], u[i] += Q;
        }
        u[i] -= C[i];
      }
      for (; u[--a] === 0; ) u.pop();
      for (; u[0] === 0; u.shift()) --n;
      return u[0] ? (t.d = u, t.e = n, U ? D(t, A) : t) : new O(0);
    }
    __name(mn, "mn");
    function ke(e, t, r) {
      var n, i = $2(e), o = ae(e.d), s = o.length;
      return t ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Pe(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (i < 0 ? "e" : "e+") + i) : i < 0 ? (o = "0." + Pe(-i - 1) + o, r && (n = r - s) > 0 && (o += Pe(n))) : i >= s ? (o += Pe(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + Pe(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += Pe(n))), e.s < 0 ? "-" + o : o;
    }
    __name(ke, "ke");
    function an(e, t) {
      if (e.length > t) return e.length = t, true;
    }
    __name(an, "an");
    function pn(e) {
      var t, r, n;
      function i(o) {
        var s = this;
        if (!(s instanceof i)) return new i(o);
        if (s.constructor = i, o instanceof i) {
          s.s = o.s, s.e = o.e, s.d = (o = o.d) ? o.slice() : o;
          return;
        }
        if (typeof o == "number") {
          if (o * 0 !== 0) throw Error(Oe + o);
          if (o > 0) s.s = 1;
          else if (o < 0) o = -o, s.s = -1;
          else {
            s.s = 0, s.e = 0, s.d = [0];
            return;
          }
          if (o === ~~o && o < 1e7) {
            s.e = 0, s.d = [o];
            return;
          }
          return sn(s, o.toString());
        } else if (typeof o != "string") throw Error(Oe + o);
        if (o.charCodeAt(0) === 45 ? (o = o.slice(1), s.s = -1) : s.s = 1, Zo.test(o)) sn(s, o);
        else throw Error(Oe + o);
      }
      __name(i, "i");
      if (i.prototype = R, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = pn, i.config = i.set = es, e === void 0 && (e = {}), e) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
      return i.config(e), i;
    }
    __name(pn, "pn");
    function es(e) {
      if (!e || typeof e != "object") throw Error(re + "Object expected");
      var t, r, n, i = ["precision", 1, Ne, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
      for (t = 0; t < i.length; t += 3) if ((n = e[r = i[t]]) !== void 0) if (Ue(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(Oe + r + ": " + n);
      if ((n = e[r = "LN10"]) !== void 0) if (n == Math.LN10) this[r] = new this(n);
      else throw Error(Oe + r + ": " + n);
      return this;
    }
    __name(es, "es");
    var Ne;
    var Xo;
    var wr;
    var U;
    var re;
    var Oe;
    var br;
    var Ue;
    var Se;
    var Zo;
    var Z;
    var Q;
    var N;
    var ln;
    var Lt;
    var R;
    var ye;
    var wr;
    var _t;
    var dn = se(() => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      Ne = 1e9, Xo = { precision: 20, rounding: 4, toExpNeg: -7, toExpPos: 21, LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286" }, U = true, re = "[DecimalError] ", Oe = re + "Invalid argument: ", br = re + "Exponent out of range: ", Ue = Math.floor, Se = Math.pow, Zo = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Q = 1e7, N = 7, ln = 9007199254740991, Lt = Ue(ln / N), R = {};
      R.absoluteValue = R.abs = function() {
        var e = new this.constructor(this);
        return e.s && (e.s = 1), e;
      };
      R.comparedTo = R.cmp = function(e) {
        var t, r, n, i, o = this;
        if (e = new o.constructor(e), o.s !== e.s) return o.s || -e.s;
        if (o.e !== e.e) return o.e > e.e ^ o.s < 0 ? 1 : -1;
        for (n = o.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t) if (o.d[t] !== e.d[t]) return o.d[t] > e.d[t] ^ o.s < 0 ? 1 : -1;
        return n === i ? 0 : n > i ^ o.s < 0 ? 1 : -1;
      };
      R.decimalPlaces = R.dp = function() {
        var e = this, t = e.d.length - 1, r = (t - e.e) * N;
        if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
        return r < 0 ? 0 : r;
      };
      R.dividedBy = R.div = function(e) {
        return ye(this, new this.constructor(e));
      };
      R.dividedToIntegerBy = R.idiv = function(e) {
        var t = this, r = t.constructor;
        return D(ye(t, new r(e), 0, 1), r.precision);
      };
      R.equals = R.eq = function(e) {
        return !this.cmp(e);
      };
      R.exponent = function() {
        return $2(this);
      };
      R.greaterThan = R.gt = function(e) {
        return this.cmp(e) > 0;
      };
      R.greaterThanOrEqualTo = R.gte = function(e) {
        return this.cmp(e) >= 0;
      };
      R.isInteger = R.isint = function() {
        return this.e > this.d.length - 2;
      };
      R.isNegative = R.isneg = function() {
        return this.s < 0;
      };
      R.isPositive = R.ispos = function() {
        return this.s > 0;
      };
      R.isZero = function() {
        return this.s === 0;
      };
      R.lessThan = R.lt = function(e) {
        return this.cmp(e) < 0;
      };
      R.lessThanOrEqualTo = R.lte = function(e) {
        return this.cmp(e) < 1;
      };
      R.logarithm = R.log = function(e) {
        var t, r = this, n = r.constructor, i = n.precision, o = i + 5;
        if (e === void 0) e = new n(10);
        else if (e = new n(e), e.s < 1 || e.eq(Z)) throw Error(re + "NaN");
        if (r.s < 1) throw Error(re + (r.s ? "NaN" : "-Infinity"));
        return r.eq(Z) ? new n(0) : (U = false, t = ye(it(r, o), it(e, o), o), U = true, D(t, i));
      };
      R.minus = R.sub = function(e) {
        var t = this;
        return e = new t.constructor(e), t.s == e.s ? mn(t, e) : un(t, (e.s = -e.s, e));
      };
      R.modulo = R.mod = function(e) {
        var t, r = this, n = r.constructor, i = n.precision;
        if (e = new n(e), !e.s) throw Error(re + "NaN");
        return r.s ? (U = false, t = ye(r, e, 0, 1).times(e), U = true, r.minus(t)) : D(new n(r), i);
      };
      R.naturalExponential = R.exp = function() {
        return cn(this);
      };
      R.naturalLogarithm = R.ln = function() {
        return it(this);
      };
      R.negated = R.neg = function() {
        var e = new this.constructor(this);
        return e.s = -e.s || 0, e;
      };
      R.plus = R.add = function(e) {
        var t = this;
        return e = new t.constructor(e), t.s == e.s ? un(t, e) : mn(t, (e.s = -e.s, e));
      };
      R.precision = R.sd = function(e) {
        var t, r, n, i = this;
        if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Oe + e);
        if (t = $2(i) + 1, n = i.d.length - 1, r = n * N + 1, n = i.d[n], n) {
          for (; n % 10 == 0; n /= 10) r--;
          for (n = i.d[0]; n >= 10; n /= 10) r++;
        }
        return e && t > r ? t : r;
      };
      R.squareRoot = R.sqrt = function() {
        var e, t, r, n, i, o, s, a = this, u = a.constructor;
        if (a.s < 1) {
          if (!a.s) return new u(0);
          throw Error(re + "NaN");
        }
        for (e = $2(a), U = false, i = Math.sqrt(+a), i == 0 || i == 1 / 0 ? (t = ae(a.d), (t.length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = Ue((e + 1) / 2) - (e < 0 || e % 2), i == 1 / 0 ? t = "5e" + e : (t = i.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new u(t)) : n = new u(i.toString()), r = u.precision, i = s = r + 3; ; ) if (o = n, n = o.plus(ye(a, o, s + 2)).times(0.5), ae(o.d).slice(0, s) === (t = ae(n.d)).slice(0, s)) {
          if (t = t.slice(s - 3, s + 1), i == s && t == "4999") {
            if (D(o, r + 1, 0), o.times(o).eq(a)) {
              n = o;
              break;
            }
          } else if (t != "9999") break;
          s += 4;
        }
        return U = true, D(n, r);
      };
      R.times = R.mul = function(e) {
        var t, r, n, i, o, s, a, u, g, T = this, C = T.constructor, O = T.d, A = (e = new C(e)).d;
        if (!T.s || !e.s) return new C(0);
        for (e.s *= T.s, r = T.e + e.e, u = O.length, g = A.length, u < g && (o = O, O = A, A = o, s = u, u = g, g = s), o = [], s = u + g, n = s; n--; ) o.push(0);
        for (n = g; --n >= 0; ) {
          for (t = 0, i = u + n; i > n; ) a = o[i] + A[n] * O[i - n - 1] + t, o[i--] = a % Q | 0, t = a / Q | 0;
          o[i] = (o[i] + t) % Q | 0;
        }
        for (; !o[--s]; ) o.pop();
        return t ? ++r : o.shift(), e.d = o, e.e = r, U ? D(e, C.precision) : e;
      };
      R.toDecimalPlaces = R.todp = function(e, t) {
        var r = this, n = r.constructor;
        return r = new n(r), e === void 0 ? r : (le(e, 0, Ne), t === void 0 ? t = n.rounding : le(t, 0, 8), D(r, e + $2(r) + 1, t));
      };
      R.toExponential = function(e, t) {
        var r, n = this, i = n.constructor;
        return e === void 0 ? r = ke(n, true) : (le(e, 0, Ne), t === void 0 ? t = i.rounding : le(t, 0, 8), n = D(new i(n), e + 1, t), r = ke(n, true, e + 1)), r;
      };
      R.toFixed = function(e, t) {
        var r, n, i = this, o = i.constructor;
        return e === void 0 ? ke(i) : (le(e, 0, Ne), t === void 0 ? t = o.rounding : le(t, 0, 8), n = D(new o(i), e + $2(i) + 1, t), r = ke(n.abs(), false, e + $2(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r);
      };
      R.toInteger = R.toint = function() {
        var e = this, t = e.constructor;
        return D(new t(e), $2(e) + 1, t.rounding);
      };
      R.toNumber = function() {
        return +this;
      };
      R.toPower = R.pow = function(e) {
        var t, r, n, i, o, s, a = this, u = a.constructor, g = 12, T = +(e = new u(e));
        if (!e.s) return new u(Z);
        if (a = new u(a), !a.s) {
          if (e.s < 1) throw Error(re + "Infinity");
          return a;
        }
        if (a.eq(Z)) return a;
        if (n = u.precision, e.eq(Z)) return D(a, n);
        if (t = e.e, r = e.d.length - 1, s = t >= r, o = a.s, s) {
          if ((r = T < 0 ? -T : T) <= ln) {
            for (i = new u(Z), t = Math.ceil(n / N + 4), U = false; r % 2 && (i = i.times(a), an(i.d, t)), r = Ue(r / 2), r !== 0; ) a = a.times(a), an(a.d, t);
            return U = true, e.s < 0 ? new u(Z).div(i) : D(i, n);
          }
        } else if (o < 0) throw Error(re + "NaN");
        return o = o < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, a.s = 1, U = false, i = e.times(it(a, n + g)), U = true, i = cn(i), i.s = o, i;
      };
      R.toPrecision = function(e, t) {
        var r, n, i = this, o = i.constructor;
        return e === void 0 ? (r = $2(i), n = ke(i, r <= o.toExpNeg || r >= o.toExpPos)) : (le(e, 1, Ne), t === void 0 ? t = o.rounding : le(t, 0, 8), i = D(new o(i), e, t), r = $2(i), n = ke(i, e <= r || r <= o.toExpNeg, e)), n;
      };
      R.toSignificantDigits = R.tosd = function(e, t) {
        var r = this, n = r.constructor;
        return e === void 0 ? (e = n.precision, t = n.rounding) : (le(e, 1, Ne), t === void 0 ? t = n.rounding : le(t, 0, 8)), D(new n(r), e, t);
      };
      R.toString = R.valueOf = R.val = R.toJSON = R[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = function() {
        var e = this, t = $2(e), r = e.constructor;
        return ke(e, t <= r.toExpNeg || t >= r.toExpPos);
      };
      ye = /* @__PURE__ */ (function() {
        function e(n, i) {
          var o, s = 0, a = n.length;
          for (n = n.slice(); a--; ) o = n[a] * i + s, n[a] = o % Q | 0, s = o / Q | 0;
          return s && n.unshift(s), n;
        }
        __name(e, "e");
        function t(n, i, o, s) {
          var a, u;
          if (o != s) u = o > s ? 1 : -1;
          else for (a = u = 0; a < o; a++) if (n[a] != i[a]) {
            u = n[a] > i[a] ? 1 : -1;
            break;
          }
          return u;
        }
        __name(t, "t");
        function r(n, i, o) {
          for (var s = 0; o--; ) n[o] -= s, s = n[o] < i[o] ? 1 : 0, n[o] = s * Q + n[o] - i[o];
          for (; !n[0] && n.length > 1; ) n.shift();
        }
        __name(r, "r");
        return function(n, i, o, s) {
          var a, u, g, T, C, O, A, M, S, I, ne, z, _e, k, Ae, fr, ie, St, Ot = n.constructor, No = n.s == i.s ? 1 : -1, oe = n.d, q = i.d;
          if (!n.s) return new Ot(n);
          if (!i.s) throw Error(re + "Division by zero");
          for (u = n.e - i.e, ie = q.length, Ae = oe.length, A = new Ot(No), M = A.d = [], g = 0; q[g] == (oe[g] || 0); ) ++g;
          if (q[g] > (oe[g] || 0) && --u, o == null ? z = o = Ot.precision : s ? z = o + ($2(n) - $2(i)) + 1 : z = o, z < 0) return new Ot(0);
          if (z = z / N + 2 | 0, g = 0, ie == 1) for (T = 0, q = q[0], z++; (g < Ae || T) && z--; g++) _e = T * Q + (oe[g] || 0), M[g] = _e / q | 0, T = _e % q | 0;
          else {
            for (T = Q / (q[0] + 1) | 0, T > 1 && (q = e(q, T), oe = e(oe, T), ie = q.length, Ae = oe.length), k = ie, S = oe.slice(0, ie), I = S.length; I < ie; ) S[I++] = 0;
            St = q.slice(), St.unshift(0), fr = q[0], q[1] >= Q / 2 && ++fr;
            do
              T = 0, a = t(q, S, ie, I), a < 0 ? (ne = S[0], ie != I && (ne = ne * Q + (S[1] || 0)), T = ne / fr | 0, T > 1 ? (T >= Q && (T = Q - 1), C = e(q, T), O = C.length, I = S.length, a = t(C, S, O, I), a == 1 && (T--, r(C, ie < O ? St : q, O))) : (T == 0 && (a = T = 1), C = q.slice()), O = C.length, O < I && C.unshift(0), r(S, C, I), a == -1 && (I = S.length, a = t(q, S, ie, I), a < 1 && (T++, r(S, ie < I ? St : q, I))), I = S.length) : a === 0 && (T++, S = [0]), M[g++] = T, a && S[0] ? S[I++] = oe[k] || 0 : (S = [oe[k]], I = 1);
            while ((k++ < Ae || S[0] !== void 0) && z--);
          }
          return M[0] || M.shift(), A.e = u, D(A, s ? o + $2(A) + 1 : o);
        };
      })();
      wr = pn(Xo);
      Z = new wr(1);
      _t = wr;
    });
    var v;
    var ue;
    var l = se(() => {
      "use strict";
      dn();
      v = class extends _t {
        static {
          __name(this, "v");
        }
        static isDecimal(t) {
          return t instanceof _t;
        }
        static random(t = 20) {
          {
            let n = crypto.getRandomValues(new Uint8Array(t)).reduce((i, o) => i + o, "");
            return new _t(`0.${n.slice(0, t)}`);
          }
        }
      }, ue = v;
    });
    function ts() {
      return false;
    }
    __name(ts, "ts");
    var rs;
    var ns;
    var yn;
    var bn = se(() => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      rs = {}, ns = { existsSync: ts, promises: rs }, yn = ns;
    });
    function us(...e) {
      return e.join("/");
    }
    __name(us, "us");
    function cs(...e) {
      return e.join("/");
    }
    __name(cs, "cs");
    var In;
    var ms;
    var ps;
    var st;
    var Ln = se(() => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      In = "/", ms = { sep: In }, ps = { resolve: us, posix: ms, join: cs, sep: In }, st = ps;
    });
    var Ut;
    var Dn = se(() => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      Ut = class {
        static {
          __name(this, "Ut");
        }
        constructor() {
          this.events = {};
        }
        on(t, r) {
          return this.events[t] || (this.events[t] = []), this.events[t].push(r), this;
        }
        emit(t, ...r) {
          return this.events[t] ? (this.events[t].forEach((n) => {
            n(...r);
          }), true) : false;
        }
      };
    });
    var Nn = De((Wc, Fn) => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      Fn.exports = (e, t = 1, r) => {
        if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof e != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
        if (typeof t != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);
        if (typeof r.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
        if (t === 0) return e;
        let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return e.replace(n, r.indent.repeat(t));
      };
    });
    var Bn = De((am, qn) => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      qn.exports = ({ onlyFirst: e = false } = {}) => {
        let t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
        return new RegExp(t, e ? void 0 : "g");
      };
    });
    var Vn = De((fm, $n) => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      var bs = Bn();
      $n.exports = (e) => typeof e == "string" ? e.replace(bs(), "") : e;
    });
    var kr = De((Mf, Jn) => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
      Jn.exports = /* @__PURE__ */ (function() {
        function e(t, r, n, i, o) {
          return t < r || n < r ? t > n ? n + 1 : t + 1 : i === o ? r : r + 1;
        }
        __name(e, "e");
        return function(t, r) {
          if (t === r) return 0;
          if (t.length > r.length) {
            var n = t;
            t = r, r = n;
          }
          for (var i = t.length, o = r.length; i > 0 && t.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && t.charCodeAt(s) === r.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, u, g, T, C, O, A, M, S, I, ne, z, _e, k = [];
          for (u = 0; u < i; u++) k.push(u + 1), k.push(t.charCodeAt(s + u));
          for (var Ae = k.length - 1; a < o - 3; ) for (I = r.charCodeAt(s + (g = a)), ne = r.charCodeAt(s + (T = a + 1)), z = r.charCodeAt(s + (C = a + 2)), _e = r.charCodeAt(s + (O = a + 3)), A = a += 4, u = 0; u < Ae; u += 2) M = k[u], S = k[u + 1], g = e(M, g, T, I, S), T = e(g, T, C, ne, S), C = e(T, C, O, z, S), A = e(C, O, A, _e, S), k[u] = A, O = C, C = T, T = g, g = M;
          for (; a < o; ) for (I = r.charCodeAt(s + (g = a)), A = ++a, u = 0; u < Ae; u += 2) M = k[u], k[u] = A = e(M, g, A, I, k[u + 1]), g = M;
          return A;
        };
      })();
    });
    var wi = De((oE, fa) => {
      fa.exports = { name: "@prisma/engines-version", version: "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "605197351a3c8bdd595af2d2a9bc3025bca48ea2" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.34", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var Ei = De(() => {
      "use strict";
      c();
      m();
      p();
      d();
      f();
      l();
    });
    var ul = {};
    Mt(ul, { Debug: /* @__PURE__ */ __name(() => Tr, "Debug"), Decimal: /* @__PURE__ */ __name(() => ue, "Decimal"), Extensions: /* @__PURE__ */ __name(() => Er, "Extensions"), MetricsClient: /* @__PURE__ */ __name(() => Ze, "MetricsClient"), NotFoundError: /* @__PURE__ */ __name(() => we, "NotFoundError"), PrismaClientInitializationError: /* @__PURE__ */ __name(() => L, "PrismaClientInitializationError"), PrismaClientKnownRequestError: /* @__PURE__ */ __name(() => J, "PrismaClientKnownRequestError"), PrismaClientRustPanicError: /* @__PURE__ */ __name(() => Ee, "PrismaClientRustPanicError"), PrismaClientUnknownRequestError: /* @__PURE__ */ __name(() => G, "PrismaClientUnknownRequestError"), PrismaClientValidationError: /* @__PURE__ */ __name(() => j, "PrismaClientValidationError"), Public: /* @__PURE__ */ __name(() => xr, "Public"), Sql: /* @__PURE__ */ __name(() => X, "Sql"), defineDmmfProperty: /* @__PURE__ */ __name(() => hi, "defineDmmfProperty"), deserializeJsonResponse: /* @__PURE__ */ __name(() => $e, "deserializeJsonResponse"), dmmfToRuntimeDataModel: /* @__PURE__ */ __name(() => gi, "dmmfToRuntimeDataModel"), empty: /* @__PURE__ */ __name(() => Pi, "empty"), getPrismaClient: /* @__PURE__ */ __name(() => _o, "getPrismaClient"), getRuntime: /* @__PURE__ */ __name(() => Ce, "getRuntime"), join: /* @__PURE__ */ __name(() => xi, "join"), makeStrictEnum: /* @__PURE__ */ __name(() => Do, "makeStrictEnum"), makeTypedQueryFactory: /* @__PURE__ */ __name(() => yi, "makeTypedQueryFactory"), objectEnumValues: /* @__PURE__ */ __name(() => Wt, "objectEnumValues"), raw: /* @__PURE__ */ __name(() => Vr, "raw"), serializeJsonQuery: /* @__PURE__ */ __name(() => Zt, "serializeJsonQuery"), skip: /* @__PURE__ */ __name(() => Xt, "skip"), sqltag: /* @__PURE__ */ __name(() => jr, "sqltag"), warnEnvConflicts: /* @__PURE__ */ __name(() => void 0, "warnEnvConflicts"), warnOnce: /* @__PURE__ */ __name(() => ct, "warnOnce") });
    module.exports = jo(ul);
    c();
    m();
    p();
    d();
    f();
    l();
    var Er = {};
    Mt(Er, { defineExtension: /* @__PURE__ */ __name(() => fn, "defineExtension"), getExtensionContext: /* @__PURE__ */ __name(() => gn, "getExtensionContext") });
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function fn(e) {
      return typeof e == "function" ? e : (t) => t.$extends(e);
    }
    __name(fn, "fn");
    c();
    m();
    p();
    d();
    f();
    l();
    function gn(e) {
      return e;
    }
    __name(gn, "gn");
    var xr = {};
    Mt(xr, { validator: /* @__PURE__ */ __name(() => hn, "validator") });
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function hn(...e) {
      return (t) => t;
    }
    __name(hn, "hn");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Pr;
    var wn;
    var En;
    var xn;
    var Pn = true;
    typeof h < "u" && ({ FORCE_COLOR: Pr, NODE_DISABLE_COLORS: wn, NO_COLOR: En, TERM: xn } = h.env || {}, Pn = h.stdout && h.stdout.isTTY);
    var is = { enabled: !wn && En == null && xn !== "dumb" && (Pr != null && Pr !== "0" || Pn) };
    function F(e, t) {
      let r = new RegExp(`\\x1b\\[${t}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${t}m`;
      return function(o) {
        return !is.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
      };
    }
    __name(F, "F");
    var fu = F(0, 0);
    var Dt = F(1, 22);
    var Ft = F(2, 22);
    var gu = F(3, 23);
    var vn = F(4, 24);
    var hu = F(7, 27);
    var yu = F(8, 28);
    var bu = F(9, 29);
    var wu = F(30, 39);
    var qe = F(31, 39);
    var Tn = F(32, 39);
    var Cn = F(33, 39);
    var Rn = F(34, 39);
    var Eu = F(35, 39);
    var An = F(36, 39);
    var xu = F(37, 39);
    var Sn = F(90, 39);
    var Pu = F(90, 39);
    var vu = F(40, 49);
    var Tu = F(41, 49);
    var Cu = F(42, 49);
    var Ru = F(43, 49);
    var Au = F(44, 49);
    var Su = F(45, 49);
    var Ou = F(46, 49);
    var ku = F(47, 49);
    c();
    m();
    p();
    d();
    f();
    l();
    var os = 100;
    var On = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var Nt = [];
    var kn = Date.now();
    var ss = 0;
    var vr = typeof h < "u" ? h.env : {};
    globalThis.DEBUG ??= vr.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= vr.DEBUG_COLORS ? vr.DEBUG_COLORS === "true" : true;
    var ot = { enable(e) {
      typeof e == "string" && (globalThis.DEBUG = e);
    }, disable() {
      let e = globalThis.DEBUG;
      return globalThis.DEBUG = "", e;
    }, enabled(e) {
      let t = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = t.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = t.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return r && !n;
    }, log: /* @__PURE__ */ __name((...e) => {
      let [t, r, ...n] = e;
      (console.warn ?? console.log)(`${t} ${r}`, ...n);
    }, "log"), formatters: {} };
    function as(e) {
      let t = { color: On[ss++ % On.length], enabled: ot.enabled(e), namespace: e, log: ot.log, extend: /* @__PURE__ */ __name(() => {
      }, "extend") }, r = /* @__PURE__ */ __name((...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = t;
        if (n.length !== 0 && Nt.push([o, ...n]), Nt.length > os && Nt.shift(), ot.enabled(o) || i) {
          let u = n.map((T) => typeof T == "string" ? T : ls(T)), g = `+${Date.now() - kn}ms`;
          kn = Date.now(), a(o, ...u, g);
        }
      }, "r");
      return new Proxy(r, { get: /* @__PURE__ */ __name((n, i) => t[i], "get"), set: /* @__PURE__ */ __name((n, i, o) => t[i] = o, "set") });
    }
    __name(as, "as");
    var Tr = new Proxy(as, { get: /* @__PURE__ */ __name((e, t) => ot[t], "get"), set: /* @__PURE__ */ __name((e, t, r) => ot[t] = r, "set") });
    function ls(e, t = 2) {
      let r = /* @__PURE__ */ new Set();
      return JSON.stringify(e, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (r.has(i)) return "[Circular *]";
          r.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, t);
    }
    __name(ls, "ls");
    function Mn() {
      Nt.length = 0;
    }
    __name(Mn, "Mn");
    var ee = Tr;
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Cr = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
    c();
    m();
    p();
    d();
    f();
    l();
    var _n = "library";
    function at(e) {
      let t = ds();
      return t || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : _n);
    }
    __name(at, "at");
    function ds() {
      let e = h.env.PRISMA_CLIENT_ENGINE_TYPE;
      return e === "library" ? "library" : e === "binary" ? "binary" : void 0;
    }
    __name(ds, "ds");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Me;
    ((t) => {
      let e;
      ((k) => (k.findUnique = "findUnique", k.findUniqueOrThrow = "findUniqueOrThrow", k.findFirst = "findFirst", k.findFirstOrThrow = "findFirstOrThrow", k.findMany = "findMany", k.create = "create", k.createMany = "createMany", k.createManyAndReturn = "createManyAndReturn", k.update = "update", k.updateMany = "updateMany", k.upsert = "upsert", k.delete = "delete", k.deleteMany = "deleteMany", k.groupBy = "groupBy", k.count = "count", k.aggregate = "aggregate", k.findRaw = "findRaw", k.aggregateRaw = "aggregateRaw"))(e = t.ModelAction ||= {});
    })(Me ||= {});
    var ut = {};
    Mt(ut, { error: /* @__PURE__ */ __name(() => hs, "error"), info: /* @__PURE__ */ __name(() => gs, "info"), log: /* @__PURE__ */ __name(() => fs, "log"), query: /* @__PURE__ */ __name(() => ys, "query"), should: /* @__PURE__ */ __name(() => Un, "should"), tags: /* @__PURE__ */ __name(() => lt, "tags"), warn: /* @__PURE__ */ __name(() => Rr, "warn") });
    c();
    m();
    p();
    d();
    f();
    l();
    var lt = { error: qe("prisma:error"), warn: Cn("prisma:warn"), info: An("prisma:info"), query: Rn("prisma:query") };
    var Un = { warn: /* @__PURE__ */ __name(() => !h.env.PRISMA_DISABLE_WARNINGS, "warn") };
    function fs(...e) {
      console.log(...e);
    }
    __name(fs, "fs");
    function Rr(e, ...t) {
      Un.warn() && console.warn(`${lt.warn} ${e}`, ...t);
    }
    __name(Rr, "Rr");
    function gs(e, ...t) {
      console.info(`${lt.info} ${e}`, ...t);
    }
    __name(gs, "gs");
    function hs(e, ...t) {
      console.error(`${lt.error} ${e}`, ...t);
    }
    __name(hs, "hs");
    function ys(e, ...t) {
      console.log(`${lt.query} ${e}`, ...t);
    }
    __name(ys, "ys");
    c();
    m();
    p();
    d();
    f();
    l();
    function qt(e, t) {
      if (!e) throw new Error(`${t}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
    }
    __name(qt, "qt");
    c();
    m();
    p();
    d();
    f();
    l();
    function be(e, t) {
      throw new Error(t);
    }
    __name(be, "be");
    c();
    m();
    p();
    d();
    f();
    l();
    function Ar(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }
    __name(Ar, "Ar");
    c();
    m();
    p();
    d();
    f();
    l();
    var Sr = /* @__PURE__ */ __name((e, t) => e.reduce((r, n) => (r[t(n)] = n, r), {}), "Sr");
    c();
    m();
    p();
    d();
    f();
    l();
    function Be(e, t) {
      let r = {};
      for (let n of Object.keys(e)) r[n] = t(e[n], n);
      return r;
    }
    __name(Be, "Be");
    c();
    m();
    p();
    d();
    f();
    l();
    function Or(e, t) {
      if (e.length === 0) return;
      let r = e[0];
      for (let n = 1; n < e.length; n++) t(r, e[n]) < 0 && (r = e[n]);
      return r;
    }
    __name(Or, "Or");
    c();
    m();
    p();
    d();
    f();
    l();
    function K(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(K, "K");
    c();
    m();
    p();
    d();
    f();
    l();
    var jn = /* @__PURE__ */ new Set();
    var ct = /* @__PURE__ */ __name((e, t, ...r) => {
      jn.has(e) || (jn.add(e), Rr(t, ...r));
    }, "ct");
    c();
    m();
    p();
    d();
    f();
    l();
    var J = class extends Error {
      static {
        __name(this, "J");
      }
      constructor(t, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(t), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    K(J, "PrismaClientKnownRequestError");
    var we = class extends J {
      static {
        __name(this, "we");
      }
      constructor(t, r) {
        super(t, { code: "P2025", clientVersion: r }), this.name = "NotFoundError";
      }
    };
    K(we, "NotFoundError");
    c();
    m();
    p();
    d();
    f();
    l();
    var L = class e extends Error {
      static {
        __name(this, "e");
      }
      constructor(t, r, n) {
        super(t), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(e);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    K(L, "PrismaClientInitializationError");
    c();
    m();
    p();
    d();
    f();
    l();
    var Ee = class extends Error {
      static {
        __name(this, "Ee");
      }
      constructor(t, r) {
        super(t), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    K(Ee, "PrismaClientRustPanicError");
    c();
    m();
    p();
    d();
    f();
    l();
    var G = class extends Error {
      static {
        __name(this, "G");
      }
      constructor(t, { clientVersion: r, batchRequestIdx: n }) {
        super(t), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    K(G, "PrismaClientUnknownRequestError");
    c();
    m();
    p();
    d();
    f();
    l();
    var j = class extends Error {
      static {
        __name(this, "j");
      }
      constructor(r, { clientVersion: n }) {
        super(r);
        this.name = "PrismaClientValidationError";
        this.clientVersion = n;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    K(j, "PrismaClientValidationError");
    c();
    m();
    p();
    d();
    f();
    l();
    l();
    function $e(e) {
      return e === null ? e : Array.isArray(e) ? e.map($e) : typeof e == "object" ? ws(e) ? Es(e) : Be(e, $e) : e;
    }
    __name($e, "$e");
    function ws(e) {
      return e !== null && typeof e == "object" && typeof e.$type == "string";
    }
    __name(ws, "ws");
    function Es({ $type: e, value: t }) {
      switch (e) {
        case "BigInt":
          return BigInt(t);
        case "Bytes":
          return b.from(t, "base64");
        case "DateTime":
          return new Date(t);
        case "Decimal":
          return new ue(t);
        case "Json":
          return JSON.parse(t);
        default:
          be(t, "Unknown tagged value");
      }
    }
    __name(Es, "Es");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function Ve(e) {
      return e.substring(0, 1).toLowerCase() + e.substring(1);
    }
    __name(Ve, "Ve");
    c();
    m();
    p();
    d();
    f();
    l();
    function je(e) {
      return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
    }
    __name(je, "je");
    function Bt(e) {
      return e.toString() !== "Invalid Date";
    }
    __name(Bt, "Bt");
    c();
    m();
    p();
    d();
    f();
    l();
    l();
    function Qe(e) {
      return v.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
    }
    __name(Qe, "Qe");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var xs = Fe(Nn());
    var Ps = { red: qe, gray: Sn, dim: Ft, bold: Dt, underline: vn, highlightSource: /* @__PURE__ */ __name((e) => e.highlight(), "highlightSource") };
    var vs = { red: /* @__PURE__ */ __name((e) => e, "red"), gray: /* @__PURE__ */ __name((e) => e, "gray"), dim: /* @__PURE__ */ __name((e) => e, "dim"), bold: /* @__PURE__ */ __name((e) => e, "bold"), underline: /* @__PURE__ */ __name((e) => e, "underline"), highlightSource: /* @__PURE__ */ __name((e) => e, "highlightSource") };
    function Ts({ message: e, originalMethod: t, isPanic: r, callArguments: n }) {
      return { functionName: `prisma.${t}()`, message: e, isPanic: r ?? false, callArguments: n };
    }
    __name(Ts, "Ts");
    function Cs({ functionName: e, location: t, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], u = t ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${u}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${u}`)), t && a.push(s.underline(Rs(t))), i) {
        a.push("");
        let g = [i.toString()];
        o && (g.push(o), g.push(s.dim(")"))), a.push(g.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r), a.join(`
`);
    }
    __name(Cs, "Cs");
    function Rs(e) {
      let t = [e.fileName];
      return e.lineNumber && t.push(String(e.lineNumber)), e.columnNumber && t.push(String(e.columnNumber)), t.join(":");
    }
    __name(Rs, "Rs");
    function Je(e) {
      let t = e.showColors ? Ps : vs, r;
      return typeof $getTemplateParameters < "u" ? r = $getTemplateParameters(e, t) : r = Ts(e), Cs(r, t);
    }
    __name(Je, "Je");
    c();
    m();
    p();
    d();
    f();
    l();
    var Yn = Fe(kr());
    c();
    m();
    p();
    d();
    f();
    l();
    function Kn(e, t, r) {
      let n = Hn(e), i = As(n), o = Os(i);
      o ? $t(o, t, r) : t.addErrorMessage(() => "Unknown error");
    }
    __name(Kn, "Kn");
    function Hn(e) {
      return e.errors.flatMap((t) => t.kind === "Union" ? Hn(t) : [t]);
    }
    __name(Hn, "Hn");
    function As(e) {
      let t = /* @__PURE__ */ new Map(), r = [];
      for (let n of e) {
        if (n.kind !== "InvalidArgumentType") {
          r.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = t.get(i);
        o ? t.set(i, { ...n, argument: { ...n.argument, typeNames: Ss(o.argument.typeNames, n.argument.typeNames) } }) : t.set(i, n);
      }
      return r.push(...t.values()), r;
    }
    __name(As, "As");
    function Ss(e, t) {
      return [...new Set(e.concat(t))];
    }
    __name(Ss, "Ss");
    function Os(e) {
      return Or(e, (t, r) => {
        let n = Gn(t), i = Gn(r);
        return n !== i ? n - i : Wn(t) - Wn(r);
      });
    }
    __name(Os, "Os");
    function Gn(e) {
      let t = 0;
      return Array.isArray(e.selectionPath) && (t += e.selectionPath.length), Array.isArray(e.argumentPath) && (t += e.argumentPath.length), t;
    }
    __name(Gn, "Gn");
    function Wn(e) {
      switch (e.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    __name(Wn, "Wn");
    c();
    m();
    p();
    d();
    f();
    l();
    var te = class {
      static {
        __name(this, "te");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
        this.isRequired = false;
      }
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.addMarginSymbol(r(this.isRequired ? "+" : "?")), t.write(r(this.name)), this.isRequired || t.write(r("?")), t.write(r(": ")), typeof this.value == "string" ? t.write(r(this.value)) : t.write(this.value);
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Ge = class {
      static {
        __name(this, "Ge");
      }
      constructor(t = 0, r) {
        this.context = r;
        this.lines = [];
        this.currentLine = "";
        this.currentIndent = 0;
        this.currentIndent = t;
      }
      write(t) {
        return typeof t == "string" ? this.currentLine += t : t.write(this), this;
      }
      writeJoined(t, r, n = (i, o) => o.write(i)) {
        let i = r.length - 1;
        for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(t);
        return this;
      }
      writeLine(t) {
        return this.write(t).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let t = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, t?.(), this;
      }
      withIndent(t) {
        return this.indent(), t(this), this.unindent(), this;
      }
      afterNextNewline(t) {
        return this.afterNextNewLineCallback = t, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(t) {
        return this.marginSymbol = t, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let t = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + t.slice(1) : t;
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Vt = class {
      static {
        __name(this, "Vt");
      }
      constructor(t) {
        this.value = t;
      }
      write(t) {
        t.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var jt = /* @__PURE__ */ __name((e) => e, "jt");
    var Qt = { bold: jt, red: jt, green: jt, dim: jt, enabled: false };
    var zn = { bold: Dt, red: qe, green: Tn, dim: Ft, enabled: true };
    var We = { write(e) {
      e.writeLine(",");
    } };
    c();
    m();
    p();
    d();
    f();
    l();
    var ce = class {
      static {
        __name(this, "ce");
      }
      constructor(t) {
        this.contents = t;
        this.isUnderlined = false;
        this.color = (t2) => t2;
      }
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(t) {
        return this.color = t, this;
      }
      write(t) {
        let r = t.getCurrentLineLength();
        t.write(this.color(this.contents)), this.isUnderlined && t.afterNextNewline(() => {
          t.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var ve = class {
      static {
        __name(this, "ve");
      }
      constructor() {
        this.hasError = false;
      }
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var Ke = class extends ve {
      static {
        __name(this, "Ke");
      }
      constructor() {
        super(...arguments);
        this.items = [];
      }
      addItem(r) {
        return this.items.push(new Vt(r)), this;
      }
      getField(r) {
        return this.items[r];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((n) => n.value.getPrintWidth())) + 2;
      }
      write(r) {
        if (this.items.length === 0) {
          this.writeEmpty(r);
          return;
        }
        this.writeWithItems(r);
      }
      writeEmpty(r) {
        let n = new ce("[]");
        this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
      }
      writeWithItems(r) {
        let { colors: n } = r.context;
        r.writeLine("[").withIndent(() => r.writeJoined(We, this.items).newLine()).write("]"), this.hasError && r.afterNextNewline(() => {
          r.writeLine(n.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var He = class e extends ve {
      static {
        __name(this, "e");
      }
      constructor() {
        super(...arguments);
        this.fields = {};
        this.suggestions = [];
      }
      addField(r) {
        this.fields[r.name] = r;
      }
      addSuggestion(r) {
        this.suggestions.push(r);
      }
      getField(r) {
        return this.fields[r];
      }
      getDeepField(r) {
        let [n, ...i] = r, o = this.getField(n);
        if (!o) return;
        let s = o;
        for (let a of i) {
          let u;
          if (s.value instanceof e ? u = s.value.getField(a) : s.value instanceof Ke && (u = s.value.getField(Number(a))), !u) return;
          s = u;
        }
        return s;
      }
      getDeepFieldValue(r) {
        return r.length === 0 ? this : this.getDeepField(r)?.value;
      }
      hasField(r) {
        return !!this.getField(r);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(r) {
        delete this.fields[r];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(r) {
        return this.getField(r)?.value;
      }
      getDeepSubSelectionValue(r) {
        let n = this;
        for (let i of r) {
          if (!(n instanceof e)) return;
          let o = n.getSubSelectionValue(i);
          if (!o) return;
          n = o;
        }
        return n;
      }
      getDeepSelectionParent(r) {
        let n = this.getSelectionParent();
        if (!n) return;
        let i = n;
        for (let o of r) {
          let s = i.value.getFieldValue(o);
          if (!s || !(s instanceof e)) return;
          let a = s.getSelectionParent();
          if (!a) return;
          i = a;
        }
        return i;
      }
      getSelectionParent() {
        let r = this.getField("select")?.value.asObject();
        if (r) return { kind: "select", value: r };
        let n = this.getField("include")?.value.asObject();
        if (n) return { kind: "include", value: n };
      }
      getSubSelectionValue(r) {
        return this.getSelectionParent()?.value.fields[r].value;
      }
      getPrintWidth() {
        let r = Object.values(this.fields);
        return r.length == 0 ? 2 : Math.max(...r.map((i) => i.getPrintWidth())) + 2;
      }
      write(r) {
        let n = Object.values(this.fields);
        if (n.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(r);
          return;
        }
        this.writeWithContents(r, n);
      }
      asObject() {
        return this;
      }
      writeEmpty(r) {
        let n = new ce("{}");
        this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
      }
      writeWithContents(r, n) {
        r.writeLine("{").withIndent(() => {
          r.writeJoined(We, [...n, ...this.suggestions]).newLine();
        }), r.write("}"), this.hasError && r.afterNextNewline(() => {
          r.writeLine(r.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var W = class extends ve {
      static {
        __name(this, "W");
      }
      constructor(r) {
        super();
        this.text = r;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r) {
        let n = new ce(this.text);
        this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
      }
      asObject() {
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var mt = class {
      static {
        __name(this, "mt");
      }
      constructor() {
        this.fields = [];
      }
      addField(t, r) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.writeLine(r("{")).withIndent(() => {
          t.writeJoined(We, this.fields).newLine();
        }).write(r("}")).addMarginSymbol(r("+"));
      }
    };
    function $t(e, t, r) {
      switch (e.kind) {
        case "MutuallyExclusiveFields":
          Ms(e, t);
          break;
        case "IncludeOnScalar":
          Is(e, t);
          break;
        case "EmptySelection":
          Ls(e, t, r);
          break;
        case "UnknownSelectionField":
          Ns(e, t);
          break;
        case "InvalidSelectionValue":
          Us(e, t);
          break;
        case "UnknownArgument":
          qs(e, t);
          break;
        case "UnknownInputField":
          Bs(e, t);
          break;
        case "RequiredArgumentMissing":
          $s(e, t);
          break;
        case "InvalidArgumentType":
          Vs(e, t);
          break;
        case "InvalidArgumentValue":
          js(e, t);
          break;
        case "ValueTooLarge":
          Qs(e, t);
          break;
        case "SomeFieldsMissing":
          Js(e, t);
          break;
        case "TooManyFieldsGiven":
          Gs(e, t);
          break;
        case "Union":
          Kn(e, t, r);
          break;
        default:
          throw new Error("not implemented: " + e.kind);
      }
    }
    __name($t, "$t");
    function Ms(e, t) {
      let r = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      r && (r.getField(e.firstField)?.markAsError(), r.getField(e.secondField)?.markAsError()), t.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    __name(Ms, "Ms");
    function Is(e, t) {
      let [r, n] = pt(e.selectionPath), i = e.outputType, o = t.arguments.getDeepSelectionParent(r)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new te(s.name, "true"));
      t.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${dt(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    __name(Is, "Is");
    function Ls(e, t, r) {
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          _s(e, t, i);
          return;
        }
        if (n.hasField("select")) {
          Ds(e, t);
          return;
        }
      }
      if (r?.[Ve(e.outputType.name)]) {
        Fs(e, t);
        return;
      }
      t.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
    }
    __name(Ls, "Ls");
    function _s(e, t, r) {
      r.removeAllFields();
      for (let n of e.outputType.fields) r.addSuggestion(new te(n.name, "false"));
      t.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(_s, "_s");
    function Ds(e, t) {
      let r = e.outputType, n = t.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), ei(n, r)), t.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${dt(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    __name(Ds, "Ds");
    function Fs(e, t) {
      let r = new mt();
      for (let i of e.outputType.fields) i.isRelation || r.addField(i.name, "false");
      let n = new te("omit", r).makeRequired();
      if (e.selectionPath.length === 0) t.arguments.addSuggestion(n);
      else {
        let [i, o] = pt(e.selectionPath), a = t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let u = a?.value.asObject() ?? new He();
          u.addSuggestion(n), a.value = u;
        }
      }
      t.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(Fs, "Fs");
    function Ns(e, t) {
      let r = ti(e.selectionPath, t);
      if (r.parentKind !== "unknown") {
        r.field.markAsError();
        let n = r.parent;
        switch (r.parentKind) {
          case "select":
            ei(n, e.outputType);
            break;
          case "include":
            Ws(n, e.outputType);
            break;
          case "omit":
            Ks(n, e.outputType);
            break;
        }
      }
      t.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
        return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(dt(n)), i.join(" ");
      });
    }
    __name(Ns, "Ns");
    function Us(e, t) {
      let r = ti(e.selectionPath, t);
      r.parentKind !== "unknown" && r.field.value.markAsError(), t.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${e.underlyingError}`);
    }
    __name(Us, "Us");
    function qs(e, t) {
      let r = e.argumentPath[0], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && (n.getField(r)?.markAsError(), Hs(n, e.arguments)), t.addErrorMessage((i) => Xn(i, r, e.arguments.map((o) => o.name)));
    }
    __name(qs, "qs");
    function Bs(e, t) {
      let [r, n] = pt(e.argumentPath), i = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(e.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(r)?.asObject();
        o && ri(o, e.inputType);
      }
      t.addErrorMessage((o) => Xn(o, n, e.inputType.fields.map((s) => s.name)));
    }
    __name(Bs, "Bs");
    function Xn(e, t, r) {
      let n = [`Unknown argument \`${e.red(t)}\`.`], i = Ys(t, r);
      return i && n.push(`Did you mean \`${e.green(i)}\`?`), r.length > 0 && n.push(dt(e)), n.join(" ");
    }
    __name(Xn, "Xn");
    function $s(e, t) {
      let r;
      t.addErrorMessage((u) => r?.value instanceof W && r.value.text === "null" ? `Argument \`${u.green(o)}\` must not be ${u.red("null")}.` : `Argument \`${u.green(o)}\` is missing.`);
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = pt(e.argumentPath), s = new mt(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) if (r = a.getField(o), r && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
        for (let u of e.inputTypes[0].fields) s.addField(u.name, u.typeNames.join(" | "));
        a.addSuggestion(new te(o, s).makeRequired());
      } else {
        let u = e.inputTypes.map(Zn).join(" | ");
        a.addSuggestion(new te(o, u).makeRequired());
      }
    }
    __name($s, "$s");
    function Zn(e) {
      return e.kind === "list" ? `${Zn(e.elementType)}[]` : e.name;
    }
    __name(Zn, "Zn");
    function Vs(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = Jt("or", e.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
      });
    }
    __name(Vs, "Vs");
    function js(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(r)}\``];
        if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
          let s = Jt("or", e.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    __name(js, "js");
    function Qs(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(e.argumentPath)?.value;
        s?.markAsError(), s instanceof W && (i = s.text);
      }
      t.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
      });
    }
    __name(Qs, "Qs");
    function Js(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
        i && ri(i, e.inputType);
      }
      t.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${Jt("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(dt(i)), o.join(" ");
      });
    }
    __name(Js, "Js");
    function Gs(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      t.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${Jt("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    __name(Gs, "Gs");
    function ei(e, t) {
      for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new te(r.name, "true"));
    }
    __name(ei, "ei");
    function Ws(e, t) {
      for (let r of t.fields) r.isRelation && !e.hasField(r.name) && e.addSuggestion(new te(r.name, "true"));
    }
    __name(Ws, "Ws");
    function Ks(e, t) {
      for (let r of t.fields) !e.hasField(r.name) && !r.isRelation && e.addSuggestion(new te(r.name, "true"));
    }
    __name(Ks, "Ks");
    function Hs(e, t) {
      for (let r of t) e.hasField(r.name) || e.addSuggestion(new te(r.name, r.typeNames.join(" | ")));
    }
    __name(Hs, "Hs");
    function ti(e, t) {
      let [r, n] = pt(e), i = t.arguments.getDeepSubSelectionValue(r)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), u = o?.getField(n);
      return o && u ? { parentKind: "select", parent: o, field: u, fieldName: n } : (u = s?.getField(n), s && u ? { parentKind: "include", field: u, parent: s, fieldName: n } : (u = a?.getField(n), a && u ? { parentKind: "omit", field: u, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    __name(ti, "ti");
    function ri(e, t) {
      if (t.kind === "object") for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new te(r.name, r.typeNames.join(" | ")));
    }
    __name(ri, "ri");
    function pt(e) {
      let t = [...e], r = t.pop();
      if (!r) throw new Error("unexpected empty path");
      return [t, r];
    }
    __name(pt, "pt");
    function dt({ green: e, enabled: t }) {
      return "Available options are " + (t ? `listed in ${e("green")}` : "marked with ?") + ".";
    }
    __name(dt, "dt");
    function Jt(e, t) {
      if (t.length === 1) return t[0];
      let r = [...t], n = r.pop();
      return `${r.join(", ")} ${e} ${n}`;
    }
    __name(Jt, "Jt");
    var zs = 3;
    function Ys(e, t) {
      let r = 1 / 0, n;
      for (let i of t) {
        let o = (0, Yn.default)(e, i);
        o > zs || o < r && (r = o, n = i);
      }
      return n;
    }
    __name(Ys, "Ys");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function ni(e) {
      return e.substring(0, 1).toLowerCase() + e.substring(1);
    }
    __name(ni, "ni");
    c();
    m();
    p();
    d();
    f();
    l();
    var ft = class {
      static {
        __name(this, "ft");
      }
      constructor(t, r, n, i, o) {
        this.modelName = t, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let t = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
        return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function ze(e) {
      return e instanceof ft;
    }
    __name(ze, "ze");
    c();
    m();
    p();
    d();
    f();
    l();
    var Gt = /* @__PURE__ */ Symbol();
    var Mr = /* @__PURE__ */ new WeakMap();
    var xe = class {
      static {
        __name(this, "xe");
      }
      constructor(t) {
        t === Gt ? Mr.set(this, `Prisma.${this._getName()}`) : Mr.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return Mr.get(this);
      }
    };
    var gt = class extends xe {
      static {
        __name(this, "gt");
      }
      _getNamespace() {
        return "NullTypes";
      }
    };
    var ht = class extends gt {
      static {
        __name(this, "ht");
      }
    };
    Ir(ht, "DbNull");
    var yt = class extends gt {
      static {
        __name(this, "yt");
      }
    };
    Ir(yt, "JsonNull");
    var bt = class extends gt {
      static {
        __name(this, "bt");
      }
    };
    Ir(bt, "AnyNull");
    var Wt = { classes: { DbNull: ht, JsonNull: yt, AnyNull: bt }, instances: { DbNull: new ht(Gt), JsonNull: new yt(Gt), AnyNull: new bt(Gt) } };
    function Ir(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(Ir, "Ir");
    c();
    m();
    p();
    d();
    f();
    l();
    var ii = ": ";
    var Kt = class {
      static {
        __name(this, "Kt");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
        this.hasError = false;
      }
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + ii.length;
      }
      write(t) {
        let r = new ce(this.name);
        this.hasError && r.underline().setColor(t.context.colors.red), t.write(r).write(ii).write(this.value);
      }
    };
    var Lr = class {
      static {
        __name(this, "Lr");
      }
      constructor(t) {
        this.errorMessages = [];
        this.arguments = t;
      }
      write(t) {
        t.write(this.arguments);
      }
      addErrorMessage(t) {
        this.errorMessages.push(t);
      }
      renderAllMessages(t) {
        return this.errorMessages.map((r) => r(t)).join(`
`);
      }
    };
    function Ye(e) {
      return new Lr(oi(e));
    }
    __name(Ye, "Ye");
    function oi(e) {
      let t = new He();
      for (let [r, n] of Object.entries(e)) {
        let i = new Kt(r, si(n));
        t.addField(i);
      }
      return t;
    }
    __name(oi, "oi");
    function si(e) {
      if (typeof e == "string") return new W(JSON.stringify(e));
      if (typeof e == "number" || typeof e == "boolean") return new W(String(e));
      if (typeof e == "bigint") return new W(`${e}n`);
      if (e === null) return new W("null");
      if (e === void 0) return new W("undefined");
      if (Qe(e)) return new W(`new Prisma.Decimal("${e.toFixed()}")`);
      if (e instanceof Uint8Array) return b.isBuffer(e) ? new W(`Buffer.alloc(${e.byteLength})`) : new W(`new Uint8Array(${e.byteLength})`);
      if (e instanceof Date) {
        let t = Bt(e) ? e.toISOString() : "Invalid Date";
        return new W(`new Date("${t}")`);
      }
      return e instanceof xe ? new W(`Prisma.${e._getName()}`) : ze(e) ? new W(`prisma.${ni(e.modelName)}.$fields.${e.name}`) : Array.isArray(e) ? Xs(e) : typeof e == "object" ? oi(e) : new W(Object.prototype.toString.call(e));
    }
    __name(si, "si");
    function Xs(e) {
      let t = new Ke();
      for (let r of e) t.addItem(si(r));
      return t;
    }
    __name(Xs, "Xs");
    function Ht(e, t) {
      let r = t === "pretty" ? zn : Qt, n = e.renderAllMessages(r), i = new Ge(0, { colors: r }).write(e).toString();
      return { message: n, args: i };
    }
    __name(Ht, "Ht");
    function zt({ args: e, errors: t, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = Ye(e);
      for (let C of t) $t(C, a, s);
      let { message: u, args: g } = Ht(a, r), T = Je({ message: u, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: g });
      throw new j(T, { clientVersion: o });
    }
    __name(zt, "zt");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var me = class {
      static {
        __name(this, "me");
      }
      constructor() {
        this._map = /* @__PURE__ */ new Map();
      }
      get(t) {
        return this._map.get(t)?.value;
      }
      set(t, r) {
        this._map.set(t, { value: r });
      }
      getOrCreate(t, r) {
        let n = this._map.get(t);
        if (n) return n.value;
        let i = r();
        return this.set(t, i), i;
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    function wt(e) {
      let t;
      return { get() {
        return t || (t = { value: e() }), t.value;
      } };
    }
    __name(wt, "wt");
    c();
    m();
    p();
    d();
    f();
    l();
    function pe(e) {
      return e.replace(/^./, (t) => t.toLowerCase());
    }
    __name(pe, "pe");
    c();
    m();
    p();
    d();
    f();
    l();
    function li(e, t, r) {
      let n = pe(r);
      return !t.result || !(t.result.$allModels || t.result[n]) ? e : Zs({ ...e, ...ai(t.name, e, t.result.$allModels), ...ai(t.name, e, t.result[n]) });
    }
    __name(li, "li");
    function Zs(e) {
      let t = new me(), r = /* @__PURE__ */ __name((n, i) => t.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => r(o, i)) : [n])), "r");
      return Be(e, (n) => ({ ...n, needs: r(n.name, /* @__PURE__ */ new Set()) }));
    }
    __name(Zs, "Zs");
    function ai(e, t, r) {
      return r ? Be(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: ea(t, o, i) })) : {};
    }
    __name(ai, "ai");
    function ea(e, t, r) {
      let n = e?.[t]?.compute;
      return n ? (i) => r({ ...i, [t]: n(i) }) : r;
    }
    __name(ea, "ea");
    function ui(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (e[n.name]) for (let i of n.needs) r[i] = true;
      return r;
    }
    __name(ui, "ui");
    function ci(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (!e[n.name]) for (let i of n.needs) delete r[i];
      return r;
    }
    __name(ci, "ci");
    var Yt = class {
      static {
        __name(this, "Yt");
      }
      constructor(t, r) {
        this.extension = t;
        this.previous = r;
        this.computedFieldsCache = new me();
        this.modelExtensionsCache = new me();
        this.queryCallbacksCache = new me();
        this.clientExtensions = wt(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
        this.batchCallbacks = wt(() => {
          let t2 = this.previous?.getAllBatchQueryCallbacks() ?? [], r2 = this.extension.query?.$__internalBatch;
          return r2 ? t2.concat(r2) : t2;
        });
      }
      getAllComputedFields(t) {
        return this.computedFieldsCache.getOrCreate(t, () => li(this.previous?.getAllComputedFields(t), this.extension, t));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(t) {
        return this.modelExtensionsCache.getOrCreate(t, () => {
          let r = pe(t);
          return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(t) : { ...this.previous?.getAllModelExtensions(t), ...this.extension.model.$allModels, ...this.extension.model[r] };
        });
      }
      getAllQueryCallbacks(t, r) {
        return this.queryCallbacksCache.getOrCreate(`${t}:${r}`, () => {
          let n = this.previous?.getAllQueryCallbacks(t, r) ?? [], i = [], o = this.extension.query;
          return !o || !(o[t] || o.$allModels || o[r] || o.$allOperations) ? n : (o[t] !== void 0 && (o[t][r] !== void 0 && i.push(o[t][r]), o[t].$allOperations !== void 0 && i.push(o[t].$allOperations)), t !== "$none" && o.$allModels !== void 0 && (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[r] !== void 0 && i.push(o[r]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var Xe = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.head = t;
      }
      static empty() {
        return new e();
      }
      static single(t) {
        return new e(new Yt(t));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(t) {
        return new e(new Yt(t, this.head));
      }
      getAllComputedFields(t) {
        return this.head?.getAllComputedFields(t);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(t) {
        return this.head?.getAllModelExtensions(t);
      }
      getAllQueryCallbacks(t, r) {
        return this.head?.getAllQueryCallbacks(t, r) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var mi = /* @__PURE__ */ Symbol();
    var Et = class {
      static {
        __name(this, "Et");
      }
      constructor(t) {
        if (t !== mi) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(t) {
        return t === void 0 ? Xt : t;
      }
    };
    var Xt = new Et(mi);
    function de(e) {
      return e instanceof Et;
    }
    __name(de, "de");
    var ta = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var pi = "explicitly `undefined` values are not allowed";
    function Zt({ modelName: e, action: t, args: r, runtimeDataModel: n, extensions: i = Xe.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: u, previewFeatures: g, globalOmit: T }) {
      let C = new _r({ runtimeDataModel: n, modelName: e, action: t, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: u, previewFeatures: g, globalOmit: T });
      return { modelName: e, action: ta[t], query: xt(r, C) };
    }
    __name(Zt, "Zt");
    function xt({ select: e, include: t, ...r } = {}, n) {
      let i;
      return n.isPreviewFeatureOn("omitApi") && (i = r.omit, delete r.omit), { arguments: fi(r, n), selection: ra(e, t, i, n) };
    }
    __name(xt, "xt");
    function ra(e, t, r, n) {
      return e ? (t ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.isPreviewFeatureOn("omitApi") && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), sa(e, n)) : na(n, t, r);
    }
    __name(ra, "ra");
    function na(e, t, r) {
      let n = {};
      return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), t && ia(n, t, e), e.isPreviewFeatureOn("omitApi") && oa(n, r, e), n;
    }
    __name(na, "na");
    function ia(e, t, r) {
      for (let [n, i] of Object.entries(t)) {
        if (de(i)) continue;
        let o = r.nestSelection(n);
        if (Dr(i, o), i === false || i === void 0) {
          e[n] = false;
          continue;
        }
        let s = r.findField(n);
        if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
          e[n] = xt(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          e[n] = true;
          continue;
        }
        e[n] = xt(i, o);
      }
    }
    __name(ia, "ia");
    function oa(e, t, r) {
      let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...t }, o = ci(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (de(a)) continue;
        Dr(a, r.nestSelection(s));
        let u = r.findField(s);
        n?.[s] && !u || (e[s] = !a);
      }
    }
    __name(oa, "oa");
    function sa(e, t) {
      let r = {}, n = t.getComputedFields(), i = ui(e, n);
      for (let [o, s] of Object.entries(i)) {
        if (de(s)) continue;
        let a = t.nestSelection(o);
        Dr(s, a);
        let u = t.findField(o);
        if (!(n?.[o] && !u)) {
          if (s === false || s === void 0 || de(s)) {
            r[o] = false;
            continue;
          }
          if (s === true) {
            u?.kind === "object" ? r[o] = xt({}, a) : r[o] = true;
            continue;
          }
          r[o] = xt(s, a);
        }
      }
      return r;
    }
    __name(sa, "sa");
    function di(e, t) {
      if (e === null) return null;
      if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
      if (typeof e == "bigint") return { $type: "BigInt", value: String(e) };
      if (je(e)) {
        if (Bt(e)) return { $type: "DateTime", value: e.toISOString() };
        t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (ze(e)) return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
      if (Array.isArray(e)) return aa(e, t);
      if (ArrayBuffer.isView(e)) return { $type: "Bytes", value: b.from(e).toString("base64") };
      if (la(e)) return e.values;
      if (Qe(e)) return { $type: "Decimal", value: e.toFixed() };
      if (e instanceof xe) {
        if (e !== Wt.instances[e._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: e._getName() };
      }
      if (ua(e)) return e.toJSON();
      if (typeof e == "object") return fi(e, t);
      t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    __name(di, "di");
    function fi(e, t) {
      if (e.$type) return { $type: "Raw", value: e };
      let r = {};
      for (let n in e) {
        let i = e[n], o = t.nestArgument(n);
        de(i) || (i !== void 0 ? r[n] = di(i, o) : t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: t.getSelectionPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: pi }));
      }
      return r;
    }
    __name(fi, "fi");
    function aa(e, t) {
      let r = [];
      for (let n = 0; n < e.length; n++) {
        let i = t.nestArgument(String(n)), o = e[n];
        if (o === void 0 || de(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${t.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        r.push(di(o, i));
      }
      return r;
    }
    __name(aa, "aa");
    function la(e) {
      return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
    }
    __name(la, "la");
    function ua(e) {
      return typeof e == "object" && e !== null && typeof e.toJSON == "function";
    }
    __name(ua, "ua");
    function Dr(e, t) {
      e === void 0 && t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t.getSelectionPath(), underlyingError: pi });
    }
    __name(Dr, "Dr");
    var _r = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.params = t;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      throwValidationError(t) {
        zt({ errors: [t], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((t) => ({ name: t.name, typeName: "boolean", isRelation: t.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(t) {
        return this.params.previewFeatures.includes(t);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(t) {
        return this.modelOrType?.fields.find((r) => r.name === t);
      }
      nestSelection(t) {
        let r = this.findField(t), n = r?.kind === "object" ? r.type : void 0;
        return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[Ve(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            be(this.params.action, "Unknown action");
        }
      }
      nestArgument(t) {
        return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(t) });
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var Ze = class {
      static {
        __name(this, "Ze");
      }
      constructor(t) {
        this._engine = t;
      }
      prometheus(t) {
        return this._engine.metrics({ format: "prometheus", ...t });
      }
      json(t) {
        return this._engine.metrics({ format: "json", ...t });
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    function gi(e) {
      return { models: Fr(e.models), enums: Fr(e.enums), types: Fr(e.types) };
    }
    __name(gi, "gi");
    function Fr(e) {
      let t = {};
      for (let { name: r, ...n } of e) t[r] = n;
      return t;
    }
    __name(Fr, "Fr");
    function hi(e, t) {
      let r = wt(() => ca(t));
      Object.defineProperty(e, "dmmf", { get: /* @__PURE__ */ __name(() => r.get(), "get") });
    }
    __name(hi, "hi");
    function ca(e) {
      throw new Error("Prisma.dmmf is not available when running in edge runtimes.");
    }
    __name(ca, "ca");
    c();
    m();
    p();
    d();
    f();
    l();
    var Ur = /* @__PURE__ */ new WeakMap();
    var er = "$$PrismaTypedSql";
    var qr = class {
      static {
        __name(this, "qr");
      }
      constructor(t, r) {
        Ur.set(this, { sql: t, values: r }), Object.defineProperty(this, er, { value: er });
      }
      get sql() {
        return Ur.get(this).sql;
      }
      get values() {
        return Ur.get(this).values;
      }
    };
    function yi(e) {
      return (...t) => new qr(e, t);
    }
    __name(yi, "yi");
    function bi(e) {
      return e != null && e[er] === er;
    }
    __name(bi, "bi");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function Pt(e) {
      return { ok: false, error: e, map() {
        return Pt(e);
      }, flatMap() {
        return Pt(e);
      } };
    }
    __name(Pt, "Pt");
    var Br = class {
      static {
        __name(this, "Br");
      }
      constructor() {
        this.registeredErrors = [];
      }
      consumeError(t) {
        return this.registeredErrors[t];
      }
      registerNewError(t) {
        let r = 0;
        for (; this.registeredErrors[r] !== void 0; ) r++;
        return this.registeredErrors[r] = { error: t }, r;
      }
    };
    var $r = /* @__PURE__ */ __name((e) => {
      let t = new Br(), r = fe(t, e.transactionContext.bind(e)), n = { adapterName: e.adapterName, errorRegistry: t, queryRaw: fe(t, e.queryRaw.bind(e)), executeRaw: fe(t, e.executeRaw.bind(e)), provider: e.provider, transactionContext: /* @__PURE__ */ __name(async (...i) => (await r(...i)).map((s) => ma(t, s)), "transactionContext") };
      return e.getConnectionInfo && (n.getConnectionInfo = da(t, e.getConnectionInfo.bind(e))), n;
    }, "$r");
    var ma = /* @__PURE__ */ __name((e, t) => {
      let r = fe(e, t.startTransaction.bind(t));
      return { adapterName: t.adapterName, provider: t.provider, queryRaw: fe(e, t.queryRaw.bind(t)), executeRaw: fe(e, t.executeRaw.bind(t)), startTransaction: /* @__PURE__ */ __name(async (...n) => (await r(...n)).map((o) => pa(e, o)), "startTransaction") };
    }, "ma");
    var pa = /* @__PURE__ */ __name((e, t) => ({ adapterName: t.adapterName, provider: t.provider, options: t.options, queryRaw: fe(e, t.queryRaw.bind(t)), executeRaw: fe(e, t.executeRaw.bind(t)), commit: fe(e, t.commit.bind(t)), rollback: fe(e, t.rollback.bind(t)) }), "pa");
    function fe(e, t) {
      return async (...r) => {
        try {
          return await t(...r);
        } catch (n) {
          let i = e.registerNewError(n);
          return Pt({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(fe, "fe");
    function da(e, t) {
      return (...r) => {
        try {
          return t(...r);
        } catch (n) {
          let i = e.registerNewError(n);
          return Pt({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(da, "da");
    var Lo = Fe(wi());
    var ek = Fe(Ei());
    Dn();
    bn();
    Ln();
    c();
    m();
    p();
    d();
    f();
    l();
    var X = class e {
      static {
        __name(this, "e");
      }
      constructor(t, r) {
        if (t.length - 1 !== r.length) throw t.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${t.length} strings to have ${t.length - 1} values`);
        let n = r.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = t[0];
        let i = 0, o = 0;
        for (; i < r.length; ) {
          let s = r[i++], a = t[i];
          if (s instanceof e) {
            this.strings[o] += s.strings[0];
            let u = 0;
            for (; u < s.values.length; ) this.values[o++] = s.values[u++], this.strings[o] = s.strings[u];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `?${this.strings[r++]}`;
        return n;
      }
      get statement() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `:${r}${this.strings[r++]}`;
        return n;
      }
      get text() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `$${r}${this.strings[r++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function xi(e, t = ",", r = "", n = "") {
      if (e.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new X([r, ...Array(e.length - 1).fill(t), n], e);
    }
    __name(xi, "xi");
    function Vr(e) {
      return new X([e], []);
    }
    __name(Vr, "Vr");
    var Pi = Vr("");
    function jr(e, ...t) {
      return new X(e, t);
    }
    __name(jr, "jr");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function vt(e) {
      return { getKeys() {
        return Object.keys(e);
      }, getPropertyValue(t) {
        return e[t];
      } };
    }
    __name(vt, "vt");
    c();
    m();
    p();
    d();
    f();
    l();
    function H(e, t) {
      return { getKeys() {
        return [e];
      }, getPropertyValue() {
        return t();
      } };
    }
    __name(H, "H");
    c();
    m();
    p();
    d();
    f();
    l();
    function Ie(e) {
      let t = new me();
      return { getKeys() {
        return e.getKeys();
      }, getPropertyValue(r) {
        return t.getOrCreate(r, () => e.getPropertyValue(r));
      }, getPropertyDescriptor(r) {
        return e.getPropertyDescriptor?.(r);
      } };
    }
    __name(Ie, "Ie");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var tr = { enumerable: true, configurable: true, writable: true };
    function rr(e) {
      let t = new Set(e);
      return { getOwnPropertyDescriptor: /* @__PURE__ */ __name(() => tr, "getOwnPropertyDescriptor"), has: /* @__PURE__ */ __name((r, n) => t.has(n), "has"), set: /* @__PURE__ */ __name((r, n, i) => t.add(n) && Reflect.set(r, n, i), "set"), ownKeys: /* @__PURE__ */ __name(() => [...t], "ownKeys") };
    }
    __name(rr, "rr");
    var vi = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
    function ge(e, t) {
      let r = ga(t), n = /* @__PURE__ */ new Set(), i = new Proxy(e, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = r.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = Ti(Reflect.ownKeys(o), r), a = Ti(Array.from(r.keys()), r);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let u = r.get(s);
        return u ? u.getPropertyDescriptor ? { ...tr, ...u?.getPropertyDescriptor(s) } : tr : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      } });
      return i[vi] = function() {
        let o = { ...this };
        return delete o[vi], o;
      }, i;
    }
    __name(ge, "ge");
    function ga(e) {
      let t = /* @__PURE__ */ new Map();
      for (let r of e) {
        let n = r.getKeys();
        for (let i of n) t.set(i, r);
      }
      return t;
    }
    __name(ga, "ga");
    function Ti(e, t) {
      return e.filter((r) => t.get(r)?.has?.(r) ?? true);
    }
    __name(Ti, "Ti");
    c();
    m();
    p();
    d();
    f();
    l();
    function et(e) {
      return { getKeys() {
        return e;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    __name(et, "et");
    c();
    m();
    p();
    d();
    f();
    l();
    function nr(e, t) {
      return { batch: e, transaction: t?.kind === "batch" ? { isolationLevel: t.options.isolationLevel } : void 0 };
    }
    __name(nr, "nr");
    c();
    m();
    p();
    d();
    f();
    l();
    function Ci(e) {
      if (e === void 0) return "";
      let t = Ye(e);
      return new Ge(0, { colors: Qt }).write(t).toString();
    }
    __name(Ci, "Ci");
    c();
    m();
    p();
    d();
    f();
    l();
    var ha = "P2037";
    function ir({ error: e, user_facing_error: t }, r, n) {
      return t.error_code ? new J(ya(t, n), { code: t.error_code, clientVersion: r, meta: t.meta, batchRequestIdx: t.batch_request_idx }) : new G(e, { clientVersion: r, batchRequestIdx: t.batch_request_idx });
    }
    __name(ir, "ir");
    function ya(e, t) {
      let r = e.message;
      return (t === "postgresql" || t === "postgres" || t === "mysql") && e.error_code === ha && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
    }
    __name(ya, "ya");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Qr = class {
      static {
        __name(this, "Qr");
      }
      getLocation() {
        return null;
      }
    };
    function Te(e) {
      return typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite() : new Qr();
    }
    __name(Te, "Te");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Ri = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function tt(e = {}) {
      let t = wa(e);
      return Object.entries(t).reduce((n, [i, o]) => (Ri[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    __name(tt, "tt");
    function wa(e = {}) {
      return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
    }
    __name(wa, "wa");
    function or(e = {}) {
      return (t) => (typeof e._count == "boolean" && (t._count = t._count._all), t);
    }
    __name(or, "or");
    function Ai(e, t) {
      let r = or(e);
      return t({ action: "aggregate", unpacker: r, argsMapper: tt })(e);
    }
    __name(Ai, "Ai");
    c();
    m();
    p();
    d();
    f();
    l();
    function Ea(e = {}) {
      let { select: t, ...r } = e;
      return typeof t == "object" ? tt({ ...r, _count: t }) : tt({ ...r, _count: { _all: true } });
    }
    __name(Ea, "Ea");
    function xa(e = {}) {
      return typeof e.select == "object" ? (t) => or(e)(t)._count : (t) => or(e)(t)._count._all;
    }
    __name(xa, "xa");
    function Si(e, t) {
      return t({ action: "count", unpacker: xa(e), argsMapper: Ea })(e);
    }
    __name(Si, "Si");
    c();
    m();
    p();
    d();
    f();
    l();
    function Pa(e = {}) {
      let t = tt(e);
      if (Array.isArray(t.by)) for (let r of t.by) typeof r == "string" && (t.select[r] = true);
      else typeof t.by == "string" && (t.select[t.by] = true);
      return t;
    }
    __name(Pa, "Pa");
    function va(e = {}) {
      return (t) => (typeof e?._count == "boolean" && t.forEach((r) => {
        r._count = r._count._all;
      }), t);
    }
    __name(va, "va");
    function Oi(e, t) {
      return t({ action: "groupBy", unpacker: va(e), argsMapper: Pa })(e);
    }
    __name(Oi, "Oi");
    function ki(e, t, r) {
      if (t === "aggregate") return (n) => Ai(n, r);
      if (t === "count") return (n) => Si(n, r);
      if (t === "groupBy") return (n) => Oi(n, r);
    }
    __name(ki, "ki");
    c();
    m();
    p();
    d();
    f();
    l();
    function Mi(e, t) {
      let r = t.fields.filter((i) => !i.relationName), n = Sr(r, (i) => i.name);
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new ft(e, o, s.type, s.isList, s.kind === "enum");
      }, ...rr(Object.keys(n)) });
    }
    __name(Mi, "Mi");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Ii = /* @__PURE__ */ __name((e) => Array.isArray(e) ? e : e.split("."), "Ii");
    var Jr = /* @__PURE__ */ __name((e, t) => Ii(t).reduce((r, n) => r && r[n], e), "Jr");
    var Li = /* @__PURE__ */ __name((e, t, r) => Ii(t).reduceRight((n, i, o, s) => Object.assign({}, Jr(e, s.slice(0, o)), { [i]: n }), r), "Li");
    function Ta(e, t) {
      return e === void 0 || t === void 0 ? [] : [...t, "select", e];
    }
    __name(Ta, "Ta");
    function Ca(e, t, r) {
      return t === void 0 ? e ?? {} : Li(t, r, e || true);
    }
    __name(Ca, "Ca");
    function Gr(e, t, r, n, i, o) {
      let a = e._runtimeDataModel.models[t].fields.reduce((u, g) => ({ ...u, [g.name]: g }), {});
      return (u) => {
        let g = Te(e._errorFormat), T = Ta(n, i), C = Ca(u, o, T), O = r({ dataPath: T, callsite: g })(C), A = Ra(e, t);
        return new Proxy(O, { get(M, S) {
          if (!A.includes(S)) return M[S];
          let ne = [a[S].type, r, S], z = [T, C];
          return Gr(e, ...ne, ...z);
        }, ...rr([...A, ...Object.getOwnPropertyNames(O)]) });
      };
    }
    __name(Gr, "Gr");
    function Ra(e, t) {
      return e._runtimeDataModel.models[t].fields.filter((r) => r.kind === "object").map((r) => r.name);
    }
    __name(Ra, "Ra");
    c();
    m();
    p();
    d();
    f();
    l();
    function _i(e, t, r, n) {
      return e === Me.ModelAction.findFirstOrThrow || e === Me.ModelAction.findUniqueOrThrow ? Aa(t, r, n) : n;
    }
    __name(_i, "_i");
    function Aa(e, t, r) {
      return async (n) => {
        if ("rejectOnNotFound" in n.args) {
          let o = Je({ originalMethod: n.clientMethod, callsite: n.callsite, message: "'rejectOnNotFound' option is not supported" });
          throw new j(o, { clientVersion: t });
        }
        return await r(n).catch((o) => {
          throw o instanceof J && o.code === "P2025" ? new we(`No ${e} found`, t) : o;
        });
      };
    }
    __name(Aa, "Aa");
    var Sa = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var Oa = ["aggregate", "count", "groupBy"];
    function Wr(e, t) {
      let r = e._extensions.getAllModelExtensions(t) ?? {}, n = [ka(e, t), Ia(e, t), vt(r), H("name", () => t), H("$name", () => t), H("$parent", () => e._appliedParent)];
      return ge({}, n);
    }
    __name(Wr, "Wr");
    function ka(e, t) {
      let r = pe(t), n = Object.keys(Me.ModelAction).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = /* @__PURE__ */ __name((u) => e._request(u), "s");
        s = _i(o, t, e._clientVersion, s);
        let a = /* @__PURE__ */ __name((u) => (g) => {
          let T = Te(e._errorFormat);
          return e._createPrismaPromise((C) => {
            let O = { args: g, dataPath: [], action: o, model: t, clientMethod: `${r}.${i}`, jsModelName: r, transaction: C, callsite: T };
            return s({ ...O, ...u });
          });
        }, "a");
        return Sa.includes(o) ? Gr(e, t, a) : Ma(i) ? ki(e, i, a) : a({});
      } };
    }
    __name(ka, "ka");
    function Ma(e) {
      return Oa.includes(e);
    }
    __name(Ma, "Ma");
    function Ia(e, t) {
      return Ie(H("fields", () => {
        let r = e._runtimeDataModel.models[t];
        return Mi(t, r);
      }));
    }
    __name(Ia, "Ia");
    c();
    m();
    p();
    d();
    f();
    l();
    function Di(e) {
      return e.replace(/^./, (t) => t.toUpperCase());
    }
    __name(Di, "Di");
    var Kr = /* @__PURE__ */ Symbol();
    function Tt(e) {
      let t = [La(e), H(Kr, () => e), H("$parent", () => e._appliedParent)], r = e._extensions.getAllClientExtensions();
      return r && t.push(vt(r)), ge(e, t);
    }
    __name(Tt, "Tt");
    function La(e) {
      let t = Object.keys(e._runtimeDataModel.models), r = t.map(pe), n = [...new Set(t.concat(r))];
      return Ie({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = Di(i);
        if (e._runtimeDataModel.models[o] !== void 0) return Wr(e, o);
        if (e._runtimeDataModel.models[i] !== void 0) return Wr(e, i);
      }, getPropertyDescriptor(i) {
        if (!r.includes(i)) return { enumerable: false };
      } });
    }
    __name(La, "La");
    function Fi(e) {
      return e[Kr] ? e[Kr] : e;
    }
    __name(Fi, "Fi");
    function Ni(e) {
      if (typeof e == "function") return e(this);
      if (e.client?.__AccelerateEngine) {
        let r = e.client.__AccelerateEngine;
        this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
      }
      let t = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $use: { value: void 0 }, $on: { value: void 0 } });
      return Tt(t);
    }
    __name(Ni, "Ni");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function Ui({ result: e, modelName: t, select: r, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(t);
      if (!o) return e;
      let s = [], a = [];
      for (let u of Object.values(o)) {
        if (n) {
          if (n[u.name]) continue;
          let g = u.needs.filter((T) => n[T]);
          g.length > 0 && a.push(et(g));
        } else if (r) {
          if (!r[u.name]) continue;
          let g = u.needs.filter((T) => !r[T]);
          g.length > 0 && a.push(et(g));
        }
        _a(e, u.needs) && s.push(Da(u, ge(e, s)));
      }
      return s.length > 0 || a.length > 0 ? ge(e, [...s, ...a]) : e;
    }
    __name(Ui, "Ui");
    function _a(e, t) {
      return t.every((r) => Ar(e, r));
    }
    __name(_a, "_a");
    function Da(e, t) {
      return Ie(H(e.name, () => e.compute(t)));
    }
    __name(Da, "Da");
    c();
    m();
    p();
    d();
    f();
    l();
    function sr({ visitor: e, result: t, args: r, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(t)) {
        for (let s = 0; s < t.length; s++) t[s] = sr({ result: t[s], args: r, modelName: i, runtimeDataModel: n, visitor: e });
        return t;
      }
      let o = e(t, i, r) ?? t;
      return r.include && qi({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), r.select && qi({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
    }
    __name(sr, "sr");
    function qi({ includeOrSelect: e, result: t, parentModelName: r, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(e)) {
        if (!s || t[o] == null || de(s)) continue;
        let u = n.models[r].fields.find((T) => T.name === o);
        if (!u || u.kind !== "object" || !u.relationName) continue;
        let g = typeof s == "object" ? s : {};
        t[o] = sr({ visitor: i, result: t[o], args: g, modelName: u.type, runtimeDataModel: n });
      }
    }
    __name(qi, "qi");
    function Bi({ result: e, modelName: t, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || e == null || typeof e != "object" || !i.models[t] ? e : sr({ result: e, args: r ?? {}, modelName: t, runtimeDataModel: i, visitor: /* @__PURE__ */ __name((a, u, g) => {
        let T = pe(u);
        return Ui({ result: a, modelName: T, select: g.select, omit: g.select ? void 0 : { ...o?.[T], ...g.omit }, extensions: n });
      }, "visitor") });
    }
    __name(Bi, "Bi");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    l();
    function $i(e) {
      if (e instanceof X) return Fa(e);
      if (Array.isArray(e)) {
        let r = [e[0]];
        for (let n = 1; n < e.length; n++) r[n] = Ct(e[n]);
        return r;
      }
      let t = {};
      for (let r in e) t[r] = Ct(e[r]);
      return t;
    }
    __name($i, "$i");
    function Fa(e) {
      return new X(e.strings, e.values);
    }
    __name(Fa, "Fa");
    function Ct(e) {
      if (typeof e != "object" || e == null || e instanceof xe || ze(e)) return e;
      if (Qe(e)) return new ue(e.toFixed());
      if (je(e)) return /* @__PURE__ */ new Date(+e);
      if (ArrayBuffer.isView(e)) return e.slice(0);
      if (Array.isArray(e)) {
        let t = e.length, r;
        for (r = Array(t); t--; ) r[t] = Ct(e[t]);
        return r;
      }
      if (typeof e == "object") {
        let t = {};
        for (let r in e) r === "__proto__" ? Object.defineProperty(t, r, { value: Ct(e[r]), configurable: true, enumerable: true, writable: true }) : t[r] = Ct(e[r]);
        return t;
      }
      be(e, "Unknown value");
    }
    __name(Ct, "Ct");
    function ji(e, t, r, n = 0) {
      return e._createPrismaPromise((i) => {
        let o = t.customDataProxyFetch;
        return "transaction" in t && i !== void 0 && (t.transaction?.kind === "batch" && t.transaction.lock.then(), t.transaction = i), n === r.length ? e._executeRequest(t) : r[n]({ model: t.model, operation: t.model ? t.action : t.clientMethod, args: $i(t.args ?? {}), __internalParams: t, query: /* @__PURE__ */ __name((s, a = t) => {
          let u = a.customDataProxyFetch;
          return a.customDataProxyFetch = Wi(o, u), a.args = s, ji(e, a, r, n + 1);
        }, "query") });
      });
    }
    __name(ji, "ji");
    function Qi(e, t) {
      let { jsModelName: r, action: n, clientMethod: i } = t, o = r ? n : i;
      if (e._extensions.isEmpty()) return e._executeRequest(t);
      let s = e._extensions.getAllQueryCallbacks(r ?? "$none", o);
      return ji(e, t, s);
    }
    __name(Qi, "Qi");
    function Ji(e) {
      return (t) => {
        let r = { requests: t }, n = t[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? Gi(r, n, 0, e) : e(r);
      };
    }
    __name(Ji, "Ji");
    function Gi(e, t, r, n) {
      if (r === t.length) return n(e);
      let i = e.customDataProxyFetch, o = e.requests[0].transaction;
      return t[r]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: e, query(s, a = e) {
        let u = a.customDataProxyFetch;
        return a.customDataProxyFetch = Wi(i, u), Gi(a, t, r + 1, n);
      } });
    }
    __name(Gi, "Gi");
    var Vi = /* @__PURE__ */ __name((e) => e, "Vi");
    function Wi(e = Vi, t = Vi) {
      return (r) => e(t(r));
    }
    __name(Wi, "Wi");
    c();
    m();
    p();
    d();
    f();
    l();
    var Ki = ee("prisma:client");
    var Hi = { Vercel: "vercel", "Netlify CI": "netlify" };
    function zi({ postinstall: e, ciName: t, clientVersion: r }) {
      if (Ki("checkPlatformCaching:postinstall", e), Ki("checkPlatformCaching:ciName", t), e === true && t && t in Hi) {
        let n = `Prisma has detected that this project was built on ${t}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Hi[t]}-build`;
        throw console.error(n), new L(n, r);
      }
    }
    __name(zi, "zi");
    c();
    m();
    p();
    d();
    f();
    l();
    function Yi(e, t) {
      return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [t[0]]: { url: e.datasourceUrl } } : {} : {};
    }
    __name(Yi, "Yi");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var Na = "Cloudflare-Workers";
    var Ua = "node";
    function Xi() {
      return typeof Netlify == "object" ? "netlify" : typeof EdgeRuntime == "string" ? "edge-light" : globalThis.navigator?.userAgent === Na ? "workerd" : globalThis.Deno ? "deno" : globalThis.__lagon__ ? "lagon" : globalThis.process?.release?.name === Ua ? "node" : globalThis.Bun ? "bun" : globalThis.fastly ? "fastly" : "unknown";
    }
    __name(Xi, "Xi");
    var qa = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function Ce() {
      let e = Xi();
      return { id: e, prettyName: qa[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
    }
    __name(Ce, "Ce");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function ar({ inlineDatasources: e, overrideDatasources: t, env: r, clientVersion: n }) {
      let i, o = Object.keys(e)[0], s = e[o]?.url, a = t[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw Ce().id === "workerd" ? new L(`error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n) : new L(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new L("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    __name(ar, "ar");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    function Zi(e) {
      if (e?.kind === "itx") return e.options.id;
    }
    __name(Zi, "Zi");
    c();
    m();
    p();
    d();
    f();
    l();
    var Hr;
    var eo = { async loadLibrary(e) {
      let { clientVersion: t, adapter: r, engineWasm: n } = e;
      if (r === void 0) throw new L(`The \`adapter\` option for \`PrismaClient\` is required in this context (${Ce().prettyName})`, t);
      if (n === void 0) throw new L("WASM engine was unexpectedly `undefined`", t);
      Hr === void 0 && (Hr = (async () => {
        let o = n.getRuntime(), s = await n.getQueryEngineWasmModule();
        if (s == null) throw new L("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", t);
        let a = { "./query_engine_bg.js": o }, u = new WebAssembly.Instance(s, a);
        return o.__wbg_set_wasm(u.exports), o.QueryEngine;
      })());
      let i = await Hr;
      return { debugPanic() {
        return Promise.reject("{}");
      }, dmmf() {
        return Promise.resolve("{}");
      }, version() {
        return { commit: "unknown", version: "unknown" };
      }, QueryEngine: i };
    } };
    var Ba = "P2036";
    var he = ee("prisma:client:libraryEngine");
    function $a(e) {
      return e.item_type === "query" && "query" in e;
    }
    __name($a, "$a");
    function Va(e) {
      return "level" in e ? e.level === "error" && e.message === "PANIC" : false;
    }
    __name(Va, "Va");
    var VR = [...Cr, "native"];
    var Rt = class {
      static {
        __name(this, "Rt");
      }
      constructor(t, r) {
        this.name = "LibraryEngine";
        this.libraryLoader = r ?? eo, this.config = t, this.libraryStarted = false, this.logQueries = t.logQueries ?? false, this.logLevel = t.logLevel ?? "error", this.logEmitter = t.logEmitter, this.datamodel = t.inlineSchema, t.enableDebugLogs && (this.logLevel = "debug");
        let n = Object.keys(t.overrideDatasources)[0], i = t.overrideDatasources[n]?.url;
        n !== void 0 && i !== void 0 && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
      }
      async applyPendingMigrations() {
        throw new Error("Cannot call this method from this type of engine instance");
      }
      async transaction(t, r, n) {
        await this.start();
        let i = JSON.stringify(r), o;
        if (t === "start") {
          let a = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
          o = await this.engine?.startTransaction(a, i);
        } else t === "commit" ? o = await this.engine?.commitTransaction(n.id, i) : t === "rollback" && (o = await this.engine?.rollbackTransaction(n.id, i));
        let s = this.parseEngineResponse(o);
        if (ja(s)) {
          let a = this.getExternalAdapterError(s);
          throw a ? a.error : new J(s.message, { code: s.error_code, clientVersion: this.config.clientVersion, meta: s.meta });
        }
        return s;
      }
      async instantiateLibrary() {
        if (he("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
        this.binaryTarget = await this.getCurrentBinaryTarget(), await this.loadEngine(), this.version();
      }
      async getCurrentBinaryTarget() {
      }
      parseEngineResponse(t) {
        if (!t) throw new G("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
        try {
          return JSON.parse(t);
        } catch {
          throw new G("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
        }
      }
      async loadEngine() {
        if (!this.engine) {
          this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
          try {
            let t = new w(this), { adapter: r } = this.config;
            r && he("Using driver adapter: %O", r), this.engine = new this.QueryEngineConstructor({ datamodel: this.datamodel, env: h.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json" }, (n) => {
              t.deref()?.logger(n);
            }, r);
          } catch (t) {
            let r = t, n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new L(n.message, this.config.clientVersion, n.error_code);
          }
        }
      }
      logger(t) {
        let r = this.parseEngineResponse(t);
        if (r) {
          if ("span" in r) {
            this.config.tracingHelper.createEngineSpan(r);
            return;
          }
          r.level = r?.level.toLowerCase() ?? "unknown", $a(r) ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: r.query, params: r.params, duration: Number(r.duration_ms), target: r.module_path }) : (Va(r), this.logEmitter.emit(r.level, { timestamp: /* @__PURE__ */ new Date(), message: r.message, target: r.module_path }));
        }
      }
      parseInitError(t) {
        try {
          return JSON.parse(t);
        } catch {
        }
        return t;
      }
      parseRequestError(t) {
        try {
          return JSON.parse(t);
        } catch {
        }
        return t;
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
      }
      async start() {
        if (await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return he(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
        if (this.libraryStarted) return;
        let t = /* @__PURE__ */ __name(async () => {
          he("library starting");
          try {
            let r = { traceparent: this.config.tracingHelper.getTraceParent() };
            await this.engine?.connect(JSON.stringify(r)), this.libraryStarted = true, he("library started");
          } catch (r) {
            let n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new L(n.message, this.config.clientVersion, n.error_code);
          } finally {
            this.libraryStartingPromise = void 0;
          }
        }, "t");
        return this.libraryStartingPromise = this.config.tracingHelper.runInChildSpan("connect", t), this.libraryStartingPromise;
      }
      async stop() {
        if (await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return he("library is already stopping"), this.libraryStoppingPromise;
        if (!this.libraryStarted) return;
        let t = /* @__PURE__ */ __name(async () => {
          await new Promise((n) => setTimeout(n, 5)), he("library stopping");
          let r = { traceparent: this.config.tracingHelper.getTraceParent() };
          await this.engine?.disconnect(JSON.stringify(r)), this.libraryStarted = false, this.libraryStoppingPromise = void 0, he("library stopped");
        }, "t");
        return this.libraryStoppingPromise = this.config.tracingHelper.runInChildSpan("disconnect", t), this.libraryStoppingPromise;
      }
      version() {
        return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
      }
      debugPanic(t) {
        return this.library?.debugPanic(t);
      }
      async request(t, { traceparent: r, interactiveTransaction: n }) {
        he(`sending request, this.libraryStarted: ${this.libraryStarted}`);
        let i = JSON.stringify({ traceparent: r }), o = JSON.stringify(t);
        try {
          await this.start(), this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
          let s = this.parseEngineResponse(await this.executingQueryPromise);
          if (s.errors) throw s.errors.length === 1 ? this.buildQueryError(s.errors[0]) : new G(JSON.stringify(s.errors), { clientVersion: this.config.clientVersion });
          if (this.loggerRustPanic) throw this.loggerRustPanic;
          return { data: s, elapsed: 0 };
        } catch (s) {
          if (s instanceof L) throw s;
          s.code === "GenericFailure" && s.message?.startsWith("PANIC:");
          let a = this.parseRequestError(s.message);
          throw typeof a == "string" ? s : new G(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
        }
      }
      async requestBatch(t, { transaction: r, traceparent: n }) {
        he("requestBatch");
        let i = nr(t, r);
        await this.start(), this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine.query(this.lastQuery, JSON.stringify({ traceparent: n }), Zi(r));
        let o = await this.executingQueryPromise, s = this.parseEngineResponse(o);
        if (s.errors) throw s.errors.length === 1 ? this.buildQueryError(s.errors[0]) : new G(JSON.stringify(s.errors), { clientVersion: this.config.clientVersion });
        let { batchResult: a, errors: u } = s;
        if (Array.isArray(a)) return a.map((g) => g.errors && g.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(g.errors[0]) : { data: g, elapsed: 0 });
        throw u && u.length === 1 ? new Error(u[0].error) : new Error(JSON.stringify(s));
      }
      buildQueryError(t) {
        t.user_facing_error.is_panic;
        let r = this.getExternalAdapterError(t.user_facing_error);
        return r ? r.error : ir(t, this.config.clientVersion, this.config.activeProvider);
      }
      getExternalAdapterError(t) {
        if (t.error_code === Ba && this.config.adapter) {
          let r = t.meta?.id;
          qt(typeof r == "number", "Malformed external JS error received from the engine");
          let n = this.config.adapter.errorRegistry.consumeError(r);
          return qt(n, "External error with reported id was not registered"), n;
        }
      }
      async metrics(t) {
        await this.start();
        let r = await this.engine.metrics(JSON.stringify(t));
        return t.format === "prometheus" ? r : this.parseEngineResponse(r);
      }
    };
    function ja(e) {
      return typeof e == "object" && e !== null && e.error_code !== void 0;
    }
    __name(ja, "ja");
    c();
    m();
    p();
    d();
    f();
    l();
    var At = "Accelerate has not been setup correctly. Make sure your client is using `.$extends(withAccelerate())`. See https://pris.ly/d/accelerate-getting-started";
    var lr = class {
      static {
        __name(this, "lr");
      }
      constructor(t) {
        this.config = t;
        this.name = "AccelerateEngine";
        this.resolveDatasourceUrl = this.config.accelerateUtils?.resolveDatasourceUrl;
        this.getBatchRequestPayload = this.config.accelerateUtils?.getBatchRequestPayload;
        this.prismaGraphQLToJSError = this.config.accelerateUtils?.prismaGraphQLToJSError;
        this.PrismaClientUnknownRequestError = this.config.accelerateUtils?.PrismaClientUnknownRequestError;
        this.PrismaClientInitializationError = this.config.accelerateUtils?.PrismaClientInitializationError;
        this.PrismaClientKnownRequestError = this.config.accelerateUtils?.PrismaClientKnownRequestError;
        this.debug = this.config.accelerateUtils?.debug;
        this.engineVersion = this.config.accelerateUtils?.engineVersion;
        this.clientVersion = this.config.accelerateUtils?.clientVersion;
      }
      onBeforeExit(t) {
      }
      async start() {
      }
      async stop() {
      }
      version(t) {
        return "unknown";
      }
      transaction(t, r, n) {
        throw new L(At, this.config.clientVersion);
      }
      metrics(t) {
        throw new L(At, this.config.clientVersion);
      }
      request(t, r) {
        throw new L(At, this.config.clientVersion);
      }
      requestBatch(t, r) {
        throw new L(At, this.config.clientVersion);
      }
      applyPendingMigrations() {
        throw new L(At, this.config.clientVersion);
      }
    };
    function to({ copyEngine: e = true }, t) {
      let r;
      try {
        r = ar({ inlineDatasources: t.inlineDatasources, overrideDatasources: t.overrideDatasources, env: { ...t.env, ...h.env }, clientVersion: t.clientVersion });
      } catch {
      }
      let n = !!(r?.startsWith("prisma://") || r?.startsWith("prisma+postgres://"));
      e && n && ct("recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)");
      let i = at(t.generator), o = n || !e, s = !!t.adapter, a = i === "library", u = i === "binary";
      if (o && s || s && false) {
        let g;
        throw e ? r?.startsWith("prisma://") ? g = ["Prisma Client was configured to use the `adapter` option but the URL was a `prisma://` URL.", "Please either use the `prisma://` URL or remove the `adapter` from the Prisma Client constructor."] : g = ["Prisma Client was configured to use both the `adapter` and Accelerate, please chose one."] : g = ["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."], new j(g.join(`
`), { clientVersion: t.clientVersion });
      }
      if (s) return new Rt(t);
      if (o) return new lr(t);
      {
        let g = [`PrismaClient failed to initialize because it wasn't configured to run in this environment (${Ce().prettyName}).`, "In order to run Prisma Client in an edge runtime, you will need to configure one of the following options:", "- Enable Driver Adapters: https://pris.ly/d/driver-adapters", "- Enable Accelerate: https://pris.ly/d/accelerate"];
        throw new j(g.join(`
`), { clientVersion: t.clientVersion });
      }
      throw new j("Invalid client engine type, please use `library` or `binary`", { clientVersion: t.clientVersion });
    }
    __name(to, "to");
    c();
    m();
    p();
    d();
    f();
    l();
    function ur({ generator: e }) {
      return e?.previewFeatures ?? [];
    }
    __name(ur, "ur");
    c();
    m();
    p();
    d();
    f();
    l();
    var ro = /* @__PURE__ */ __name((e) => ({ command: e }), "ro");
    c();
    m();
    p();
    d();
    f();
    l();
    c();
    m();
    p();
    d();
    f();
    l();
    var no = /* @__PURE__ */ __name((e) => e.strings.reduce((t, r, n) => `${t}@P${n}${r}`), "no");
    c();
    m();
    p();
    d();
    f();
    l();
    l();
    function rt(e) {
      try {
        return io(e, "fast");
      } catch {
        return io(e, "slow");
      }
    }
    __name(rt, "rt");
    function io(e, t) {
      return JSON.stringify(e.map((r) => so(r, t)));
    }
    __name(io, "io");
    function so(e, t) {
      return Array.isArray(e) ? e.map((r) => so(r, t)) : typeof e == "bigint" ? { prisma__type: "bigint", prisma__value: e.toString() } : je(e) ? { prisma__type: "date", prisma__value: e.toJSON() } : ue.isDecimal(e) ? { prisma__type: "decimal", prisma__value: e.toJSON() } : b.isBuffer(e) ? { prisma__type: "bytes", prisma__value: e.toString("base64") } : Qa(e) || ArrayBuffer.isView(e) ? { prisma__type: "bytes", prisma__value: b.from(e).toString("base64") } : typeof e == "object" && t === "slow" ? ao(e) : e;
    }
    __name(so, "so");
    function Qa(e) {
      return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    __name(Qa, "Qa");
    function ao(e) {
      if (typeof e != "object" || e === null) return e;
      if (typeof e.toJSON == "function") return e.toJSON();
      if (Array.isArray(e)) return e.map(oo);
      let t = {};
      for (let r of Object.keys(e)) t[r] = oo(e[r]);
      return t;
    }
    __name(ao, "ao");
    function oo(e) {
      return typeof e == "bigint" ? e.toString() : ao(e);
    }
    __name(oo, "oo");
    c();
    m();
    p();
    d();
    f();
    l();
    var Ja = ["$connect", "$disconnect", "$on", "$transaction", "$use", "$extends"];
    var lo = Ja;
    var Ga = /^(\s*alter\s)/i;
    var uo = ee("prisma:client");
    function zr(e, t, r, n) {
      if (!(e !== "postgresql" && e !== "cockroachdb") && r.length > 0 && Ga.exec(t)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    __name(zr, "zr");
    var Yr = /* @__PURE__ */ __name(({ clientMethod: e, activeProvider: t }) => (r) => {
      let n = "", i;
      if (bi(r)) n = r.sql, i = { values: rt(r.values), __prismaRawParameters__: true };
      else if (Array.isArray(r)) {
        let [o, ...s] = r;
        n = o, i = { values: rt(s || []), __prismaRawParameters__: true };
      } else switch (t) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: rt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: rt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = no(r), i = { values: rt(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${t} provider does not support ${e}`);
      }
      return i?.values ? uo(`prisma.${e}(${n}, ${i.values})`) : uo(`prisma.${e}(${n})`), { query: n, parameters: i };
    }, "Yr");
    var co = { requestArgsToMiddlewareArgs(e) {
      return [e.strings, ...e.values];
    }, middlewareArgsToRequestArgs(e) {
      let [t, ...r] = e;
      return new X(t, r);
    } };
    var mo = { requestArgsToMiddlewareArgs(e) {
      return [e];
    }, middlewareArgsToRequestArgs(e) {
      return e[0];
    } };
    c();
    m();
    p();
    d();
    f();
    l();
    function Xr(e) {
      return function(r) {
        let n, i = /* @__PURE__ */ __name((o = e) => {
          try {
            return o === void 0 || o?.kind === "itx" ? n ??= po(r(o)) : po(r(o));
          } catch (s) {
            return Promise.reject(s);
          }
        }, "i");
        return { then(o, s) {
          return i().then(o, s);
        }, catch(o) {
          return i().catch(o);
        }, finally(o) {
          return i().finally(o);
        }, requestTransaction(o) {
          let s = i(o);
          return s.requestTransaction ? s.requestTransaction(o) : s;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    __name(Xr, "Xr");
    function po(e) {
      return typeof e.then == "function" ? e : Promise.resolve(e);
    }
    __name(po, "po");
    c();
    m();
    p();
    d();
    f();
    l();
    var fo = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, async createEngineSpan() {
    }, getActiveContext() {
    }, runInChildSpan(e, t) {
      return t();
    } };
    var Zr = class {
      static {
        __name(this, "Zr");
      }
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(t) {
        return this.getGlobalTracingHelper().getTraceParent(t);
      }
      createEngineSpan(t) {
        return this.getGlobalTracingHelper().createEngineSpan(t);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(t, r) {
        return this.getGlobalTracingHelper().runInChildSpan(t, r);
      }
      getGlobalTracingHelper() {
        return globalThis.PRISMA_INSTRUMENTATION?.helper ?? fo;
      }
    };
    function go(e) {
      return e.includes("tracing") ? new Zr() : fo;
    }
    __name(go, "go");
    c();
    m();
    p();
    d();
    f();
    l();
    function ho(e, t = () => {
    }) {
      let r, n = new Promise((i) => r = i);
      return { then(i) {
        return --e === 0 && r(t()), i?.(n);
      } };
    }
    __name(ho, "ho");
    c();
    m();
    p();
    d();
    f();
    l();
    function yo(e) {
      return typeof e == "string" ? e : e.reduce((t, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query" ? t : t && (r === "info" || t === "info") ? "info" : n;
      }, void 0);
    }
    __name(yo, "yo");
    c();
    m();
    p();
    d();
    f();
    l();
    var cr = class {
      static {
        __name(this, "cr");
      }
      constructor() {
        this._middlewares = [];
      }
      use(t) {
        this._middlewares.push(t);
      }
      get(t) {
        return this._middlewares[t];
      }
      has(t) {
        return !!this._middlewares[t];
      }
      length() {
        return this._middlewares.length;
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    var Eo = Fe(Vn());
    c();
    m();
    p();
    d();
    f();
    l();
    function mr(e) {
      return typeof e.batchRequestIdx == "number";
    }
    __name(mr, "mr");
    c();
    m();
    p();
    d();
    f();
    l();
    function bo(e) {
      if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow") return;
      let t = [];
      return e.modelName && t.push(e.modelName), e.query.arguments && t.push(en(e.query.arguments)), t.push(en(e.query.selection)), t.join("");
    }
    __name(bo, "bo");
    function en(e) {
      return `(${Object.keys(e).sort().map((r) => {
        let n = e[r];
        return typeof n == "object" && n !== null ? `(${r} ${en(n)})` : r;
      }).join(" ")})`;
    }
    __name(en, "en");
    c();
    m();
    p();
    d();
    f();
    l();
    var Wa = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateOne: true, upsertOne: true };
    function tn(e) {
      return Wa[e];
    }
    __name(tn, "tn");
    c();
    m();
    p();
    d();
    f();
    l();
    var pr = class {
      static {
        __name(this, "pr");
      }
      constructor(t) {
        this.options = t;
        this.tickActive = false;
        this.batches = {};
      }
      request(t) {
        let r = this.options.batchBy(t);
        return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, h.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[r].push({ request: t, resolve: n, reject: i });
        })) : this.options.singleLoader(t);
      }
      dispatchBatches() {
        for (let t in this.batches) {
          let r = this.batches[t];
          delete this.batches[t], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
            n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
          }).catch((n) => {
            r[0].reject(n);
          }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
            else for (let i = 0; i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < r.length; i++) r[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    c();
    m();
    p();
    d();
    f();
    l();
    l();
    function Le(e, t) {
      if (t === null) return t;
      switch (e) {
        case "bigint":
          return BigInt(t);
        case "bytes":
          return b.from(t, "base64");
        case "decimal":
          return new ue(t);
        case "datetime":
        case "date":
          return new Date(t);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${t}Z`);
        case "bigint-array":
          return t.map((r) => Le("bigint", r));
        case "bytes-array":
          return t.map((r) => Le("bytes", r));
        case "decimal-array":
          return t.map((r) => Le("decimal", r));
        case "datetime-array":
          return t.map((r) => Le("datetime", r));
        case "date-array":
          return t.map((r) => Le("date", r));
        case "time-array":
          return t.map((r) => Le("time", r));
        default:
          return t;
      }
    }
    __name(Le, "Le");
    function wo(e) {
      let t = [], r = Ka(e);
      for (let n = 0; n < e.rows.length; n++) {
        let i = e.rows[n], o = { ...r };
        for (let s = 0; s < i.length; s++) o[e.columns[s]] = Le(e.types[s], i[s]);
        t.push(o);
      }
      return t;
    }
    __name(wo, "wo");
    function Ka(e) {
      let t = {};
      for (let r = 0; r < e.columns.length; r++) t[e.columns[r]] = null;
      return t;
    }
    __name(Ka, "Ka");
    var Ha = ee("prisma:client:request_handler");
    var dr = class {
      static {
        __name(this, "dr");
      }
      constructor(t, r) {
        this.logEmitter = r, this.client = t, this.dataloader = new pr({ batchLoader: Ji(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((C) => C.protocolQuery), u = this.client._tracingHelper.getTraceParent(s), g = n.some((C) => tn(C.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: u, transaction: za(o), containsWrite: g, customDataProxyFetch: i })).map((C, O) => {
            if (C instanceof Error) return C;
            try {
              return this.mapQueryEngineResult(n[O], C);
            } catch (A) {
              return A;
            }
          });
        }), singleLoader: /* @__PURE__ */ __name(async (n) => {
          let i = n.transaction?.kind === "itx" ? xo(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: tn(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, "singleLoader"), batchBy: /* @__PURE__ */ __name((n) => n.transaction?.id ? `transaction-${n.transaction.id}` : bo(n.protocolQuery), "batchBy"), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(t) {
        try {
          return await this.dataloader.request(t);
        } catch (r) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = t;
          this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: t.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: t, unpacker: r }, n) {
        let i = n?.data, o = n?.elapsed, s = this.unpack(i, t, r);
        return h.env.PRISMA_CLIENT_GET_TIME ? { data: s, elapsed: o } : s;
      }
      handleAndLogRequestError(t) {
        try {
          this.handleRequestError(t);
        } catch (r) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: t.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r;
        }
      }
      handleRequestError({ error: t, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (Ha(t), Ya(t, i) || t instanceof we) throw t;
        if (t instanceof J && Xa(t)) {
          let g = Po(t.meta);
          zt({ args: o, errors: [g], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let u = t.message;
        if (n && (u = Je({ callsite: n, originalMethod: r, isPanic: t.isPanic, showColors: this.client._errorFormat === "pretty", message: u })), u = this.sanitizeMessage(u), t.code) {
          let g = s ? { modelName: s, ...t.meta } : t.meta;
          throw new J(u, { code: t.code, clientVersion: this.client._clientVersion, meta: g, batchRequestIdx: t.batchRequestIdx });
        } else {
          if (t.isPanic) throw new Ee(u, this.client._clientVersion);
          if (t instanceof G) throw new G(u, { clientVersion: this.client._clientVersion, batchRequestIdx: t.batchRequestIdx });
          if (t instanceof L) throw new L(u, this.client._clientVersion);
          if (t instanceof Ee) throw new Ee(u, this.client._clientVersion);
        }
        throw t.clientVersion = this.client._clientVersion, t;
      }
      sanitizeMessage(t) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? (0, Eo.default)(t) : t;
      }
      unpack(t, r, n) {
        if (!t || (t.data && (t = t.data), !t)) return t;
        let i = Object.keys(t)[0], o = Object.values(t)[0], s = r.filter((g) => g !== "select" && g !== "include"), a = Jr(o, s), u = i === "queryRaw" ? wo(a) : $e(a);
        return n ? n(u) : u;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function za(e) {
      if (e) {
        if (e.kind === "batch") return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
        if (e.kind === "itx") return { kind: "itx", options: xo(e) };
        be(e, "Unknown transaction kind");
      }
    }
    __name(za, "za");
    function xo(e) {
      return { id: e.id, payload: e.payload };
    }
    __name(xo, "xo");
    function Ya(e, t) {
      return mr(e) && t?.kind === "batch" && e.batchRequestIdx !== t.index;
    }
    __name(Ya, "Ya");
    function Xa(e) {
      return e.code === "P2009" || e.code === "P2012";
    }
    __name(Xa, "Xa");
    function Po(e) {
      if (e.kind === "Union") return { kind: "Union", errors: e.errors.map(Po) };
      if (Array.isArray(e.selectionPath)) {
        let [, ...t] = e.selectionPath;
        return { ...e, selectionPath: t };
      }
      return e;
    }
    __name(Po, "Po");
    c();
    m();
    p();
    d();
    f();
    l();
    var vo = "5.22.0";
    var To = vo;
    c();
    m();
    p();
    d();
    f();
    l();
    var Oo = Fe(kr());
    c();
    m();
    p();
    d();
    f();
    l();
    var _ = class extends Error {
      static {
        __name(this, "_");
      }
      constructor(t) {
        super(t + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    K(_, "PrismaClientConstructorValidationError");
    var Co = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var Ro = ["pretty", "colorless", "minimal"];
    var Ao = ["info", "query", "warn", "error"];
    var el = { datasources: /* @__PURE__ */ __name((e, { datasourceNames: t }) => {
      if (e) {
        if (typeof e != "object" || Array.isArray(e)) throw new _(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(e)) {
          if (!t.includes(r)) {
            let i = nt(r, t) || ` Available datasources: ${t.join(", ")}`;
            throw new _(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new _(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new _(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new _(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, "datasources"), adapter: /* @__PURE__ */ __name((e, t) => {
      if (e === null) return;
      if (e === void 0) throw new _('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
      if (!ur(t).includes("driverAdapters")) throw new _('"adapter" property can only be provided to PrismaClient constructor when "driverAdapters" preview feature is enabled.');
      if (at() === "binary") throw new _('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
    }, "adapter"), datasourceUrl: /* @__PURE__ */ __name((e) => {
      if (typeof e < "u" && typeof e != "string") throw new _(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, "datasourceUrl"), errorFormat: /* @__PURE__ */ __name((e) => {
      if (e) {
        if (typeof e != "string") throw new _(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!Ro.includes(e)) {
          let t = nt(e, Ro);
          throw new _(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`);
        }
      }
    }, "errorFormat"), log: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      if (!Array.isArray(e)) throw new _(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
      function t(r) {
        if (typeof r == "string" && !Ao.includes(r)) {
          let n = nt(r, Ao);
          throw new _(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      __name(t, "t");
      for (let r of e) {
        t(r);
        let n = { level: t, emit: /* @__PURE__ */ __name((i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = nt(i, o);
            throw new _(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        }, "emit") };
        if (r && typeof r == "object") for (let [i, o] of Object.entries(r)) if (n[i]) n[i](o);
        else throw new _(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, "log"), transactionOptions: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = e.maxWait;
      if (t != null && t <= 0) throw new _(`Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r = e.timeout;
      if (r != null && r <= 0) throw new _(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, "transactionOptions"), omit: /* @__PURE__ */ __name((e, t) => {
      if (typeof e != "object") throw new _('"omit" option is expected to be an object.');
      if (e === null) throw new _('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(e)) {
        let o = rl(n, t.runtimeDataModel);
        if (!o) {
          r.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let u = o.fields.find((g) => g.name === s);
          if (!u) {
            r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (u.relationName) {
            r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new _(nl(e, r));
    }, "omit"), __internal: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = ["debug", "engine", "configOverride"];
      if (typeof e != "object") throw new _(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(e)) if (!t.includes(r)) {
        let n = nt(r, t);
        throw new _(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    }, "__internal") };
    function ko(e, t) {
      for (let [r, n] of Object.entries(e)) {
        if (!Co.includes(r)) {
          let i = nt(r, Co);
          throw new _(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
        }
        el[r](n, t);
      }
      if (e.datasourceUrl && e.datasources) throw new _('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    __name(ko, "ko");
    function nt(e, t) {
      if (t.length === 0 || typeof e != "string") return "";
      let r = tl(e, t);
      return r ? ` Did you mean "${r}"?` : "";
    }
    __name(nt, "nt");
    function tl(e, t) {
      if (t.length === 0) return null;
      let r = t.map((i) => ({ value: i, distance: (0, Oo.default)(e, i) }));
      r.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = r[0];
      return n.distance < 3 ? n.value : null;
    }
    __name(tl, "tl");
    function rl(e, t) {
      return So(t.models, e) ?? So(t.types, e);
    }
    __name(rl, "rl");
    function So(e, t) {
      let r = Object.keys(e).find((n) => Ve(n) === t);
      if (r) return e[r];
    }
    __name(So, "So");
    function nl(e, t) {
      let r = Ye(e);
      for (let o of t) switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = Ht(r, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    __name(nl, "nl");
    c();
    m();
    p();
    d();
    f();
    l();
    function Mo(e) {
      return e.length === 0 ? Promise.resolve([]) : new Promise((t, r) => {
        let n = new Array(e.length), i = null, o = false, s = 0, a = /* @__PURE__ */ __name(() => {
          o || (s++, s === e.length && (o = true, i ? r(i) : t(n)));
        }, "a"), u = /* @__PURE__ */ __name((g) => {
          o || (o = true, r(g));
        }, "u");
        for (let g = 0; g < e.length; g++) e[g].then((T) => {
          n[g] = T, a();
        }, (T) => {
          if (!mr(T)) {
            u(T);
            return;
          }
          T.batchRequestIdx === g ? u(T) : (i || (i = T), a());
        });
      });
    }
    __name(Mo, "Mo");
    var Re = ee("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var il = { requestArgsToMiddlewareArgs: /* @__PURE__ */ __name((e) => e, "requestArgsToMiddlewareArgs"), middlewareArgsToRequestArgs: /* @__PURE__ */ __name((e) => e, "middlewareArgsToRequestArgs") };
    var ol = /* @__PURE__ */ Symbol.for("prisma.client.transaction.id");
    var sl = { id: 0, nextId() {
      return ++this.id;
    } };
    function _o(e) {
      class t {
        static {
          __name(this, "t");
        }
        constructor(n) {
          this._originalClient = this;
          this._middlewares = new cr();
          this._createPrismaPromise = Xr();
          this.$extends = Ni;
          e = n?.__internal?.configOverride?.(e) ?? e, zi(e), n && ko(n, e);
          let i = new Ut().on("error", () => {
          });
          this._extensions = Xe.empty(), this._previewFeatures = ur(e), this._clientVersion = e.clientVersion ?? To, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = go(this._previewFeatures);
          let o = { rootEnvPath: e.relativeEnvPaths.rootEnvPath && st.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && st.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = $r(n.adapter);
            let u = e.activeProvider === "postgresql" ? "postgres" : e.activeProvider;
            if (s.provider !== u) throw new L(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${u}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new L("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = e.injectableEdgeEnv?.();
          try {
            let u = n ?? {}, g = u.__internal ?? {}, T = g.debug === true;
            T && ee.enable("prisma:client");
            let C = st.resolve(e.dirname, e.relativePath);
            yn.existsSync(C) || (C = e.dirname), Re("dirname", e.dirname), Re("relativePath", e.relativePath), Re("cwd", C);
            let O = g.engine || {};
            if (u.errorFormat ? this._errorFormat = u.errorFormat : h.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : h.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: C, dirname: e.dirname, enableDebugLogs: T, allowTriggerPanic: O.allowTriggerPanic, datamodelPath: st.join(e.dirname, e.filename ?? "schema.prisma"), prismaPath: O.binaryPath ?? void 0, engineEndpoint: O.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: u.log && yo(u.log), logQueries: u.log && !!(typeof u.log == "string" ? u.log === "query" : u.log.find((A) => typeof A == "string" ? A === "query" : A.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: Yi(u, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: u.transactionOptions?.maxWait ?? 2e3, timeout: u.transactionOptions?.timeout ?? 5e3, isolationLevel: u.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: ar, getBatchRequestPayload: nr, prismaGraphQLToJSError: ir, PrismaClientUnknownRequestError: G, PrismaClientInitializationError: L, PrismaClientKnownRequestError: J, debug: ee("prisma:client:accelerateEngine"), engineVersion: Lo.version, clientVersion: e.clientVersion } }, Re("clientVersion", e.clientVersion), this._engine = to(e, this._engineConfig), this._requestHandler = new dr(this, i), u.log) for (let A of u.log) {
              let M = typeof A == "string" ? A : A.emit === "stdout" ? A.level : null;
              M && this.$on(M, (S) => {
                ut.log(`${ut.tags[M] ?? ""}`, S.message || S.query);
              });
            }
            this._metrics = new Ze(this._engine);
          } catch (u) {
            throw u.clientVersion = this._clientVersion, u;
          }
          return this._appliedParent = Tt(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $use(n) {
          this._middlewares.use(n);
        }
        $on(n, i) {
          n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i);
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            Mn();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: Yr({ clientMethod: i, activeProvider: a }), callsite: Te(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = Io(n, i);
              return zr(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new j("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (zr(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (e.activeProvider !== "mongodb") throw new j(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: ro, callsite: Te(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: Yr({ clientMethod: i, activeProvider: a }), callsite: Te(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...Io(n, i));
            throw new j("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new j("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = sl.nextId(), s = ho(n.length), a = n.map((u, g) => {
            if (u?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let T = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, C = { kind: "batch", id: o, index: g, isolationLevel: T, lock: s };
            return u.requestTransaction?.(C) ?? u;
          });
          return Mo(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), u;
          try {
            let g = { kind: "itx", ...a };
            u = await n(this._createItxClient(g)), await this._engine.transaction("commit", o, a);
          } catch (g) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), g;
          }
          return u;
        }
        _createItxClient(n) {
          return Tt(ge(Fi(this), [H("_appliedParent", () => this._appliedParent._createItxClient(n)), H("_createPrismaPromise", () => Xr(n)), H(ol, () => n.id), et(lo)]));
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = /* @__PURE__ */ __name(() => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          }, "o") : o = /* @__PURE__ */ __name(() => this._transactionWithCallback({ callback: n, options: i }), "o") : o = /* @__PURE__ */ __name(() => this._transactionWithArray({ promises: n, options: i }), "o");
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? il, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { middleware: { name: "middleware", middleware: true, attributes: { method: "$use" }, active: false }, operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = -1, u = /* @__PURE__ */ __name(async (g) => {
            let T = this._middlewares.get(++a);
            if (T) return this._tracingHelper.runInChildSpan(s.middleware, (I) => T(g, (ne) => (I?.end(), u(ne))));
            let { runInTransaction: C, args: O, ...A } = g, M = { ...n, ...A };
            O && (M.args = i.middlewareArgsToRequestArgs(O)), n.transaction !== void 0 && C === false && delete M.transaction;
            let S = await Qi(this, M);
            return M.model ? Bi({ result: S, modelName: M.model, args: M.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : S;
          }, "u");
          return this._tracingHelper.runInChildSpan(s.operation, () => u(o));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: u, argsMapper: g, transaction: T, unpacker: C, otelParentCtx: O, customDataProxyFetch: A }) {
          try {
            n = g ? g(n) : n;
            let M = { name: "serialize" }, S = this._tracingHelper.runInChildSpan(M, () => Zt({ modelName: u, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return ee.enabled("prisma:client") && (Re("Prisma Client call:"), Re(`prisma.${i}(${Ci(n)})`), Re("Generated request:"), Re(JSON.stringify(S, null, 2) + `
`)), T?.kind === "batch" && await T.lock, this._requestHandler.request({ protocolQuery: S, modelName: u, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: T, unpacker: C, otelParentCtx: O, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: A });
          } catch (M) {
            throw M.clientVersion = this._clientVersion, M;
          }
        }
        get $metrics() {
          if (!this._hasPreviewFlag("metrics")) throw new j("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: this._clientVersion });
          return this._metrics;
        }
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
      }
      return t;
    }
    __name(_o, "_o");
    function Io(e, t) {
      return al(e) ? [new X(e, t), co] : [e, mo];
    }
    __name(Io, "Io");
    function al(e) {
      return Array.isArray(e) && Array.isArray(e.raw);
    }
    __name(al, "al");
    c();
    m();
    p();
    d();
    f();
    l();
    var ll = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function Do(e) {
      return new Proxy(e, { get(t, r) {
        if (r in t) return t[r];
        if (!ll.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      } });
    }
    __name(Do, "Do");
    c();
    m();
    p();
    d();
    f();
    l();
    l();
  }
});

// node_modules/.prisma/client/query_engine_bg.js
var require_query_engine_bg = __commonJS({
  "node_modules/.prisma/client/query_engine_bg.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var j = Object.defineProperty;
    var R = Object.getOwnPropertyDescriptor;
    var D = Object.getOwnPropertyNames;
    var M = Object.prototype.hasOwnProperty;
    var U = /* @__PURE__ */ __name((t, e) => {
      for (var n in e) j(t, n, { get: e[n], enumerable: true });
    }, "U");
    var B = /* @__PURE__ */ __name((t, e, n, _) => {
      if (e && typeof e == "object" || typeof e == "function") for (let o of D(e)) !M.call(t, o) && o !== n && j(t, o, { get: /* @__PURE__ */ __name(() => e[o], "get"), enumerable: !(_ = R(e, o)) || _.enumerable });
      return t;
    }, "B");
    var N = /* @__PURE__ */ __name((t) => B(j({}, "__esModule", { value: true }), t), "N");
    var Oe = {};
    U(Oe, { QueryEngine: /* @__PURE__ */ __name(() => G, "QueryEngine"), __wbg_String_88810dfeb4021902: /* @__PURE__ */ __name(() => Et, "__wbg_String_88810dfeb4021902"), __wbg_buffer_344d9b41efe96da7: /* @__PURE__ */ __name(() => Rt, "__wbg_buffer_344d9b41efe96da7"), __wbg_call_53fc3abd42e24ec8: /* @__PURE__ */ __name(() => ie, "__wbg_call_53fc3abd42e24ec8"), __wbg_call_669127b9d730c650: /* @__PURE__ */ __name(() => Qt, "__wbg_call_669127b9d730c650"), __wbg_crypto_58f13aa23ffcb166: /* @__PURE__ */ __name(() => Ct, "__wbg_crypto_58f13aa23ffcb166"), __wbg_done_bc26bf4ada718266: /* @__PURE__ */ __name(() => Xt, "__wbg_done_bc26bf4ada718266"), __wbg_entries_6d727b73ee02b7ce: /* @__PURE__ */ __name(() => pe, "__wbg_entries_6d727b73ee02b7ce"), __wbg_getRandomValues_504510b5564925af: /* @__PURE__ */ __name(() => Bt, "__wbg_getRandomValues_504510b5564925af"), __wbg_getTime_ed6ee333b702f8fc: /* @__PURE__ */ __name(() => ct, "__wbg_getTime_ed6ee333b702f8fc"), __wbg_get_2aff440840bb6202: /* @__PURE__ */ __name(() => te, "__wbg_get_2aff440840bb6202"), __wbg_get_4a9aa5157afeb382: /* @__PURE__ */ __name(() => Ht, "__wbg_get_4a9aa5157afeb382"), __wbg_get_94990005bd6ca07c: /* @__PURE__ */ __name(() => vt, "__wbg_get_94990005bd6ca07c"), __wbg_getwithrefkey_5e6d9547403deab8: /* @__PURE__ */ __name(() => qt, "__wbg_getwithrefkey_5e6d9547403deab8"), __wbg_globalThis_17eff828815f7d84: /* @__PURE__ */ __name(() => re, "__wbg_globalThis_17eff828815f7d84"), __wbg_global_46f939f6541643c5: /* @__PURE__ */ __name(() => _e, "__wbg_global_46f939f6541643c5"), __wbg_has_cdf8b85f6e903c80: /* @__PURE__ */ __name(() => rt, "__wbg_has_cdf8b85f6e903c80"), __wbg_instanceof_ArrayBuffer_c7cc317e5c29cc0d: /* @__PURE__ */ __name(() => we, "__wbg_instanceof_ArrayBuffer_c7cc317e5c29cc0d"), __wbg_instanceof_Promise_cfbcc42300367513: /* @__PURE__ */ __name(() => st, "__wbg_instanceof_Promise_cfbcc42300367513"), __wbg_instanceof_Uint8Array_19e6f142a5e7e1e1: /* @__PURE__ */ __name(() => le, "__wbg_instanceof_Uint8Array_19e6f142a5e7e1e1"), __wbg_isArray_38525be7442aa21e: /* @__PURE__ */ __name(() => ce, "__wbg_isArray_38525be7442aa21e"), __wbg_isSafeInteger_c38b0a16d0c7cef7: /* @__PURE__ */ __name(() => ue, "__wbg_isSafeInteger_c38b0a16d0c7cef7"), __wbg_iterator_7ee1a391d310f8e4: /* @__PURE__ */ __name(() => bt, "__wbg_iterator_7ee1a391d310f8e4"), __wbg_length_a5587d6cd79ab197: /* @__PURE__ */ __name(() => be, "__wbg_length_a5587d6cd79ab197"), __wbg_length_cace2e0b3ddc0502: /* @__PURE__ */ __name(() => at, "__wbg_length_cace2e0b3ddc0502"), __wbg_msCrypto_abcb1295e768d1f2: /* @__PURE__ */ __name(() => Pt, "__wbg_msCrypto_abcb1295e768d1f2"), __wbg_new0_ad75dd38f92424e2: /* @__PURE__ */ __name(() => ot, "__wbg_new0_ad75dd38f92424e2"), __wbg_new_08236689f0afb357: /* @__PURE__ */ __name(() => ht, "__wbg_new_08236689f0afb357"), __wbg_new_1b94180eeb48f2a2: /* @__PURE__ */ __name(() => It, "__wbg_new_1b94180eeb48f2a2"), __wbg_new_c728d68b8b34487e: /* @__PURE__ */ __name(() => St, "__wbg_new_c728d68b8b34487e"), __wbg_new_d8a000788389a31e: /* @__PURE__ */ __name(() => Mt, "__wbg_new_d8a000788389a31e"), __wbg_new_feb65b865d980ae2: /* @__PURE__ */ __name(() => Y, "__wbg_new_feb65b865d980ae2"), __wbg_newnoargs_ccdcae30fd002262: /* @__PURE__ */ __name(() => oe, "__wbg_newnoargs_ccdcae30fd002262"), __wbg_newwithbyteoffsetandlength_2dc04d99088b15e3: /* @__PURE__ */ __name(() => Dt, "__wbg_newwithbyteoffsetandlength_2dc04d99088b15e3"), __wbg_newwithlength_13b5319ab422dcf6: /* @__PURE__ */ __name(() => Wt, "__wbg_newwithlength_13b5319ab422dcf6"), __wbg_next_15da6a3df9290720: /* @__PURE__ */ __name(() => Zt, "__wbg_next_15da6a3df9290720"), __wbg_next_1989a20442400aaa: /* @__PURE__ */ __name(() => Kt, "__wbg_next_1989a20442400aaa"), __wbg_node_523d7bd03ef69fba: /* @__PURE__ */ __name(() => zt, "__wbg_node_523d7bd03ef69fba"), __wbg_now_28a6b413aca4a96a: /* @__PURE__ */ __name(() => ge, "__wbg_now_28a6b413aca4a96a"), __wbg_now_4579335d3581594c: /* @__PURE__ */ __name(() => ut, "__wbg_now_4579335d3581594c"), __wbg_now_8ed1a4454e40ecd1: /* @__PURE__ */ __name(() => it, "__wbg_now_8ed1a4454e40ecd1"), __wbg_parse_3f0cb48976ca4123: /* @__PURE__ */ __name(() => _t, "__wbg_parse_3f0cb48976ca4123"), __wbg_process_5b786e71d465a513: /* @__PURE__ */ __name(() => $t, "__wbg_process_5b786e71d465a513"), __wbg_push_fd3233d09cf81821: /* @__PURE__ */ __name(() => kt, "__wbg_push_fd3233d09cf81821"), __wbg_randomFillSync_a0d98aa11c81fe89: /* @__PURE__ */ __name(() => Nt, "__wbg_randomFillSync_a0d98aa11c81fe89"), __wbg_require_2784e593a4674877: /* @__PURE__ */ __name(() => Lt, "__wbg_require_2784e593a4674877"), __wbg_resolve_a3252b2860f0a09e: /* @__PURE__ */ __name(() => Ae, "__wbg_resolve_a3252b2860f0a09e"), __wbg_self_3fad056edded10bd: /* @__PURE__ */ __name(() => ee, "__wbg_self_3fad056edded10bd"), __wbg_setTimeout_631fe61f31fa2fad: /* @__PURE__ */ __name(() => Z, "__wbg_setTimeout_631fe61f31fa2fad"), __wbg_set_0ac78a2bc07da03c: /* @__PURE__ */ __name(() => Tt, "__wbg_set_0ac78a2bc07da03c"), __wbg_set_3355b9f2d3092e3b: /* @__PURE__ */ __name(() => At, "__wbg_set_3355b9f2d3092e3b"), __wbg_set_40f7786a25a9cc7e: /* @__PURE__ */ __name(() => se, "__wbg_set_40f7786a25a9cc7e"), __wbg_set_841ac57cff3d672b: /* @__PURE__ */ __name(() => Ot, "__wbg_set_841ac57cff3d672b"), __wbg_set_dcfd613a3420f908: /* @__PURE__ */ __name(() => ae, "__wbg_set_dcfd613a3420f908"), __wbg_set_wasm: /* @__PURE__ */ __name(() => C, "__wbg_set_wasm"), __wbg_stringify_4039297315a25b00: /* @__PURE__ */ __name(() => fe, "__wbg_stringify_4039297315a25b00"), __wbg_subarray_6ca5cfa7fbb9abbe: /* @__PURE__ */ __name(() => Ut, "__wbg_subarray_6ca5cfa7fbb9abbe"), __wbg_then_1bbc9edafd859b06: /* @__PURE__ */ __name(() => Se, "__wbg_then_1bbc9edafd859b06"), __wbg_then_89e1c559530b85cf: /* @__PURE__ */ __name(() => Ie, "__wbg_then_89e1c559530b85cf"), __wbg_valueOf_ff4b62641803432a: /* @__PURE__ */ __name(() => Gt, "__wbg_valueOf_ff4b62641803432a"), __wbg_value_0570714ff7d75f35: /* @__PURE__ */ __name(() => Yt, "__wbg_value_0570714ff7d75f35"), __wbg_versions_c2ab80650590b6a2: /* @__PURE__ */ __name(() => Vt, "__wbg_versions_c2ab80650590b6a2"), __wbg_window_a4f46c98a61d4089: /* @__PURE__ */ __name(() => ne, "__wbg_window_a4f46c98a61d4089"), __wbindgen_bigint_from_i64: /* @__PURE__ */ __name(() => wt, "__wbindgen_bigint_from_i64"), __wbindgen_bigint_from_u64: /* @__PURE__ */ __name(() => xt, "__wbindgen_bigint_from_u64"), __wbindgen_bigint_get_as_i64: /* @__PURE__ */ __name(() => ye, "__wbindgen_bigint_get_as_i64"), __wbindgen_boolean_get: /* @__PURE__ */ __name(() => gt, "__wbindgen_boolean_get"), __wbindgen_cb_drop: /* @__PURE__ */ __name(() => he, "__wbindgen_cb_drop"), __wbindgen_closure_wrapper6700: /* @__PURE__ */ __name(() => je, "__wbindgen_closure_wrapper6700"), __wbindgen_debug_string: /* @__PURE__ */ __name(() => me, "__wbindgen_debug_string"), __wbindgen_error_new: /* @__PURE__ */ __name(() => X, "__wbindgen_error_new"), __wbindgen_in: /* @__PURE__ */ __name(() => pt, "__wbindgen_in"), __wbindgen_is_bigint: /* @__PURE__ */ __name(() => dt, "__wbindgen_is_bigint"), __wbindgen_is_function: /* @__PURE__ */ __name(() => Jt, "__wbindgen_is_function"), __wbindgen_is_object: /* @__PURE__ */ __name(() => ft, "__wbindgen_is_object"), __wbindgen_is_string: /* @__PURE__ */ __name(() => jt, "__wbindgen_is_string"), __wbindgen_is_undefined: /* @__PURE__ */ __name(() => nt, "__wbindgen_is_undefined"), __wbindgen_jsval_eq: /* @__PURE__ */ __name(() => yt, "__wbindgen_jsval_eq"), __wbindgen_jsval_loose_eq: /* @__PURE__ */ __name(() => de, "__wbindgen_jsval_loose_eq"), __wbindgen_memory: /* @__PURE__ */ __name(() => Ft, "__wbindgen_memory"), __wbindgen_number_get: /* @__PURE__ */ __name(() => lt, "__wbindgen_number_get"), __wbindgen_number_new: /* @__PURE__ */ __name(() => mt, "__wbindgen_number_new"), __wbindgen_object_clone_ref: /* @__PURE__ */ __name(() => et, "__wbindgen_object_clone_ref"), __wbindgen_object_drop_ref: /* @__PURE__ */ __name(() => Te, "__wbindgen_object_drop_ref"), __wbindgen_string_get: /* @__PURE__ */ __name(() => K, "__wbindgen_string_get"), __wbindgen_string_new: /* @__PURE__ */ __name(() => tt, "__wbindgen_string_new"), __wbindgen_throw: /* @__PURE__ */ __name(() => xe, "__wbindgen_throw"), debug_panic: /* @__PURE__ */ __name(() => Q, "debug_panic"), getBuildTimeInfo: /* @__PURE__ */ __name(() => J, "getBuildTimeInfo") });
    module.exports = N(Oe);
    var T = /* @__PURE__ */ __name(() => {
    }, "T");
    T.prototype = T;
    var c;
    function C(t) {
      c = t;
    }
    __name(C, "C");
    var w = new Array(128).fill(void 0);
    w.push(void 0, null, true, false);
    function r(t) {
      return w[t];
    }
    __name(r, "r");
    var a = 0;
    var I = null;
    function S() {
      return (I === null || I.byteLength === 0) && (I = new Uint8Array(c.memory.buffer)), I;
    }
    __name(S, "S");
    var $2 = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder;
    var A = new $2("utf-8");
    var V = typeof A.encodeInto == "function" ? function(t, e) {
      return A.encodeInto(t, e);
    } : function(t, e) {
      const n = A.encode(t);
      return e.set(n), { read: t.length, written: n.length };
    };
    function d(t, e, n) {
      if (n === void 0) {
        const s = A.encode(t), p = e(s.length, 1) >>> 0;
        return S().subarray(p, p + s.length).set(s), a = s.length, p;
      }
      let _ = t.length, o = e(_, 1) >>> 0;
      const f = S();
      let u = 0;
      for (; u < _; u++) {
        const s = t.charCodeAt(u);
        if (s > 127) break;
        f[o + u] = s;
      }
      if (u !== _) {
        u !== 0 && (t = t.slice(u)), o = n(o, _, _ = u + t.length * 3, 1) >>> 0;
        const s = S().subarray(o + u, o + _), p = V(t, s);
        u += p.written, o = n(o, _, u, 1) >>> 0;
      }
      return a = u, o;
    }
    __name(d, "d");
    function x(t) {
      return t == null;
    }
    __name(x, "x");
    var y = null;
    function l() {
      return (y === null || y.buffer.detached === true || y.buffer.detached === void 0 && y.buffer !== c.memory.buffer) && (y = new DataView(c.memory.buffer)), y;
    }
    __name(l, "l");
    var z = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
    var q = new z("utf-8", { ignoreBOM: true, fatal: true });
    q.decode();
    function m(t, e) {
      return t = t >>> 0, q.decode(S().subarray(t, t + e));
    }
    __name(m, "m");
    var h = w.length;
    function i(t) {
      h === w.length && w.push(w.length + 1);
      const e = h;
      return h = w[e], w[e] = t, e;
    }
    __name(i, "i");
    function O(t) {
      const e = typeof t;
      if (e == "number" || e == "boolean" || t == null) return `${t}`;
      if (e == "string") return `"${t}"`;
      if (e == "symbol") {
        const o = t.description;
        return o == null ? "Symbol" : `Symbol(${o})`;
      }
      if (e == "function") {
        const o = t.name;
        return typeof o == "string" && o.length > 0 ? `Function(${o})` : "Function";
      }
      if (Array.isArray(t)) {
        const o = t.length;
        let f = "[";
        o > 0 && (f += O(t[0]));
        for (let u = 1; u < o; u++) f += ", " + O(t[u]);
        return f += "]", f;
      }
      const n = /\[object ([^\]]+)\]/.exec(toString.call(t));
      let _;
      if (n.length > 1) _ = n[1];
      else return toString.call(t);
      if (_ == "Object") try {
        return "Object(" + JSON.stringify(t) + ")";
      } catch {
        return "Object";
      }
      return t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : _;
    }
    __name(O, "O");
    function L(t) {
      t < 132 || (w[t] = h, h = t);
    }
    __name(L, "L");
    function b(t) {
      const e = r(t);
      return L(t), e;
    }
    __name(b, "b");
    var k = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((t) => {
      c.__wbindgen_export_2.get(t.dtor)(t.a, t.b);
    });
    function P(t, e, n, _) {
      const o = { a: t, b: e, cnt: 1, dtor: n }, f = /* @__PURE__ */ __name((...u) => {
        o.cnt++;
        const s = o.a;
        o.a = 0;
        try {
          return _(s, o.b, ...u);
        } finally {
          --o.cnt === 0 ? (c.__wbindgen_export_2.get(o.dtor)(s, o.b), k.unregister(o)) : o.a = s;
        }
      }, "f");
      return f.original = o, k.register(f, o, o), f;
    }
    __name(P, "P");
    function W(t, e, n) {
      c._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9eef02caf99553a1(t, e, i(n));
    }
    __name(W, "W");
    function J() {
      const t = c.getBuildTimeInfo();
      return b(t);
    }
    __name(J, "J");
    function Q(t) {
      try {
        const f = c.__wbindgen_add_to_stack_pointer(-16);
        var e = x(t) ? 0 : d(t, c.__wbindgen_malloc, c.__wbindgen_realloc), n = a;
        c.debug_panic(f, e, n);
        var _ = l().getInt32(f + 4 * 0, true), o = l().getInt32(f + 4 * 1, true);
        if (o) throw b(_);
      } finally {
        c.__wbindgen_add_to_stack_pointer(16);
      }
    }
    __name(Q, "Q");
    function g(t, e) {
      try {
        return t.apply(this, e);
      } catch (n) {
        c.__wbindgen_exn_store(i(n));
      }
    }
    __name(g, "g");
    function H(t, e, n, _) {
      c.wasm_bindgen__convert__closures__invoke2_mut__h174c8485536aed69(t, e, i(n), i(_));
    }
    __name(H, "H");
    var v = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((t) => c.__wbg_queryengine_free(t >>> 0, 1));
    var G = class {
      static {
        __name(this, "G");
      }
      __destroy_into_raw() {
        const e = this.__wbg_ptr;
        return this.__wbg_ptr = 0, v.unregister(this), e;
      }
      free() {
        const e = this.__destroy_into_raw();
        c.__wbg_queryengine_free(e, 0);
      }
      constructor(e, n, _) {
        try {
          const s = c.__wbindgen_add_to_stack_pointer(-16);
          c.queryengine_new(s, i(e), i(n), i(_));
          var o = l().getInt32(s + 4 * 0, true), f = l().getInt32(s + 4 * 1, true), u = l().getInt32(s + 4 * 2, true);
          if (u) throw b(f);
          return this.__wbg_ptr = o >>> 0, v.register(this, this.__wbg_ptr, this), this;
        } finally {
          c.__wbindgen_add_to_stack_pointer(16);
        }
      }
      connect(e) {
        const n = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), _ = a, o = c.queryengine_connect(this.__wbg_ptr, n, _);
        return b(o);
      }
      disconnect(e) {
        const n = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), _ = a, o = c.queryengine_disconnect(this.__wbg_ptr, n, _);
        return b(o);
      }
      query(e, n, _) {
        const o = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), f = a, u = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), s = a;
        var p = x(_) ? 0 : d(_, c.__wbindgen_malloc, c.__wbindgen_realloc), E = a;
        const F = c.queryengine_query(this.__wbg_ptr, o, f, u, s, p, E);
        return b(F);
      }
      startTransaction(e, n) {
        const _ = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), o = a, f = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), u = a, s = c.queryengine_startTransaction(this.__wbg_ptr, _, o, f, u);
        return b(s);
      }
      commitTransaction(e, n) {
        const _ = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), o = a, f = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), u = a, s = c.queryengine_commitTransaction(this.__wbg_ptr, _, o, f, u);
        return b(s);
      }
      rollbackTransaction(e, n) {
        const _ = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), o = a, f = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), u = a, s = c.queryengine_rollbackTransaction(this.__wbg_ptr, _, o, f, u);
        return b(s);
      }
      metrics(e) {
        const n = d(e, c.__wbindgen_malloc, c.__wbindgen_realloc), _ = a, o = c.queryengine_metrics(this.__wbg_ptr, n, _);
        return b(o);
      }
    };
    function K(t, e) {
      const n = r(e), _ = typeof n == "string" ? n : void 0;
      var o = x(_) ? 0 : d(_, c.__wbindgen_malloc, c.__wbindgen_realloc), f = a;
      l().setInt32(t + 4 * 1, f, true), l().setInt32(t + 4 * 0, o, true);
    }
    __name(K, "K");
    function X(t, e) {
      const n = new Error(m(t, e));
      return i(n);
    }
    __name(X, "X");
    function Y(t, e) {
      try {
        var n = { a: t, b: e }, _ = /* @__PURE__ */ __name((f, u) => {
          const s = n.a;
          n.a = 0;
          try {
            return H(s, n.b, f, u);
          } finally {
            n.a = s;
          }
        }, "_");
        const o = new Promise(_);
        return i(o);
      } finally {
        n.a = n.b = 0;
      }
    }
    __name(Y, "Y");
    function Z(t, e) {
      return setTimeout(r(t), e >>> 0);
    }
    __name(Z, "Z");
    function tt(t, e) {
      const n = m(t, e);
      return i(n);
    }
    __name(tt, "tt");
    function et(t) {
      const e = r(t);
      return i(e);
    }
    __name(et, "et");
    function nt(t) {
      return r(t) === void 0;
    }
    __name(nt, "nt");
    function rt() {
      return g(function(t, e) {
        return Reflect.has(r(t), r(e));
      }, arguments);
    }
    __name(rt, "rt");
    function _t() {
      return g(function(t, e) {
        const n = JSON.parse(m(t, e));
        return i(n);
      }, arguments);
    }
    __name(_t, "_t");
    function ot() {
      return i(/* @__PURE__ */ new Date());
    }
    __name(ot, "ot");
    function ct(t) {
      return r(t).getTime();
    }
    __name(ct, "ct");
    function it(t) {
      return r(t).now();
    }
    __name(it, "it");
    function ut() {
      return Date.now();
    }
    __name(ut, "ut");
    function st(t) {
      let e;
      try {
        e = r(t) instanceof Promise;
      } catch {
        e = false;
      }
      return e;
    }
    __name(st, "st");
    function ft(t) {
      const e = r(t);
      return typeof e == "object" && e !== null;
    }
    __name(ft, "ft");
    function at(t) {
      return r(t).length;
    }
    __name(at, "at");
    function bt() {
      return i(Symbol.iterator);
    }
    __name(bt, "bt");
    function gt(t) {
      const e = r(t);
      return typeof e == "boolean" ? e ? 1 : 0 : 2;
    }
    __name(gt, "gt");
    function dt(t) {
      return typeof r(t) == "bigint";
    }
    __name(dt, "dt");
    function lt(t, e) {
      const n = r(e), _ = typeof n == "number" ? n : void 0;
      l().setFloat64(t + 8 * 1, x(_) ? 0 : _, true), l().setInt32(t + 4 * 0, !x(_), true);
    }
    __name(lt, "lt");
    function wt(t) {
      return i(t);
    }
    __name(wt, "wt");
    function pt(t, e) {
      return r(t) in r(e);
    }
    __name(pt, "pt");
    function xt(t) {
      const e = BigInt.asUintN(64, t);
      return i(e);
    }
    __name(xt, "xt");
    function yt(t, e) {
      return r(t) === r(e);
    }
    __name(yt, "yt");
    function mt(t) {
      return i(t);
    }
    __name(mt, "mt");
    function ht() {
      const t = new Array();
      return i(t);
    }
    __name(ht, "ht");
    function Tt(t, e, n) {
      r(t)[e >>> 0] = b(n);
    }
    __name(Tt, "Tt");
    function It() {
      return i(/* @__PURE__ */ new Map());
    }
    __name(It, "It");
    function St() {
      const t = new Object();
      return i(t);
    }
    __name(St, "St");
    function At(t, e, n) {
      const _ = r(t).set(r(e), r(n));
      return i(_);
    }
    __name(At, "At");
    function jt(t) {
      return typeof r(t) == "string";
    }
    __name(jt, "jt");
    function Ot(t, e, n) {
      r(t)[b(e)] = b(n);
    }
    __name(Ot, "Ot");
    function qt(t, e) {
      const n = r(t)[r(e)];
      return i(n);
    }
    __name(qt, "qt");
    function kt(t, e) {
      return r(t).push(r(e));
    }
    __name(kt, "kt");
    function vt() {
      return g(function(t, e) {
        const n = r(t)[b(e)];
        return i(n);
      }, arguments);
    }
    __name(vt, "vt");
    function Et(t, e) {
      const n = String(r(e)), _ = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), o = a;
      l().setInt32(t + 4 * 1, o, true), l().setInt32(t + 4 * 0, _, true);
    }
    __name(Et, "Et");
    function Ft() {
      const t = c.memory;
      return i(t);
    }
    __name(Ft, "Ft");
    function Rt(t) {
      const e = r(t).buffer;
      return i(e);
    }
    __name(Rt, "Rt");
    function Dt(t, e, n) {
      const _ = new Uint8Array(r(t), e >>> 0, n >>> 0);
      return i(_);
    }
    __name(Dt, "Dt");
    function Mt(t) {
      const e = new Uint8Array(r(t));
      return i(e);
    }
    __name(Mt, "Mt");
    function Ut(t, e, n) {
      const _ = r(t).subarray(e >>> 0, n >>> 0);
      return i(_);
    }
    __name(Ut, "Ut");
    function Bt() {
      return g(function(t, e) {
        r(t).getRandomValues(r(e));
      }, arguments);
    }
    __name(Bt, "Bt");
    function Nt() {
      return g(function(t, e) {
        r(t).randomFillSync(b(e));
      }, arguments);
    }
    __name(Nt, "Nt");
    function Ct(t) {
      const e = r(t).crypto;
      return i(e);
    }
    __name(Ct, "Ct");
    function $t(t) {
      const e = r(t).process;
      return i(e);
    }
    __name($t, "$t");
    function Vt(t) {
      const e = r(t).versions;
      return i(e);
    }
    __name(Vt, "Vt");
    function zt(t) {
      const e = r(t).node;
      return i(e);
    }
    __name(zt, "zt");
    function Lt() {
      return g(function() {
        const t = module.require;
        return i(t);
      }, arguments);
    }
    __name(Lt, "Lt");
    function Pt(t) {
      const e = r(t).msCrypto;
      return i(e);
    }
    __name(Pt, "Pt");
    function Wt(t) {
      const e = new Uint8Array(t >>> 0);
      return i(e);
    }
    __name(Wt, "Wt");
    function Jt(t) {
      return typeof r(t) == "function";
    }
    __name(Jt, "Jt");
    function Qt() {
      return g(function(t, e) {
        const n = r(t).call(r(e));
        return i(n);
      }, arguments);
    }
    __name(Qt, "Qt");
    function Ht(t, e) {
      const n = r(t)[e >>> 0];
      return i(n);
    }
    __name(Ht, "Ht");
    function Gt(t) {
      return r(t).valueOf();
    }
    __name(Gt, "Gt");
    function Kt() {
      return g(function(t) {
        const e = r(t).next();
        return i(e);
      }, arguments);
    }
    __name(Kt, "Kt");
    function Xt(t) {
      return r(t).done;
    }
    __name(Xt, "Xt");
    function Yt(t) {
      const e = r(t).value;
      return i(e);
    }
    __name(Yt, "Yt");
    function Zt(t) {
      const e = r(t).next;
      return i(e);
    }
    __name(Zt, "Zt");
    function te() {
      return g(function(t, e) {
        const n = Reflect.get(r(t), r(e));
        return i(n);
      }, arguments);
    }
    __name(te, "te");
    function ee() {
      return g(function() {
        const t = self.self;
        return i(t);
      }, arguments);
    }
    __name(ee, "ee");
    function ne() {
      return g(function() {
        const t = window.window;
        return i(t);
      }, arguments);
    }
    __name(ne, "ne");
    function re() {
      return g(function() {
        const t = globalThis.globalThis;
        return i(t);
      }, arguments);
    }
    __name(re, "re");
    function _e() {
      return g(function() {
        const t = global.global;
        return i(t);
      }, arguments);
    }
    __name(_e, "_e");
    function oe(t, e) {
      const n = new T(m(t, e));
      return i(n);
    }
    __name(oe, "oe");
    function ce(t) {
      return Array.isArray(r(t));
    }
    __name(ce, "ce");
    function ie() {
      return g(function(t, e, n) {
        const _ = r(t).call(r(e), r(n));
        return i(_);
      }, arguments);
    }
    __name(ie, "ie");
    function ue(t) {
      return Number.isSafeInteger(r(t));
    }
    __name(ue, "ue");
    function se() {
      return g(function(t, e, n) {
        return Reflect.set(r(t), r(e), r(n));
      }, arguments);
    }
    __name(se, "se");
    function fe() {
      return g(function(t) {
        const e = JSON.stringify(r(t));
        return i(e);
      }, arguments);
    }
    __name(fe, "fe");
    function ae(t, e, n) {
      r(t).set(r(e), n >>> 0);
    }
    __name(ae, "ae");
    function be(t) {
      return r(t).length;
    }
    __name(be, "be");
    function ge() {
      return g(function() {
        return Date.now();
      }, arguments);
    }
    __name(ge, "ge");
    function de(t, e) {
      return r(t) == r(e);
    }
    __name(de, "de");
    function le(t) {
      let e;
      try {
        e = r(t) instanceof Uint8Array;
      } catch {
        e = false;
      }
      return e;
    }
    __name(le, "le");
    function we(t) {
      let e;
      try {
        e = r(t) instanceof ArrayBuffer;
      } catch {
        e = false;
      }
      return e;
    }
    __name(we, "we");
    function pe(t) {
      const e = Object.entries(r(t));
      return i(e);
    }
    __name(pe, "pe");
    function xe(t, e) {
      throw new Error(m(t, e));
    }
    __name(xe, "xe");
    function ye(t, e) {
      const n = r(e), _ = typeof n == "bigint" ? n : void 0;
      l().setBigInt64(t + 8 * 1, x(_) ? BigInt(0) : _, true), l().setInt32(t + 4 * 0, !x(_), true);
    }
    __name(ye, "ye");
    function me(t, e) {
      const n = O(r(e)), _ = d(n, c.__wbindgen_malloc, c.__wbindgen_realloc), o = a;
      l().setInt32(t + 4 * 1, o, true), l().setInt32(t + 4 * 0, _, true);
    }
    __name(me, "me");
    function he(t) {
      const e = b(t).original;
      return e.cnt-- == 1 ? (e.a = 0, true) : false;
    }
    __name(he, "he");
    function Te(t) {
      b(t);
    }
    __name(Te, "Te");
    function Ie(t, e) {
      const n = r(t).then(r(e));
      return i(n);
    }
    __name(Ie, "Ie");
    function Se(t, e, n) {
      const _ = r(t).then(r(e), r(n));
      return i(_);
    }
    __name(Se, "Se");
    function Ae(t) {
      const e = Promise.resolve(r(t));
      return i(e);
    }
    __name(Ae, "Ae");
    function je(t, e, n) {
      const _ = P(t, e, 530, W);
      return i(_);
    }
    __name(je, "je");
  }
});

// node_modules/.prisma/client/wasm-worker-loader.mjs
var wasm_worker_loader_exports = {};
__export(wasm_worker_loader_exports, {
  default: () => wasm_worker_loader_default
});
var wasm_worker_loader_default;
var init_wasm_worker_loader = __esm({
  "node_modules/.prisma/client/wasm-worker-loader.mjs"() {
    init_checked_fetch();
    init_modules_watch_stub();
    wasm_worker_loader_default = import("./8ced8cceb8eccc002dffe42c7b6658c446f622f0-query_engine_bg.wasm");
  }
});

// node_modules/.prisma/client/wasm.js
var require_wasm2 = __commonJS({
  "node_modules/.prisma/client/wasm.js"(exports) {
    init_checked_fetch();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      NotFoundError: NotFoundError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw3,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug3,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2
    } = require_wasm();
    var Prisma2 = {};
    exports.Prisma = Prisma2;
    exports.$Enums = {};
    Prisma2.prismaVersion = {
      client: "5.22.0",
      engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
    };
    Prisma2.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma2.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma2.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma2.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma2.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma2.NotFoundError = NotFoundError2;
    Prisma2.Decimal = Decimal2;
    Prisma2.sql = sqltag2;
    Prisma2.empty = empty2;
    Prisma2.join = join2;
    Prisma2.raw = raw3;
    Prisma2.validator = Public2.validator;
    Prisma2.getExtensionContext = Extensions2.getExtensionContext;
    Prisma2.defineExtension = Extensions2.defineExtension;
    Prisma2.DbNull = objectEnumValues2.instances.DbNull;
    Prisma2.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma2.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma2.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      Serializable: "Serializable"
    });
    exports.Prisma.UrunScalarFieldEnum = {
      id: "id",
      slug: "slug",
      ad: "ad",
      fiyat: "fiyat",
      indirimliFiyat: "indirimliFiyat",
      renkSecenekleri: "renkSecenekleri",
      kartelaIcCephe: "kartelaIcCephe",
      kartelaDisCephe: "kartelaDisCephe",
      iadeImkaniVar: "iadeImkaniVar",
      agirlik: "agirlik",
      aciklama: "aciklama",
      resimUrl: "resimUrl",
      aktif: "aktif",
      oneCikan: "oneCikan",
      firsatUrunu: "firsatUrunu",
      yeniUrun: "yeniUrun",
      cokSatanlar: "cokSatanlar",
      goruntulemeSayisi: "goruntulemeSayisi",
      satisAdedi: "satisAdedi",
      stokAdedi: "stokAdedi",
      varyantBasligi: "varyantBasligi",
      kategoriId: "kategoriId",
      markaId: "markaId",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.UrunResimScalarFieldEnum = {
      id: "id",
      url: "url",
      sira: "sira",
      urunId: "urunId",
      createdAt: "createdAt"
    };
    exports.Prisma.RenkKartelasiScalarFieldEnum = {
      id: "id",
      section: "section",
      code: "code",
      name: "name",
      hex: "hex",
      rgb: "rgb",
      sourceFile: "sourceFile",
      aktif: "aktif",
      sira: "sira",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.MarkaScalarFieldEnum = {
      id: "id",
      ad: "ad",
      slug: "slug",
      logoUrl: "logoUrl",
      aktif: "aktif",
      sira: "sira",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.KategoriScalarFieldEnum = {
      id: "id",
      ad: "ad",
      slug: "slug",
      resim: "resim",
      sira: "sira",
      aktif: "aktif",
      ustKategoriId: "ustKategoriId",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.SiparisScalarFieldEnum = {
      id: "id",
      siparisNumarasi: "siparisNumarasi",
      takipTokeni: "takipTokeni",
      toplamTutar: "toplamTutar",
      kargoUcreti: "kargoUcreti",
      kargoTakipNo: "kargoTakipNo",
      kargoFirmasi: "kargoFirmasi",
      durum: "durum",
      faturaDurumu: "faturaDurumu",
      faturaNo: "faturaNo",
      faturaTarihi: "faturaTarihi",
      eposta: "eposta",
      ad: "ad",
      soyad: "soyad",
      telefon: "telefon",
      adres: "adres",
      sehir: "sehir",
      ilce: "ilce",
      postaKodu: "postaKodu",
      ulke: "ulke",
      kurumsalMi: "kurumsalMi",
      sirketAdi: "sirketAdi",
      vergiDairesi: "vergiDairesi",
      vergiNumarasi: "vergiNumarasi",
      odemeId: "odemeId",
      odemeTokeni: "odemeTokeni",
      odemeDurumu: "odemeDurumu",
      teslimTarihi: "teslimTarihi",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.IadeTalebiScalarFieldEnum = {
      id: "id",
      siparisId: "siparisId",
      talepTipi: "talepTipi",
      aciklama: "aciklama",
      fotografUrls: "fotografUrls",
      resimUrl: "resimUrl",
      manuelIadeKodu: "manuelIadeKodu",
      kargoFirmasi: "kargoFirmasi",
      adminNotu: "adminNotu",
      durum: "durum",
      olusturulmaTarihi: "olusturulmaTarihi",
      guncellenmeTarihi: "guncellenmeTarihi"
    };
    exports.Prisma.SiparisKalemiScalarFieldEnum = {
      id: "id",
      siparisId: "siparisId",
      urunId: "urunId",
      secilenRenk: "secilenRenk",
      secilenBoyut: "secilenBoyut",
      iadeyeUygunMuSnapshot: "iadeyeUygunMuSnapshot",
      adet: "adet",
      fiyat: "fiyat",
      urunAdSnapshot: "urunAdSnapshot",
      urunFiyatSnapshot: "urunFiyatSnapshot",
      toplamFiyat: "toplamFiyat"
    };
    exports.Prisma.SiparisGecmisiScalarFieldEnum = {
      id: "id",
      siparisId: "siparisId",
      eskiDurum: "eskiDurum",
      yeniDurum: "yeniDurum",
      not: "not",
      islemYapan: "islemYapan",
      tarih: "tarih"
    };
    exports.Prisma.SistemAyarlariScalarFieldEnum = {
      id: "id",
      kargoAgirlikCarpani: "kargoAgirlikCarpani",
      ambarEsikAgirlik: "ambarEsikAgirlik",
      ucretsizKargoAltLimit: "ucretsizKargoAltLimit",
      kargoFiyatListesi: "kargoFiyatListesi",
      maintenanceMode: "maintenanceMode",
      updatedAt: "updatedAt"
    };
    exports.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports.Prisma.ModelName = {
      Urun: "Urun",
      UrunResim: "UrunResim",
      RenkKartelasi: "RenkKartelasi",
      Marka: "Marka",
      Kategori: "Kategori",
      Siparis: "Siparis",
      IadeTalebi: "IadeTalebi",
      SiparisKalemi: "SiparisKalemi",
      SiparisGecmisi: "SiparisGecmisi",
      SistemAyarlari: "SistemAyarlari"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "C:\\Users\\yusuf\\Github\\e-commerce-cloudflare\\server\\api\\node_modules\\@prisma\\client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "windows",
            "native": true
          }
        ],
        "previewFeatures": [
          "driverAdapters"
        ],
        "sourceFilePath": "C:\\Users\\yusuf\\Github\\e-commerce-cloudflare\\server\\api\\prisma\\schema.prisma"
      },
      "relativeEnvPaths": {
        "rootEnvPath": null
      },
      "relativePath": "../../../prisma",
      "clientVersion": "5.22.0",
      "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "sqlite",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": null,
            "value": "file:./dev.db"
          }
        }
      },
      "inlineSchema": 'generator client {\n  provider        = "prisma-client-js"\n  previewFeatures = ["driverAdapters"]\n}\n\ndatasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}\n\n// --- ENUMLAR ---\n// SQLite \xFCzerinde bu enumlar Prisma taraf\u0131ndan k\u0131s\u0131tlanacakt\u0131r.\n\nmodel Urun {\n  id              String  @id @default(uuid())\n  slug            String  @unique // SEO: bosch-matkap-v3\n  ad              String\n  fiyat           Float\n  indirimliFiyat  Float?\n  renkSecenekleri String  @default("[]") // JSON Array string: ["Beyaz", "Gri"]\n  kartelaIcCephe  Boolean @default(false)\n  kartelaDisCephe Boolean @default(false)\n  iadeImkaniVar   Boolean @default(true)\n\n  agirlik  Float   @default(1) @map("desi")\n  aciklama String?\n  resimUrl String? // Main image URL\n  aktif    Boolean @default(true)\n\n  // Feature Flags - Manuel Se\xE7im i\xE7in\n  oneCikan    Boolean @default(false) // \xD6ne \xC7\u0131kan \xDCr\xFCn\n  firsatUrunu Boolean @default(false) // F\u0131rsat \xDCr\xFCn\xFC (\u0130ndirimli)\n  yeniUrun    Boolean @default(false) // Yeni \xDCr\xFCn\n  cokSatanlar Boolean @default(false) // \xC7ok Satanlar\n\n  // Analytics & Tracking - Otomatik se\xE7im i\xE7in\n  goruntulemeSayisi Int @default(0) // \xDCr\xFCn detay sayfas\u0131 g\xF6r\xFCnt\xFCleme\n  satisAdedi        Int @default(0) // Toplam sat\u0131\u015F adedi\n\n  // Google Shopping Feed fields\n  stokAdedi      Int     @default(0) // Stock quantity for Google Merchant\n  varyantBasligi String? @map("varyant_basligi") // Title for variants (e.g., "Kum Boyutu")\n\n  kategoriId String?\n  kategori   Kategori? @relation(fields: [kategoriId], references: [id])\n\n  markaId String?\n  marka   Marka?  @relation(fields: [markaId], references: [id])\n\n  resimler         UrunResim[] // Multiple image support\n  siparisKalemleri SiparisKalemi[]\n\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@index([ad]) // Search performance\n  @@index([oneCikan, firsatUrunu, yeniUrun, cokSatanlar]) // Feature flags index\n  @@index([satisAdedi]) // Best sellers sorting\n  @@index([goruntulemeSayisi]) // Popular products sorting\n  @@map("urunler")\n}\n\nmodel UrunResim {\n  id        String   @id @default(uuid())\n  url       String\n  sira      Int      @default(0) // Resimlerin s\u0131ralamas\u0131 i\xE7in\n  urunId    String\n  urun      Urun     @relation(fields: [urunId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n\n  @@map("urun_resimleri")\n}\n\nmodel RenkKartelasi {\n  id                String   @id @default(uuid())\n  section           String\n  code              String   @unique\n  name              String\n  hex               String\n  rgb               String\n  sourceFile        String?\n  aktif             Boolean  @default(true)\n  sira              Int      @default(0)\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@index([section, sira])\n  @@index([name])\n  @@map("renk_kartelasi")\n}\n\nmodel Marka {\n  id      String  @id @default(uuid())\n  ad      String  @unique\n  slug    String  @unique\n  logoUrl String?\n  aktif   Boolean @default(true)\n\n  sira Int @default(0) // Slider s\u0131ralamas\u0131 i\xE7in\n\n  urunler Urun[]\n\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@map("markalar")\n}\n\nmodel Kategori {\n  id    String  @id @default(uuid())\n  ad    String\n  slug  String  @unique // SEO i\xE7in\n  resim String? // Kategori resmi\n  sira  Int     @default(0)\n  aktif Boolean @default(true)\n\n  ustKategoriId  String?\n  ustKategori    Kategori?  @relation("KategoriHiyerarsisi", fields: [ustKategoriId], references: [id])\n  altKategoriler Kategori[] @relation("KategoriHiyerarsisi")\n\n  urunler Urun[]\n\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@map("kategoriler")\n}\n\nmodel Siparis {\n  id              String    @id @default(uuid())\n  siparisNumarasi String    @unique\n  takipTokeni     String?   @unique // Takip linkleri i\xE7in g\xFCvenli token (UUID)\n  toplamTutar     Float\n  kargoUcreti     Float     @default(0)\n  kargoTakipNo    String? // Kargo Takip Numaras\u0131\n  kargoFirmasi    String? // Kargo Firmas\u0131 (Aras, Yurtici vs.)\n  durum           String    @default("BEKLEMEDE") // BEKLEMEDE, HAZIRLANIYOR, KARGOLANDI vb.\n  faturaDurumu    String    @default("DUZENLENMEDI") // DUZENLENMEDI, DUZENLENDI, ODENDI\n  faturaNo        String? // E-Fatura Numaras\u0131\n  faturaTarihi    DateTime? // Fatura Kesim Tarihi\n\n  // M\xFC\u015Fteri Bilgileri\n  eposta    String\n  ad        String\n  soyad     String\n  telefon   String\n  adres     String\n  sehir     String\n  ilce      String\n  postaKodu String\n  ulke      String @default("T\xFCrkiye")\n\n  // Kurumsal Fatura Bilgileri\n  kurumsalMi    Boolean @default(false)\n  sirketAdi     String?\n  vergiDairesi  String?\n  vergiNumarasi String?\n\n  // \xD6deme (Param POS)\n  odemeId     String? @unique\n  odemeTokeni String? @unique\n  odemeDurumu String? @default("INIT")\n\n  teslimTarihi DateTime? // 14 g\xFCn iade s\xFCresi kontrol\xFC i\xE7in\n\n  kalemler   SiparisKalemi[]\n  gecmis     SiparisGecmisi[]\n  iadeTalebi IadeTalebi?\n\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@index([eposta]) // Admin sorgular\u0131 i\xE7in\n  @@index([siparisNumarasi])\n  @@index([takipTokeni])\n  @@map("siparisler")\n}\n\nmodel IadeTalebi {\n  id        String  @id @default(uuid())\n  siparisId String  @unique\n  siparis   Siparis @relation(fields: [siparisId], references: [id])\n\n  talepTipi String @map("iadeTipi") // KUSURLU_URUN, KEYFI_IADE vb.\n  aciklama  String @map("sebepAciklamasi")\n\n  fotografUrls String  @default("[]") // JSON Array string: ["url1", "url2"]\n  resimUrl     String? // Kan\u0131t resmi\n\n  // Admin Fields\n  manuelIadeKodu String?\n  kargoFirmasi   String?\n  adminNotu      String?\n\n  durum String @default("ONAY_BEKLENIYOR") // ONAY_BEKLENIYOR, ONAYLANDI, REDDEDILDI vb.\n\n  olusturulmaTarihi DateTime @default(now())\n  guncellenmeTarihi DateTime @updatedAt\n\n  @@map("iade_talepleri")\n}\n\nmodel SiparisKalemi {\n  id        String  @id @default(uuid())\n  siparisId String\n  siparis   Siparis @relation(fields: [siparisId], references: [id])\n\n  urunId                String?\n  urun                  Urun?   @relation(fields: [urunId], references: [id])\n  secilenRenk           String?\n  secilenBoyut          String?\n  iadeyeUygunMuSnapshot Boolean @default(true)\n  adet                  Int\n  fiyat                 Float\n  urunAdSnapshot        String\n  urunFiyatSnapshot     Float\n  toplamFiyat           Float\n\n  @@map("siparis_kalemleri")\n}\n\nmodel SiparisGecmisi {\n  id         String   @id @default(uuid())\n  siparisId  String\n  siparis    Siparis  @relation(fields: [siparisId], references: [id])\n  eskiDurum  String?\n  yeniDurum  String\n  not        String?\n  islemYapan String   @default("SYSTEM")\n  tarih      DateTime @default(now())\n\n  @@map("siparis_gecmisi")\n}\n\nmodel SistemAyarlari {\n  id                    String   @id @default("global-settings")\n  kargoAgirlikCarpani   Float    @default(0) @map("kargoDesiCarpani")\n  ambarEsikAgirlik      Int      @default(0) @map("ambarEsikDesi")\n  ucretsizKargoAltLimit Float?   @default(0)\n  kargoFiyatListesi     String? // JSON string of maxWeight/price pairs\n  maintenanceMode       Boolean  @default(false)\n  updatedAt             DateTime @updatedAt\n\n  @@map("sistem_ayarlari")\n}\n',
      "inlineSchemaHash": "2e0afa17b992a10eaf9a08865bb5378afc71a9e4e2d26cb3dd8ff6f5928c2794",
      "copyEngine": true
    };
    config2.dirname = "/";
    config2.runtimeDataModel = JSON.parse('{"models":{"Urun":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"ad","kind":"scalar","type":"String"},{"name":"fiyat","kind":"scalar","type":"Float"},{"name":"indirimliFiyat","kind":"scalar","type":"Float"},{"name":"renkSecenekleri","kind":"scalar","type":"String"},{"name":"kartelaIcCephe","kind":"scalar","type":"Boolean"},{"name":"kartelaDisCephe","kind":"scalar","type":"Boolean"},{"name":"iadeImkaniVar","kind":"scalar","type":"Boolean"},{"name":"agirlik","kind":"scalar","type":"Float","dbName":"desi"},{"name":"aciklama","kind":"scalar","type":"String"},{"name":"resimUrl","kind":"scalar","type":"String"},{"name":"aktif","kind":"scalar","type":"Boolean"},{"name":"oneCikan","kind":"scalar","type":"Boolean"},{"name":"firsatUrunu","kind":"scalar","type":"Boolean"},{"name":"yeniUrun","kind":"scalar","type":"Boolean"},{"name":"cokSatanlar","kind":"scalar","type":"Boolean"},{"name":"goruntulemeSayisi","kind":"scalar","type":"Int"},{"name":"satisAdedi","kind":"scalar","type":"Int"},{"name":"stokAdedi","kind":"scalar","type":"Int"},{"name":"varyantBasligi","kind":"scalar","type":"String","dbName":"varyant_basligi"},{"name":"kategoriId","kind":"scalar","type":"String"},{"name":"kategori","kind":"object","type":"Kategori","relationName":"KategoriToUrun"},{"name":"markaId","kind":"scalar","type":"String"},{"name":"marka","kind":"object","type":"Marka","relationName":"MarkaToUrun"},{"name":"resimler","kind":"object","type":"UrunResim","relationName":"UrunToUrunResim"},{"name":"siparisKalemleri","kind":"object","type":"SiparisKalemi","relationName":"SiparisKalemiToUrun"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"urunler"},"UrunResim":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"url","kind":"scalar","type":"String"},{"name":"sira","kind":"scalar","type":"Int"},{"name":"urunId","kind":"scalar","type":"String"},{"name":"urun","kind":"object","type":"Urun","relationName":"UrunToUrunResim"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"urun_resimleri"},"RenkKartelasi":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"section","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"hex","kind":"scalar","type":"String"},{"name":"rgb","kind":"scalar","type":"String"},{"name":"sourceFile","kind":"scalar","type":"String"},{"name":"aktif","kind":"scalar","type":"Boolean"},{"name":"sira","kind":"scalar","type":"Int"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"renk_kartelasi"},"Marka":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"ad","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"aktif","kind":"scalar","type":"Boolean"},{"name":"sira","kind":"scalar","type":"Int"},{"name":"urunler","kind":"object","type":"Urun","relationName":"MarkaToUrun"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"markalar"},"Kategori":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"ad","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"resim","kind":"scalar","type":"String"},{"name":"sira","kind":"scalar","type":"Int"},{"name":"aktif","kind":"scalar","type":"Boolean"},{"name":"ustKategoriId","kind":"scalar","type":"String"},{"name":"ustKategori","kind":"object","type":"Kategori","relationName":"KategoriHiyerarsisi"},{"name":"altKategoriler","kind":"object","type":"Kategori","relationName":"KategoriHiyerarsisi"},{"name":"urunler","kind":"object","type":"Urun","relationName":"KategoriToUrun"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"kategoriler"},"Siparis":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"siparisNumarasi","kind":"scalar","type":"String"},{"name":"takipTokeni","kind":"scalar","type":"String"},{"name":"toplamTutar","kind":"scalar","type":"Float"},{"name":"kargoUcreti","kind":"scalar","type":"Float"},{"name":"kargoTakipNo","kind":"scalar","type":"String"},{"name":"kargoFirmasi","kind":"scalar","type":"String"},{"name":"durum","kind":"scalar","type":"String"},{"name":"faturaDurumu","kind":"scalar","type":"String"},{"name":"faturaNo","kind":"scalar","type":"String"},{"name":"faturaTarihi","kind":"scalar","type":"DateTime"},{"name":"eposta","kind":"scalar","type":"String"},{"name":"ad","kind":"scalar","type":"String"},{"name":"soyad","kind":"scalar","type":"String"},{"name":"telefon","kind":"scalar","type":"String"},{"name":"adres","kind":"scalar","type":"String"},{"name":"sehir","kind":"scalar","type":"String"},{"name":"ilce","kind":"scalar","type":"String"},{"name":"postaKodu","kind":"scalar","type":"String"},{"name":"ulke","kind":"scalar","type":"String"},{"name":"kurumsalMi","kind":"scalar","type":"Boolean"},{"name":"sirketAdi","kind":"scalar","type":"String"},{"name":"vergiDairesi","kind":"scalar","type":"String"},{"name":"vergiNumarasi","kind":"scalar","type":"String"},{"name":"odemeId","kind":"scalar","type":"String"},{"name":"odemeTokeni","kind":"scalar","type":"String"},{"name":"odemeDurumu","kind":"scalar","type":"String"},{"name":"teslimTarihi","kind":"scalar","type":"DateTime"},{"name":"kalemler","kind":"object","type":"SiparisKalemi","relationName":"SiparisToSiparisKalemi"},{"name":"gecmis","kind":"object","type":"SiparisGecmisi","relationName":"SiparisToSiparisGecmisi"},{"name":"iadeTalebi","kind":"object","type":"IadeTalebi","relationName":"IadeTalebiToSiparis"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"siparisler"},"IadeTalebi":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"siparisId","kind":"scalar","type":"String"},{"name":"siparis","kind":"object","type":"Siparis","relationName":"IadeTalebiToSiparis"},{"name":"talepTipi","kind":"scalar","type":"String","dbName":"iadeTipi"},{"name":"aciklama","kind":"scalar","type":"String","dbName":"sebepAciklamasi"},{"name":"fotografUrls","kind":"scalar","type":"String"},{"name":"resimUrl","kind":"scalar","type":"String"},{"name":"manuelIadeKodu","kind":"scalar","type":"String"},{"name":"kargoFirmasi","kind":"scalar","type":"String"},{"name":"adminNotu","kind":"scalar","type":"String"},{"name":"durum","kind":"scalar","type":"String"},{"name":"olusturulmaTarihi","kind":"scalar","type":"DateTime"},{"name":"guncellenmeTarihi","kind":"scalar","type":"DateTime"}],"dbName":"iade_talepleri"},"SiparisKalemi":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"siparisId","kind":"scalar","type":"String"},{"name":"siparis","kind":"object","type":"Siparis","relationName":"SiparisToSiparisKalemi"},{"name":"urunId","kind":"scalar","type":"String"},{"name":"urun","kind":"object","type":"Urun","relationName":"SiparisKalemiToUrun"},{"name":"secilenRenk","kind":"scalar","type":"String"},{"name":"secilenBoyut","kind":"scalar","type":"String"},{"name":"iadeyeUygunMuSnapshot","kind":"scalar","type":"Boolean"},{"name":"adet","kind":"scalar","type":"Int"},{"name":"fiyat","kind":"scalar","type":"Float"},{"name":"urunAdSnapshot","kind":"scalar","type":"String"},{"name":"urunFiyatSnapshot","kind":"scalar","type":"Float"},{"name":"toplamFiyat","kind":"scalar","type":"Float"}],"dbName":"siparis_kalemleri"},"SiparisGecmisi":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"siparisId","kind":"scalar","type":"String"},{"name":"siparis","kind":"object","type":"Siparis","relationName":"SiparisToSiparisGecmisi"},{"name":"eskiDurum","kind":"scalar","type":"String"},{"name":"yeniDurum","kind":"scalar","type":"String"},{"name":"not","kind":"scalar","type":"String"},{"name":"islemYapan","kind":"scalar","type":"String"},{"name":"tarih","kind":"scalar","type":"DateTime"}],"dbName":"siparis_gecmisi"},"SistemAyarlari":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"kargoAgirlikCarpani","kind":"scalar","type":"Float","dbName":"kargoDesiCarpani"},{"name":"ambarEsikAgirlik","kind":"scalar","type":"Int","dbName":"ambarEsikDesi"},{"name":"ucretsizKargoAltLimit","kind":"scalar","type":"Float"},{"name":"kargoFiyatListesi","kind":"scalar","type":"String"},{"name":"maintenanceMode","kind":"scalar","type":"Boolean"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"sistem_ayarlari"}},"enums":{},"types":{}}');
    defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
    config2.engineWasm = {
      getRuntime: /* @__PURE__ */ __name(() => require_query_engine_bg(), "getRuntime"),
      getQueryEngineWasmModule: /* @__PURE__ */ __name(async () => {
        const loader = (await Promise.resolve().then(() => (init_wasm_worker_loader(), wasm_worker_loader_exports))).default;
        const engine = (await loader).default;
        return engine;
      }, "getQueryEngineWasmModule")
    };
    config2.injectableEdgeEnv = () => ({
      parsed: {}
    });
    if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
      Debug3.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
    }
    var PrismaClient2 = getPrismaClient2(config2);
    exports.PrismaClient = PrismaClient2;
    Object.assign(exports, Prisma2);
  }
});

// node_modules/.prisma/client/default.js
var require_default = __commonJS({
  "node_modules/.prisma/client/default.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    module.exports = { ...require_wasm2() };
  }
});

// node_modules/@prisma/client/default.js
var require_default2 = __commonJS({
  "node_modules/@prisma/client/default.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    module.exports = {
      ...require_default()
    };
  }
});

// node_modules/@prisma/debug/dist/index.js
var require_dist = __commonJS({
  "node_modules/@prisma/debug/dist/index.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name2 in all)
        __defProp2(target, name2, { get: all[name2], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var src_exports = {};
    __export2(src_exports, {
      Debug: /* @__PURE__ */ __name(() => Debug3, "Debug"),
      clearLogs: /* @__PURE__ */ __name(() => clearLogs, "clearLogs"),
      default: /* @__PURE__ */ __name(() => src_default, "default"),
      getLogs: /* @__PURE__ */ __name(() => getLogs, "getLogs")
    });
    module.exports = __toCommonJS(src_exports);
    var colors_exports = {};
    __export2(colors_exports, {
      $: /* @__PURE__ */ __name(() => $2, "$"),
      bgBlack: /* @__PURE__ */ __name(() => bgBlack2, "bgBlack"),
      bgBlue: /* @__PURE__ */ __name(() => bgBlue2, "bgBlue"),
      bgCyan: /* @__PURE__ */ __name(() => bgCyan2, "bgCyan"),
      bgGreen: /* @__PURE__ */ __name(() => bgGreen2, "bgGreen"),
      bgMagenta: /* @__PURE__ */ __name(() => bgMagenta2, "bgMagenta"),
      bgRed: /* @__PURE__ */ __name(() => bgRed2, "bgRed"),
      bgWhite: /* @__PURE__ */ __name(() => bgWhite2, "bgWhite"),
      bgYellow: /* @__PURE__ */ __name(() => bgYellow2, "bgYellow"),
      black: /* @__PURE__ */ __name(() => black2, "black"),
      blue: /* @__PURE__ */ __name(() => blue2, "blue"),
      bold: /* @__PURE__ */ __name(() => bold2, "bold"),
      cyan: /* @__PURE__ */ __name(() => cyan2, "cyan"),
      dim: /* @__PURE__ */ __name(() => dim2, "dim"),
      gray: /* @__PURE__ */ __name(() => gray2, "gray"),
      green: /* @__PURE__ */ __name(() => green2, "green"),
      grey: /* @__PURE__ */ __name(() => grey2, "grey"),
      hidden: /* @__PURE__ */ __name(() => hidden2, "hidden"),
      inverse: /* @__PURE__ */ __name(() => inverse2, "inverse"),
      italic: /* @__PURE__ */ __name(() => italic2, "italic"),
      magenta: /* @__PURE__ */ __name(() => magenta2, "magenta"),
      red: /* @__PURE__ */ __name(() => red2, "red"),
      reset: /* @__PURE__ */ __name(() => reset2, "reset"),
      strikethrough: /* @__PURE__ */ __name(() => strikethrough2, "strikethrough"),
      underline: /* @__PURE__ */ __name(() => underline2, "underline"),
      white: /* @__PURE__ */ __name(() => white2, "white"),
      yellow: /* @__PURE__ */ __name(() => yellow2, "yellow")
    });
    var FORCE_COLOR2;
    var NODE_DISABLE_COLORS2;
    var NO_COLOR2;
    var TERM2;
    var isTTY2 = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR: FORCE_COLOR2, NODE_DISABLE_COLORS: NODE_DISABLE_COLORS2, NO_COLOR: NO_COLOR2, TERM: TERM2 } = process.env || {});
      isTTY2 = process.stdout && process.stdout.isTTY;
    }
    var $2 = {
      enabled: !NODE_DISABLE_COLORS2 && NO_COLOR2 == null && TERM2 !== "dumb" && (FORCE_COLOR2 != null && FORCE_COLOR2 !== "0" || isTTY2)
    };
    function init2(x, y) {
      let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
      let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
      return function(txt) {
        if (!$2.enabled || txt == null) return txt;
        return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
      };
    }
    __name(init2, "init");
    var reset2 = init2(0, 0);
    var bold2 = init2(1, 22);
    var dim2 = init2(2, 22);
    var italic2 = init2(3, 23);
    var underline2 = init2(4, 24);
    var inverse2 = init2(7, 27);
    var hidden2 = init2(8, 28);
    var strikethrough2 = init2(9, 29);
    var black2 = init2(30, 39);
    var red2 = init2(31, 39);
    var green2 = init2(32, 39);
    var yellow2 = init2(33, 39);
    var blue2 = init2(34, 39);
    var magenta2 = init2(35, 39);
    var cyan2 = init2(36, 39);
    var white2 = init2(37, 39);
    var gray2 = init2(90, 39);
    var grey2 = init2(90, 39);
    var bgBlack2 = init2(40, 49);
    var bgRed2 = init2(41, 49);
    var bgGreen2 = init2(42, 49);
    var bgYellow2 = init2(43, 49);
    var bgBlue2 = init2(44, 49);
    var bgMagenta2 = init2(45, 49);
    var bgCyan2 = init2(46, 49);
    var bgWhite2 = init2(47, 49);
    var MAX_ARGS_HISTORY = 100;
    var COLORS = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var argsHistory = [];
    var lastTimestamp = Date.now();
    var lastColor = 0;
    var processEnv = typeof process !== "undefined" ? process.env : {};
    globalThis.DEBUG ??= processEnv.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
    var topProps = {
      enable(namespace) {
        if (typeof namespace === "string") {
          globalThis.DEBUG = namespace;
        }
      },
      disable() {
        const prev = globalThis.DEBUG;
        globalThis.DEBUG = "";
        return prev;
      },
      // this is the core logic to check if logging should happen or not
      enabled(namespace) {
        const listenedNamespaces = globalThis.DEBUG.split(",").map((s) => {
          return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        });
        const isListened = listenedNamespaces.some((listenedNamespace) => {
          if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
          return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
        });
        const isExcluded = listenedNamespaces.some((listenedNamespace) => {
          if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
          return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
        });
        return isListened && !isExcluded;
      },
      log: /* @__PURE__ */ __name((...args) => {
        const [namespace, format, ...rest] = args;
        const logWithFormatting = console.warn ?? console.log;
        logWithFormatting(`${namespace} ${format}`, ...rest);
      }, "log"),
      formatters: {}
      // not implemented
    };
    function debugCreate(namespace) {
      const instanceProps = {
        color: COLORS[lastColor++ % COLORS.length],
        enabled: topProps.enabled(namespace),
        namespace,
        log: topProps.log,
        extend: /* @__PURE__ */ __name(() => {
        }, "extend")
        // not implemented
      };
      const debugCall = /* @__PURE__ */ __name((...args) => {
        const { enabled, namespace: namespace2, color, log } = instanceProps;
        if (args.length !== 0) {
          argsHistory.push([namespace2, ...args]);
        }
        if (argsHistory.length > MAX_ARGS_HISTORY) {
          argsHistory.shift();
        }
        if (topProps.enabled(namespace2) || enabled) {
          const stringArgs = args.map((arg) => {
            if (typeof arg === "string") {
              return arg;
            }
            return safeStringify(arg);
          });
          const ms = `+${Date.now() - lastTimestamp}ms`;
          lastTimestamp = Date.now();
          if (globalThis.DEBUG_COLORS) {
            log(colors_exports[color](bold2(namespace2)), ...stringArgs, colors_exports[color](ms));
          } else {
            log(namespace2, ...stringArgs, ms);
          }
        }
      }, "debugCall");
      return new Proxy(debugCall, {
        get: /* @__PURE__ */ __name((_, prop) => instanceProps[prop], "get"),
        set: /* @__PURE__ */ __name((_, prop, value) => instanceProps[prop] = value, "set")
      });
    }
    __name(debugCreate, "debugCreate");
    var Debug3 = new Proxy(debugCreate, {
      get: /* @__PURE__ */ __name((_, prop) => topProps[prop], "get"),
      set: /* @__PURE__ */ __name((_, prop, value) => topProps[prop] = value, "set")
    });
    function safeStringify(value, indent = 2) {
      const cache = /* @__PURE__ */ new Set();
      return JSON.stringify(
        value,
        (key, value2) => {
          if (typeof value2 === "object" && value2 !== null) {
            if (cache.has(value2)) {
              return `[Circular *]`;
            }
            cache.add(value2);
          } else if (typeof value2 === "bigint") {
            return value2.toString();
          }
          return value2;
        },
        indent
      );
    }
    __name(safeStringify, "safeStringify");
    function getLogs(numChars = 7500) {
      const logs = argsHistory.map(([namespace, ...args]) => {
        return `${namespace} ${args.map((arg) => {
          if (typeof arg === "string") {
            return arg;
          } else {
            return JSON.stringify(arg);
          }
        }).join(" ")}`;
      }).join("\n");
      if (logs.length < numChars) {
        return logs;
      }
      return logs.slice(-numChars);
    }
    __name(getLogs, "getLogs");
    function clearLogs() {
      argsHistory.length = 0;
    }
    __name(clearLogs, "clearLogs");
    var src_default = Debug3;
  }
});

// .wrangler/tmp/bundle-2Kfb2C/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-2Kfb2C/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/app.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/hono.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/hono-base.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/compose.js
init_checked_fetch();
init_modules_watch_stub();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err2) {
          if (err2 instanceof Error && onError) {
            context.error = err2;
            res = await onError(err2, context);
            isError = true;
          } else {
            throw err2;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/context.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/request.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/http-exception.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/request/constants.js
init_checked_fetch();
init_modules_watch_stub();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
init_checked_fetch();
init_modules_watch_stub();
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
init_checked_fetch();
init_modules_watch_stub();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name2 = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name2 = _decodeURI(name2);
    }
    keyIndex = nextKeyIndex;
    if (name2 === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name2] && Array.isArray(results[name2]))) {
        results[name2] = [];
      }
      ;
      results[name2].push(value);
    } else {
      results[name2] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name2) {
    if (name2) {
      return this.raw.headers.get(name2) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw3 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw3[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
init_checked_fetch();
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw2 = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw2(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init2) => new Response(body, init2), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name2, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name2);
    } else if (options?.append) {
      headers.append(name2, value);
    } else {
      headers.set(name2, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
init_checked_fetch();
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
init_checked_fetch();
init_modules_watch_stub();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err2, c) => {
  if ("getResponse" in err2) {
    const res = err2.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err2);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err2, c) {
    if (err2 instanceof Error) {
      return this.errorHandler(err2, c);
    }
    throw err2;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err2) {
        return this.#handleError(err2, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err2) => this.#handleError(err2, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err2) {
        return this.#handleError(err2, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/matcher.js
init_checked_fetch();
init_modules_watch_stub();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name2 = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name2 && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name2 !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name2 !== "") {
        paramMap.push([name2, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
init_checked_fetch();
init_modules_watch_stub();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/smart-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/smart-router/router.js
init_checked_fetch();
init_modules_watch_stub();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init2) {
    this.#routers = init2.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router11 = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router11.add(...routes[i2]);
        }
        res = router11.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router11.match.bind(router11);
      this.#routers = [router11];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name2, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name2] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name2] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
init_checked_fetch();
init_modules_watch_stub();
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/hono/dist/middleware/jwt/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/middleware/jwt/jwt.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/helper/cookie/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/cookie.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/jwt/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/jwt/jwt.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/encode.js
init_checked_fetch();
init_modules_watch_stub();
var decodeBase64Url = /* @__PURE__ */ __name((str) => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
}, "decodeBase64Url");
var encodeBase64Url = /* @__PURE__ */ __name((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
var encodeBase64 = /* @__PURE__ */ __name((buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}, "encodeBase64");
var decodeBase64 = /* @__PURE__ */ __name((str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
}, "decodeBase64");

// node_modules/hono/dist/utils/jwt/jwa.js
init_checked_fetch();
init_modules_watch_stub();
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});

// node_modules/hono/dist/utils/jwt/jws.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/helper/adapter/index.js
init_checked_fetch();
init_modules_watch_stub();
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = /* @__PURE__ */ __name(() => {
  const global2 = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && true;
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global2?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global2?.fastly !== void 0) {
    return "fastly";
  }
  if (global2?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}, "getRuntimeKey");
var checkUserAgentEquals = /* @__PURE__ */ __name((platform) => {
  const userAgent = "Cloudflare-Workers";
  return userAgent.startsWith(platform);
}, "checkUserAgentEquals");

// node_modules/hono/dist/utils/jwt/types.js
init_checked_fetch();
init_modules_watch_stub();
var JwtAlgorithmNotImplemented = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotImplemented");
  }
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtAlgorithmRequired = class extends Error {
  static {
    __name(this, "JwtAlgorithmRequired");
  }
  constructor() {
    super('JWT verification requires "alg" option to be specified');
    this.name = "JwtAlgorithmRequired";
  }
};
var JwtAlgorithmMismatch = class extends Error {
  static {
    __name(this, "JwtAlgorithmMismatch");
  }
  constructor(expected, actual) {
    super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`);
    this.name = "JwtAlgorithmMismatch";
  }
};
var JwtTokenInvalid = class extends Error {
  static {
    __name(this, "JwtTokenInvalid");
  }
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  static {
    __name(this, "JwtTokenNotBefore");
  }
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  static {
    __name(this, "JwtTokenExpired");
  }
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  static {
    __name(this, "JwtTokenIssuedAt");
  }
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  static {
    __name(this, "JwtTokenIssuer");
  }
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  static {
    __name(this, "JwtHeaderInvalid");
  }
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  static {
    __name(this, "JwtHeaderRequiresKid");
  }
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtSymmetricAlgorithmNotAllowed = class extends Error {
  static {
    __name(this, "JwtSymmetricAlgorithmNotAllowed");
  }
  constructor(alg) {
    super(`symmetric algorithm "${alg}" is not allowed for JWK verification`);
    this.name = "JwtSymmetricAlgorithmNotAllowed";
  }
};
var JwtAlgorithmNotAllowed = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotAllowed");
  }
  constructor(alg, allowedAlgorithms) {
    super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(", ")}]`);
    this.name = "JwtAlgorithmNotAllowed";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  static {
    __name(this, "JwtTokenSignatureMismatched");
  }
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var JwtPayloadRequiresAud = class extends Error {
  static {
    __name(this, "JwtPayloadRequiresAud");
  }
  constructor(payload) {
    super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
    this.name = "JwtPayloadRequiresAud";
  }
};
var JwtTokenAudience = class extends Error {
  static {
    __name(this, "JwtTokenAudience");
  }
  constructor(expected, aud) {
    super(
      `expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`
    );
    this.name = "JwtTokenAudience";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});

// node_modules/hono/dist/utils/jwt/utf8.js
init_checked_fetch();
init_modules_watch_stub();
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();

// node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
__name(signing, "signing");
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
__name(verifying, "verifying");
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*?-+/g, "").replace(/\s/g, ""));
}
__name(pemToBinary, "pemToBinary");
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPrivateKey, "importPrivateKey");
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPublicKey, "importPublicKey");
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x, y } = jwk;
  return { kty, alg, e, n, crv, x, y, key_ops: [CryptoKeyUsage.Verify] };
}
__name(exportPublicJwkFrom, "exportPublicJwkFrom");
function getKeyAlgorithm(name2) {
  switch (name2) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
        // 256 >> 3
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
        // 384 >> 3
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
        // 512 >> 3,
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name2);
  }
}
__name(getKeyAlgorithm, "getKeyAlgorithm");
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
__name(isCryptoKey, "isCryptoKey");

// node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = /* @__PURE__ */ __name((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
var encodeSignaturePart = /* @__PURE__ */ __name((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
var decodeJwtPart = /* @__PURE__ */ __name((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
__name(isTokenHeader, "isTokenHeader");
var sign = /* @__PURE__ */ __name(async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
}, "sign");
var verify = /* @__PURE__ */ __name(async (token, publicKey, algOrOptions) => {
  if (!algOrOptions) {
    throw new JwtAlgorithmRequired();
  }
  const {
    alg,
    iss,
    nbf = true,
    exp = true,
    iat = true,
    aud
  } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions;
  if (!alg) {
    throw new JwtAlgorithmRequired();
  }
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (header.alg !== alg) {
    throw new JwtAlgorithmMismatch(alg, header.alg);
  }
  const now = Math.floor(Date.now() / 1e3);
  if (nbf && payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number" || !Number.isFinite(payload.nbf) || payload.nbf > now) {
      throw new JwtTokenNotBefore(token);
    }
  }
  if (exp && payload.exp !== void 0) {
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= now) {
      throw new JwtTokenExpired(token);
    }
  }
  if (iat && payload.iat !== void 0) {
    if (typeof payload.iat !== "number" || !Number.isFinite(payload.iat) || now < payload.iat) {
      throw new JwtTokenIssuedAt(now, payload.iat);
    }
  }
  if (iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(iss, null);
    }
    if (typeof iss === "string" && payload.iss !== iss) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
    if (iss instanceof RegExp && !iss.test(payload.iss)) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
  }
  if (aud) {
    if (!payload.aud) {
      throw new JwtPayloadRequiresAud(payload);
    }
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const matched = audiences.some(
      (payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud)
    );
    if (!matched) {
      throw new JwtTokenAudience(aud, payload.aud);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
}, "verify");
var symmetricAlgorithms = [
  AlgorithmTypes.HS256,
  AlgorithmTypes.HS384,
  AlgorithmTypes.HS512
];
var verifyWithJwks = /* @__PURE__ */ __name(async (token, options, init2) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (symmetricAlgorithms.includes(header.alg)) {
    throw new JwtSymmetricAlgorithmNotAllowed(header.alg);
  }
  if (!options.allowedAlgorithms.includes(header.alg)) {
    throw new JwtAlgorithmNotAllowed(header.alg, options.allowedAlgorithms);
  }
  let verifyKeys = options.keys ? [...options.keys] : void 0;
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init2);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    verifyKeys ??= [];
    verifyKeys.push(...data.keys);
  } else if (!verifyKeys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = verifyKeys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  if (matchingKey.alg && matchingKey.alg !== header.alg) {
    throw new JwtAlgorithmMismatch(matchingKey.alg, header.alg);
  }
  return await verify(token, matchingKey, {
    alg: header.alg,
    ...verifyOpts
  });
}, "verifyWithJwks");
var decode = /* @__PURE__ */ __name((token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decode");
var decodeHeader = /* @__PURE__ */ __name((token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  try {
    return decodeJwtPart(parts[0]);
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decodeHeader");

// node_modules/hono/dist/utils/jwt/index.js
var Jwt = { sign, verify, decode, verifyWithJwks };

// node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;

// src/config.js
init_checked_fetch();
init_modules_watch_stub();
var config = {
  port: 8787,
  corsOrigin: "*",
  nodeEnv: "development",
  param: {
    clientCode: "",
    clientUsername: "",
    clientPassword: "",
    guid: "",
    baseUrl: "https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl",
    callbackUrl: "http://localhost:8787"
  },
  brevo: {
    apiKey: "",
    smtp: {
      host: "smtp-relay.brevo.com",
      port: 587,
      user: "",
      pass: "",
      sender: "E-Market <siparis@e-market-domain.com>",
      replyTo: "bilgi@e-market-domain.com"
    }
  },
  clientUrl: "http://localhost:3000",
  orderNotificationEmail: "bilgi@e-market-domain.com",
  cdnUrl: "https://cdn.e-market-domain.com",
  googleMerchantToken: "",
  adminJwtSecret: "secure-admin-token-secret-12345"
};
var currentEnv = null;
function initConfig(env) {
  currentEnv = env;
  config.port = env.PORT || 8787;
  config.corsOrigin = env.CORS_ORIGIN || "*";
  config.nodeEnv = env.NODE_ENV || "development";
  config.clientUrl = env.CLIENT_URL || "http://localhost:3000";
  config.orderNotificationEmail = env.ORDER_NOTIFICATION_EMAIL || "bilgi@e-market-domain.com";
  config.cdnUrl = env.CDN_URL || "https://cdn.e-market-domain.com";
  config.googleMerchantToken = env.GOOGLE_MERCHANT_TOKEN || "";
  config.adminJwtSecret = env.ADMIN_JWT_SECRET || "secure-admin-token-secret-12345";
  Object.assign(config.param, {
    clientCode: env.PARAM_CLIENT_CODE || "",
    clientUsername: env.PARAM_CLIENT_USERNAME || "",
    clientPassword: env.PARAM_CLIENT_PASSWORD || "",
    guid: env.PARAM_GUID || "",
    baseUrl: env.PARAM_BASE_URL || "https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl",
    callbackUrl: env.API_URL || "http://localhost:8787"
  });
  Object.assign(config.brevo, {
    apiKey: env.BREVO_API_KEY || ""
  });
  Object.assign(config.brevo.smtp, {
    host: env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(env.SMTP_PORT) || 587,
    user: env.SMTP_USER || "",
    pass: env.SMTP_PASS || "",
    sender: env.SMTP_SENDER || "E-Market <siparis@e-market-domain.com>",
    replyTo: env.SMTP_REPLY_TO || "bilgi@e-market-domain.com"
  });
}
__name(initConfig, "initConfig");

// src/prisma.js
init_checked_fetch();
init_modules_watch_stub();
var import_client = __toESM(require_default2(), 1);

// node_modules/@prisma/adapter-d1/dist/index.mjs
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@prisma/driver-adapter-utils/dist/index.mjs
init_checked_fetch();
init_modules_watch_stub();
var import_debug = __toESM(require_dist(), 1);
function ok(value) {
  return {
    ok: true,
    value,
    map(fn) {
      return ok(fn(value));
    },
    flatMap(fn) {
      return fn(value);
    }
  };
}
__name(ok, "ok");
function err(error) {
  return {
    ok: false,
    error,
    map() {
      return err(error);
    },
    flatMap() {
      return err(error);
    }
  };
}
__name(err, "err");
var ColumnTypeEnum = {
  // Scalars
  Int32: 0,
  Int64: 1,
  Float: 2,
  Double: 3,
  Numeric: 4,
  Boolean: 5,
  Character: 6,
  Text: 7,
  Date: 8,
  Time: 9,
  DateTime: 10,
  Json: 11,
  Enum: 12,
  Bytes: 13,
  Set: 14,
  Uuid: 15,
  // Arrays
  Int32Array: 64,
  Int64Array: 65,
  FloatArray: 66,
  DoubleArray: 67,
  NumericArray: 68,
  BooleanArray: 69,
  CharacterArray: 70,
  TextArray: 71,
  DateArray: 72,
  TimeArray: 73,
  DateTimeArray: 74,
  JsonArray: 75,
  EnumArray: 76,
  BytesArray: 77,
  UuidArray: 78,
  // Custom
  UnknownNumber: 128
};

// node_modules/@prisma/adapter-d1/dist/index.mjs
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof process !== "undefined") {
  ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
  isTTY = process.stdout && process.stdout.isTTY;
}
var $ = {
  enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
  let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
  return function(txt) {
    if (!$.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
__name(init, "init");
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
var name = "@prisma/adapter-d1";
function getColumnTypes(columnNames, rows) {
  const columnTypes = [];
  columnLoop: for (let columnIndex = 0; columnIndex < columnNames.length; columnIndex++) {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const candidateValue = rows[rowIndex][columnIndex];
      if (candidateValue !== null) {
        columnTypes[columnIndex] = inferColumnType(candidateValue);
        continue columnLoop;
      }
    }
    columnTypes[columnIndex] = ColumnTypeEnum.Int32;
  }
  return columnTypes;
}
__name(getColumnTypes, "getColumnTypes");
function inferColumnType(value) {
  switch (typeof value) {
    case "string":
      return inferStringType(value);
    case "number":
      return inferNumberType(value);
    case "object":
      return inferObjectType(value);
    default:
      throw new UnexpectedTypeError(value);
  }
}
__name(inferColumnType, "inferColumnType");
var isoDateRegex = new RegExp(
  /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/
);
var sqliteDateRegex = /^\d{4}-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d$/;
function isISODate(str) {
  return isoDateRegex.test(str) || sqliteDateRegex.test(str);
}
__name(isISODate, "isISODate");
function inferStringType(value) {
  if (isISODate(value)) {
    return ColumnTypeEnum.DateTime;
  }
  return ColumnTypeEnum.Text;
}
__name(inferStringType, "inferStringType");
function inferNumberType(_) {
  return ColumnTypeEnum.Double;
}
__name(inferNumberType, "inferNumberType");
function inferObjectType(value) {
  if (value instanceof Array) {
    return ColumnTypeEnum.Bytes;
  }
  throw new UnexpectedTypeError(value);
}
__name(inferObjectType, "inferObjectType");
var UnexpectedTypeError = class extends Error {
  static {
    __name(this, "UnexpectedTypeError");
  }
  constructor(value) {
    const type = typeof value;
    const repr = type === "object" ? JSON.stringify(value) : String(value);
    super(`unexpected value of type ${type}: ${repr}`);
    this.name = "UnexpectedTypeError";
  }
};
function mapRow(result, columnTypes) {
  for (let i = 0; i < result.length; i++) {
    const value = result[i];
    if (value instanceof ArrayBuffer) {
      result[i] = Array.from(new Uint8Array(value));
      continue;
    }
    if (typeof value === "number" && (columnTypes[i] === ColumnTypeEnum.Int32 || columnTypes[i] === ColumnTypeEnum.Int64) && !Number.isInteger(value)) {
      result[i] = Math.trunc(value);
      continue;
    }
    if (typeof value === "bigint") {
      result[i] = value.toString();
      continue;
    }
    if (columnTypes[i] === ColumnTypeEnum.Boolean) {
      result[i] = JSON.parse(value);
    }
  }
  return result;
}
__name(mapRow, "mapRow");
function cleanArg(arg, argType) {
  if (arg !== null) {
    if (argType === "Int64") {
      const asInt56 = Number.parseInt(arg);
      if (!Number.isSafeInteger(asInt56)) {
        throw new Error(`Invalid Int64-encoded value received: ${arg}`);
      }
      return asInt56;
    }
    if (argType === "Int32") {
      return Number.parseInt(arg);
    }
    if (argType === "Float" || argType === "Double") {
      return Number.parseFloat(arg);
    }
    if (arg === true) {
      return 1;
    }
    if (arg === false) {
      return 0;
    }
    if (arg instanceof Uint8Array) {
      return Array.from(arg);
    }
  }
  return arg;
}
__name(cleanArg, "cleanArg");
function matchSQLiteErrorCode(message) {
  let extendedCode = 1;
  if (!message) return extendedCode;
  if (message.startsWith("D1_ERROR: UNIQUE constraint failed:")) {
    extendedCode = 2067;
  } else if (message.startsWith("D1_ERROR: FOREIGN KEY constraint failed")) {
    extendedCode = 787;
  } else if (message.startsWith("D1_ERROR: NOT NULL constraint failed")) {
    extendedCode = 1299;
  } else if (message.startsWith("D1_ERROR: CHECK constraint failed")) {
    extendedCode = 1811;
  } else if (message.startsWith("D1_ERROR: PRIMARY KEY constraint failed")) {
    extendedCode = 1555;
  }
  return extendedCode;
}
__name(matchSQLiteErrorCode, "matchSQLiteErrorCode");
var debug = (0, import_debug.Debug)("prisma:driver-adapter:d1");
var D1Queryable = class {
  static {
    __name(this, "D1Queryable");
  }
  constructor(client) {
    this.client = client;
    this.provider = "sqlite";
    this.adapterName = name;
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters.
   */
  async queryRaw(query) {
    const tag = "[js::query_raw]";
    debug(`${tag} %O`, query);
    const ioResult = await this.performIO(query);
    return ioResult.map((data) => {
      const convertedData = this.convertData(data);
      return convertedData;
    });
  }
  convertData(ioResult) {
    const columnNames = ioResult[0];
    const results = ioResult[1];
    if (results.length === 0) {
      return {
        columnNames: [],
        columnTypes: [],
        rows: []
      };
    }
    const columnTypes = Object.values(getColumnTypes(columnNames, results));
    const rows = results.map((value) => mapRow(value, columnTypes));
    return {
      columnNames,
      // * Note: without Object.values the array looks like
      // * columnTypes: [ id: 128 ],
      // * and errors with:
      // * ✘ [ERROR] A hanging Promise was canceled. This happens when the worker runtime is waiting for a Promise from JavaScript to resolve, but has detected that the Promise cannot possibly ever resolve because all code and events related to the Promise's I/O context have already finished.
      columnTypes,
      rows
    };
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */
  async executeRaw(query) {
    const tag = "[js::execute_raw]";
    debug(`${tag} %O`, query);
    const res = await this.performIO(query, true);
    return res.map((result) => result.meta.changes ?? 0);
  }
  async performIO(query, executeRaw = false) {
    try {
      query.args = query.args.map((arg, i) => cleanArg(arg, query.argTypes[i]));
      const stmt = this.client.prepare(query.sql).bind(...query.args);
      if (executeRaw) {
        return ok(await stmt.run());
      } else {
        const [columnNames, ...rows] = await stmt.raw({ columnNames: true });
        return ok([columnNames, rows]);
      }
    } catch (e) {
      console.error("Error in performIO: %O", e);
      const { message } = e;
      return err({
        kind: "Sqlite",
        extendedCode: matchSQLiteErrorCode(message),
        message
      });
    }
  }
};
var D1Transaction = class extends D1Queryable {
  static {
    __name(this, "D1Transaction");
  }
  constructor(client, options) {
    super(client);
    this.options = options;
  }
  async commit() {
    debug(`[js::commit]`);
    return ok(void 0);
  }
  async rollback() {
    debug(`[js::rollback]`);
    return ok(void 0);
  }
};
var D1TransactionContext = class extends D1Queryable {
  static {
    __name(this, "D1TransactionContext");
  }
  constructor(client) {
    super(client);
    this.client = client;
  }
  async startTransaction() {
    const options = {
      // TODO: D1 does not have a Transaction API.
      usePhantomQuery: true
    };
    const tag = "[js::startTransaction]";
    debug("%s options: %O", tag, options);
    return ok(new D1Transaction(this.client, options));
  }
};
var PrismaD1 = class extends D1Queryable {
  static {
    __name(this, "PrismaD1");
  }
  constructor(client) {
    super(client);
    this.tags = {
      error: red("prisma:error"),
      warn: yellow("prisma:warn"),
      info: cyan("prisma:info"),
      query: blue("prisma:query")
    };
    this.alreadyWarned = /* @__PURE__ */ new Set();
    this.warnOnce = (key, message, ...args) => {
      if (!this.alreadyWarned.has(key)) {
        this.alreadyWarned.add(key);
        console.info(`${this.tags.warn} ${message}`, ...args);
      }
    };
  }
  getConnectionInfo() {
    return ok({
      maxBindValues: 98
    });
  }
  async transactionContext() {
    this.warnOnce(
      "D1 Transaction",
      "Cloudflare D1 does not support transactions yet. When using Prisma's D1 adapter, implicit & explicit transactions will be ignored and run as individual queries, which breaks the guarantees of the ACID properties of transactions. For more details see https://pris.ly/d/d1-transactions"
    );
    return ok(new D1TransactionContext(this.client));
  }
};

// src/prisma.js
var cachedPrisma = null;
function getPrisma(env) {
  if (!cachedPrisma) {
    const adapter = new PrismaD1(env.DB);
    cachedPrisma = new import_client.PrismaClient({ adapter });
  }
  return cachedPrisma;
}
__name(getPrisma, "getPrisma");
var prismaProxy = new Proxy({}, {
  get(target, prop) {
    if (cachedPrisma) {
      return Reflect.get(cachedPrisma, prop);
    }
    return new Proxy({}, {
      get(modelTarget, modelProp) {
        if (!cachedPrisma) {
          throw new Error("Prisma client has not been initialized with env yet! Run getPrisma(env) in middleware.");
        }
        const model = Reflect.get(cachedPrisma, prop);
        if (!model) {
          return void 0;
        }
        const val = Reflect.get(model, modelProp);
        if (typeof val === "function") {
          return val.bind(model);
        }
        return val;
      }
    });
  }
});
var prisma_default = prismaProxy;

// src/middlewares/errorHandler.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/zod/v3/ZodError.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/zod/v3/helpers/util.js
init_checked_fetch();
init_modules_watch_stub();
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// src/middlewares/errorHandler.js
var import_client2 = __toESM(require_default2(), 1);
var errorHandler2 = /* @__PURE__ */ __name((err2, c) => {
  let statusCode = err2.statusCode || 500;
  let message = err2.message || "Sunucu Hatas\u0131 (Internal Server Error)";
  let details = void 0;
  if (err2 instanceof ZodError) {
    statusCode = 400;
    message = "Ge\xE7ersiz Veri Giri\u015Fi";
    details = err2.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message
    }));
  }
  if (err2 instanceof import_client2.Prisma.PrismaClientKnownRequestError) {
    if (err2.code === "P2002") {
      statusCode = 409;
      message = "Benzersizlik k\u0131s\u0131tlamas\u0131 ihlal edildi (Duplicate Entry)";
    } else if (err2.code === "P2025") {
      statusCode = 404;
      message = "Kay\u0131t bulunamad\u0131";
    }
  }
  console.error(`[Hata] ${statusCode} - ${c.req.method} ${c.req.path}: ${message}`);
  if (config.nodeEnv === "development" && !(err2 instanceof ZodError)) {
    console.error(err2.stack);
  }
  return c.json({
    success: false,
    error: message,
    details,
    stack: config.nodeEnv === "development" ? err2.stack : void 0
  }, statusCode);
}, "errorHandler");

// src/routes/productRoutes.js
init_checked_fetch();
init_modules_watch_stub();

// src/container.js
init_checked_fetch();
init_modules_watch_stub();

// src/repositories/productRepository.js
init_checked_fetch();
init_modules_watch_stub();

// src/repositories/baseRepository.js
init_checked_fetch();
init_modules_watch_stub();
var BaseRepository = class {
  static {
    __name(this, "BaseRepository");
  }
  /**
   * @param {Object} model - Belirli bir model için Prisma temsili (örn. prisma.urun).
   */
  constructor(model) {
    this.model = model;
  }
  /**
   * Verilen seçeneklere uyan tüm kayıtları bulur.
   * @param {Object} [options={}] - Prisma findMany seçenekleri.
   * @returns {Promise<Array<Object>>} Kayıt listesi.
   */
  async findAll(options = {}) {
    return this.model.findMany(options);
  }
  /**
   * ID'ye göre tek bir kayıt bulur.
   * @param {string} id - Kaydın UUID'si.
   * @returns {Promise<Object|null>} Kayıt veya bulunamazsa null.
   */
  async findById(id) {
    return this.model.findUnique({
      where: { id }
    });
  }
  /**
   * Yeni bir kayıt oluşturur.
   * @param {Object} data - Yeni kayıt için veri.
   * @returns {Promise<Object>} Oluşturulan kayıt.
   */
  async create(data) {
    return this.model.create({ data });
  }
  /**
   * Mevcut bir kaydı ID ile günceller.
   * @param {string} id - Güncellenecek kaydın UUID'si.
   * @param {Object} data - Güncellenecek veri.
   * @returns {Promise<Object>} Güncellenen kayıt.
   */
  async update(id, data) {
    return this.model.update({
      where: { id },
      data
    });
  }
  /**
   * ID ile bir kaydı siler.
   * @param {string} id - Silinecek kaydın UUID'si.
   * @returns {Promise<Object>} Silinen kayıt.
   */
  async delete(id) {
    return this.model.delete({
      where: { id }
    });
  }
};

// src/repositories/productRepository.js
var ProductRepository = class extends BaseRepository {
  static {
    __name(this, "ProductRepository");
  }
  /**
   * Creates an instance of ProductRepository.
   * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
   */
  constructor(dbClient) {
    super(dbClient.urun);
  }
  /**
   * Retrieves all products including their associated category.
   * @returns {Promise<Array<import('@prisma/client').Urun & { kategori: import('@prisma/client').Kategori }>>} A promise that resolves to an array of products with categories.
   */
  async findAllWithCategories(filters = {}) {
    const where = { aktif: true };
    if (filters.markaId) where.markaId = filters.markaId;
    if (filters.kategoriId) {
      where.OR = [
        { kategoriId: filters.kategoriId },
        // Direct match (product is in this category)
        { kategori: { ustKategoriId: filters.kategoriId } }
        // Indirect match (product is in a subcategory of this category)
      ];
    }
    if (filters.oneCikan) where.oneCikan = true;
    if (filters.firsatUrunu) where.firsatUrunu = true;
    if (filters.yeniUrun) where.yeniUrun = true;
    if (filters.cokSatanlar) where.cokSatanlar = true;
    let orderBy = { olusturulmaTarihi: "desc" };
    if (filters.cokSatanlar) {
      orderBy = { satisAdedi: "desc" };
    } else if (filters.oneCikan) {
      orderBy = { goruntulemeSayisi: "desc" };
    }
    console.log("[DEBUG] findAllWithCategories where:", where);
    const results = await this.findAll({
      where,
      include: {
        kategori: true,
        marka: true,
        resimler: {
          orderBy: { sira: "asc" }
        }
      },
      orderBy
    });
    console.log("[DEBUG] findAllWithCategories results count:", results?.length, results);
    return results;
  }
  /**
   * Retrieves a single product by its ID with relations.
   * @param {string} id - The ID of the product.
   * @returns {Promise<import('@prisma/client').Urun|null>} The product with relations.
   */
  async findById(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        kategori: true,
        marka: true,
        resimler: {
          orderBy: { sira: "asc" }
        }
      }
    });
  }
  /**
   * Retrieves a single product by its Slug with relations.
   * @param {string} slug - The SEO slug of the product.
   * @returns {Promise<import('@prisma/client').Urun|null>} The product with relations.
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug },
      include: {
        kategori: true,
        marka: true,
        resimler: {
          orderBy: { sira: "asc" }
        }
      }
    });
  }
  /**
   * Increments the view count for a product.
   * @param {string} id - The ID of the product.
   * @returns {Promise<void>}
   */
  async incrementViewCount(id) {
    await this.model.update({
      where: { id },
      data: {
        goruntulemeSayisi: {
          increment: 1
        }
      }
    });
  }
  /**
   * Retrieves all products (active or not) for administrative panel list.
   * @returns {Promise<Array>}
   */
  async findAllForAdmin() {
    return this.model.findMany({
      include: { kategori: true, marka: true },
      orderBy: { olusturulmaTarihi: "desc" }
    });
  }
};

// src/repositories/categoryRepository.js
init_checked_fetch();
init_modules_watch_stub();
var CategoryRepository = class extends BaseRepository {
  static {
    __name(this, "CategoryRepository");
  }
  /**
   * CategoryRepository örneği oluşturur.
   * @param {import('@prisma/client').PrismaClient} dbClient - Veritabanı istemcisi (PrismaClient).
   */
  constructor(dbClient) {
    super(dbClient.kategori);
  }
  async findAll() {
    return this.model.findMany({
      where: {
        ustKategoriId: null
      },
      include: {
        altKategoriler: true
      },
      orderBy: {
        id: "asc"
      }
    });
  }
  /**
   * Slug'a göre kategori bulur.
   * @param {string} slug - Kategori slug'ı.
   * @returns {Promise<Object|null>} Kategori.
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug }
    });
  }
  /**
   * Retrieves all categories ordered by index for administrative panel.
   * @returns {Promise<Array>}
   */
  async findAllForAdmin() {
    return this.model.findMany({
      orderBy: { sira: "asc" }
    });
  }
};

// src/repositories/orderRepository.js
init_checked_fetch();
init_modules_watch_stub();
var OrderRepository = class extends BaseRepository {
  static {
    __name(this, "OrderRepository");
  }
  /**
   * Creates an instance of OrderRepository.
   * @param {import('@prisma/client').PrismaClient} dbClient - Database client (PrismaClient).
   */
  constructor(dbClient) {
    super(dbClient.siparis);
    this.prisma = dbClient;
  }
  /**
   * Creates a new order with its associated line items.
   * @param {Object} orderData - Order data containing line items.
   * @returns {Promise<Object>} The created order.
   */
  async createOrder(orderData) {
    return this.model.create({
      data: orderData
    });
  }
  /**
   * Updates payment and order status.
   * @param {string} id - Order ID.
   * @param {string} paymentStatus - New payment status.
   * @param {string} status - New order status.
   * @returns {Promise<Object>} The updated order.
   */
  async updateStatus(id, paymentStatus, status) {
    return this.model.update({
      where: { id },
      data: {
        odemeDurumu: paymentStatus,
        durum: status
      }
    });
  }
  /**
   * Retrieves an order by ID with line items and product details.
   * @param {string} id - Order ID.
   * @returns {Promise<Object>} Detailed order object.
   */
  async getOrderById(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        kalemler: {
          include: {
            urun: true
          }
        }
      }
    });
  }
  /**
   * Finalizes the order: marks status as 'HAZIRLANIYOR', payment as 'SUCCESS', and manages inventory/invoicing.
   * Uses db transaction to ensure atomicity.
   * 
   * @param {string} id - Order ID.
   * @returns {Promise<Object>} The finalized order.
   */
  async finalizeOrder(id) {
    return this.prisma.$transaction(async (tx) => {
      const siparis = await tx.siparis.findUnique({
        where: { id },
        include: { kalemler: true }
      });
      if (!siparis) throw new Error("Sipari\u015F bulunamad\u0131");
      return tx.siparis.update({
        where: { id },
        data: {
          durum: "HAZIRLANIYOR",
          odemeDurumu: "SUCCESS",
          faturaDurumu: "DUZENLENMEDI"
          // Invoice to be issued later
        }
      });
    });
  }
  /**
   * Updates the payment token for an order.
   * @param {string} id - Order ID.
   * @param {string} token - Payment gateway token.
   */
  async updatePaymentToken(id, token) {
    return this.model.update({
      where: { id },
      data: { odemeTokeni: token }
    });
  }
  /**
   * Finds an order by its payment token.
   * @param {string} token - Payment token.
   * @returns {Promise<Object>} Order.
   */
  async getOrderByPaymentToken(token) {
    return this.model.findUnique({
      where: { odemeTokeni: token },
      include: { kalemler: true }
    });
  }
  /**
   * Finds an order by its 6-digit order number.
   * @param {string} orderNumber - 6-digit order number.
   * @returns {Promise<Object>} Order with line items.
   */
  async getOrderByNumber(orderNumber) {
    return this.model.findUnique({
      where: { siparisNumarasi: orderNumber },
      include: {
        kalemler: {
          include: {
            urun: true
          }
        }
      }
    });
  }
  /**
   * Finds an order by its secure tracking token.
   * @param {string} token - Tracking UUID token.
   * @returns {Promise<Object>} Order with line items.
   */
  async getOrderByTrackingToken(token) {
    return this.model.findUnique({
      where: { takipTokeni: token },
      include: {
        kalemler: {
          include: {
            urun: true
          }
        }
      }
    });
  }
  /**
   * Sets an order status to IPTAL_EDILDI (Canceled).
   * @param {string} id - Order ID.
   * @returns {Promise<Object>} The updated order.
   */
  async cancelOrder(id) {
    return this.model.update({
      where: { id },
      data: { durum: "IPTAL_EDILDI" }
    });
  }
  /**
   * Retrieves all orders for administration panel lists.
   * @returns {Promise<Array>}
   */
  async findAllForAdmin() {
    return this.model.findMany({
      include: { kalemler: true },
      orderBy: { olusturulmaTarihi: "desc" }
    });
  }
  /**
   * Retrieves order details with kalemler, gecmis and iadeTalebi.
   * @param {string} id - Order ID.
   * @returns {Promise<Object|null>}
   */
  async getOrderByIdWithDetails(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        kalemler: true,
        gecmis: true,
        iadeTalebi: true
      }
    });
  }
  /**
   * Adds an audit trail entry for status changes.
   * @param {Object} historyData
   */
  async createOrderHistory(historyData) {
    return this.prisma.siparisGecmisi.create({
      data: {
        siparisId: historyData.siparisId,
        eskiDurum: historyData.eskiDurum,
        yeniDurum: historyData.yeniDurum,
        not: historyData.not,
        islemYapan: historyData.islemYapan || "SYSTEM"
      }
    });
  }
};

// src/repositories/brandRepository.js
init_checked_fetch();
init_modules_watch_stub();
var BrandRepository = class extends BaseRepository {
  static {
    __name(this, "BrandRepository");
  }
  constructor(dbClient) {
    super(dbClient.marka);
  }
  async findAll() {
    return this.model.findMany({
      where: { aktif: true },
      orderBy: { sira: "asc" }
    });
  }
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug }
    });
  }
  /**
   * Retrieves all brands ordered by index for administrative panel.
   * @returns {Promise<Array>}
   */
  async findAllForAdmin() {
    return this.model.findMany({
      orderBy: { sira: "asc" }
    });
  }
};

// src/repositories/settingsRepository.js
init_checked_fetch();
init_modules_watch_stub();
var SettingsRepository = class extends BaseRepository {
  static {
    __name(this, "SettingsRepository");
  }
  constructor(dbClient) {
    super(dbClient.sistemAyarlari);
  }
  async getSettings() {
    return this.model.findUnique({
      where: { id: "global-settings" }
    });
  }
  async createSettings(data) {
    return this.model.create({
      data: {
        id: "global-settings",
        ...data
      }
    });
  }
  async updateSettings(data) {
    return this.model.update({
      where: { id: "global-settings" },
      data
    });
  }
};

// src/repositories/returnRepository.js
init_checked_fetch();
init_modules_watch_stub();
var ReturnRepository = class extends BaseRepository {
  static {
    __name(this, "ReturnRepository");
  }
  constructor(dbClient) {
    super(dbClient.iadeTalebi);
  }
  /**
   * Finds a return request by ID with the associated order.
   * @param {string} id
   */
  async findByIdWithOrder(id) {
    return this.model.findUnique({
      where: { id },
      include: { siparis: true }
    });
  }
  /**
   * Retrieves all return requests for administration panel lists.
   * @returns {Promise<Array>}
   */
  async findAllForAdmin() {
    return this.model.findMany({
      include: { siparis: true },
      orderBy: { olusturulmaTarihi: "desc" }
    });
  }
};

// src/services/productService.js
init_checked_fetch();
init_modules_watch_stub();
var ProductService = class {
  static {
    __name(this, "ProductService");
  }
  /**
   * Creates an instance of ProductService.
   * @param {import('../repositories/productRepository.js').ProductRepository} productRepository - Product repository instance.
   * @param {import('../repositories/categoryRepository.js').CategoryRepository} categoryRepository - Category repository instance.
   * @param {import('@prisma/client').PrismaClient} prisma - Prisma client for palette lookups.
   */
  constructor(productRepository2, categoryRepository2, prisma) {
    this.productRepository = productRepository2;
    this.categoryRepository = categoryRepository2;
    this.prisma = prisma;
  }
  _getSectionCandidates(isInteriorPaint, isExteriorPaint) {
    if (isInteriorPaint) {
      return ["ic-cephe", "\u0130\xE7 Cephe", "Ic Cephe", "i\xE7 cephe"];
    }
    if (isExteriorPaint) {
      return ["dis-cephe", "D\u0131\u015F Cephe", "Dis Cephe", "d\u0131\u015F cephe"];
    }
    return [];
  }
  /**
   * Formats product data, ensuring image URLs are absolute paths with CDN prefix.
   * @param {Object} product - Raw product object from database.
   * @returns {Object|null} Formatted product with CDN-prefixed image URLs.
   * @private
   */
  async _formatProduct(product) {
    if (!product) return null;
    if (typeof product.renkSecenekleri === "string") {
      try {
        product.renkSecenekleri = JSON.parse(product.renkSecenekleri);
      } catch (e) {
        product.renkSecenekleri = [];
      }
    }
    const paletteRows = await this._getPaletteRows(product);
    let resimUrl = product.resimUrl;
    if (product.resimler && product.resimler.length > 0) {
      resimUrl = product.resimler[0].url;
    }
    if (resimUrl && !resimUrl.startsWith("http") && config.cdnUrl) {
      const baseUrl = config.cdnUrl.endsWith("/") ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
      const path = resimUrl.startsWith("/") ? resimUrl : `/${resimUrl}`;
      resimUrl = `${baseUrl}${path}`;
    }
    const resimler = (product.resimler || []).map((img) => {
      let url = img.url;
      if (url && !url.startsWith("http") && config.cdnUrl) {
        const baseUrl = config.cdnUrl.endsWith("/") ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
        const path = url.startsWith("/") ? url : `/${url}`;
        url = `${baseUrl}${path}`;
      }
      return { ...img, url };
    });
    return {
      ...product,
      resimUrl,
      resimler,
      renkKartelasi: paletteRows
    };
  }
  async _getPaletteRows(product) {
    if (!product) return [];
    const isInteriorPaint = Boolean(product.kartelaIcCephe);
    const isExteriorPaint = Boolean(product.kartelaDisCephe);
    if (!isInteriorPaint && !isExteriorPaint) {
      return [];
    }
    const selectedNames = Array.isArray(product.renkSecenekleri) ? product.renkSecenekleri.map((item) => String(item || "").trim()).filter(Boolean) : [];
    const hasSelectedNames = selectedNames.length > 0;
    console.log(`[PaletteCheck] Product: "${product.ad}" | Colors: ${hasSelectedNames} | Int: ${isInteriorPaint} | Ext: ${isExteriorPaint}`);
    const sectionCandidates = this._getSectionCandidates(isInteriorPaint, isExteriorPaint);
    const where = {
      aktif: true,
      ...hasSelectedNames ? { name: { in: selectedNames } } : { section: { in: sectionCandidates } }
    };
    const rows = await this.prisma.renkKartelasi.findMany({
      where,
      orderBy: [{ sira: "asc" }, { name: "asc" }]
    });
    return rows.map((row) => ({
      id: row.id,
      section: row.section,
      code: row.code,
      name: row.name,
      hex: row.hex,
      rgb: row.rgb,
      sourceFile: row.sourceFile
    }));
  }
  /**
   * Retrieves all products with optional filtering.
   * @param {Object} [filters={}] - Optional filters (kategoriId, markaId).
   * @returns {Promise<Array<Object>>} Array of formatted products.
   */
  async getAllProducts(filters = {}) {
    if (filters.kategoriSlug && !filters.kategoriId && this.categoryRepository) {
      const category = await this.categoryRepository.findBySlug(filters.kategoriSlug);
      if (category) {
        filters.kategoriId = category.id;
      }
    }
    const products = await this.productRepository.findAllWithCategories(filters);
    return Promise.all(products.map((p) => this._formatProduct(p)));
  }
  /**
   * Retrieves a single product by its ID.
   * @param {string} id - Product UUID.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    return this._formatProduct(product);
  }
  /**
   * Retrieves a single product by its Slug.
   * @param {string} slug - Product Slug.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async getProductBySlug(slug) {
    const product = await this.productRepository.findBySlug(slug);
    return this._formatProduct(product);
  }
  /**
   * Increments the view count for a product.
   * @param {string} id - Product UUID.
   * @returns {Promise<void>}
   */
  async incrementViewCount(id) {
    await this.productRepository.incrementViewCount(id);
  }
  /**
   * Retrieves all products (including inactive ones) for administration list.
   */
  async getAllProductsForAdmin() {
    const products = await this.productRepository.findAllForAdmin();
    return Promise.all(products.map((p) => this._formatProduct(p)));
  }
  /**
   * Creates a new product.
   */
  async createProduct(data) {
    return this.productRepository.create(data);
  }
  /**
   * Updates an existing product.
   */
  async updateProduct(id, data) {
    return this.productRepository.update(id, data);
  }
  /**
   * Deletes a product.
   */
  async deleteProduct(id) {
    return this.productRepository.delete(id);
  }
};

// src/services/categoryService.js
init_checked_fetch();
init_modules_watch_stub();
var CategoryService = class {
  static {
    __name(this, "CategoryService");
  }
  /**
   * Creates an instance of CategoryService.
   * @param {import('../repositories/categoryRepository.js').CategoryRepository} categoryRepository - Category repository instance.
   */
  constructor(categoryRepository2) {
    this.categoryRepository = categoryRepository2;
  }
  /**
   * Formats category data (adds CDN prefix to image URL).
   * Recursively formats subcategories as well.
   * @param {Object} category - Raw category object from database.
   * @returns {Object|null} Formatted category with CDN-prefixed image URLs.
   * @private
   */
  _formatCategory(category) {
    if (!category) return null;
    let resim = category.resim;
    if (resim && !resim.startsWith("http") && config.cdnUrl) {
      const baseUrl = config.cdnUrl.endsWith("/") ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
      const path = resim.startsWith("/") ? resim : `/${resim}`;
      resim = `${baseUrl}${path}`;
    }
    let altKategoriler = category.altKategoriler;
    if (altKategoriler && Array.isArray(altKategoriler)) {
      altKategoriler = altKategoriler.map((cat) => this._formatCategory(cat));
    }
    return {
      ...category,
      resim,
      altKategoriler
    };
  }
  /**
   * Retrieves all categories with subcategories.
   * @returns {Promise<Array<Object>>} Array of formatted categories.
   */
  async getAllCategories() {
    const categories = await this.categoryRepository.findAll();
    return categories.map((c) => this._formatCategory(c));
  }
  /**
   * Retrieves all categories (active or not) formatted with CDN prefixes.
   */
  async getAllCategoriesForAdmin() {
    const categories = await this.categoryRepository.findAllForAdmin();
    return categories.map((c) => this._formatCategory(c));
  }
  /**
   * Creates a new category.
   */
  async createCategory(data) {
    return this.categoryRepository.create(data);
  }
  /**
   * Updates an existing category.
   */
  async updateCategory(id, data) {
    return this.categoryRepository.update(id, data);
  }
  /**
   * Deletes a category.
   */
  async deleteCategory(id) {
    return this.categoryRepository.delete(id);
  }
};

// src/services/orderService.js
init_checked_fetch();
init_modules_watch_stub();
var OrderService = class {
  static {
    __name(this, "OrderService");
  }
  /**
   * Creates an instance of OrderService.
   * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository - Order repository.
   * @param {import('./productService.js').ProductService} productService - Product service.
   * @param {import('./paramService.js').ParamService} paramService - POS service.
   * @param {import('./emailService.js').EmailService} emailService - Email service.
   */
  constructor(orderRepository2, productService2, paramService2, emailService2) {
    this.orderRepository = orderRepository2;
    this.productService = productService2;
    this.paramService = paramService2;
    this.emailService = emailService2;
  }
  /**
   * Initiates checkout session, calculates total pricing/shipping, and records a PENDING order.
   * @param {Object} checkoutData - Items list and shipping/invoice billing details.
   * @returns {Promise<Object>} Checkout result with payment page URL.
   */
  async processCheckout(checkoutData) {
    const { items, guestInfo: customerInfo } = checkoutData;
    let subTotal = 0;
    let totalDesi = 0;
    let totalWeight = 0;
    const indexItems = [];
    for (const item of items) {
      const product = await this.productService.getProductById(item.id);
      if (product) {
        const unitPrice = Number(product.indirimliFiyat || product.fiyat);
        const productColors = Array.isArray(product.renkSecenekleri) ? product.renkSecenekleri.filter(Boolean) : [];
        const selectedColor = typeof item.selectedColor === "string" ? item.selectedColor.trim() : "";
        if (productColors.length > 0 && !selectedColor) {
          throw new Error(`Color selection is required for ${product.ad}.`);
        }
        if (selectedColor && !productColors.includes(selectedColor)) {
          throw new Error(`Selected color for ${product.ad} is invalid.`);
        }
        let finalColorName = selectedColor;
        if (selectedColor) {
          const colorRecord = await prisma_default.renkKartelasi.findFirst({
            where: { name: selectedColor, aktif: true }
          });
          if (colorRecord) {
            finalColorName = `${selectedColor} (${colorRecord.code})`;
          }
        }
        subTotal += unitPrice * item.quantity;
        totalWeight += Number(product.agirlik || 1) * item.quantity;
        indexItems.push({
          urunId: product.id,
          secilenRenk: finalColorName,
          adet: item.quantity,
          iadeyeUygunMuSnapshot: product.iadeImkaniVar !== false,
          fiyat: unitPrice,
          urunAdSnapshot: product.ad,
          urunFiyatSnapshot: unitPrice,
          toplamFiyat: unitPrice * item.quantity
        });
      }
    }
    if (totalWeight > 100) {
      throw new Error("Order total weight exceeds 100kg limit. Please contact satis@e-market.com or our WhatsApp line for bulk cargo shipping pricing.");
    }
    let settings = await prisma_default.sistemAyarlari.findUnique({ where: { id: "global-settings" } });
    const ucretsizKargoAltLimit = settings && settings.ucretsizKargoAltLimit ? Number(settings.ucretsizKargoAltLimit) : 5e3;
    let shippingFee = 0;
    let priceList = settings && settings.kargoFiyatListesi ? settings.kargoFiyatListesi : null;
    if (typeof priceList === "string") {
      try {
        priceList = JSON.parse(priceList);
      } catch (e) {
        priceList = null;
      }
    }
    if (Array.isArray(priceList) && priceList.length > 0) {
      const sortedList = [...priceList].sort((a, b) => a.maxWeight - b.maxWeight);
      const matchingTier = sortedList.find((tier) => totalWeight <= tier.maxWeight);
      if (matchingTier) {
        shippingFee = Number(matchingTier.price);
      } else {
        const lastTier = sortedList[sortedList.length - 1];
        const extraWeight = Math.ceil(totalWeight - lastTier.maxWeight);
        shippingFee = Number(lastTier.price) + extraWeight * 15;
      }
    } else {
      if (totalWeight <= 1) shippingFee = 65;
      else if (totalWeight <= 2) shippingFee = 85;
      else if (totalWeight <= 3) shippingFee = 105;
      else if (totalWeight <= 4) shippingFee = 125;
      else if (totalWeight <= 5) shippingFee = 145;
      else if (totalWeight <= 10) shippingFee = 200;
      else if (totalWeight <= 20) shippingFee = 350;
      else if (totalWeight <= 35) shippingFee = 550;
      else if (totalWeight <= 50) shippingFee = 800;
      else if (totalWeight <= 75) shippingFee = 1200;
      else if (totalWeight <= 100) shippingFee = 1600;
      else {
        shippingFee = null;
      }
    }
    if (shippingFee === null) {
      throw new Error("Shipping calculations failed for this weight. Contact customer support.");
    }
    shippingFee = Number(shippingFee.toFixed(2));
    const toplamTutar = subTotal + shippingFee;
    const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};
    const siparisNumarasi = Math.floor(1e5 + Math.random() * 9e5).toString();
    const fullNameParts = customerInfo.name.trim().split(" ");
    const soyad = fullNameParts.length > 1 ? fullNameParts.pop() : "";
    const ad = fullNameParts.join(" ");
    let rawPhone = customerInfo.phone.replace(/\s/g, "");
    if (rawPhone.startsWith("0")) {
      rawPhone = "+90" + rawPhone.substring(1);
    } else if (!rawPhone.startsWith("+")) {
      rawPhone = "+90" + rawPhone;
    }
    const ulke = "T\xFCrkiye";
    const takipTokeni = crypto.randomUUID();
    const orderData = {
      toplamTutar,
      kargoUcreti: shippingFee,
      durum: "BEKLEMEDE",
      siparisNumarasi,
      takipTokeni,
      ad: ad || customerInfo.name,
      soyad,
      eposta: customerInfo.email,
      telefon: rawPhone,
      adres: customerInfo.address,
      sehir: customerInfo.city,
      ilce: customerInfo.district,
      postaKodu: customerInfo.zipCode,
      ulke,
      kurumsalMi: !!isCorporate,
      sirketAdi: companyName || null,
      vergiDairesi: taxOffice || null,
      vergiNumarasi: taxNumber || null,
      kalemler: {
        create: indexItems
      }
    };
    const siparis = await this.orderRepository.createOrder(orderData);
    return {
      status: "pending_payment",
      orderId: siparis.id,
      orderNumber: siparis.siparisNumarasi,
      total: siparis.toplamTutar,
      message: "Order created successfully, awaiting payment"
    };
  }
  /**
   * Initiates Param payment gateway session with card details.
   * @param {string} orderId - Order UUID.
   * @param {Object} cardInfo - Card details (cardNumber, cardExpMonth, cardExpYear, cardCvc).
   * @param {Object} buyerInfo - Buyer details (IP address, etc.).
   * @returns {Promise<Object>} 3D secure redirect HTML or error object.
   */
  async initiateParamPayment(orderId, cardInfo, buyerInfo) {
    const siparis = await this.orderRepository.getOrderById(orderId);
    if (!siparis) {
      throw new Error("Order not found.");
    }
    if (siparis.durum !== "BEKLEMEDE") {
      throw new Error("This order is not eligible for payment.");
    }
    try {
      const buyer = {
        name: siparis.ad,
        surname: siparis.soyad,
        phone: siparis.telefon,
        cardNumber: cardInfo.cardNumber,
        cardExpMonth: cardInfo.cardExpMonth,
        cardExpYear: cardInfo.cardExpYear,
        cardCvc: cardInfo.cardCvc,
        ip: buyerInfo.ip || "127.0.0.1"
      };
      const paymentResult = await this.paramService.startPaymentProcess(siparis, [], buyer);
      if (paymentResult.dekontId) {
        await this.orderRepository.updatePaymentToken(siparis.id, paymentResult.dekontId);
      }
      return {
        status: "success",
        ucdHtml: paymentResult.ucdHtml,
        orderId: siparis.id
      };
    } catch (error) {
      console.error("Param Payment Error:", error);
      return { status: "failure", errorMessage: error.message || "Payment initiation failed." };
    }
  }
  /**
   * Completes and finalizes payment after successful 3D secure callback.
   * @param {Object} callbackData - Callback parameters sent from Param gateway.
   * @returns {Promise<Object>} Payment completion results.
   */
  async completePayment(callbackData) {
    try {
      const result = this.paramService.verifyCallback(callbackData);
      if (result.status === "success") {
        console.log("Completing payment, Order Number:", result.siparisNumarasi);
        const siparis = await this.orderRepository.getOrderByNumber(result.siparisNumarasi);
        if (!siparis) {
          throw new Error("Order not found for the given payment.");
        }
        await this.orderRepository.updatePaymentToken(siparis.id, result.paymentId);
        await this.orderRepository.finalizeOrder(siparis.id);
        const freshOrder = await this.orderRepository.getOrderById(siparis.id);
        if (freshOrder) {
          await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
            id: freshOrder.id,
            orderNumber: freshOrder.siparisNumarasi,
            trackingToken: freshOrder.takipTokeni,
            total: freshOrder.toplamTutar,
            items: freshOrder.kalemler
          });
          await this.emailService.sendSellerNewOrderNotification(freshOrder);
        }
        return {
          status: "success",
          orderId: siparis.id,
          orderNumber: siparis.siparisNumarasi,
          trackingToken: siparis.takipTokeni
        };
      } else {
        return {
          status: "failure",
          errorMessage: result.errorMessage || "Payment verification failed.",
          orderNumber: result.siparisNumarasi
        };
      }
    } catch (error) {
      console.error("Payment Completion Error:", error);
      throw error;
    }
  }
  /**
   * Cancels an order, releases hold slots, and refunds payment if applicable.
   * @param {string} token - Secure tracking token.
   * @param {string} reason - Cancellation reason statement.
   * @returns {Promise<Object>} Result message with status.
   */
  async cancelOrder(token, reason) {
    const order = await this.orderRepository.getOrderByTrackingToken(token);
    if (!order) {
      throw new Error("Order not found.");
    }
    if (order.durum === "IPTAL_EDILDI") {
      throw new Error("Order is already canceled.");
    }
    if (order.durum === "KARGOLANDI" || order.durum === "TESLIM_EDILDI" || order.durum === "TAMAMLANDI") {
      throw new Error("Shipped or completed orders cannot be canceled.");
    }
    const hasNonReturnableItems = Array.isArray(order.kalemler) && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);
    if (hasNonReturnableItems) {
      throw new Error("This order contains custom or non-returnable items and cannot be canceled.");
    }
    console.log(`[Order Cancel] Order: ${order.siparisNumarasi}, Reason: ${reason}`);
    let refundStatus = "NONE";
    if (order.odemeDurumu === "SUCCESS" && order.odemeId) {
      try {
        await this.paramService.cancelPayment(order.odemeId, reason);
        refundStatus = "SUCCESS";
        console.log(`[Param Refund] Successful, Order: ${order.siparisNumarasi}`);
      } catch (error) {
        console.error(`[Param Refund Failed] Order: ${order.siparisNumarasi}`, error);
      }
    }
    await this.orderRepository.cancelOrder(order.id);
    if (order.eposta) {
      await this.emailService.sendCancellationNotification(order.eposta, order.ad, {
        orderNumber: order.siparisNumarasi,
        refundStatus,
        trackingToken: token
      });
    }
    return { status: "success", message: "Order successfully canceled and refund process initiated." };
  }
  /**
   * Retrieves an order by its secure tracking token.
   * @param {string} token - Order tracking token (UUID).
   * @returns {Promise<Object>} Order object with all details.
   */
  async getOrderByTrackingToken(token) {
    return this.orderRepository.getOrderByTrackingToken(token);
  }
  /**
   * Retrieves an order by ID with optional email verification.
   * @param {string} id - Order UUID.
   * @param {string} [email] - Email address for verification.
   * @returns {Promise<Object|null>} Order object or null if not found.
   * @throws {Error} If email is provided but doesn't match.
   */
  async getOrderById(id, email) {
    const siparis = await this.orderRepository.getOrderById(id);
    if (!siparis) return null;
    if (email && siparis.eposta !== email) {
      throw new Error("Access denied: Email address does not match.");
    }
    return siparis;
  }
  /**
   * Gets installment options for a card BIN.
   * @param {string} bin - First 6 digits of card number.
   * @param {number} amount - Transaction amount.
   * @returns {Promise<Array>} Available installment options.
   */
  async getInstallmentOptions(bin, amount) {
    return this.paramService.getInstallmentOptions(bin, amount);
  }
  /**
   * Retrieves all orders for admin panel.
   */
  async getAllOrdersForAdmin() {
    return this.orderRepository.findAllForAdmin();
  }
  /**
   * Retrieves order details with logs.
   */
  async getOrderByIdWithDetails(id) {
    return this.orderRepository.getOrderByIdWithDetails(id);
  }
  /**
   * Updates an order by admin, logging status change histories.
   */
  async updateOrder(id, body) {
    const currentOrder = await this.orderRepository.getOrderById(id);
    if (!currentOrder) {
      throw new Error("Sipari\u015F bulunamad\u0131.");
    }
    const data = {};
    if (body.durum) data.durum = body.durum;
    if (body.kargoTakipNo !== void 0) data.kargoTakipNo = body.kargoTakipNo;
    if (body.kargoFirmasi !== void 0) data.kargoFirmasi = body.kargoFirmasi;
    if (body.faturaNo !== void 0) data.faturaNo = body.faturaNo;
    if (body.faturaDurumu !== void 0) data.faturaDurumu = body.faturaDurumu;
    if (body.durum === "TESLIM_EDILDI" && !currentOrder.teslimTarihi) {
      data.teslimTarihi = /* @__PURE__ */ new Date();
    }
    const updatedOrder = await this.orderRepository.update(id, data);
    if (body.durum && body.durum !== currentOrder.durum) {
      await this.orderRepository.createOrderHistory({
        siparisId: id,
        eskiDurum: currentOrder.durum,
        yeniDurum: body.durum,
        not: body.not || `Sipari\u015F durumu ${body.durum} olarak g\xFCncellendi.`,
        islemYapan: "ADMIN"
      });
    }
    return updatedOrder;
  }
};

// src/services/paramService.js
init_checked_fetch();
init_modules_watch_stub();
var ParamService = class {
  static {
    __name(this, "ParamService");
  }
  /**
   * Creates an instance of ParamService.
   * @param {Object} config - Configuration object.
   */
  constructor(config2) {
    this.config = config2;
  }
  /**
   * Resolves the ASMX service endpoint from the config baseUrl.
   * Strips '?wsdl' if present.
   * @private
   */
  _getEndpointUrl() {
    const url = this.config.baseUrl || "https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx";
    return url.split("?")[0];
  }
  /**
   * Helper to extract the value of a specific XML tag from a SOAP response string.
   * @private
   */
  _extractTag(xml, tagName) {
    const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, "s");
    const match2 = xml.match(regex);
    return match2 ? match2[1].trim() : null;
  }
  /**
   * Formats amount to Param's expected format (comma as decimal separator).
   * @private
   */
  _formatAmount(amount) {
    return Number(amount).toFixed(2).replace(".", ",");
  }
  /**
   * Validates GUID format (should be 36 characters with dashes).
   * @private
   */
  _validateGuid(guid) {
    if (!guid || guid.length !== 36) {
      console.error(`[Param] Invalid GUID length: ${guid?.length || 0}, expected 36`);
      return false;
    }
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return guidRegex.test(guid);
  }
  /**
   * Sends a raw SOAP request via fetch.
   * @private
   */
  async _sendSoapRequest(actionName, soapBodyContent) {
    const endpoint = this._getEndpointUrl();
    const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${soapBodyContent}
  </soap:Body>
</soap:Envelope>`;
    console.log(`[Param SOAP] Sending request for action: ${actionName} to ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": `https://turkpos.com.tr/${actionName}`
      },
      body: xmlPayload
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Param SOAP request failed with status ${response.status}: ${errText}`);
    }
    return response.text();
  }
  /**
   * Initiates a 3D Secure payment process.
   * Returns HTML form for 3D redirect.
   */
  async startPaymentProcess(order, basketItems, buyer) {
    if (!this._validateGuid(this.config.guid)) {
      throw new Error("Param GUID yap\u0131land\u0131rmas\u0131 ge\xE7ersiz.");
    }
    const islemTutar = this._formatAmount(order.toplamTutar);
    const toplamTutar = this._formatAmount(order.toplamTutar);
    const taksit = 1;
    const orderId = order.siparisNumarasi;
    const errorUrl = `${this.config.callbackUrl}/api/v1/payment/param/error`;
    const successUrl = `${this.config.callbackUrl}/api/v1/payment/param/success`;
    const hashDataString = `${this.config.clientCode}${this.config.guid}${taksit}${islemTutar}${toplamTutar}${orderId}`;
    const encoder = new TextEncoder();
    const hashDataBytes = encoder.encode(hashDataString);
    const hashBuffer = await crypto.subtle.digest("SHA-1", hashDataBytes);
    const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    const cardHolderGSM = buyer.phone?.replace(/\D/g, "") || "";
    const cardExpYear = buyer.cardExpYear.length === 2 ? `20${buyer.cardExpYear}` : buyer.cardExpYear;
    const cardExpMonth = buyer.cardExpMonth.padStart(2, "0");
    const bodyContent = `
    <TP_WMD_UCD xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <KK_Sahibi>${buyer.name} ${buyer.surname}</KK_Sahibi>
      <KK_No>${buyer.cardNumber}</KK_No>
      <KK_SK_Ay>${cardExpMonth}</KK_SK_Ay>
      <KK_SK_Yil>${cardExpYear}</KK_SK_Yil>
      <KK_CVC>${buyer.cardCvc}</KK_CVC>
      <KK_Sahibi_GSM>${cardHolderGSM}</KK_Sahibi_GSM>
      <Hata_URL>${errorUrl}</Hata_URL>
      <Basarili_URL>${successUrl}</Basarili_URL>
      <Siparis_ID>${orderId}</Siparis_ID>
      <Siparis_Aciklama>Sipari\u015F #${orderId}</Siparis_Aciklama>
      <Taksit>${taksit}</Taksit>
      <Islem_Tutar>${islemTutar}</Islem_Tutar>
      <Toplam_Tutar>${toplamTutar}</Toplam_Tutar>
      <Islem_Hash>${hash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <Islem_ID>${orderId}</Islem_ID>
      <IPAdr>${buyer.ip || "127.0.0.1"}</IPAdr>
      <Ref_URL>${this.config.callbackUrl}</Ref_URL>
      <Data1></Data1>
      <Data2></Data2>
      <Data3></Data3>
      <Data4></Data4>
      <Data5></Data5>
    </TP_WMD_UCD>`;
    const responseXml = await this._sendSoapRequest("TP_WMD_UCD", bodyContent);
    const sonuc = this._extractTag(responseXml, "Sonuc");
    const sonucStr = this._extractTag(responseXml, "Sonuc_Str");
    const ucdHtml = this._extractTag(responseXml, "UCD_HTML");
    const dekontId = this._extractTag(responseXml, "Dekont_ID");
    if (sonuc !== "1") {
      console.error("[Param] API Error:", sonucStr);
      throw new Error(sonucStr || "\xD6deme ba\u015Flat\u0131lamad\u0131");
    }
    return {
      status: "success",
      ucdHtml,
      dekontId,
      siparisId: order.id
    };
  }
  /**
   * Verifies payment callback from Param.
   */
  verifyCallback(callbackData) {
    console.log("[Param] Verifying callback:", callbackData);
    const mdStatus = callbackData.mdStatus || callbackData.md_status;
    const isSuccess = mdStatus === "1";
    const siparisNumarasi = callbackData.orderId || callbackData.siparis_id || callbackData.Siparis_ID;
    if (!isSuccess) {
      return {
        status: "failure",
        errorCode: mdStatus,
        errorMessage: callbackData.md_errormessage || "\xD6deme do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z",
        siparisNumarasi
      };
    }
    return {
      status: "success",
      paymentId: callbackData.islemGUID || callbackData.dekont_id || callbackData.Dekont_ID,
      siparisNumarasi,
      amount: callbackData.transactionAmount || callbackData.islem_tutar || callbackData.Islem_Tutar,
      rawResult: callbackData
    };
  }
  /**
   * Cancels/refunds a payment.
   */
  async cancelPayment(dekontId, reason) {
    console.log(`[Param] Cancelling payment ${dekontId}, Reason: ${reason}`);
    const bodyContent = `
    <TP_Islem_Iptal_Iade xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <Durum>IPTAL</Durum>
      <Siparis_ID></Siparis_ID>
      <Dekont_ID>${dekontId}</Dekont_ID>
      <Tutar></Tutar>
    </TP_Islem_Iptal_Iade>`;
    const responseXml = await this._sendSoapRequest("TP_Islem_Iptal_Iade", bodyContent);
    const sonuc = this._extractTag(responseXml, "Sonuc");
    const sonucStr = this._extractTag(responseXml, "Sonuc_Str");
    if (sonuc !== "1") {
      throw new Error(sonucStr || "\u0130ptal i\u015Flemi ba\u015Far\u0131s\u0131z");
    }
    return {
      status: "success",
      dekontId,
      message: "\xD6deme iptal edildi"
    };
  }
  /**
   * Gets installment options for a card BIN.
   */
  async getInstallmentOptions(bin, amount) {
    const formattedAmount = this._formatAmount(amount);
    const bodyContent = `
    <TP_Ozel_Oran_SK_Liste xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <Bin>${bin}</Bin>
      <Tutar>${formattedAmount}</Tutar>
    </TP_Ozel_Oran_SK_Liste>`;
    try {
      const responseXml = await this._sendSoapRequest("TP_Ozel_Oran_SK_Liste", bodyContent);
      const sonuc = this._extractTag(responseXml, "Sonuc");
      if (sonuc !== "1") {
        return [];
      }
      const tempBlocks = responseXml.match(/<Temp>([\s\S]*?)<\/Temp>/g) || [];
      const installments = tempBlocks.map((block) => {
        const taksitMatch = block.match(/<Taksit_Sayisi>(.*?)<\/Taksit_Sayisi>/) || block.match(/<Taksit>(.*?)<\/Taksit>/);
        const komiMatch = block.match(/<Komi_Oran>(.*?)<\/Komi_Oran>/) || block.match(/<Oran>(.*?)<\/Oran>/);
        return {
          Taksit: taksitMatch ? parseInt(taksitMatch[1].trim(), 10) : 1,
          Komi_Oran: komiMatch ? parseFloat(komiMatch[1].trim().replace(",", ".")) : 0
        };
      }).filter((inst) => inst.Taksit > 1);
      return installments.sort((a, b) => a.Taksit - b.Taksit);
    } catch (error) {
      console.error("[Param] Installment Options fetch failed:", error);
      return [];
    }
  }
};

// src/services/emailService.js
init_checked_fetch();
init_modules_watch_stub();
var EmailService = class {
  static {
    __name(this, "EmailService");
  }
  /**
   * Creates an instance of EmailService.
   * @param {Object} smtpConfig - SMTP configuration object (preserved for structure).
   */
  constructor(smtpConfig) {
    const senderString = smtpConfig?.sender || "E-Market <siparis@e-market-domain.com>";
    const replyToString = smtpConfig?.replyTo || "bilgi@e-market-domain.com";
    this.sender = this._parseSenderString(senderString);
    this.replyTo = this._parseSenderString(replyToString);
  }
  /**
   * Helper to parse sender strings like "Name <email@domain.com>"
   * @private
   */
  _parseSenderString(str) {
    const match2 = str.match(/^(.*?)\s*<(.*?)>$/);
    if (match2) {
      return { name: match2[1].trim(), email: match2[2].trim() };
    }
    return { name: "E-Market", email: str.trim() };
  }
  /**
   * Sends an email via Cloudflare Workers Email Routing Send Email API.
   * @private
   */
  async _sendMail({ toEmail, toName, subject, htmlContent }) {
    const env = currentEnv;
    if (!env || !env.EMAIL) {
      console.warn("[Email] Email skipped: Cloudflare EMAIL binding is not configured in c.env");
      return;
    }
    try {
      const { EmailMessage } = await import("cloudflare:email");
      const rawMime = [
        `From: ${this.sender.name} <${this.sender.email}>`,
        `To: ${toName || toEmail} <${toEmail}>`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
        // Base64 encoding for UTF-8 subject compatibility
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        htmlContent
      ].join("\r\n");
      const message = new EmailMessage(
        this.sender.email,
        toEmail,
        rawMime
      );
      await env.EMAIL.send(message);
      console.log("[Email] Email sent successfully via Cloudflare Send Email API.");
    } catch (error) {
      console.error("[Email] Failed to send email via Cloudflare:", error);
    }
  }
  /**
   * Creates a common email template with header, content, and footer.
   * @private
   */
  _createEmailTemplate(title, content, headerColor = "#191919") {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #F4F4F4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F4F4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${headerColor}; padding: 25px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 600;">${title}</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px; color: #191919; line-height: 1.6;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #191919; padding: 20px 30px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #deff36; font-size: 14px; font-weight: 600;">E-MARKET</p>
                            <p style="margin: 0; color: #666666; font-size: 12px;">
                                Bu e-posta otomatik olarak g\xF6nderilmi\u015Ftir. Yan\u0131tlamay\u0131n\u0131z.<br>
                                Sorular\u0131n\u0131z i\xE7in: <a href="mailto:${this.replyTo.email}" style="color: #deff36;">${this.replyTo.email}</a>
                            </p>
                            <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                                \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} E-Market. T\xFCm haklar\u0131 sakl\u0131d\u0131r.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }
  /**
   * Sends order confirmation email to customer.
   */
  async sendOrderConfirmation(toEmail, toName, orderDetails) {
    console.log(`[Email] Sipari\u015F Onay\u0131 g\xF6nderiliyor: ${toEmail} - Sipari\u015F: ${orderDetails.id}`);
    const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;
    const content = `
            <p>Say\u0131n <strong>${toName}</strong>,</p>
            <p>Sipari\u015Finiz ba\u015Far\u0131yla al\u0131nd\u0131 ve haz\u0131rlan\u0131yor. Te\u015Fekk\xFCr ederiz!</p>
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <p style="margin: 5px 0;"><strong>Sipari\u015F No:</strong> #${orderDetails.orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Toplam Tutar:</strong> <span style="font-size: 18px; color: #191919; font-weight: bold;">\u20BA${Number(orderDetails.total).toFixed(2)}</span></p>
            </div>

            <p>Sipari\u015Finizin detaylar\u0131n\u0131, kargo takibini ve faturan\u0131z\u0131 g\xF6r\xFCnt\xFClemek i\xE7in a\u015Fa\u011F\u0131daki butona t\u0131klay\u0131n:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${orderLink}" style="background-color: #dc2a12; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Sipari\u015Fimi G\xF6r\xFCnt\xFCle</a>
            </div>

            <p style="color: #666666; font-size: 13px;">Bizi tercih etti\u011Finiz i\xE7in te\u015Fekk\xFCr ederiz.</p>
        `;
    await this._sendMail({
      toEmail,
      toName,
      subject: `Sipari\u015Finiz Onayland\u0131 \u2705 - #${orderDetails.orderNumber}`,
      htmlContent: this._createEmailTemplate("Sipari\u015Finiz Onayland\u0131!", content)
    });
  }
  /**
   * Sends order cancellation email notification to customer.
   */
  async sendCancellationNotification(toEmail, toName, details) {
    const isRefunded = details.refundStatus === "SUCCESS";
    const refundMessage = isRefunded ? "\xD6deme iadeniz bankan\u0131za iletilmi\u015Ftir. Banka prosed\xFCrlerine g\xF6re 3-7 i\u015F g\xFCn\xFC i\xE7inde hesab\u0131n\u0131za yans\u0131yacakt\u0131r." : "\xD6deme iadesi hakk\u0131nda detayl\u0131 bilgi i\xE7in l\xFCtfen bizimle ileti\u015Fime ge\xE7iniz.";
    const reasonHtml = details.cancelReason ? `<div style="background-color: #F4F4F4; padding: 15px; border-left: 4px solid #dc2a12; margin: 20px 0; color: #191919;">
                 <strong style="display:block; margin-bottom:5px; color: #dc2a12;">\u0130ptal Nedeni:</strong>
                 ${details.cancelReason}
               </div>` : "";
    const content = `
            <p>Say\u0131n <strong>${toName}</strong>,</p>
            <p><strong>#${details.orderNumber}</strong> numaral\u0131 sipari\u015Finiz iptal edilmi\u015Ftir.</p>
            
            ${reasonHtml}
            
            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #deff36;">
                <h3 style="margin: 0 0 10px 0; color: #191919; font-size: 16px;">\u0130ade Durumu</h3>
                <p style="margin: 0; color: #666666;">${refundMessage}</p>
            </div>

            <p style="color: #666666;">Ya\u015Fanan aksakl\u0131k i\xE7in \xF6z\xFCr diler, anlay\u0131\u015F\u0131n\u0131z i\xE7in te\u015Fekk\xFCr ederiz.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${config.clientUrl}" style="background-color: #191919; color: #deff36; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ana Sayfaya D\xF6n</a>
                <br><br>
                <a href="${config.clientUrl}/siparis-takip?token=${details.trackingToken}" style="background-color: #dc2a12; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Sipari\u015F Detay\u0131</a>
            </div>
        `;
    await this._sendMail({
      toEmail,
      toName,
      subject: `Sipari\u015F \u0130ptali - #${details.orderNumber}`,
      htmlContent: this._createEmailTemplate("Sipari\u015F \u0130ptal Bilgilendirmesi", content, "#dc2a12")
    });
  }
  /**
   * Sends internal seller notification for a newly completed order.
   */
  async sendSellerNewOrderNotification(order) {
    const recipient = config.orderNotificationEmail || "bilgi@e-market-domain.com";
    if (!recipient) {
      console.warn("[Email] Seller notification skipped: recipient missing");
      return;
    }
    const orderItems = Array.isArray(order?.kalemler) ? order.kalemler : [];
    const itemRows = orderItems.map((item, index) => {
      const productName = item.urunAdSnapshot || item.urun?.ad || "-";
      const color = item.secilenRenk || "-";
      const qty = Number(item.adet || 0);
      const unitPrice = Number(item.urunFiyatSnapshot || item.fiyat || 0);
      const lineTotal = Number(item.toplamFiyat || qty * unitPrice);
      return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${productName}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${color}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">\u20BA${unitPrice.toFixed(2)}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">\u20BA${lineTotal.toFixed(2)}</td>
                </tr>
            `;
    }).join("");
    const content = `
            <p>Yeni bir sipari\u015F al\u0131nd\u0131.</p>

            <div style="background-color: #F4F4F4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #deff36;">
                <p style="margin: 5px 0;"><strong>Sipari\u015F No:</strong> #${order.siparisNumarasi || "-"}</p>
                <p style="margin: 5px 0;"><strong>Sipari\u015F ID:</strong> ${order.id || "-"}</p>
                <p style="margin: 5px 0;"><strong>Durum:</strong> ${order.durum || "-"}</p>
                <p style="margin: 5px 0;"><strong>\xD6deme Durumu:</strong> ${order.odemeDurumu || "-"}</p>
                <p style="margin: 5px 0;"><strong>Toplam:</strong> <strong>\u20BA${Number(order.toplamTutar || 0).toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Kargo:</strong> \u20BA${Number(order.kargoUcreti || 0).toFixed(2)}</p>
                <p style="margin: 5px 0;"><strong>Olu\u015Fturulma:</strong> ${order.olusturulmaTarihi ? new Date(order.olusturulmaTarihi).toLocaleString("tr-TR") : "-"}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">M\xFC\u015Fteri Bilgileri</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Ad Soyad:</strong> ${order.ad || ""} ${order.soyad || ""}</p>
                <p style="margin: 4px 0;"><strong>E-posta:</strong> ${order.eposta || "-"}</p>
                <p style="margin: 4px 0;"><strong>Telefon:</strong> ${order.telefon || "-"}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Teslimat Adresi</h3>
            <div style="background-color: #F9F9F9; padding: 15px; border-radius: 6px;">
                <p style="margin: 4px 0;"><strong>Adres:</strong> ${order.adres || "-"}</p>
                <p style="margin: 4px 0;"><strong>\u0130l\xE7e / \u015Eehir:</strong> ${order.ilce || "-"} / ${order.sehir || "-"}</p>
                <p style="margin: 4px 0;"><strong>Posta Kodu:</strong> ${order.postaKodu || "-"}</p>
                <p style="margin: 4px 0;"><strong>\xDClke:</strong> ${order.ulke || "T\xFCrkiye"}</p>
            </div>

            <h3 style="margin: 25px 0 10px 0;">Sipari\u015F Kalemleri</h3>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #eee; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #191919; color: #fff;">
                        <th style="padding: 10px; text-align: left;">#</th>
                        <th style="padding: 10px; text-align: left;">\xDCr\xFCn</th>
                        <th style="padding: 10px; text-align: left;">Renk</th>
                        <th style="padding: 10px; text-align: center;">Adet</th>
                        <th style="padding: 10px; text-align: right;">Birim</th>
                        <th style="padding: 10px; text-align: right;">Toplam</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows || '<tr><td colspan="6" style="padding: 12px;">Kalem bulunamad\u0131.</td></tr>'}
                </tbody>
            </table>
        `;
    await this._sendMail({
      toEmail: recipient,
      toName: "E-Market Admin",
      subject: `Yeni Sipari\u015F Al\u0131nd\u0131 - #${order.siparisNumarasi || "-"}`,
      htmlContent: this._createEmailTemplate("Yeni Sipari\u015F Bildirimi", content, "#191919")
    });
  }
};

// src/services/brandService.js
init_checked_fetch();
init_modules_watch_stub();
var BrandService = class {
  static {
    __name(this, "BrandService");
  }
  /**
   * Creates an instance of BrandService.
   * @param {import('../repositories/brandRepository.js').BrandRepository} brandRepository - Brand repository instance.
   */
  constructor(brandRepository2) {
    this.brandRepository = brandRepository2;
  }
  /**
   * Formats brand data (adds CDN prefix to logo URL).
   * @param {Object} brand - Raw brand object from database.
   * @returns {Object|null} Formatted brand with CDN-prefixed logo URL.
   * @private
   */
  _formatBrand(brand) {
    if (!brand) return null;
    let logoUrl = brand.logoUrl;
    if (logoUrl && !logoUrl.startsWith("http") && config.cdnUrl) {
      const baseUrl = config.cdnUrl.endsWith("/") ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
      const path = logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`;
      logoUrl = `${baseUrl}${path}`;
    }
    return {
      ...brand,
      logoUrl
    };
  }
  /**
   * Retrieves all brands sorted by display order.
   * @returns {Promise<Array<Object>>} Array of formatted brands.
   */
  async getAllBrands() {
    const brands = await this.brandRepository.findAll();
    return brands.map((b) => this._formatBrand(b));
  }
  /**
   * Retrieves a single brand by its ID.
   * @param {string} id - Brand UUID.
   * @returns {Promise<Object|null>} Brand object or null if not found.
   */
  async getBrandById(id) {
    const brand = await this.brandRepository.findById(id);
    return this._formatBrand(brand);
  }
  /**
   * Creates a new brand.
   * @param {Object} data - Brand data (ad, slug, logoUrl, aktif, sira).
   * @returns {Promise<Object>} Created brand object.
   */
  async createBrand(data) {
    return this.brandRepository.create(data);
  }
  /**
   * Retrieves a single brand by its URL slug.
   * @param {string} slug - Brand URL slug.
   * @returns {Promise<Object|null>} Brand object or null if not found.
   */
  async getBrandBySlug(slug) {
    const brand = await this.brandRepository.findBySlug(slug);
    return this._formatBrand(brand);
  }
  /**
   * Retrieves all brands (active or not) for admin panel lists.
   */
  async getAllBrandsForAdmin() {
    const brands = await this.brandRepository.findAllForAdmin();
    return brands.map((b) => this._formatBrand(b));
  }
  /**
   * Updates an existing brand.
   */
  async updateBrand(id, data) {
    return this.brandRepository.update(id, data);
  }
  /**
   * Deletes a brand.
   */
  async deleteBrand(id) {
    return this.brandRepository.delete(id);
  }
};

// src/services/settingsService.js
init_checked_fetch();
init_modules_watch_stub();
var SettingsService = class {
  static {
    __name(this, "SettingsService");
  }
  /**
   * @param {import('../repositories/settingsRepository.js').SettingsRepository} settingsRepository
   */
  constructor(settingsRepository2) {
    this.settingsRepository = settingsRepository2;
  }
  /**
   * Fetches the global settings singleton, creating it with defaults if it doesn't exist.
   */
  async getSettings() {
    let settings = await this.settingsRepository.getSettings();
    if (!settings) {
      settings = await this.settingsRepository.createSettings({
        kargoAgirlikCarpani: 15,
        ucretsizKargoAltLimit: 5e3,
        maintenanceMode: false
      });
    }
    return settings;
  }
  /**
   * Updates the global settings singleton.
   */
  async updateSettings(data) {
    return this.settingsRepository.updateSettings(data);
  }
};

// src/services/returnService.js
init_checked_fetch();
init_modules_watch_stub();
var ReturnService = class {
  static {
    __name(this, "ReturnService");
  }
  /**
   * Creates an instance of ReturnService.
   * @param {import('../repositories/returnRepository.js').ReturnRepository} returnRepository
   * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository
   */
  constructor(returnRepository2, orderRepository2) {
    this.returnRepository = returnRepository2;
    this.orderRepository = orderRepository2;
  }
  /**
   * Creates a return request.
   * @param {Object} data - { token, iadeTipi, sebepAciklamasi, fotografUrls }
   */
  async createReturnRequest(data) {
    const { token, iadeTipi, sebepAciklamasi, fotografUrls } = data;
    const order = await this.orderRepository.getOrderByTrackingToken(token);
    if (!order) {
      throw new Error("Sipari\u015F bulunamad\u0131.");
    }
    if (order.durum !== "TESLIM_EDILDI") {
      throw new Error("Sadece teslim edilmi\u015F sipari\u015Fler i\xE7in iade talebi olu\u015Fturulabilir.");
    }
    if (order.iadeTalebi) {
      throw new Error("Bu sipari\u015F i\xE7in zaten bir iade talebi mevcut.");
    }
    const hasNonReturnableItems = Array.isArray(order.kalemler) && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);
    if (hasNonReturnableItems) {
      throw new Error("Bu sipari\u015Fte \xF6zel yap\u0131m/iade edilemez \xFCr\xFCn bulundu\u011Fu i\xE7in iade talebi olu\u015Fturulamaz.");
    }
    if (!order.teslimTarihi) {
      throw new Error("Sipari\u015F teslim tarihi bilgisi eksik, iade i\u015Flemi ba\u015Flat\u0131lam\u0131yor. L\xFCtfen destek ile ileti\u015Fime ge\xE7in.");
    }
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1e3;
    const timeDiff = /* @__PURE__ */ new Date() - new Date(order.teslimTarihi);
    if (timeDiff > fourteenDaysInMs) {
      throw new Error("\u0130ade s\xFCresi (14 g\xFCn) dolmu\u015Ftur.");
    }
    const iade = await this.returnRepository.create({
      siparisId: order.id,
      talepTipi: iadeTipi,
      aciklama: sebepAciklamasi,
      fotografUrls: Array.isArray(fotografUrls) ? JSON.stringify(fotografUrls) : "[]",
      durum: "ONAY_BEKLENIYOR"
    });
    await this.orderRepository.update(order.id, { durum: "IADE_TALEP_EDILDI" });
    return {
      ...iade,
      fotografUrls: Array.isArray(fotografUrls) ? fotografUrls : []
    };
  }
  /**
   * Retrieves the return status of an order.
   */
  async getReturnStatus(token) {
    const order = await this.orderRepository.getOrderByTrackingToken(token);
    if (!order) throw new Error("Sipari\u015F bulunamad\u0131.");
    const iadeTalebi = order.iadeTalebi;
    if (iadeTalebi && typeof iadeTalebi.fotografUrls === "string") {
      try {
        iadeTalebi.fotografUrls = JSON.parse(iadeTalebi.fotografUrls);
      } catch (e) {
        iadeTalebi.fotografUrls = [];
      }
    }
    return iadeTalebi;
  }
  /**
   * Retrieves all return requests for admin panel.
   */
  async getAllReturnsForAdmin() {
    const returns = await this.returnRepository.findAllForAdmin();
    return returns.map((r) => {
      let fotografUrls = [];
      try {
        fotografUrls = typeof r.fotografUrls === "string" ? JSON.parse(r.fotografUrls) : r.fotografUrls;
      } catch (e) {
        fotografUrls = [];
      }
      return { ...r, fotografUrls };
    });
  }
  /**
   * Updates return status by admin, logging status change histories and updating the order status.
   */
  async updateReturnRequest(id, body) {
    const iade = await this.returnRepository.findByIdWithOrder(id);
    if (!iade) {
      throw new Error("\u0130ade talebi bulunamad\u0131.");
    }
    const data = {};
    if (body.durum) data.durum = body.durum;
    if (body.adminNotu !== void 0) data.adminNotu = body.adminNotu;
    if (body.manuelIadeKodu !== void 0) data.manuelIadeKodu = body.manuelIadeKodu;
    const updatedReturn = await this.returnRepository.update(id, data);
    let targetOrderStatus = "IADE_TALEP_EDILDI";
    if (body.durum === "ONAYLANDI") {
      targetOrderStatus = "IADE_EDILDI";
    } else if (body.durum === "REDDEDILDI") {
      targetOrderStatus = "TESLIM_EDILDI";
    }
    await this.orderRepository.update(iade.siparisId, { durum: targetOrderStatus });
    await this.orderRepository.createOrderHistory({
      siparisId: iade.siparisId,
      eskiDurum: iade.siparis.durum,
      yeniDurum: targetOrderStatus,
      not: `\u0130ade talebi ${body.durum} olarak g\xFCncellendi. Admin Notu: ${body.adminNotu || "-"}`,
      islemYapan: "ADMIN"
    });
    return updatedReturn;
  }
};

// src/controllers/productController.js
init_checked_fetch();
init_modules_watch_stub();

// src/utils/asyncHandler.js
init_checked_fetch();
init_modules_watch_stub();
var asyncHandler = /* @__PURE__ */ __name((fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next), "asyncHandler");

// src/controllers/productController.js
var ProductController = class {
  static {
    __name(this, "ProductController");
  }
  /**
   * ProductController örneği oluşturur.
   * @param {import('../services/productService.js').ProductService} productService - Ürün servisi.
   */
  constructor(productService2) {
    this.productService = productService2;
  }
  /**
   * Tüm ürünleri getiren isteği işler.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  getProducts = asyncHandler(async (req, res, next) => {
    const { markaId, kategoriId, kategori, kategoriSlug, oneCikan, firsatUrunu, yeniUrun, cokSatanlar } = req.query;
    const products = await this.productService.getAllProducts({
      markaId,
      kategoriId,
      kategoriSlug: kategoriSlug || kategori,
      // Support both 'kategoriSlug' (from frontend) and 'kategori' (legacy)
      oneCikan: oneCikan === "true",
      firsatUrunu: firsatUrunu === "true",
      yeniUrun: yeniUrun === "true",
      cokSatanlar: cokSatanlar === "true"
    });
    res.json(products);
  });
  /**
   * ID'ye göre ürün detayını getirir ve görüntülenme sayısını artırır.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "\xDCr\xFCn bulunamad\u0131" });
    }
    this.productService.incrementViewCount(id).catch(
      (err2) => console.error("Failed to increment view count:", err2)
    );
    res.json(product);
  });
  /**
   * Slug'a göre ürün detayını getirir.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  getProductBySlug = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const product = await this.productService.getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ error: "\xDCr\xFCn bulunamad\u0131" });
    }
    if (product.id) {
      this.productService.incrementViewCount(product.id).catch(
        (err2) => console.error("Failed to increment view count:", err2)
      );
    }
    res.json(product);
  });
  /**
   * Admin panel product listing.
   */
  adminGetProducts = asyncHandler(async (req, res, next) => {
    const products = await this.productService.getAllProductsForAdmin();
    res.json({ status: "success", data: products });
  });
  /**
   * Admin panel product creation.
   */
  adminCreateProduct = asyncHandler(async (req, res, next) => {
    const body = req.body;
    const slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const product = await this.productService.createProduct({
      ad: body.ad,
      slug,
      fiyat: parseFloat(body.fiyat),
      indirimliFiyat: body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null,
      renkSecenekleri: Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]",
      kartelaIcCephe: !!body.kartelaIcCephe,
      kartelaDisCephe: !!body.kartelaDisCephe,
      iadeImkaniVar: body.iadeImkaniVar !== false,
      agirlik: parseFloat(body.agirlik || 1),
      aciklama: body.aciklama || "",
      resimUrl: body.resimUrl || null,
      aktif: body.aktif !== false,
      oneCikan: !!body.oneCikan,
      firsatUrunu: !!body.firsatUrunu,
      yeniUrun: !!body.yeniUrun,
      cokSatanlar: !!body.cokSatanlar,
      stokAdedi: parseInt(body.stokAdedi || 0, 10),
      varyantBasligi: body.varyantBasligi || null,
      kategoriId: body.kategoriId || null,
      markaId: body.markaId || null
    });
    res.json({ status: "success", data: product });
  });
  /**
   * Admin panel product update.
   */
  adminUpdateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const data = {};
    if (body.ad !== void 0) {
      data.ad = body.ad;
      data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (body.fiyat !== void 0) data.fiyat = parseFloat(body.fiyat);
    if (body.indirimliFiyat !== void 0) data.indirimliFiyat = body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null;
    if (body.renkSecenekleri !== void 0) data.renkSecenekleri = Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]";
    if (body.kartelaIcCephe !== void 0) data.kartelaIcCephe = !!body.kartelaIcCephe;
    if (body.kartelaDisCephe !== void 0) data.kartelaDisCephe = !!body.kartelaDisCephe;
    if (body.iadeImkaniVar !== void 0) data.iadeImkaniVar = body.iadeImkaniVar !== false;
    if (body.agirlik !== void 0) data.agirlik = parseFloat(body.agirlik);
    if (body.aciklama !== void 0) data.aciklama = body.aciklama;
    if (body.resimUrl !== void 0) data.resimUrl = body.resimUrl;
    if (body.aktif !== void 0) data.aktif = body.aktif !== false;
    if (body.oneCikan !== void 0) data.oneCikan = !!body.oneCikan;
    if (body.firsatUrunu !== void 0) data.firsatUrunu = !!body.firsatUrunu;
    if (body.yeniUrun !== void 0) data.yeniUrun = !!body.yeniUrun;
    if (body.cokSatanlar !== void 0) data.cokSatanlar = !!body.cokSatanlar;
    if (body.stokAdedi !== void 0) data.stokAdedi = parseInt(body.stokAdedi, 10);
    if (body.varyantBasligi !== void 0) data.varyantBasligi = body.varyantBasligi;
    if (body.kategoriId !== void 0) data.kategoriId = body.kategoriId || null;
    if (body.markaId !== void 0) data.markaId = body.markaId || null;
    const product = await this.productService.updateProduct(id, data);
    res.json({ status: "success", data: product });
  });
  /**
   * Admin panel product delete.
   */
  adminDeleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    res.json({ status: "success", message: "\xDCr\xFCn silindi." });
  });
};

// src/controllers/categoryController.js
init_checked_fetch();
init_modules_watch_stub();
var CategoryController = class {
  static {
    __name(this, "CategoryController");
  }
  /**
   * CategoryController örneği oluşturur.
   * @param {import('../services/categoryService.js').CategoryService} categoryService - Kategori servisi.
   */
  constructor(categoryService2) {
    this.categoryService = categoryService2;
  }
  /**
   * Tüm kategorileri getiren isteği işler.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  getCategories = asyncHandler(async (req, res, next) => {
    const categories = await this.categoryService.getAllCategories();
    res.json(categories);
  });
  /**
   * Admin panel category listing.
   */
  adminGetCategories = asyncHandler(async (req, res, next) => {
    const categories = await this.categoryService.getAllCategoriesForAdmin();
    res.json({ status: "success", data: categories });
  });
  /**
   * Admin panel category creation.
   */
  adminCreateCategory = asyncHandler(async (req, res, next) => {
    const body = req.body;
    const slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cat = await this.categoryService.createCategory({
      ad: body.ad,
      slug,
      resim: body.resim || null,
      sira: parseInt(body.sira || 0, 10),
      aktif: body.aktif !== false
    });
    res.json({ status: "success", data: cat });
  });
  /**
   * Admin panel category update.
   */
  adminUpdateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const data = {};
    if (body.ad !== void 0) {
      data.ad = body.ad;
      data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (body.resim !== void 0) data.resim = body.resim;
    if (body.sira !== void 0) data.sira = parseInt(body.sira, 10);
    if (body.aktif !== void 0) data.aktif = body.aktif !== false;
    const cat = await this.categoryService.updateCategory(id, data);
    res.json({ status: "success", data: cat });
  });
  /**
   * Admin panel category delete.
   */
  adminDeleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await this.categoryService.deleteCategory(id);
    res.json({ status: "success", message: "Kategori silindi." });
  });
};

// src/controllers/orderController.js
init_checked_fetch();
init_modules_watch_stub();
var OrderController = class {
  static {
    __name(this, "OrderController");
  }
  /**
   * OrderController örneği oluşturur.
   * @param {import('../services/orderService.js').OrderService} orderService - Sipariş servisi.
   */
  constructor(orderService2) {
    this.orderService = orderService2;
  }
  /**
   * Checkout (Ödeme Başlatma) işlemini yönetir.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  createCheckoutSession = asyncHandler(async (req, res, next) => {
    const result = await this.orderService.processCheckout(req.body);
    res.json(result);
  });
  /**
   * Güvenli token ile sipariş takibini sağlar.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  trackOrder = asyncHandler(async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ status: "failure", errorMessage: "Takip kodu eksik." });
    }
    const order = await this.orderService.getOrderByTrackingToken(token);
    if (!order) {
      return res.status(404).json({ status: "failure", errorMessage: "Sipari\u015F bulunamad\u0131." });
    }
    res.json({
      status: "success",
      data: {
        siparisNumarasi: order.siparisNumarasi,
        durum: order.durum,
        olusturulmaTarihi: order.olusturulmaTarihi,
        // Financials
        toplamTutar: order.toplamTutar,
        kargoUcreti: order.kargoUcreti,
        araToplam: (Number(order.toplamTutar) - Number(order.kargoUcreti)).toFixed(2),
        // Items
        kalemler: order.kalemler.map((item) => ({
          urunAd: item.urunAdSnapshot,
          secilenRenk: item.secilenRenk,
          adet: item.adet,
          birimFiyat: item.urunFiyatSnapshot,
          toplamFiyat: item.toplamFiyat,
          iadeyeUygunMu: item.iadeyeUygunMuSnapshot
        })),
        // Safe Location Info ONLY
        teslimatAdresi: {
          ilce: order.ilce,
          sehir: order.sehir,
          acikAdres: "* G\xFCvenlik nedeniyle tam adres gizlenmi\u015Ftir."
        }
      }
    });
  });
  /**
   * Bir siparişi iptal eder.
   * 
   * @param {import('express').Request} req - Express istek nesnesi.
   * @param {import('express').Response} res - Express yanıt nesnesi.
   * @param {import('express').NextFunction} next - Express next fonksiyonu.
   */
  cancelOrder = asyncHandler(async (req, res, next) => {
    const { token, reason } = req.body;
    if (!token) {
      return res.status(400).json({ status: "failure", errorMessage: "Takip kodu (token) gereklidir." });
    }
    try {
      const result = await this.orderService.cancelOrder(token, reason);
      res.json(result);
    } catch (error) {
      return res.status(400).json({ status: "failure", errorMessage: error.message });
    }
  });
  /**
   * Admin panel order listing.
   */
  adminGetOrders = asyncHandler(async (req, res, next) => {
    const orders = await this.orderService.getAllOrdersForAdmin();
    res.json({ status: "success", data: orders });
  });
  /**
   * Admin panel order details.
   */
  adminGetOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await this.orderService.getOrderByIdWithDetails(id);
    if (!order) {
      return res.status(404).json({ status: "error", errorMessage: "Sipari\u015F bulunamad\u0131." });
    }
    res.json({ status: "success", data: order });
  });
  /**
   * Admin panel order status / detail update.
   */
  adminUpdateOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
      const updatedOrder = await this.orderService.updateOrder(id, req.body);
      res.json({ status: "success", data: updatedOrder });
    } catch (error) {
      res.status(400).json({ status: "error", errorMessage: error.message });
    }
  });
};

// src/controllers/paymentController.js
init_checked_fetch();
init_modules_watch_stub();
var PaymentController = class {
  static {
    __name(this, "PaymentController");
  }
  /**
   * Creates an instance of PaymentController.
   * @param {import('../services/orderService.js').OrderService} orderService - Order service.
   */
  constructor(orderService2) {
    this.orderService = orderService2;
  }
  /**
   * Initiates payment process with credit card details.
   * Called via AJAX from the frontend checkout page.
   * 
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  initiatePayment = asyncHandler(async (req, res) => {
    const { orderId, cardInfo, buyerInfo } = req.body;
    if (!orderId || !cardInfo) {
      return res.status(400).json({
        status: "failure",
        message: "Sipari\u015F ID ve Kart Bilgileri zorunludur."
      });
    }
    const result = await this.orderService.initiateParamPayment(orderId, cardInfo, buyerInfo);
    if (result.status === "success") {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  });
  /**
   * Handles successful 3D Secure callback from Param.
   * Param redirects user here via POST if 3D verification is successful.
   * 
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  handleParamSuccess = asyncHandler(async (req, res) => {
    console.log("Payment Success Callback:", req.body);
    try {
      const result = await this.orderService.completePayment(req.body);
      if (result.status === "success") {
        const redirectUrl = `${config.clientUrl}/payment/success?orderNumber=${result.orderNumber}&trackingToken=${result.trackingToken}`;
        console.log("Redirecting to Success:", redirectUrl);
        res.redirect(redirectUrl);
      } else {
        const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(result.errorMessage)}`;
        res.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Callback Handling Error:", error);
      res.redirect(`${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent("Sistem hatas\u0131 olu\u015Ftu.")}`);
    }
  });
  /**
   * Handles failed 3D Secure callback from Param.
   * Param redirects here if 3D authentication fails or user cancels.
   * 
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  handleParamError = asyncHandler(async (req, res) => {
    console.log("Payment Error Callback:", req.body);
    const errorMessage = req.body.md_errormessage || req.body.Sonuc_Str || "\xD6deme i\u015Flemi ba\u015Far\u0131s\u0131z oldu veya iptal edildi.";
    const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(errorMessage)}`;
    console.log("Redirecting to Failure:", redirectUrl);
    res.redirect(redirectUrl);
  });
  /**
   * Gets installment options for a card BIN.
   * Called when user enters first 6 digits of card number.
   * 
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  getInstallments = asyncHandler(async (req, res) => {
    const { amount } = req.query;
    const rawBin = req.query.bin;
    let binValue = null;
    if (typeof rawBin === "string") {
      binValue = rawBin;
    } else if (Array.isArray(rawBin) && typeof rawBin[0] === "string") {
      binValue = rawBin[0];
    }
    if (!binValue || binValue.length < 6) {
      return res.status(400).json({
        status: "failure",
        message: "Kart BIN numaras\u0131 (ilk 6 hane) gereklidir."
      });
    }
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({
        status: "failure",
        message: "Ge\xE7erli bir tutar gereklidir."
      });
    }
    try {
      const installments = await this.orderService.getInstallmentOptions(binValue, Number(amount));
      res.json({
        status: "success",
        installments
      });
    } catch (error) {
      console.error("Installment fetch error:", error);
      res.json({
        status: "success",
        installments: []
        // Return empty if error (no installments available)
      });
    }
  });
};

// src/controllers/brandController.js
init_checked_fetch();
init_modules_watch_stub();
var BrandController = class {
  static {
    __name(this, "BrandController");
  }
  constructor(brandService2) {
    this.brandService = brandService2;
  }
  getBrands = asyncHandler(async (req, res, next) => {
    const brands = await this.brandService.getAllBrands();
    res.json(brands);
  });
  getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await this.brandService.getBrandById(id);
    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamad\u0131" });
    }
    res.json(brand);
  });
  getBrandBySlug = asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const brand = await this.brandService.getBrandBySlug(slug);
    if (!brand) {
      return res.status(404).json({ message: "Marka bulunamad\u0131" });
    }
    res.json(brand);
  });
  /**
   * Admin panel brand listing.
   */
  adminGetBrands = asyncHandler(async (req, res, next) => {
    const brands = await this.brandService.getAllBrandsForAdmin();
    res.json({ status: "success", data: brands });
  });
  /**
   * Admin panel brand creation.
   */
  adminCreateBrand = asyncHandler(async (req, res, next) => {
    const body = req.body;
    const slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const marka = await this.brandService.createBrand({
      ad: body.ad,
      slug,
      logoUrl: body.logoUrl || null,
      sira: parseInt(body.sira || 0, 10),
      aktif: body.aktif !== false
    });
    res.json({ status: "success", data: marka });
  });
  /**
   * Admin panel brand update.
   */
  adminUpdateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    const data = {};
    if (body.ad !== void 0) {
      data.ad = body.ad;
      data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (body.logoUrl !== void 0) data.logoUrl = body.logoUrl;
    if (body.sira !== void 0) data.sira = parseInt(body.sira, 10);
    if (body.aktif !== void 0) data.aktif = body.aktif !== false;
    const marka = await this.brandService.updateBrand(id, data);
    res.json({ status: "success", data: marka });
  });
  /**
   * Admin panel brand delete.
   */
  adminDeleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await this.brandService.deleteBrand(id);
    res.json({ status: "success", message: "Marka silindi." });
  });
};

// src/controllers/settingsController.js
init_checked_fetch();
init_modules_watch_stub();
var SettingsController = class {
  static {
    __name(this, "SettingsController");
  }
  /**
   * @param {import('../services/settingsService.js').SettingsService} settingsService
   */
  constructor(settingsService2) {
    this.settingsService = settingsService2;
  }
  /**
   * Get system settings (Public or Admin)
   */
  getSettings = asyncHandler(async (req, res, next) => {
    const settings = await this.settingsService.getSettings();
    res.json(settings);
  });
  /**
   * Update system settings (Admin)
   */
  updateSettings = asyncHandler(async (req, res, next) => {
    const body = req.body;
    const data = {};
    if (body.kargoAgirlikCarpani !== void 0) data.kargoAgirlikCarpani = parseFloat(body.kargoAgirlikCarpani);
    if (body.ambarEsikAgirlik !== void 0) data.ambarEsikAgirlik = parseInt(body.ambarEsikAgirlik, 10);
    if (body.ucretsizKargoAltLimit !== void 0) data.ucretsizKargoAltLimit = parseFloat(body.ucretsizKargoAltLimit);
    if (body.kargoFiyatListesi !== void 0) {
      data.kargoFiyatListesi = typeof body.kargoFiyatListesi === "object" ? JSON.stringify(body.kargoFiyatListesi) : body.kargoFiyatListesi;
    }
    if (body.maintenanceMode !== void 0) data.maintenanceMode = !!body.maintenanceMode;
    const settings = await this.settingsService.updateSettings(data);
    res.json({ status: "success", data: settings });
  });
};

// src/controllers/returnController.js
init_checked_fetch();
init_modules_watch_stub();
var ReturnController = class {
  static {
    __name(this, "ReturnController");
  }
  /**
   * @param {import('../services/returnService.js').ReturnService} returnService
   */
  constructor(returnService2) {
    this.returnService = returnService2;
  }
  createReturnRequest = asyncHandler(async (req, res, next) => {
    const { token, iadeTipi, sebepAciklamasi, fotografUrls } = req.body;
    if (!token) {
      return res.status(400).json({ status: "error", errorMessage: "Takip tokeni gerekli." });
    }
    const result = await this.returnService.createReturnRequest({
      token,
      iadeTipi,
      sebepAciklamasi,
      fotografUrls
    });
    res.json({ status: "success", data: result, message: "\u0130ade talebiniz olu\u015Fturuldu. Onay bekleniyor." });
  });
  getReturnStatus = asyncHandler(async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ status: "error", errorMessage: "Token gerekli." });
    }
    const result = await this.returnService.getReturnStatus(token);
    res.json({ status: "success", data: result });
  });
  /**
   * Admin panel return requests listing.
   */
  adminGetAllReturns = asyncHandler(async (req, res, next) => {
    const returns = await this.returnService.getAllReturnsForAdmin();
    res.json({ status: "success", data: returns });
  });
  /**
   * Admin panel return request approval / rejection.
   */
  adminUpdateReturnRequest = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
      const updatedReturn = await this.returnService.updateReturnRequest(id, req.body);
      res.json({ status: "success", data: updatedReturn });
    } catch (error) {
      res.status(400).json({ status: "error", errorMessage: error.message });
    }
  });
};

// src/controllers/seoController.js
init_checked_fetch();
init_modules_watch_stub();
var SeoController = class {
  static {
    __name(this, "SeoController");
  }
  /**
   * @param {import('../repositories/productRepository.js').ProductRepository} productRepository
   */
  constructor(productRepository2) {
    this.productRepository = productRepository2;
  }
  /**
   * Generate dynamic sitemap.xml
   * Includes all active products and categories
   */
  getSitemap = asyncHandler(async (req, res, next) => {
    const baseUrl = config.clientUrl || "https://e-market.com";
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const products = await this.productRepository.findAll({
      where: { aktif: true },
      select: { slug: true, guncellenmeTarihi: true }
    });
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/checkout</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/siparis-takip</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
    for (const product of products) {
      if (!product.slug) continue;
      xml += `  <url>
    <loc>${baseUrl}/urun/${product.slug}</loc>
    <lastmod>${product.guncellenmeTarihi?.toISOString().split("T")[0] || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }
    xml += `</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });
};

// src/controllers/feedController.js
init_checked_fetch();
init_modules_watch_stub();
var FeedController = class {
  static {
    __name(this, "FeedController");
  }
  /**
   * @param {import('../repositories/productRepository.js').ProductRepository} productRepository
   */
  constructor(productRepository2) {
    this.productRepository = productRepository2;
  }
  /**
   * Escapes special XML characters to prevent parsing errors.
   * @private
   */
  _escapeXml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }
  /**
   * Maps internal category to Google Product Category taxonomy.
   * @private
   */
  _mapToGoogleCategory(kategori) {
    const categoryMappings = {
      "elektronik": "222",
      // Electronics
      "giyim-aksesuar": "166",
      // Apparel & Accessories
      "ev-yasam": "536",
      // Home & Garden
      "spor-outdoor": "988"
      // Sporting Goods
    };
    if (kategori?.slug && categoryMappings[kategori.slug]) {
      return categoryMappings[kategori.slug];
    }
    return "536";
  }
  /**
   * Generates Google Shopping XML Feed.
   * Endpoint: GET /api/v1/feeds/google
   */
  getGoogleShoppingFeed = asyncHandler(async (req, res, next) => {
    const token = req.query.token;
    const secretToken = config.googleMerchantToken;
    if (secretToken && token !== secretToken) {
      return res.status(401).send("Unauthorized: Invalid or missing feed token");
    }
    const urunler = await this.productRepository.findAll({
      where: {
        aktif: true,
        stokAdedi: { gt: 0 }
      },
      include: {
        kategori: true,
        marka: true,
        resimler: {
          orderBy: { sira: "asc" },
          take: 1
          // Only need first image
        }
      }
    });
    const baseUrl = config.clientUrl || "https://e-market.com";
    const cdnUrl = config.cdnUrl || "https://cdn.e-market.com";
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>E-Market \xDCr\xFCn Katalo\u011Fu</title>
    <link>${baseUrl}</link>
    <description>E-Market \xDCr\xFCn Katalo\u011Fu - Sunucusuz H\u0131zl\u0131 Al\u0131\u015Fveri\u015F</description>`;
    for (const urun of urunler) {
      let imageUrl = urun.resimUrl;
      if (urun.resimler && urun.resimler.length > 0) {
        imageUrl = urun.resimler[0].url;
      }
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${cdnUrl}/${imageUrl.replace(/^\//, "")}`;
      }
      const price = urun.indirimliFiyat ? Number(urun.indirimliFiyat).toFixed(2) : Number(urun.fiyat).toFixed(2);
      const salePrice = urun.indirimliFiyat ? `<g:sale_price>${Number(urun.indirimliFiyat).toFixed(2)} TRY</g:sale_price>` : "";
      const originalPrice = urun.indirimliFiyat ? Number(urun.fiyat).toFixed(2) : price;
      xml += `
    <item>
      <g:id>${this._escapeXml(urun.id)}</g:id>
      <g:title>${this._escapeXml(urun.ad)}</g:title>
      <g:description>${this._escapeXml(urun.aciklama || urun.ad)}</g:description>
      <g:link>${baseUrl}/product/${this._escapeXml(urun.id)}</g:link>
      <g:image_link>${this._escapeXml(imageUrl || "")}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:shipping_weight>${Number(urun.agirlik || 1).toFixed(2)} kg</g:shipping_weight>
      <g:price>${originalPrice} TRY</g:price>
      ${salePrice}
      <g:brand>${this._escapeXml(urun.marka?.ad || "E-Market")}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${this._mapToGoogleCategory(urun.kategori)}</g:google_product_category>
      <g:product_type>${this._escapeXml(urun.kategori?.ad || "Genel")}</g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Kargo</g:service>
        <g:price>0 TRY</g:price>
      </g:shipping>
    </item>`;
    }
    xml += `
  </channel>
</rss>`;
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.status(200).send(xml);
  });
  /**
   * Returns feed statistics for admin monitoring.
   * Endpoint: GET /api/v1/feeds/google/stats
   */
  getFeedStats = asyncHandler(async (req, res, next) => {
    const totalProducts = await this.productRepository.model.count({ where: { aktif: true } });
    const inStockProducts = await this.productRepository.model.count({
      where: { aktif: true, stokAdedi: { gt: 0 } }
    });
    res.json({
      totalActiveProducts: totalProducts,
      productsInFeed: inStockProducts,
      feedUrl: "/api/v1/feeds/google",
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
};

// src/controllers/uploadController.js
init_checked_fetch();
init_modules_watch_stub();
var UploadController = class {
  static {
    __name(this, "UploadController");
  }
  /**
   * Upload image file to R2 bucket.
   */
  uploadImage = asyncHandler(async (req, res, next) => {
    const file = req.body.file;
    if (!file || typeof file.arrayBuffer !== "function") {
      return res.status(400).json({ status: "error", errorMessage: "Dosya y\xFCklenemedi veya ge\xE7ersiz." });
    }
    const env = currentEnv;
    if (!env || !env.IMAGES_BUCKET) {
      return res.status(500).json({ status: "error", errorMessage: "G\xF6rsel depolama servisi yap\u0131land\u0131r\u0131lmam\u0131\u015F." });
    }
    const extension = file.name.split(".").pop() || "webp";
    const key = `products/${crypto.randomUUID()}.${extension}`;
    const buffer = await file.arrayBuffer();
    await env.IMAGES_BUCKET.put(key, buffer, {
      httpMetadata: { contentType: file.type || "image/webp" }
    });
    res.json({
      status: "success",
      key,
      url: `${config.cdnUrl}/${key}`
    });
  });
};

// src/container.js
var productRepository = new ProductRepository(prisma_default);
var categoryRepository = new CategoryRepository(prisma_default);
var orderRepository = new OrderRepository(prisma_default);
var brandRepository = new BrandRepository(prisma_default);
var settingsRepository = new SettingsRepository(prisma_default);
var returnRepository = new ReturnRepository(prisma_default);
var paramService = new ParamService(config.param);
var emailService = new EmailService(config.brevo.smtp);
var productService = new ProductService(productRepository, categoryRepository, prisma_default);
var categoryService = new CategoryService(categoryRepository);
var settingsService = new SettingsService(settingsRepository);
var returnService = new ReturnService(returnRepository, orderRepository);
var orderService = new OrderService(orderRepository, productService, paramService, emailService);
var brandService = new BrandService(brandRepository);
var productController = new ProductController(productService);
var categoryController = new CategoryController(categoryService);
var orderController = new OrderController(orderService);
var paymentController = new PaymentController(orderService);
var brandController = new BrandController(brandService);
var settingsController = new SettingsController(settingsService);
var returnController = new ReturnController(returnService);
var seoController = new SeoController(productRepository);
var feedController = new FeedController(productRepository);
var uploadController = new UploadController();

// src/utils/honoAdapter.js
init_checked_fetch();
init_modules_watch_stub();
var adapt = /* @__PURE__ */ __name((expressMethod) => {
  return async (c) => {
    let statusCode = 200;
    let responseBody = null;
    let redirectUrl = null;
    const headersMap = {};
    const queryParams = c.req.query();
    const routeParams = c.req.param();
    let body = {};
    if (c.req.method === "POST" || c.req.method === "PUT" || c.req.method === "PATCH") {
      const contentType = c.req.header("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          body = await c.req.json();
        } catch (e) {
          body = {};
        }
      } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
        try {
          body = await c.req.parseBody();
        } catch (e) {
          body = {};
        }
      }
    }
    const parsedBody = c.get("parsedBody");
    const reqBody = parsedBody || body;
    const req = {
      query: queryParams,
      params: routeParams,
      body: reqBody,
      headers: c.req.header(),
      method: c.req.method,
      url: c.req.url
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      set(name2, value) {
        headersMap[name2] = value;
        return this;
      },
      header(name2, value) {
        headersMap[name2] = value;
        return this;
      },
      json(data) {
        responseBody = data;
        return this;
      },
      redirect(url) {
        redirectUrl = url;
        return this;
      },
      send(data) {
        responseBody = data;
        return this;
      }
    };
    const next = /* @__PURE__ */ __name((err2) => {
      if (err2) {
        throw err2;
      }
    }, "next");
    await expressMethod(req, res, next);
    if (Object.keys(headersMap).length > 0) {
      for (const [name2, value] of Object.entries(headersMap)) {
        c.header(name2, value);
      }
    }
    if (redirectUrl) {
      return c.redirect(redirectUrl);
    }
    if (responseBody !== null) {
      if (typeof responseBody === "object") {
        return c.json(responseBody, statusCode);
      }
      return c.text(responseBody, statusCode);
    }
    return c.body(null, statusCode);
  };
}, "adapt");

// src/routes/productRoutes.js
var router = new Hono2();
router.get("/", async (c) => {
  console.log("[DEBUG] GET /api/v1/products route handler hit!");
  return adapt(productController.getProducts)(c);
});
router.get("/slug/:slug", adapt(productController.getProductBySlug));
router.get("/:id", adapt(productController.getProduct));
var productRoutes_default = router;

// src/routes/categoryRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router2 = new Hono2();
router2.get("/", adapt(categoryController.getCategories));
var categoryRoutes_default = router2;

// src/routes/brandRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router3 = new Hono2();
router3.get("/", adapt(brandController.getBrands));
router3.get("/slug/:slug", adapt(brandController.getBrandBySlug));
router3.get("/:id", adapt(brandController.getBrand));
var brandRoutes_default = router3;

// src/routes/orderRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router4 = new Hono2();
router4.post("/checkout", adapt(orderController.createCheckoutSession));
router4.get("/track", adapt(orderController.trackOrder));
router4.post("/cancel", adapt(orderController.cancelOrder));
var orderRoutes_default = router4;

// src/routes/returnRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router5 = new Hono2();
router5.post("/request", adapt(returnController.createReturnRequest));
router5.get("/status", adapt(returnController.getReturnStatus));
var returnRoutes_default = router5;

// src/routes/paymentRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router6 = new Hono2();
router6.post("/success", adapt(paymentController.handleParamSuccess));
router6.post("/error", adapt(paymentController.handleParamError));
router6.post("/initiate", adapt(paymentController.initiatePayment));
router6.get("/installments", adapt(paymentController.getInstallments));
var paymentRoutes_default = router6;

// src/routes/settingsRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router7 = new Hono2();
router7.get("/", adapt(settingsController.getSettings));
var settingsRoutes_default = router7;

// src/routes/feedRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router8 = new Hono2();
router8.get("/google", adapt(feedController.getGoogleShoppingFeed));
router8.get("/google/stats", adapt(feedController.getFeedStats));
var feedRoutes_default = router8;

// src/routes/seoRoutes.js
init_checked_fetch();
init_modules_watch_stub();
var router9 = new Hono2();
router9.get("/sitemap.xml", adapt(seoController.getSitemap));
var seoRoutes_default = router9;

// src/routes/adminRoutes.js
init_checked_fetch();
init_modules_watch_stub();

// src/middlewares/adminAuth.js
init_checked_fetch();
init_modules_watch_stub();
var adminAuth = /* @__PURE__ */ __name(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ status: "error", errorMessage: "Yetkisiz eri\u015Fim! Oturum bulunamad\u0131." }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify2(token, config.adminJwtSecret);
    c.set("adminUser", payload);
    await next();
  } catch (e) {
    return c.json({ status: "error", errorMessage: "Oturum s\xFCresi dolmu\u015F veya ge\xE7ersiz token!" }, 401);
  }
}, "adminAuth");

// src/routes/adminRoutes.js
var router10 = new Hono2();
router10.use("*", adminAuth);
router10.post("/upload", adapt(uploadController.uploadImage));
router10.get("/products", adapt(productController.adminGetProducts));
router10.post("/products", adapt(productController.adminCreateProduct));
router10.put("/products/:id", adapt(productController.adminUpdateProduct));
router10.delete("/products/:id", adapt(productController.adminDeleteProduct));
router10.get("/categories", adapt(categoryController.adminGetCategories));
router10.post("/categories", adapt(categoryController.adminCreateCategory));
router10.put("/categories/:id", adapt(categoryController.adminUpdateCategory));
router10.delete("/categories/:id", adapt(categoryController.adminDeleteCategory));
router10.get("/brands", adapt(brandController.adminGetBrands));
router10.post("/brands", adapt(brandController.adminCreateBrand));
router10.put("/brands/:id", adapt(brandController.adminUpdateBrand));
router10.delete("/brands/:id", adapt(brandController.adminDeleteBrand));
router10.get("/orders", adapt(orderController.adminGetOrders));
router10.get("/orders/:id", adapt(orderController.adminGetOrder));
router10.put("/orders/:id", adapt(orderController.adminUpdateOrder));
router10.get("/returns", adapt(returnController.adminGetAllReturns));
router10.put("/returns/:id", adapt(returnController.adminUpdateReturnRequest));
router10.get("/settings", adapt(settingsController.getSettings));
router10.put("/settings", adapt(settingsController.updateSettings));
var adminRoutes_default = router10;

// src/app.js
var app = new Hono2();
app.use("*", cors({
  origin: /* @__PURE__ */ __name((origin) => {
    return origin;
  }, "origin"),
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true
}));
app.use("*", async (c, next) => {
  initConfig(c.env);
  getPrisma(c.env);
  await next();
});
app.get("/api/v1/health", (c) => {
  return c.json({ status: "UP", timestamp: /* @__PURE__ */ new Date() });
});
app.get("/api/v1/debug-db", async (c) => {
  try {
    const result = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const urunler = await c.env.DB.prepare("SELECT * FROM urunler").all();
    const kategoriler = await c.env.DB.prepare("SELECT * FROM kategoriler").all();
    return c.json({ tables: result.results, urunler: urunler.results, kategoriler: kategoriler.results });
  } catch (e) {
    return c.json({ error: e.message, stack: e.stack }, 500);
  }
});
app.post("/api/v1/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const adminEmail = c.env.ADMIN_EMAIL || "admin@e-market.com";
    const adminPassword = c.env.ADMIN_PASSWORD || "admin12345";
    if (email === adminEmail && password === adminPassword) {
      const payload = {
        email: adminEmail,
        exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24
        // 24 Hours validity
      };
      const token = await sign2(payload, config.adminJwtSecret);
      return c.json({ status: "success", token });
    }
    return c.json({ status: "error", errorMessage: "E-posta veya \u015Fifre hatal\u0131!" }, 401);
  } catch (e) {
    return c.json({ status: "error", errorMessage: "Ge\xE7ersiz giri\u015F verisi!" }, 400);
  }
});
app.route("/api/v1/products", productRoutes_default);
app.route("/api/v1/categories", categoryRoutes_default);
app.route("/api/v1/brands", brandRoutes_default);
app.route("/api/v1/orders", orderRoutes_default);
app.route("/api/v1/returns", returnRoutes_default);
app.route("/api/v1/payment/param", paymentRoutes_default);
app.route("/api/v1/settings", settingsRoutes_default);
app.route("/api/v1/feeds", feedRoutes_default);
app.route("/", seoRoutes_default);
app.route("/api/v1", seoRoutes_default);
app.route("/api/v1/admin", adminRoutes_default);
app.onError(errorHandler2);
var app_default = app;

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-2Kfb2C/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = app_default;

// ../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-2Kfb2C/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=app.js.map

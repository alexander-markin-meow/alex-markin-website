import "./leafEditor.es.js";
const ro = 1, io = 2, Ys = 4, qs = 8, Qt = 32, Ce = 64, ee = 128, _s = 31, wr = 63, Xe = 127, Uu = 2147483647, ue = Math.floor, Wn = Math.abs, Xr = (t, e) => t < e ? t : e, ut = (t, e) => t > e ? t : e, Fu = Math.pow, Rc = (t) => t !== 0 ? t < 0 : 1 / t < 0, ns = Number.MAX_SAFE_INTEGER, oo = Number.MIN_SAFE_INTEGER, ju = Number.isInteger || ((t) => typeof t == "number" && isFinite(t) && ue(t) === t), Re = () => /* @__PURE__ */ new Set(), Gs = (t) => t[t.length - 1], Hu = (t, e) => {
  for (let n = 0; n < e.length; n++)
    t.push(e[n]);
}, Se = Array.from, Zr = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (!e(t[n], n, t))
      return !1;
  return !0;
}, Nc = (t, e) => {
  for (let n = 0; n < t.length; n++)
    if (e(t[n], n, t))
      return !0;
  return !1;
}, zu = (t, e) => {
  const n = new Array(t);
  for (let s = 0; s < t; s++)
    n[s] = e(s, n);
  return n;
}, As = Array.isArray, Uc = String.fromCharCode, Bu = (t) => t.toLowerCase(), Vu = /^\s*/g, Ku = (t) => t.replace(Vu, ""), Wu = /([A-Z])/g, co = (t, e) => Ku(t.replace(Wu, (n) => `${e}${Bu(n)}`)), Yu = (t) => {
  const e = unescape(encodeURIComponent(t)), n = e.length, s = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    s[r] = /** @type {number} */
    e.codePointAt(r);
  return s;
}, en = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), qu = (t) => en.encode(t), Gu = en ? qu : Yu;
let Wt = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Wt && Wt.decode(new Uint8Array()).length === 1 && (Wt = null);
const Ju = (t, e) => zu(e, () => t).join(""), ge = (t) => new Error(t), ae = () => {
  throw ge("Method unimplemented");
}, ie = () => {
  throw ge("Unexpected case");
};
class Cn {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const V = () => new Cn(), Qr = (t) => {
  let e = t.cpos;
  for (let n = 0; n < t.bufs.length; n++)
    e += t.bufs[n].length;
  return e;
}, A = (t) => {
  const e = new Uint8Array(Qr(t));
  let n = 0;
  for (let s = 0; s < t.bufs.length; s++) {
    const r = t.bufs[s];
    e.set(r, n), n += r.length;
  }
  return e.set(new Uint8Array(t.cbuf.buffer, 0, t.cpos), n), e;
}, Xu = (t, e) => {
  const n = t.cbuf.length;
  n - t.cpos < e && (t.bufs.push(new Uint8Array(t.cbuf.buffer, 0, t.cpos)), t.cbuf = new Uint8Array(ut(n, e) * 2), t.cpos = 0);
}, N = (t, e) => {
  const n = t.cbuf.length;
  t.cpos === n && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(n * 2), t.cpos = 0), t.cbuf[t.cpos++] = e;
}, br = N, w = (t, e) => {
  for (; e > Xe; )
    N(t, ee | Xe & e), e = ue(e / 128);
  N(t, Xe & e);
}, ei = (t, e) => {
  const n = Rc(e);
  for (n && (e = -e), N(t, (e > wr ? ee : 0) | (n ? Ce : 0) | wr & e), e = ue(e / 64); e > 0; )
    N(t, (e > Xe ? ee : 0) | Xe & e), e = ue(e / 128);
}, vr = new Uint8Array(3e4), Zu = vr.length / 3, Qu = (t, e) => {
  if (e.length < Zu) {
    const n = en.encodeInto(e, vr).written || 0;
    w(t, n);
    for (let s = 0; s < n; s++)
      N(t, vr[s]);
  } else
    T(t, Gu(e));
}, eh = (t, e) => {
  const n = unescape(encodeURIComponent(e)), s = n.length;
  w(t, s);
  for (let r = 0; r < s; r++)
    N(
      t,
      /** @type {number} */
      n.codePointAt(r)
    );
}, Ze = en && /** @type {any} */
en.encodeInto ? Qu : eh, ks = (t, e) => {
  const n = t.cbuf.length, s = t.cpos, r = Xr(n - s, e.length), i = e.length - r;
  t.cbuf.set(e.subarray(0, r), s), t.cpos += r, i > 0 && (t.bufs.push(t.cbuf), t.cbuf = new Uint8Array(ut(n * 2, i)), t.cbuf.set(e.subarray(r)), t.cpos = i);
}, T = (t, e) => {
  w(t, e.byteLength), ks(t, e);
}, ti = (t, e) => {
  Xu(t, e);
  const n = new DataView(t.cbuf.buffer, t.cpos, e);
  return t.cpos += e, n;
}, th = (t, e) => ti(t, 4).setFloat32(0, e, !1), nh = (t, e) => ti(t, 8).setFloat64(0, e, !1), sh = (t, e) => (
  /** @type {any} */
  ti(t, 8).setBigInt64(0, e, !1)
), ao = new DataView(new ArrayBuffer(4)), rh = (t) => (ao.setFloat32(0, t), ao.getFloat32(0) === t), tn = (t, e) => {
  switch (typeof e) {
    case "string":
      N(t, 119), Ze(t, e);
      break;
    case "number":
      ju(e) && Wn(e) <= Uu ? (N(t, 125), ei(t, e)) : rh(e) ? (N(t, 124), th(t, e)) : (N(t, 123), nh(t, e));
      break;
    case "bigint":
      N(t, 122), sh(t, e);
      break;
    case "object":
      if (e === null)
        N(t, 126);
      else if (As(e)) {
        N(t, 117), w(t, e.length);
        for (let n = 0; n < e.length; n++)
          tn(t, e[n]);
      } else if (e instanceof Uint8Array)
        N(t, 116), T(t, e);
      else {
        N(t, 118);
        const n = Object.keys(e);
        w(t, n.length);
        for (let s = 0; s < n.length; s++) {
          const r = n[s];
          Ze(t, r), tn(t, e[r]);
        }
      }
      break;
    case "boolean":
      N(t, e ? 120 : 121);
      break;
    default:
      N(t, 127);
  }
};
class lo extends Cn {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(e) {
    super(), this.w = e, this.s = null, this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(e) {
    this.s === e ? this.count++ : (this.count > 0 && w(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
  }
}
const uo = (t) => {
  t.count > 0 && (ei(t.encoder, t.count === 1 ? t.s : -t.s), t.count > 1 && w(t.encoder, t.count - 2));
};
class Yn {
  constructor() {
    this.encoder = new Cn(), this.s = 0, this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.s === e ? this.count++ : (uo(this), this.count = 1, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return uo(this), A(this.encoder);
  }
}
const ho = (t) => {
  if (t.count > 0) {
    const e = t.diff * 2 + (t.count === 1 ? 0 : 1);
    ei(t.encoder, e), t.count > 1 && w(t.encoder, t.count - 2);
  }
};
class Js {
  constructor() {
    this.encoder = new Cn(), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(e) {
    this.diff === e - this.s ? (this.s = e, this.count++) : (ho(this), this.count = 1, this.diff = e - this.s, this.s = e);
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    return ho(this), A(this.encoder);
  }
}
class ih {
  constructor() {
    this.sarr = [], this.s = "", this.lensE = new Yn();
  }
  /**
   * @param {string} string
   */
  write(e) {
    this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
  }
  toUint8Array() {
    const e = new Cn();
    return this.sarr.push(this.s), this.s = "", Ze(e, this.sarr.join("")), ks(e, this.lensE.toUint8Array()), A(e);
  }
}
const Fc = ge("Unexpected end of array"), jc = ge("Integer out of Range");
class xs {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const ze = (t) => new xs(t), oh = (t) => t.pos !== t.arr.length, ch = (t, e) => {
  const n = new Uint8Array(t.arr.buffer, t.pos + t.arr.byteOffset, e);
  return t.pos += e, n;
}, B = (t) => ch(t, b(t)), Et = (t) => t.arr[t.pos++], b = (t) => {
  let e = 0, n = 1;
  const s = t.arr.length;
  for (; t.pos < s; ) {
    const r = t.arr[t.pos++];
    if (e = e + (r & Xe) * n, n *= 128, r < ee)
      return e;
    if (e > ns)
      throw jc;
  }
  throw Fc;
}, ni = (t) => {
  let e = t.arr[t.pos++], n = e & wr, s = 64;
  const r = (e & Ce) > 0 ? -1 : 1;
  if ((e & ee) === 0)
    return r * n;
  const i = t.arr.length;
  for (; t.pos < i; ) {
    if (e = t.arr[t.pos++], n = n + (e & Xe) * s, s *= 128, e < ee)
      return r * n;
    if (n > ns)
      throw jc;
  }
  throw Fc;
}, ah = (t) => {
  let e = b(t);
  if (e === 0)
    return "";
  {
    let n = String.fromCodePoint(Et(t));
    if (--e < 100)
      for (; e--; )
        n += String.fromCodePoint(Et(t));
    else
      for (; e > 0; ) {
        const s = e < 1e4 ? e : 1e4, r = t.arr.subarray(t.pos, t.pos + s);
        t.pos += s, n += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          r
        ), e -= s;
      }
    return decodeURIComponent(escape(n));
  }
}, lh = (t) => (
  /** @type any */
  Wt.decode(B(t))
), Oe = Wt ? lh : ah, si = (t, e) => {
  const n = new DataView(t.arr.buffer, t.arr.byteOffset + t.pos, e);
  return t.pos += e, n;
}, uh = (t) => si(t, 4).getFloat32(0, !1), hh = (t) => si(t, 8).getFloat64(0, !1), dh = (t) => (
  /** @type {any} */
  si(t, 8).getBigInt64(0, !1)
), fh = [
  (t) => {
  },
  // CASE 127: undefined
  (t) => null,
  // CASE 126: null
  ni,
  // CASE 125: integer
  uh,
  // CASE 124: float32
  hh,
  // CASE 123: float64
  dh,
  // CASE 122: bigint
  (t) => !1,
  // CASE 121: boolean (false)
  (t) => !0,
  // CASE 120: boolean (true)
  Oe,
  // CASE 119: string
  (t) => {
    const e = b(t), n = {};
    for (let s = 0; s < e; s++) {
      const r = Oe(t);
      n[r] = nn(t);
    }
    return n;
  },
  (t) => {
    const e = b(t), n = [];
    for (let s = 0; s < e; s++)
      n.push(nn(t));
    return n;
  },
  B
  // CASE 116: Uint8Array
], nn = (t) => fh[127 - Et(t)](t);
class fo extends xs {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(e, n) {
    super(e), this.reader = n, this.s = null, this.count = 0;
  }
  read() {
    return this.count === 0 && (this.s = this.reader(this), oh(this) ? this.count = b(this) + 1 : this.count = -1), this.count--, /** @type {T} */
    this.s;
  }
}
class qn extends xs {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = ni(this);
      const e = Rc(this.s);
      this.count = 1, e && (this.s = -this.s, this.count = b(this) + 2);
    }
    return this.count--, /** @type {number} */
    this.s;
  }
}
class Xs extends xs {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    super(e), this.s = 0, this.count = 0, this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const e = ni(this), n = e & 1;
      this.diff = ue(e / 2), this.count = 1, n && (this.count = b(this) + 2);
    }
    return this.s += this.diff, this.count--, this.s;
  }
}
class ph {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(e) {
    this.decoder = new qn(e), this.str = Oe(this.decoder), this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const e = this.spos + this.decoder.read(), n = this.str.slice(this.spos, e);
    return this.spos = e, n;
  }
}
const _t = Date.now, J = () => /* @__PURE__ */ new Map(), Cr = (t) => {
  const e = J();
  return t.forEach((n, s) => {
    e.set(s, n);
  }), e;
}, be = (t, e, n) => {
  let s = t.get(e);
  return s === void 0 && t.set(e, s = n()), s;
}, gh = (t, e) => {
  const n = [];
  for (const [s, r] of t)
    n.push(e(r, s));
  return n;
}, yh = (t, e) => {
  for (const [n, s] of t)
    if (e(s, n))
      return !0;
  return !1;
};
class mh {
  constructor() {
    this._observers = J();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(e, n) {
    return be(
      this._observers,
      /** @type {string} */
      e,
      Re
    ).add(n), n;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(e, n) {
    const s = (...r) => {
      this.off(
        e,
        /** @type {any} */
        s
      ), n(...r);
    };
    this.on(
      e,
      /** @type {any} */
      s
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(e, n) {
    const s = this._observers.get(e);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return Se((this._observers.get(e) || J()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = J();
  }
}
class Hc {
  constructor() {
    this._observers = J();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, n) {
    be(this._observers, e, Re).add(n);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(e, n) {
    const s = (...r) => {
      this.off(e, s), n(...r);
    };
    this.on(e, s);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(e, n) {
    const s = this._observers.get(e);
    s !== void 0 && (s.delete(n), s.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(e, n) {
    return Se((this._observers.get(e) || J()).values()).forEach((s) => s(...n));
  }
  destroy() {
    this._observers = J();
  }
}
const sn = /* @__PURE__ */ Symbol("Equality"), zc = (t, e) => t === e || !!t?.[sn]?.(e) || !1, wh = (t) => typeof t == "object", bh = Object.assign, vh = Object.keys, Ch = (t, e) => {
  for (const n in t)
    e(t[n], n);
}, Sh = (t, e) => {
  const n = [];
  for (const s in t)
    n.push(e(t[s], s));
  return n;
}, ss = (t) => vh(t).length, Eh = (t) => {
  for (const e in t)
    return !1;
  return !0;
}, Sn = (t, e) => {
  for (const n in t)
    if (!e(t[n], n))
      return !1;
  return !0;
}, ri = (t, e) => Object.prototype.hasOwnProperty.call(t, e), _h = (t, e) => t === e || ss(t) === ss(e) && Sn(t, (n, s) => (n !== void 0 || ri(e, s)) && zc(e[s], n)), ii = (t, e, n = 0) => {
  try {
    for (; n < t.length; n++)
      t[n](...e);
  } finally {
    n < t.length && ii(t, e, n + 1);
  }
}, Ah = (t) => t, wt = (t, e) => {
  if (t === e)
    return !0;
  if (t == null || e == null || t.constructor !== e.constructor && (t.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (t[sn] != null)
    return t[sn](e);
  switch (t.constructor) {
    case ArrayBuffer:
      t = new Uint8Array(t), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (t.byteLength !== e.byteLength)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (t[n] !== e[n])
          return !1;
      break;
    }
    case Set: {
      if (t.size !== e.size)
        return !1;
      for (const n of t)
        if (!e.has(n))
          return !1;
      break;
    }
    case Map: {
      if (t.size !== e.size)
        return !1;
      for (const n of t.keys())
        if (!e.has(n) || !wt(t.get(n), e.get(n)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (ss(t) !== ss(e))
        return !1;
      for (const n in t)
        if (!ri(t, n) || !wt(t[n], e[n]))
          return !1;
      break;
    case Array:
      if (t.length !== e.length)
        return !1;
      for (let n = 0; n < t.length; n++)
        if (!wt(t[n], e[n]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, kh = (t, e) => e.includes(t), xh = crypto.getRandomValues.bind(crypto), Bc = () => xh(new Uint32Array(1))[0], Dh = "10000000-1000-4000-8000" + -1e11, Lh = () => Dh.replace(
  /[018]/g,
  /** @param {number} c */
  (t) => (t ^ Bc() & 15 >> t / 4).toString(16)
), po = (t) => (
  /** @type {Promise<T>} */
  new Promise(t)
);
Promise.all.bind(Promise);
const go = (t) => t === void 0 ? null : t;
class Th {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(e, n) {
    this.map.set(e, n);
  }
  /**
   * @param {string} key
   */
  getItem(e) {
    return this.map.get(e);
  }
}
let Vc = new Th(), oi = !0;
try {
  typeof localStorage < "u" && localStorage && (Vc = localStorage, oi = !1);
} catch {
}
const Kc = Vc, Mh = (t) => oi || addEventListener(
  "storage",
  /** @type {any} */
  t
), $h = (t) => oi || removeEventListener(
  "storage",
  /** @type {any} */
  t
), At = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Wc = typeof window < "u" && typeof document < "u" && !At;
let de;
const Oh = () => {
  if (de === void 0)
    if (At) {
      de = J();
      const t = process.argv;
      let e = null;
      for (let n = 0; n < t.length; n++) {
        const s = t[n];
        s[0] === "-" ? (e !== null && de.set(e, ""), e = s) : e !== null && (de.set(e, s), e = null);
      }
      e !== null && de.set(e, "");
    } else typeof location == "object" ? (de = J(), (location.search || "?").slice(1).split("&").forEach((t) => {
      if (t.length !== 0) {
        const [e, n] = t.split("=");
        de.set(`--${co(e, "-")}`, n), de.set(`-${co(e, "-")}`, n);
      }
    })) : de = J();
  return de;
}, Sr = (t) => Oh().has(t), Er = (t) => go(At ? process.env[t.toUpperCase().replaceAll("-", "_")] : Kc.getItem(t)), Yc = (t) => Sr("--" + t) || Er(t) !== null, Ih = Yc("production"), Ph = At && kh(process.env.FORCE_COLOR, ["true", "1", "2"]), Rh = Ph || !Sr("--no-colors") && // @todo deprecate --no-colors
!Yc("no-color") && (!At || process.stdout.isTTY) && (!At || Sr("--color") || Er("COLORTERM") !== null || (Er("TERM") || "").includes("color")), qc = (t) => new Uint8Array(t), Nh = (t, e, n) => new Uint8Array(t, e, n), Uh = (t) => new Uint8Array(t), Fh = (t) => {
  let e = "";
  for (let n = 0; n < t.byteLength; n++)
    e += Uc(t[n]);
  return btoa(e);
}, jh = (t) => Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("base64"), Hh = (t) => {
  const e = atob(t), n = qc(e.length);
  for (let s = 0; s < e.length; s++)
    n[s] = e.charCodeAt(s);
  return n;
}, zh = (t) => {
  const e = Buffer.from(t, "base64");
  return Nh(e.buffer, e.byteOffset, e.byteLength);
}, Bh = Wc ? Fh : jh, Vh = Wc ? Hh : zh, Kh = (t) => {
  const e = qc(t.byteLength);
  return e.set(t), e;
};
class Wh {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor(e, n) {
    this.left = e, this.right = n;
  }
}
const ve = (t, e) => new Wh(t, e), yo = (t) => t.next() >= 0.5, Zs = (t, e, n) => ue(t.next() * (n + 1 - e) + e), Gc = (t, e, n) => ue(t.next() * (n + 1 - e) + e), ci = (t, e, n) => Gc(t, e, n), Yh = (t) => Uc(ci(t, 97, 122)), qh = (t, e = 0, n = 20) => {
  const s = ci(t, e, n);
  let r = "";
  for (let i = 0; i < s; i++)
    r += Yh(t);
  return r;
}, Qs = (t, e) => e[ci(t, 0, e.length - 1)], Gh = /* @__PURE__ */ Symbol("0schema");
class Jh {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(e, n, s, r = null) {
    this._rerrs.push({ path: e, expected: n, has: s, message: r });
  }
  toString() {
    const e = [];
    for (let n = this._rerrs.length - 1; n > 0; n--) {
      const s = this._rerrs[n];
      e.push(Ju(" ", (this._rerrs.length - n) * 2) + `${s.path != null ? `[${s.path}] ` : ""}${s.has} doesn't match ${s.expected}. ${s.message}`);
    }
    return e.join(`
`);
  }
}
const _r = (t, e) => t === e ? !0 : t == null || e == null || t.constructor !== e.constructor ? !1 : t[sn] ? zc(t, e) : As(t) ? Zr(
  t,
  (n) => Nc(e, (s) => _r(n, s))
) : wh(t) ? Sn(
  t,
  (n, s) => _r(n, e[s])
) : !1;
class q {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = !1;
  /**
   * @param {Schema<any>} other
   */
  extends(e) {
    let [n, s] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      e.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([s, n] = [n, s]), _r(n, s)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && wt(this.shape, e.shape);
  }
  [Gh]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [sn](e) {
    return this.equals(
      /** @type {any} */
      e
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(e) {
    return this.check(e);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(e, n) {
    ae();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return It(this, $s);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Zc(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(e) {
    return mo(e, this), /** @type {any} */
    e;
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(e) {
    return mo(e, this), e;
  }
}
class ai extends q {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(e, n = void 0) {
    const s = e?.constructor === this.shape && (this._c == null || this._c(e));
    return !s && n?.extend(null, this.shape.name, e?.constructor.name, e?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), s;
  }
}
const M = (t, e = null) => new ai(t, e);
M(ai);
class li extends q {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(e, n) {
    const s = this.shape(e);
    return !s && n?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), s;
  }
}
const H = (t) => new li(t);
M(li);
class Ds extends q {
  /**
   * @param {Array<T>} literals
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(e, n) {
    const s = this.shape.some((r) => r === e);
    return !s && n?.extend(null, this.shape.join(" | "), e.toString()), s;
  }
}
const Ls = (...t) => new Ds(t), Jc = M(Ds), Xh = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((t) => t.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Xc = (t) => {
  if (kt.check(t))
    return [Xh(t)];
  if (Jc.check(t))
    return (
      /** @type {Array<string|number>} */
      t.shape.map((e) => e + "")
    );
  if (ca.check(t))
    return ["[+-]?\\d+.?\\d*"];
  if (aa.check(t))
    return [".*"];
  if (rs.check(t))
    return t.shape.map(Xc).flat(1);
  ie();
};
class Zh extends q {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Xc).map((n) => `(${n.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(e, n) {
    const s = this._r.exec(e) != null;
    return !s && n?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), s;
  }
}
M(Zh);
const Qh = /* @__PURE__ */ Symbol("optional");
class Zc extends q {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(e, n) {
    const s = e === void 0 || this.shape.check(e);
    return !s && n?.extend(null, "undefined (optional)", "()"), s;
  }
  get [Qh]() {
    return !0;
  }
}
const ed = M(Zc);
class td extends q {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, n) {
    return n?.extend(null, "never", typeof e), !1;
  }
}
M(td);
class Ts extends q {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(e, n = !1) {
    super(), this.shape = e, this._isPartial = n;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new Ts(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, n) {
    return e == null ? (n?.extend(null, "object", "null"), !1) : Sn(this.shape, (s, r) => {
      const i = this._isPartial && !ri(e, r) || s.check(e[r], n);
      return !i && n?.extend(r.toString(), s.toString(), typeof e[r], "Object property does not match"), i;
    });
  }
}
const nd = (t) => (
  /** @type {any} */
  new Ts(t)
), sd = M(Ts), rd = H((t) => t != null && (t.constructor === Object || t.constructor == null));
class Qc extends q {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(e, n) {
    super(), this.shape = {
      keys: e,
      values: n
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(e, n) {
    return e != null && Sn(e, (s, r) => {
      const i = this.shape.keys.check(r, n);
      return !i && n?.extend(r + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(s, n);
    });
  }
}
const ea = (t, e) => new Qc(t, e), id = M(Qc);
class ta extends q {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(e, n) {
    return e != null && Sn(this.shape, (s, r) => {
      const i = (
        /** @type {Schema<any>} */
        s.check(e[r], n)
      );
      return !i && n?.extend(r.toString(), "Tuple", typeof s), i;
    });
  }
}
const od = (...t) => new ta(t);
M(ta);
class na extends q {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new ui(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, n) {
    const s = As(e) && Zr(e, (r) => this.shape.check(r));
    return !s && n?.extend(null, "Array", ""), s;
  }
}
const sa = (...t) => new na(t), cd = M(na), ad = H((t) => As(t));
class ra extends q {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(e, n) {
    super(), this.shape = e, this._c = n;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(e, n) {
    const s = e instanceof this.shape && (this._c == null || this._c(e));
    return !s && n?.extend(null, this.shape.name, e?.constructor.name), s;
  }
}
const ld = (t, e = null) => new ra(t, e);
M(ra);
const ud = ld(q);
class hd extends q {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = od(...e.slice(-1)), this.res = e[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(e, n) {
    const s = e.constructor === Function && e.length <= this.len;
    return !s && n?.extend(null, "function", typeof e), s;
  }
}
const dd = M(hd), fd = H((t) => typeof t == "function");
class pd extends q {
  /**
   * @param {T} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(e, n) {
    const s = Zr(this.shape, (r) => r.check(e, n));
    return !s && n?.extend(null, "Intersectinon", typeof e), s;
  }
}
M(pd, (t) => t.shape.length > 0);
class ui extends q {
  static _dilutes = !0;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(e, n) {
    const s = Nc(this.shape, (r) => r.check(e, n));
    return n?.extend(null, "Union", typeof e), s;
  }
}
const It = (...t) => t.findIndex((e) => rs.check(e)) >= 0 ? It(...t.map((e) => rn(e)).map((e) => rs.check(e) ? e.shape : [e]).flat(1)) : t.length === 1 ? t[0] : new ui(t), rs = (
  /** @type {Schema<$Union<any>>} */
  M(ui)
), ia = () => !0, is = H(ia), gd = (
  /** @type {Schema<Schema<any>>} */
  M(li, (t) => t.shape === ia)
), hi = H((t) => typeof t == "bigint"), yd = (
  /** @type {Schema<Schema<BigInt>>} */
  H((t) => t === hi)
), oa = H((t) => typeof t == "symbol");
H((t) => t === oa);
const bt = H((t) => typeof t == "number"), ca = (
  /** @type {Schema<Schema<number>>} */
  H((t) => t === bt)
), kt = H((t) => typeof t == "string"), aa = (
  /** @type {Schema<Schema<string>>} */
  H((t) => t === kt)
), Ms = H((t) => typeof t == "boolean"), md = (
  /** @type {Schema<Schema<Boolean>>} */
  H((t) => t === Ms)
), la = Ls(void 0);
M(Ds, (t) => t.shape.length === 1 && t.shape[0] === void 0);
Ls(void 0);
const $s = Ls(null), wd = (
  /** @type {Schema<Schema<null>>} */
  M(Ds, (t) => t.shape.length === 1 && t.shape[0] === null)
);
M(Uint8Array);
M(ai, (t) => t.shape === Uint8Array);
const bd = It(bt, kt, $s, la, hi, Ms, oa);
(() => {
  const t = (
    /** @type {$Array<$any>} */
    sa(is)
  ), e = (
    /** @type {$Record<$string,$any>} */
    ea(kt, is)
  ), n = It(bt, kt, $s, Ms, t, e);
  return t.shape = n, e.shape.values = n, n;
})();
const rn = (t) => {
  if (ud.check(t))
    return (
      /** @type {any} */
      t
    );
  if (rd.check(t)) {
    const e = {};
    for (const n in t)
      e[n] = rn(t[n]);
    return (
      /** @type {any} */
      nd(e)
    );
  } else {
    if (ad.check(t))
      return (
        /** @type {any} */
        It(...t.map(rn))
      );
    if (bd.check(t))
      return (
        /** @type {any} */
        Ls(t)
      );
    if (fd.check(t))
      return (
        /** @type {any} */
        M(
          /** @type {any} */
          t
        )
      );
  }
  ie();
}, mo = Ih ? () => {
} : (t, e) => {
  const n = new Jh();
  if (!e.check(t, n))
    throw ge(`Expected value to be of type ${e.constructor.name}.
${n.toString()}`);
};
class vd {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor(e) {
    this.patterns = [], this.$state = e;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(e, n) {
    return this.patterns.push({ if: rn(e), h: n }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(is, e);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (e, n) => {
        for (let s = 0; s < this.patterns.length; s++) {
          const r = this.patterns[s];
          if (r.if.check(e))
            return r.h(e, n);
        }
        throw ge("Unhandled pattern");
      }
    );
  }
}
const Cd = (t) => new vd(
  /** @type {any} */
  t
), ua = (
  /** @type {any} */
  Cd(
    /** @type {Schema<prng.PRNG>} */
    is
  ).if(ca, (t, e) => Zs(e, oo, ns)).if(aa, (t, e) => qh(e)).if(md, (t, e) => yo(e)).if(yd, (t, e) => BigInt(Zs(e, oo, ns))).if(rs, (t, e) => dt(e, Qs(e, t.shape))).if(sd, (t, e) => {
    const n = {};
    for (const s in t.shape) {
      let r = t.shape[s];
      if (ed.check(r)) {
        if (yo(e))
          continue;
        r = r.shape;
      }
      n[s] = ua(r, e);
    }
    return n;
  }).if(cd, (t, e) => {
    const n = [], s = Gc(e, 0, 42);
    for (let r = 0; r < s; r++)
      n.push(dt(e, t.shape));
    return n;
  }).if(Jc, (t, e) => Qs(e, t.shape)).if(wd, (t, e) => null).if(dd, (t, e) => {
    const n = dt(e, t.res);
    return () => n;
  }).if(gd, (t, e) => dt(e, Qs(e, [
    bt,
    kt,
    $s,
    la,
    hi,
    Ms,
    sa(bt),
    ea(It("a", "b", "c"), bt)
  ]))).if(id, (t, e) => {
    const n = {}, s = Zs(e, 0, 3);
    for (let r = 0; r < s; r++) {
      const i = dt(e, t.shape.keys), o = dt(e, t.shape.values);
      n[i] = o;
    }
    return n;
  }).done()
), dt = (t, e) => (
  /** @type {any} */
  ua(rn(e), t)
), Os = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
H((t) => t.nodeType === kd);
typeof DOMParser < "u" && new DOMParser();
H((t) => t.nodeType === Ed);
H((t) => t.nodeType === _d);
const Sd = (t) => gh(t, (e, n) => `${n}:${e};`).join(""), Ed = Os.ELEMENT_NODE, _d = Os.TEXT_NODE, Ad = Os.DOCUMENT_NODE, kd = Os.DOCUMENT_FRAGMENT_NODE;
H((t) => t.nodeType === Ad);
const Ae = Symbol, ha = Ae(), da = Ae(), xd = Ae(), Dd = Ae(), Ld = Ae(), fa = Ae(), Td = Ae(), pa = Ae(), Md = Ae(), $d = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [];
  let s = 0;
  for (; s < t.length; s++) {
    const r = t[s];
    if (r === void 0)
      break;
    if (r.constructor === String || r.constructor === Number)
      e.push(r);
    else if (r.constructor === Object)
      break;
  }
  for (s > 0 && n.push(e.join("")); s < t.length; s++) {
    const r = t[s];
    r instanceof Symbol || n.push(r);
  }
  return n;
}, Od = {
  [ha]: ve("font-weight", "bold"),
  [da]: ve("font-weight", "normal"),
  [xd]: ve("color", "blue"),
  [Ld]: ve("color", "green"),
  [Dd]: ve("color", "grey"),
  [fa]: ve("color", "red"),
  [Td]: ve("color", "purple"),
  [pa]: ve("color", "orange"),
  // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [Md]: ve("color", "black")
}, Id = (t) => {
  t.length === 1 && t[0]?.constructor === Function && (t = /** @type {Array<string|Symbol|Object|number>} */
  /** @type {[function]} */
  t[0]());
  const e = [], n = [], s = J();
  let r = [], i = 0;
  for (; i < t.length; i++) {
    const o = t[i], c = Od[o];
    if (c !== void 0)
      s.set(c.left, c.right);
    else {
      if (o === void 0)
        break;
      if (o.constructor === String || o.constructor === Number) {
        const a = Sd(s);
        i > 0 || a.length > 0 ? (e.push("%c" + o), n.push(a)) : e.push(o);
      } else
        break;
    }
  }
  for (i > 0 && (r = n, r.unshift(e.join(""))); i < t.length; i++) {
    const o = t[i];
    o instanceof Symbol || r.push(o);
  }
  return r;
}, Pd = Rh ? Id : $d, Rd = (...t) => {
  console.log(...Pd(t)), Nd.forEach((e) => e.print(t));
}, Nd = Re(), ga = (t) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next: t
}), Ud = (t, e) => ga(() => {
  let n;
  do
    n = t.next();
  while (!n.done && !e(n.value));
  return n;
}), er = (t, e) => ga(() => {
  const { done: n, value: s } = t.next();
  return { done: n, value: n ? void 0 : e(s) };
});
class di {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(e, n) {
    this.clock = e, this.len = n;
  }
}
class En {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
}
const ya = (t, e, n) => e.clients.forEach((s, r) => {
  const i = (
    /** @type {Array<GC|Item>} */
    t.doc.store.clients.get(r)
  );
  for (let o = 0; o < s.length; o++) {
    const c = s[o];
    La(t, i, c.clock, c.len, n);
  }
}), Fd = (t, e) => {
  let n = 0, s = t.length - 1;
  for (; n <= s; ) {
    const r = ue((n + s) / 2), i = t[r], o = i.clock;
    if (o <= e) {
      if (e < o + i.len)
        return r;
      n = r + 1;
    } else
      s = r - 1;
  }
  return null;
}, ma = (t, e) => {
  const n = t.clients.get(e.client);
  return n !== void 0 && Fd(n, e.clock) !== null;
}, fi = (t) => {
  t.clients.forEach((e) => {
    e.sort((r, i) => r.clock - i.clock);
    let n, s;
    for (n = 1, s = 1; n < e.length; n++) {
      const r = e[s - 1], i = e[n];
      r.clock + r.len >= i.clock ? r.len = ut(r.len, i.clock + i.len - r.clock) : (s < n && (e[s] = i), s++);
    }
    e.length = s;
  });
}, jd = (t) => {
  const e = new En();
  for (let n = 0; n < t.length; n++)
    t[n].clients.forEach((s, r) => {
      if (!e.clients.has(r)) {
        const i = s.slice();
        for (let o = n + 1; o < t.length; o++)
          Hu(i, t[o].clients.get(r) || []);
        e.clients.set(r, i);
      }
    });
  return fi(e), e;
}, os = (t, e, n, s) => {
  be(t.clients, e, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new di(n, s));
}, Hd = () => new En(), zd = (t) => {
  const e = Hd();
  return t.clients.forEach((n, s) => {
    const r = [];
    for (let i = 0; i < n.length; i++) {
      const o = n[i];
      if (o.deleted) {
        const c = o.id.clock;
        let a = o.length;
        if (i + 1 < n.length)
          for (let l = n[i + 1]; i + 1 < n.length && l.deleted; l = n[++i + 1])
            a += l.length;
        r.push(new di(c, a));
      }
    }
    r.length > 0 && e.clients.set(s, r);
  }), e;
}, Pt = (t, e) => {
  w(t.restEncoder, e.clients.size), Se(e.clients.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
    t.resetDsCurVal(), w(t.restEncoder, n);
    const r = s.length;
    w(t.restEncoder, r);
    for (let i = 0; i < r; i++) {
      const o = s[i];
      t.writeDsClock(o.clock), t.writeDsLen(o.len);
    }
  });
}, pi = (t) => {
  const e = new En(), n = b(t.restDecoder);
  for (let s = 0; s < n; s++) {
    t.resetDsCurVal();
    const r = b(t.restDecoder), i = b(t.restDecoder);
    if (i > 0) {
      const o = be(e.clients, r, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let c = 0; c < i; c++)
        o.push(new di(t.readDsClock(), t.readDsLen()));
    }
  }
  return e;
}, wo = (t, e, n) => {
  const s = new En(), r = b(t.restDecoder);
  for (let i = 0; i < r; i++) {
    t.resetDsCurVal();
    const o = b(t.restDecoder), c = b(t.restDecoder), a = n.clients.get(o) || [], l = F(n, o);
    for (let u = 0; u < c; u++) {
      const h = t.readDsClock(), d = h + t.readDsLen();
      if (h < l) {
        l < d && os(s, o, l, d - l);
        let f = he(a, h), p = a[f];
        for (!p.deleted && p.id.clock < h && (a.splice(f + 1, 0, hs(e, p, h - p.id.clock)), f++); f < a.length && (p = a[f++], p.id.clock < d); )
          p.deleted || (d < p.id.clock + p.length && a.splice(f, 0, hs(e, p, d - p.id.clock)), p.delete(e));
      } else
        os(s, o, h, d - h);
    }
  }
  if (s.clients.size > 0) {
    const i = new nt();
    return w(i.restEncoder, 0), Pt(i, s), i.toUint8Array();
  }
  return null;
}, wa = Bc;
class ke extends mh {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid: e = Lh(), collectionid: n = null, gc: s = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: o = !1, shouldLoad: c = !0 } = {}) {
    super(), this.gc = s, this.gcFilter = r, this.clientID = wa(), this.guid = e, this.collectionid = n, this.share = /* @__PURE__ */ new Map(), this.store = new xa(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = c, this.autoLoad = o, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.whenLoaded = po((l) => {
      this.on("load", () => {
        this.isLoaded = !0, l(this);
      });
    });
    const a = () => po((l) => {
      const u = (h) => {
        (h === void 0 || h === !0) && (this.off("sync", u), l());
      };
      this.on("sync", u);
    });
    this.on("sync", (l) => {
      l === !1 && this.isSynced && (this.whenSynced = a()), this.isSynced = l === void 0 || l === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
    }), this.whenSynced = a();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const e = this._item;
    e !== null && !this.shouldLoad && E(
      /** @type {any} */
      e.parent.doc,
      (n) => {
        n.subdocsLoaded.add(this);
      },
      null,
      !0
    ), this.shouldLoad = !0;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(Se(this.subdocs).map((e) => e.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(e, n = null) {
    return E(this, e, n);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(e, n = (
    /** @type {any} */
    D
  )) {
    const s = be(this.share, e, () => {
      const i = new n();
      return i._integrate(this, null), i;
    }), r = s.constructor;
    if (n !== D && r !== n)
      if (r === D) {
        const i = new n();
        i._map = s._map, s._map.forEach(
          /** @param {Item?} n */
          (o) => {
            for (; o !== null; o = o.left)
              o.parent = i;
          }
        ), i._start = s._start;
        for (let o = i._start; o !== null; o = o.right)
          o.parent = i;
        return i._length = s._length, this.share.set(e, i), i._integrate(this, null), /** @type {InstanceType<Type>} */
        i;
      } else
        throw new Error(`Type with the name ${e} has already been defined with a different constructor`);
    return (
      /** @type {InstanceType<Type>} */
      s
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(e = "") {
    return (
      /** @type {YArray<T>} */
      this.get(e, pe)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(e = "") {
    return this.get(e, Ee);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(e = "") {
    return (
      /** @type {YMap<T>} */
      this.get(e, ye)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(e = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(e, _e)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(e = "") {
    return this.get(e, me);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const e = {};
    return this.share.forEach((n, s) => {
      e[s] = n.toJSON();
    }), e;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    Se(this.subdocs).forEach((n) => n.destroy());
    const e = this._item;
    if (e !== null) {
      this._item = null;
      const n = (
        /** @type {ContentDoc} */
        e.content
      );
      n.doc = new ke({ guid: this.guid, ...n.opts, shouldLoad: !1 }), n.doc._item = e, E(
        /** @type {any} */
        e.parent.doc,
        (s) => {
          const r = n.doc;
          e.deleted || s.subdocsAdded.add(r), s.subdocsRemoved.add(this);
        },
        null,
        !0
      );
    }
    this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
  }
}
class ba {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.restDecoder = e;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return b(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return b(this.restDecoder);
  }
}
class va extends ba {
  /**
   * @return {ID}
   */
  readLeftID() {
    return v(b(this.restDecoder), b(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return v(b(this.restDecoder), b(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return b(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return Et(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return Oe(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return b(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return b(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return b(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return nn(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return Kh(B(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(Oe(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return Oe(this.restDecoder);
  }
}
class Bd {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    this.dsCurrVal = 0, this.restDecoder = e;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return this.dsCurrVal += b(this.restDecoder), this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const e = b(this.restDecoder) + 1;
    return this.dsCurrVal += e, e;
  }
}
class xt extends Bd {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(e) {
    super(e), this.keys = [], b(e), this.keyClockDecoder = new Xs(B(e)), this.clientDecoder = new qn(B(e)), this.leftClockDecoder = new Xs(B(e)), this.rightClockDecoder = new Xs(B(e)), this.infoDecoder = new fo(B(e), Et), this.stringDecoder = new ph(B(e)), this.parentInfoDecoder = new fo(B(e), Et), this.typeRefDecoder = new qn(B(e)), this.lenDecoder = new qn(B(e));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new vt(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new vt(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return nn(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return B(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return nn(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const e = this.keyClockDecoder.read();
    if (e < this.keys.length)
      return this.keys[e];
    {
      const n = this.stringDecoder.read();
      return this.keys.push(n), n;
    }
  }
}
class Ca {
  constructor() {
    this.restEncoder = V();
  }
  toUint8Array() {
    return A(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    w(this.restEncoder, e);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    w(this.restEncoder, e);
  }
}
class _n extends Ca {
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    w(this.restEncoder, e.client), w(this.restEncoder, e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    w(this.restEncoder, e.client), w(this.restEncoder, e.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(e) {
    w(this.restEncoder, e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    br(this.restEncoder, e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    Ze(this.restEncoder, e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    w(this.restEncoder, e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    w(this.restEncoder, e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    w(this.restEncoder, e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    tn(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    T(this.restEncoder, e);
  }
  /**
   * @param {any} embed
   */
  writeJSON(e) {
    Ze(this.restEncoder, JSON.stringify(e));
  }
  /**
   * @param {string} key
   */
  writeKey(e) {
    Ze(this.restEncoder, e);
  }
}
class Sa {
  constructor() {
    this.restEncoder = V(), this.dsCurrVal = 0;
  }
  toUint8Array() {
    return A(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(e) {
    const n = e - this.dsCurrVal;
    this.dsCurrVal = e, w(this.restEncoder, n);
  }
  /**
   * @param {number} len
   */
  writeDsLen(e) {
    e === 0 && ie(), w(this.restEncoder, e - 1), this.dsCurrVal += e;
  }
}
class nt extends Sa {
  constructor() {
    super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new Js(), this.clientEncoder = new Yn(), this.leftClockEncoder = new Js(), this.rightClockEncoder = new Js(), this.infoEncoder = new lo(br), this.stringEncoder = new ih(), this.parentInfoEncoder = new lo(br), this.typeRefEncoder = new Yn(), this.lenEncoder = new Yn();
  }
  toUint8Array() {
    const e = V();
    return w(e, 0), T(e, this.keyClockEncoder.toUint8Array()), T(e, this.clientEncoder.toUint8Array()), T(e, this.leftClockEncoder.toUint8Array()), T(e, this.rightClockEncoder.toUint8Array()), T(e, A(this.infoEncoder)), T(e, this.stringEncoder.toUint8Array()), T(e, A(this.parentInfoEncoder)), T(e, this.typeRefEncoder.toUint8Array()), T(e, this.lenEncoder.toUint8Array()), ks(e, A(this.restEncoder)), A(e);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(e) {
    this.clientEncoder.write(e.client), this.leftClockEncoder.write(e.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(e) {
    this.clientEncoder.write(e.client), this.rightClockEncoder.write(e.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(e) {
    this.clientEncoder.write(e);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(e) {
    this.infoEncoder.write(e);
  }
  /**
   * @param {string} s
   */
  writeString(e) {
    this.stringEncoder.write(e);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(e) {
    this.parentInfoEncoder.write(e ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(e) {
    this.typeRefEncoder.write(e);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(e) {
    this.lenEncoder.write(e);
  }
  /**
   * @param {any} any
   */
  writeAny(e) {
    tn(this.restEncoder, e);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(e) {
    T(this.restEncoder, e);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(e) {
    tn(this.restEncoder, e);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(e) {
    const n = this.keyMap.get(e);
    n === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(n);
  }
}
const Vd = (t, e, n, s) => {
  s = ut(s, e[0].id.clock);
  const r = he(e, s);
  w(t.restEncoder, e.length - r), t.writeClient(n), w(t.restEncoder, s);
  const i = e[r];
  i.write(t, s - i.id.clock);
  for (let o = r + 1; o < e.length; o++)
    e[o].write(t, 0);
}, gi = (t, e, n) => {
  const s = /* @__PURE__ */ new Map();
  n.forEach((r, i) => {
    F(e, i) > r && s.set(i, r);
  }), Is(e).forEach((r, i) => {
    n.has(i) || s.set(i, 0);
  }), w(t.restEncoder, s.size), Se(s.entries()).sort((r, i) => i[0] - r[0]).forEach(([r, i]) => {
    Vd(
      t,
      /** @type {Array<GC|Item>} */
      e.clients.get(r),
      r,
      i
    );
  });
}, Kd = (t, e) => {
  const n = J(), s = b(t.restDecoder);
  for (let r = 0; r < s; r++) {
    const i = b(t.restDecoder), o = new Array(i), c = t.readClient();
    let a = b(t.restDecoder);
    n.set(c, { i: 0, refs: o });
    for (let l = 0; l < i; l++) {
      const u = t.readInfo();
      switch (_s & u) {
        case 0: {
          const h = t.readLen();
          o[l] = new Z(v(c, a), h), a += h;
          break;
        }
        case 10: {
          const h = b(t.restDecoder);
          o[l] = new se(v(c, a), h), a += h;
          break;
        }
        default: {
          const h = (u & (Ce | ee)) === 0, d = new O(
            v(c, a),
            null,
            // left
            (u & ee) === ee ? t.readLeftID() : null,
            // origin
            null,
            // right
            (u & Ce) === Ce ? t.readRightID() : null,
            // right origin
            h ? t.readParentInfo() ? e.get(t.readString()) : t.readLeftID() : null,
            // parent
            h && (u & Qt) === Qt ? t.readString() : null,
            // parentSub
            qa(t, u)
            // item content
          );
          o[l] = d, a += d.length;
        }
      }
    }
  }
  return n;
}, Wd = (t, e, n) => {
  const s = [];
  let r = Se(n.keys()).sort((f, p) => f - p);
  if (r.length === 0)
    return null;
  const i = () => {
    if (r.length === 0)
      return null;
    let f = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      n.get(r[r.length - 1])
    );
    for (; f.refs.length === f.i; )
      if (r.pop(), r.length > 0)
        f = /** @type {{i:number,refs:Array<GC|Item>}} */
        n.get(r[r.length - 1]);
      else
        return null;
    return f;
  };
  let o = i();
  if (o === null)
    return null;
  const c = new xa(), a = /* @__PURE__ */ new Map(), l = (f, p) => {
    const y = a.get(f);
    (y == null || y > p) && a.set(f, p);
  };
  let u = (
    /** @type {any} */
    o.refs[
      /** @type {any} */
      o.i++
    ]
  );
  const h = /* @__PURE__ */ new Map(), d = () => {
    for (const f of s) {
      const p = f.id.client, y = n.get(p);
      y ? (y.i--, c.clients.set(p, y.refs.slice(y.i)), n.delete(p), y.i = 0, y.refs = []) : c.clients.set(p, [f]), r = r.filter((g) => g !== p);
    }
    s.length = 0;
  };
  for (; ; ) {
    if (u.constructor !== se) {
      const p = be(h, u.id.client, () => F(e, u.id.client)) - u.id.clock;
      if (p < 0)
        s.push(u), l(u.id.client, u.id.clock - 1), d();
      else {
        const y = u.getMissing(t, e);
        if (y !== null) {
          s.push(u);
          const g = n.get(
            /** @type {number} */
            y
          ) || { refs: [], i: 0 };
          if (g.refs.length === g.i)
            l(
              /** @type {number} */
              y,
              F(e, y)
            ), d();
          else {
            u = g.refs[g.i++];
            continue;
          }
        } else (p === 0 || p < u.length) && (u.integrate(t, p), h.set(u.id.client, u.id.clock + u.length));
      }
    }
    if (s.length > 0)
      u = /** @type {GC|Item} */
      s.pop();
    else if (o !== null && o.i < o.refs.length)
      u = /** @type {GC|Item} */
      o.refs[o.i++];
    else {
      if (o = i(), o === null)
        break;
      u = /** @type {GC|Item} */
      o.refs[o.i++];
    }
  }
  if (c.clients.size > 0) {
    const f = new nt();
    return gi(f, c, /* @__PURE__ */ new Map()), w(f.restEncoder, 0), { missing: a, update: f.toUint8Array() };
  }
  return null;
}, Yd = (t, e) => gi(t, e.doc.store, e.beforeState), qd = (t, e, n, s = new xt(t)) => E(e, (r) => {
  r.local = !1;
  let i = !1;
  const o = r.doc, c = o.store, a = Kd(s, o), l = Wd(r, c, a), u = c.pendingStructs;
  if (u) {
    for (const [d, f] of u.missing)
      if (f < F(c, d)) {
        i = !0;
        break;
      }
    if (l) {
      for (const [d, f] of l.missing) {
        const p = u.missing.get(d);
        (p == null || p > f) && u.missing.set(d, f);
      }
      u.update = cs([u.update, l.update]);
    }
  } else
    c.pendingStructs = l;
  const h = wo(s, r, c);
  if (c.pendingDs) {
    const d = new xt(ze(c.pendingDs));
    b(d.restDecoder);
    const f = wo(d, r, c);
    h && f ? c.pendingDs = cs([h, f]) : c.pendingDs = h || f;
  } else
    c.pendingDs = h;
  if (i) {
    const d = (
      /** @type {{update: Uint8Array}} */
      c.pendingStructs.update
    );
    c.pendingStructs = null, Ea(r.doc, d);
  }
}, n, !1), Ea = (t, e, n, s = xt) => {
  const r = ze(e);
  qd(r, t, n, new s(r));
}, Gd = (t, e, n) => Ea(t, e, n, va), Jd = (t, e, n = /* @__PURE__ */ new Map()) => {
  gi(t, e.store, n), Pt(t, zd(e.store));
}, Xd = (t, e = new Uint8Array([0]), n = new nt()) => {
  const s = _a(e);
  Jd(n, t, s);
  const r = [n.toUint8Array()];
  if (t.store.pendingDs && r.push(t.store.pendingDs), t.store.pendingStructs && r.push(pf(t.store.pendingStructs.update, e)), r.length > 1) {
    if (n.constructor === _n)
      return df(r.map((i, o) => o === 0 ? i : yf(i)));
    if (n.constructor === nt)
      return cs(r);
  }
  return r[0];
}, Zd = (t, e) => Xd(t, e, new _n()), Qd = (t) => {
  const e = /* @__PURE__ */ new Map(), n = b(t.restDecoder);
  for (let s = 0; s < n; s++) {
    const r = b(t.restDecoder), i = b(t.restDecoder);
    e.set(r, i);
  }
  return e;
}, _a = (t) => Qd(new ba(ze(t))), Aa = (t, e) => (w(t.restEncoder, e.size), Se(e.entries()).sort((n, s) => s[0] - n[0]).forEach(([n, s]) => {
  w(t.restEncoder, n), w(t.restEncoder, s);
}), t), ef = (t, e) => Aa(t, Is(e.store)), tf = (t, e = new Sa()) => (t instanceof Map ? Aa(e, t) : ef(e, t), e.toUint8Array()), nf = (t) => tf(t, new Ca());
class sf {
  constructor() {
    this.l = [];
  }
}
const bo = () => new sf(), vo = (t, e) => t.l.push(e), Co = (t, e) => {
  const n = t.l, s = n.length;
  t.l = n.filter((r) => e !== r), s === t.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, ka = (t, e, n) => ii(t.l, [e, n]);
class vt {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(e, n) {
    this.client = e, this.clock = n;
  }
}
const On = (t, e) => t === e || t !== null && e !== null && t.client === e.client && t.clock === e.clock, v = (t, e) => new vt(t, e), rf = (t) => {
  for (const [e, n] of t.doc.share.entries())
    if (n === t)
      return e;
  throw ie();
}, pt = (t, e) => e === void 0 ? !t.deleted : e.sv.has(t.id.client) && (e.sv.get(t.id.client) || 0) > t.id.clock && !ma(e.ds, t.id), Ar = (t, e) => {
  const n = be(t.meta, Ar, Re), s = t.doc.store;
  n.has(e) || (e.sv.forEach((r, i) => {
    r < F(s, i) && Ne(t, v(i, r));
  }), ya(t, e.ds, (r) => {
  }), n.add(e));
};
class xa {
  constructor() {
    this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
  }
}
const Is = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.clients.forEach((n, s) => {
    const r = n[n.length - 1];
    e.set(s, r.id.clock + r.length);
  }), e;
}, F = (t, e) => {
  const n = t.clients.get(e);
  if (n === void 0)
    return 0;
  const s = n[n.length - 1];
  return s.id.clock + s.length;
}, Da = (t, e) => {
  let n = t.clients.get(e.id.client);
  if (n === void 0)
    n = [], t.clients.set(e.id.client, n);
  else {
    const s = n[n.length - 1];
    if (s.id.clock + s.length !== e.id.clock)
      throw ie();
  }
  n.push(e);
}, he = (t, e) => {
  let n = 0, s = t.length - 1, r = t[s], i = r.id.clock;
  if (i === e)
    return s;
  let o = ue(e / (i + r.length - 1) * s);
  for (; n <= s; ) {
    if (r = t[o], i = r.id.clock, i <= e) {
      if (e < i + r.length)
        return o;
      n = o + 1;
    } else
      s = o - 1;
    o = ue((n + s) / 2);
  }
  throw ie();
}, of = (t, e) => {
  const n = t.clients.get(e.client);
  return n[he(n, e.clock)];
}, tr = (
  /** @type {function(StructStore,ID):Item} */
  of
), kr = (t, e, n) => {
  const s = he(e, n), r = e[s];
  return r.id.clock < n && r instanceof O ? (e.splice(s + 1, 0, hs(t, r, n - r.id.clock)), s + 1) : s;
}, Ne = (t, e) => {
  const n = (
    /** @type {Array<Item>} */
    t.doc.store.clients.get(e.client)
  );
  return n[kr(t, n, e.clock)];
}, So = (t, e, n) => {
  const s = e.clients.get(n.client), r = he(s, n.clock), i = s[r];
  return n.clock !== i.id.clock + i.length - 1 && i.constructor !== Z && s.splice(r + 1, 0, hs(t, i, n.clock - i.id.clock + 1)), i;
}, cf = (t, e, n) => {
  const s = (
    /** @type {Array<GC|Item>} */
    t.clients.get(e.id.client)
  );
  s[he(s, e.id.clock)] = n;
}, La = (t, e, n, s, r) => {
  if (s === 0)
    return;
  const i = n + s;
  let o = kr(t, e, n), c;
  do
    c = e[o++], i < c.id.clock + c.length && kr(t, e, i), r(c);
  while (o < e.length && e[o].id.clock < i);
};
class af {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(e, n, s) {
    this.doc = e, this.deleteSet = new En(), this.beforeState = Is(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = n, this.meta = /* @__PURE__ */ new Map(), this.local = s, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
  }
}
const Eo = (t, e) => e.deleteSet.clients.size === 0 && !yh(e.afterState, (n, s) => e.beforeState.get(s) !== n) ? !1 : (fi(e.deleteSet), Yd(t, e), Pt(t, e.deleteSet), !0), _o = (t, e, n) => {
  const s = e._item;
  (s === null || s.id.clock < (t.beforeState.get(s.id.client) || 0) && !s.deleted) && be(t.changed, e, Re).add(n);
}, Gn = (t, e) => {
  let n = t[e], s = t[e - 1], r = e;
  for (; r > 0; n = s, s = t[--r - 1]) {
    if (s.deleted === n.deleted && s.constructor === n.constructor && s.mergeWith(n)) {
      n instanceof O && n.parentSub !== null && /** @type {AbstractType<any>} */
      n.parent._map.get(n.parentSub) === n && n.parent._map.set(
        n.parentSub,
        /** @type {Item} */
        s
      );
      continue;
    }
    break;
  }
  const i = e - r;
  return i && t.splice(e + 1 - i, i), i;
}, lf = (t, e, n) => {
  for (const [s, r] of t.clients.entries()) {
    const i = (
      /** @type {Array<GC|Item>} */
      e.clients.get(s)
    );
    for (let o = r.length - 1; o >= 0; o--) {
      const c = r[o], a = c.clock + c.len;
      for (let l = he(i, c.clock), u = i[l]; l < i.length && u.id.clock < a; u = i[++l]) {
        const h = i[l];
        if (c.clock + c.len <= h.id.clock)
          break;
        h instanceof O && h.deleted && !h.keep && n(h) && h.gc(e, !1);
      }
    }
  }
}, uf = (t, e) => {
  t.clients.forEach((n, s) => {
    const r = (
      /** @type {Array<GC|Item>} */
      e.clients.get(s)
    );
    for (let i = n.length - 1; i >= 0; i--) {
      const o = n[i], c = Xr(r.length - 1, 1 + he(r, o.clock + o.len - 1));
      for (let a = c, l = r[a]; a > 0 && l.id.clock >= o.clock; l = r[a])
        a -= 1 + Gn(r, a);
    }
  });
}, Ta = (t, e) => {
  if (e < t.length) {
    const n = t[e], s = n.doc, r = s.store, i = n.deleteSet, o = n._mergeStructs;
    try {
      fi(i), n.afterState = Is(n.doc.store), s.emit("beforeObserverCalls", [n, s]);
      const c = [];
      n.changed.forEach(
        (a, l) => c.push(() => {
          (l._item === null || !l._item.deleted) && l._callObserver(n, a);
        })
      ), c.push(() => {
        n.changedParentTypes.forEach((a, l) => {
          l._dEH.l.length > 0 && (l._item === null || !l._item.deleted) && (a = a.filter(
            (u) => u.target._item === null || !u.target._item.deleted
          ), a.forEach((u) => {
            u.currentTarget = l, u._path = null;
          }), a.sort((u, h) => u.path.length - h.path.length), ka(l._dEH, a, n));
        });
      }), c.push(() => s.emit("afterTransaction", [n, s])), ii(c, []), n._needFormattingCleanup && Tf(n);
    } finally {
      s.gc && lf(i, r, s.gcFilter), uf(i, r), n.afterState.forEach((u, h) => {
        const d = n.beforeState.get(h) || 0;
        if (d !== u) {
          const f = (
            /** @type {Array<GC|Item>} */
            r.clients.get(h)
          ), p = ut(he(f, d), 1);
          for (let y = f.length - 1; y >= p; )
            y -= 1 + Gn(f, y);
        }
      });
      for (let u = o.length - 1; u >= 0; u--) {
        const { client: h, clock: d } = o[u].id, f = (
          /** @type {Array<GC|Item>} */
          r.clients.get(h)
        ), p = he(f, d);
        p + 1 < f.length && Gn(f, p + 1) > 1 || p > 0 && Gn(f, p);
      }
      if (!n.local && n.afterState.get(s.clientID) !== n.beforeState.get(s.clientID) && (Rd(pa, ha, "[yjs] ", da, fa, "Changed the client-id because another client seems to be using it."), s.clientID = wa()), s.emit("afterTransactionCleanup", [n, s]), s._observers.has("update")) {
        const u = new _n();
        Eo(u, n) && s.emit("update", [u.toUint8Array(), n.origin, s, n]);
      }
      if (s._observers.has("updateV2")) {
        const u = new nt();
        Eo(u, n) && s.emit("updateV2", [u.toUint8Array(), n.origin, s, n]);
      }
      const { subdocsAdded: c, subdocsLoaded: a, subdocsRemoved: l } = n;
      (c.size > 0 || l.size > 0 || a.size > 0) && (c.forEach((u) => {
        u.clientID = s.clientID, u.collectionid == null && (u.collectionid = s.collectionid), s.subdocs.add(u);
      }), l.forEach((u) => s.subdocs.delete(u)), s.emit("subdocs", [{ loaded: a, added: c, removed: l }, s, n]), l.forEach((u) => u.destroy())), t.length <= e + 1 ? (s._transactionCleanups = [], s.emit("afterAllTransactions", [s, t])) : Ta(t, e + 1);
    }
  }
}, E = (t, e, n = null, s = !0) => {
  const r = t._transactionCleanups;
  let i = !1, o = null;
  t._transaction === null && (i = !0, t._transaction = new af(t, n, s), r.push(t._transaction), r.length === 1 && t.emit("beforeAllTransactions", [t]), t.emit("beforeTransaction", [t._transaction, t]));
  try {
    o = e(t._transaction);
  } finally {
    if (i) {
      const c = t._transaction === r[0];
      t._transaction = null, c && Ta(r, 0);
    }
  }
  return o;
};
function* hf(t) {
  const e = b(t.restDecoder);
  for (let n = 0; n < e; n++) {
    const s = b(t.restDecoder), r = t.readClient();
    let i = b(t.restDecoder);
    for (let o = 0; o < s; o++) {
      const c = t.readInfo();
      if (c === 10) {
        const a = b(t.restDecoder);
        yield new se(v(r, i), a), i += a;
      } else if ((_s & c) !== 0) {
        const a = (c & (Ce | ee)) === 0, l = new O(
          v(r, i),
          null,
          // left
          (c & ee) === ee ? t.readLeftID() : null,
          // origin
          null,
          // right
          (c & Ce) === Ce ? t.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          a ? t.readParentInfo() ? t.readString() : t.readLeftID() : null,
          // parent
          a && (c & Qt) === Qt ? t.readString() : null,
          // parentSub
          qa(t, c)
          // item content
        );
        yield l, i += l.length;
      } else {
        const a = t.readLen();
        yield new Z(v(r, i), a), i += a;
      }
    }
  }
}
class yi {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(e, n) {
    this.gen = hf(e), this.curr = null, this.done = !1, this.filterSkips = n, this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do
      this.curr = this.gen.next().value || null;
    while (this.filterSkips && this.curr !== null && this.curr.constructor === se);
    return this.curr;
  }
}
class mi {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(e) {
    this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
  }
}
const df = (t) => cs(t, va, _n), ff = (t, e) => {
  if (t.constructor === Z) {
    const { client: n, clock: s } = t.id;
    return new Z(v(n, s + e), t.length - e);
  } else if (t.constructor === se) {
    const { client: n, clock: s } = t.id;
    return new se(v(n, s + e), t.length - e);
  } else {
    const n = (
      /** @type {Item} */
      t
    ), { client: s, clock: r } = n.id;
    return new O(
      v(s, r + e),
      null,
      v(s, r + e - 1),
      null,
      n.rightOrigin,
      n.parent,
      n.parentSub,
      n.content.splice(e)
    );
  }
}, cs = (t, e = xt, n = nt) => {
  if (t.length === 1)
    return t[0];
  const s = t.map((u) => new e(ze(u)));
  let r = s.map((u) => new yi(u, !0)), i = null;
  const o = new n(), c = new mi(o);
  for (; r = r.filter((d) => d.curr !== null), r.sort(
    /** @type {function(any,any):number} */
    (d, f) => {
      if (d.curr.id.client === f.curr.id.client) {
        const p = d.curr.id.clock - f.curr.id.clock;
        return p === 0 ? d.curr.constructor === f.curr.constructor ? 0 : d.curr.constructor === se ? 1 : -1 : p;
      } else
        return f.curr.id.client - d.curr.id.client;
    }
  ), r.length !== 0; ) {
    const u = r[0], h = (
      /** @type {Item | GC} */
      u.curr.id.client
    );
    if (i !== null) {
      let d = (
        /** @type {Item | GC | null} */
        u.curr
      ), f = !1;
      for (; d !== null && d.id.clock + d.length <= i.struct.id.clock + i.struct.length && d.id.client >= i.struct.id.client; )
        d = u.next(), f = !0;
      if (d === null || // current decoder is empty
      d.id.client !== h || // check whether there is another decoder that has has updates from `firstClient`
      f && d.id.clock > i.struct.id.clock + i.struct.length)
        continue;
      if (h !== i.struct.id.client)
        Le(c, i.struct, i.offset), i = { struct: d, offset: 0 }, u.next();
      else if (i.struct.id.clock + i.struct.length < d.id.clock)
        if (i.struct.constructor === se)
          i.struct.length = d.id.clock + d.length - i.struct.id.clock;
        else {
          Le(c, i.struct, i.offset);
          const p = d.id.clock - i.struct.id.clock - i.struct.length;
          i = { struct: new se(v(h, i.struct.id.clock + i.struct.length), p), offset: 0 };
        }
      else {
        const p = i.struct.id.clock + i.struct.length - d.id.clock;
        p > 0 && (i.struct.constructor === se ? i.struct.length -= p : d = ff(d, p)), i.struct.mergeWith(
          /** @type {any} */
          d
        ) || (Le(c, i.struct, i.offset), i = { struct: d, offset: 0 }, u.next());
      }
    } else
      i = { struct: (
        /** @type {Item | GC} */
        u.curr
      ), offset: 0 }, u.next();
    for (let d = u.curr; d !== null && d.id.client === h && d.id.clock === i.struct.id.clock + i.struct.length && d.constructor !== se; d = u.next())
      Le(c, i.struct, i.offset), i = { struct: d, offset: 0 };
  }
  i !== null && (Le(c, i.struct, i.offset), i = null), wi(c);
  const a = s.map((u) => pi(u)), l = jd(a);
  return Pt(o, l), o.toUint8Array();
}, pf = (t, e, n = xt, s = nt) => {
  const r = _a(e), i = new s(), o = new mi(i), c = new n(ze(t)), a = new yi(c, !1);
  for (; a.curr; ) {
    const u = a.curr, h = u.id.client, d = r.get(h) || 0;
    if (a.curr.constructor === se) {
      a.next();
      continue;
    }
    if (u.id.clock + u.length > d)
      for (Le(o, u, ut(d - u.id.clock, 0)), a.next(); a.curr && a.curr.id.client === h; )
        Le(o, a.curr, 0), a.next();
    else
      for (; a.curr && a.curr.id.client === h && a.curr.id.clock + a.curr.length <= d; )
        a.next();
  }
  wi(o);
  const l = pi(c);
  return Pt(i, l), i.toUint8Array();
}, Ma = (t) => {
  t.written > 0 && (t.clientStructs.push({ written: t.written, restEncoder: A(t.encoder.restEncoder) }), t.encoder.restEncoder = V(), t.written = 0);
}, Le = (t, e, n) => {
  t.written > 0 && t.currClient !== e.id.client && Ma(t), t.written === 0 && (t.currClient = e.id.client, t.encoder.writeClient(e.id.client), w(t.encoder.restEncoder, e.id.clock + n)), e.write(t.encoder, n), t.written++;
}, wi = (t) => {
  Ma(t);
  const e = t.encoder.restEncoder;
  w(e, t.clientStructs.length);
  for (let n = 0; n < t.clientStructs.length; n++) {
    const s = t.clientStructs[n];
    w(e, s.written), ks(e, s.restEncoder);
  }
}, gf = (t, e, n, s) => {
  const r = new n(ze(t)), i = new yi(r, !1), o = new s(), c = new mi(o);
  for (let l = i.curr; l !== null; l = i.next())
    Le(c, e(l), 0);
  wi(c);
  const a = pi(r);
  return Pt(o, a), o.toUint8Array();
}, yf = (t) => gf(t, Ah, xt, _n), Ao = "You must not compute changes after the event-handler fired.";
class Ps {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(e, n) {
    this.target = e, this.currentTarget = e, this.transaction = n, this._changes = null, this._keys = null, this._delta = null, this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = mf(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(e) {
    return ma(this.transaction.deleteSet, e.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any, newValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw ge(Ao);
      const e = /* @__PURE__ */ new Map(), n = this.target;
      /** @type Set<string|null> */
      this.transaction.changed.get(n).forEach((r) => {
        if (r !== null) {
          const i = (
            /** @type {Item} */
            n._map.get(r)
          );
          let o, c;
          if (this.adds(i)) {
            let a = i.left;
            for (; a !== null && this.adds(a); )
              a = a.left;
            if (this.deletes(i))
              if (a !== null && this.deletes(a))
                o = "delete", c = Gs(a.content.getContent());
              else
                return;
            else
              a !== null && this.deletes(a) ? (o = "update", c = Gs(a.content.getContent())) : (o = "add", c = void 0);
          } else if (this.deletes(i))
            o = "delete", c = Gs(
              /** @type {Item} */
              i.content.getContent()
            );
          else
            return;
          e.set(r, { action: o, oldValue: c });
        }
      }), this._keys = e;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(e) {
    return e.id.clock >= (this.transaction.beforeState.get(e.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let e = this._changes;
    if (e === null) {
      if (this.transaction.doc._transactionCleanups.length === 0)
        throw ge(Ao);
      const n = this.target, s = Re(), r = Re(), i = [];
      if (e = {
        added: s,
        deleted: r,
        delta: i,
        keys: this.keys
      }, /** @type Set<string|null> */
      this.transaction.changed.get(n).has(null)) {
        let c = null;
        const a = () => {
          c && i.push(c);
        };
        for (let l = n._start; l !== null; l = l.right)
          l.deleted ? this.deletes(l) && !this.adds(l) && ((c === null || c.delete === void 0) && (a(), c = { delete: 0 }), c.delete += l.length, r.add(l)) : this.adds(l) ? ((c === null || c.insert === void 0) && (a(), c = { insert: [] }), c.insert = c.insert.concat(l.content.getContent()), s.add(l)) : ((c === null || c.retain === void 0) && (a(), c = { retain: 0 }), c.retain += l.length);
        c !== null && c.retain === void 0 && a();
      }
      this._changes = e;
    }
    return (
      /** @type {any} */
      e
    );
  }
}
const mf = (t, e) => {
  const n = [];
  for (; e._item !== null && e !== t; ) {
    if (e._item.parentSub !== null)
      n.unshift(e._item.parentSub);
    else {
      let s = 0, r = (
        /** @type {AbstractType<any>} */
        e._item.parent._start
      );
      for (; r !== e._item && r !== null; )
        !r.deleted && r.countable && (s += r.length), r = r.right;
      n.unshift(s);
    }
    e = /** @type {AbstractType<any>} */
    e._item.parent;
  }
  return n;
}, $a = 80;
let bi = 0;
class wf {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(e, n) {
    e.marker = !0, this.p = e, this.index = n, this.timestamp = bi++;
  }
}
const bf = (t) => {
  t.timestamp = bi++;
}, Oa = (t, e, n) => {
  t.p.marker = !1, t.p = e, e.marker = !0, t.index = n, t.timestamp = bi++;
}, vf = (t, e, n) => {
  if (t.length >= $a) {
    const s = t.reduce((r, i) => r.timestamp < i.timestamp ? r : i);
    return Oa(s, e, n), s;
  } else {
    const s = new wf(e, n);
    return t.push(s), s;
  }
}, Rs = (t, e) => {
  if (t._start === null || e === 0 || t._searchMarker === null)
    return null;
  const n = t._searchMarker.length === 0 ? null : t._searchMarker.reduce((i, o) => Wn(e - i.index) < Wn(e - o.index) ? i : o);
  let s = t._start, r = 0;
  for (n !== null && (s = n.p, r = n.index, bf(n)); s.right !== null && r < e; ) {
    if (!s.deleted && s.countable) {
      if (e < r + s.length)
        break;
      r += s.length;
    }
    s = s.right;
  }
  for (; s.left !== null && r > e; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  for (; s.left !== null && s.left.id.client === s.id.client && s.left.id.clock + s.left.length === s.id.clock; )
    s = s.left, !s.deleted && s.countable && (r -= s.length);
  return n !== null && Wn(n.index - r) < /** @type {YText|YArray<any>} */
  s.parent.length / $a ? (Oa(n, s, r), n) : vf(t._searchMarker, s, r);
}, on = (t, e, n) => {
  for (let s = t.length - 1; s >= 0; s--) {
    const r = t[s];
    if (n > 0) {
      let i = r.p;
      for (i.marker = !1; i && (i.deleted || !i.countable); )
        i = i.left, i && !i.deleted && i.countable && (r.index -= i.length);
      if (i === null || i.marker === !0) {
        t.splice(s, 1);
        continue;
      }
      r.p = i, i.marker = !0;
    }
    (e < r.index || n > 0 && e === r.index) && (r.index = ut(e, r.index + n));
  }
}, Ns = (t, e, n) => {
  const s = t, r = e.changedParentTypes;
  for (; be(r, t, () => []).push(n), t._item !== null; )
    t = /** @type {AbstractType<any>} */
    t._item.parent;
  ka(s._eH, n, e);
};
class D {
  constructor() {
    this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = bo(), this._dEH = bo(), this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(e, n) {
    this.doc = e, this._item = n;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw ae();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw ae();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(e) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let e = this._start;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    !e.local && this._searchMarker && (this._searchMarker.length = 0);
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(e) {
    vo(this._eH, e);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(e) {
    vo(this._dEH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(e) {
    Co(this._eH, e);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(e) {
    Co(this._dEH, e);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
}
const Ia = (t, e, n) => {
  e < 0 && (e = t._length + e), n < 0 && (n = t._length + n);
  let s = n - e;
  const r = [];
  let i = t._start;
  for (; i !== null && s > 0; ) {
    if (i.countable && !i.deleted) {
      const o = i.content.getContent();
      if (o.length <= e)
        e -= o.length;
      else {
        for (let c = e; c < o.length && s > 0; c++)
          r.push(o[c]), s--;
        e = 0;
      }
    }
    i = i.right;
  }
  return r;
}, Pa = (t) => {
  const e = [];
  let n = t._start;
  for (; n !== null; ) {
    if (n.countable && !n.deleted) {
      const s = n.content.getContent();
      for (let r = 0; r < s.length; r++)
        e.push(s[r]);
    }
    n = n.right;
  }
  return e;
}, cn = (t, e) => {
  let n = 0, s = t._start;
  for (; s !== null; ) {
    if (s.countable && !s.deleted) {
      const r = s.content.getContent();
      for (let i = 0; i < r.length; i++)
        e(r[i], n++, t);
    }
    s = s.right;
  }
}, Ra = (t, e) => {
  const n = [];
  return cn(t, (s, r) => {
    n.push(e(s, r, t));
  }), n;
}, Cf = (t) => {
  let e = t._start, n = null, s = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (n === null) {
        for (; e !== null && e.deleted; )
          e = e.right;
        if (e === null)
          return {
            done: !0,
            value: void 0
          };
        n = e.content.getContent(), s = 0, e = e.right;
      }
      const r = n[s++];
      return n.length <= s && (n = null), {
        done: !1,
        value: r
      };
    }
  };
}, Na = (t, e) => {
  const n = Rs(t, e);
  let s = t._start;
  for (n !== null && (s = n.p, e -= n.index); s !== null; s = s.right)
    if (!s.deleted && s.countable) {
      if (e < s.length)
        return s.content.getContent()[e];
      e -= s.length;
    }
}, as = (t, e, n, s) => {
  let r = n;
  const i = t.doc, o = i.clientID, c = i.store, a = n === null ? e._start : n.right;
  let l = [];
  const u = () => {
    l.length > 0 && (r = new O(v(o, F(c, o)), r, r && r.lastId, a, a && a.id, e, null, new rt(l)), r.integrate(t, 0), l = []);
  };
  s.forEach((h) => {
    if (h === null)
      l.push(h);
    else
      switch (h.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          l.push(h);
          break;
        default:
          switch (u(), h.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              r = new O(v(o, F(c, o)), r, r && r.lastId, a, a && a.id, e, null, new An(new Uint8Array(
                /** @type {Uint8Array} */
                h
              ))), r.integrate(t, 0);
              break;
            case ke:
              r = new O(v(o, F(c, o)), r, r && r.lastId, a, a && a.id, e, null, new kn(
                /** @type {Doc} */
                h
              )), r.integrate(t, 0);
              break;
            default:
              if (h instanceof D)
                r = new O(v(o, F(c, o)), r, r && r.lastId, a, a && a.id, e, null, new xe(h)), r.integrate(t, 0);
              else
                throw new Error("Unexpected content type in insert operation");
          }
      }
  }), u();
}, Ua = () => ge("Length exceeded!"), Fa = (t, e, n, s) => {
  if (n > e._length)
    throw Ua();
  if (n === 0)
    return e._searchMarker && on(e._searchMarker, n, s.length), as(t, e, null, s);
  const r = n, i = Rs(e, n);
  let o = e._start;
  for (i !== null && (o = i.p, n -= i.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right)
    if (!o.deleted && o.countable) {
      if (n <= o.length) {
        n < o.length && Ne(t, v(o.id.client, o.id.clock + n));
        break;
      }
      n -= o.length;
    }
  return e._searchMarker && on(e._searchMarker, r, s.length), as(t, e, o, s);
}, Sf = (t, e, n) => {
  let r = (e._searchMarker || []).reduce((i, o) => o.index > i.index ? o : i, { index: 0, p: e._start }).p;
  if (r)
    for (; r.right; )
      r = r.right;
  return as(t, e, r, n);
}, ja = (t, e, n, s) => {
  if (s === 0)
    return;
  const r = n, i = s, o = Rs(e, n);
  let c = e._start;
  for (o !== null && (c = o.p, n -= o.index); c !== null && n > 0; c = c.right)
    !c.deleted && c.countable && (n < c.length && Ne(t, v(c.id.client, c.id.clock + n)), n -= c.length);
  for (; s > 0 && c !== null; )
    c.deleted || (s < c.length && Ne(t, v(c.id.client, c.id.clock + s)), c.delete(t), s -= c.length), c = c.right;
  if (s > 0)
    throw Ua();
  e._searchMarker && on(
    e._searchMarker,
    r,
    -i + s
    /* in case we remove the above exception */
  );
}, ls = (t, e, n) => {
  const s = e._map.get(n);
  s !== void 0 && s.delete(t);
}, vi = (t, e, n, s) => {
  const r = e._map.get(n) || null, i = t.doc, o = i.clientID;
  let c;
  if (s == null)
    c = new rt([s]);
  else
    switch (s.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        c = new rt([s]);
        break;
      case Uint8Array:
        c = new An(
          /** @type {Uint8Array} */
          s
        );
        break;
      case ke:
        c = new kn(
          /** @type {Doc} */
          s
        );
        break;
      default:
        if (s instanceof D)
          c = new xe(s);
        else
          throw new Error("Unexpected content type");
    }
  new O(v(o, F(i.store, o)), r, r && r.lastId, null, null, e, n, c).integrate(t, 0);
}, Ci = (t, e) => {
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, Ha = (t) => {
  const e = {};
  return t._map.forEach((n, s) => {
    n.deleted || (e[s] = n.content.getContent()[n.length - 1]);
  }), e;
}, za = (t, e) => {
  const n = t._map.get(e);
  return n !== void 0 && !n.deleted;
}, Ef = (t, e) => {
  const n = {};
  return t._map.forEach((s, r) => {
    let i = s;
    for (; i !== null && (!e.sv.has(i.id.client) || i.id.clock >= (e.sv.get(i.id.client) || 0)); )
      i = i.left;
    i !== null && pt(i, e) && (n[r] = i.content.getContent()[i.length - 1]);
  }), n;
}, In = (t) => Ud(
  t.entries(),
  /** @param {any} entry */
  (e) => !e[1].deleted
);
class _f extends Ps {
}
class pe extends D {
  constructor() {
    super(), this._prelimContent = [], this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(e) {
    const n = new pe();
    return n.push(e), n;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new pe();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const e = new pe();
    return e.insert(0, this.toArray().map(
      (n) => n instanceof D ? (
        /** @type {typeof el} */
        n.clone()
      ) : n
    )), e;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n), Ns(this, e, new _f(this, e));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? E(this.doc, (s) => {
      Fa(
        s,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(e) {
    this.doc !== null ? E(this.doc, (n) => {
      Sf(
        n,
        this,
        /** @type {any} */
        e
      );
    }) : this._prelimContent.push(...e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? E(this.doc, (s) => {
      ja(s, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(e) {
    return Na(this, e);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return Pa(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(e = 0, n = this.length) {
    return Ia(this, e, n);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((e) => e instanceof D ? e.toJSON() : e);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(e) {
    return Ra(
      this,
      /** @type {any} */
      e
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    cn(this, e);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return Cf(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(qf);
  }
}
const Af = (t) => new pe();
class kf extends Ps {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(e, n, s) {
    super(e, n), this.keysChanged = s;
  }
}
class ye extends D {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(e) {
    super(), this._prelimContent = null, e === void 0 ? this._prelimContent = /* @__PURE__ */ new Map() : this._prelimContent = new Map(e);
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this._prelimContent.forEach((s, r) => {
      this.set(r, s);
    }), this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new ye();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const e = new ye();
    return this.forEach((n, s) => {
      e.set(s, n instanceof D ? (
        /** @type {typeof value} */
        n.clone()
      ) : n);
    }), e;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Ns(this, e, new kf(this, e, n));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    const e = {};
    return this._map.forEach((n, s) => {
      if (!n.deleted) {
        const r = n.content.getContent()[n.length - 1];
        e[s] = r instanceof D ? r.toJSON() : r;
      }
    }), e;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...In(this._map)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return er(
      In(this._map),
      /** @param {any} v */
      (e) => e[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return er(
      In(this._map),
      /** @param {any} v */
      (e) => e[1].content.getContent()[e[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return er(
      In(this._map),
      /** @param {any} v */
      (e) => (
        /** @type {any} */
        [e[0], e[1].content.getContent()[e[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    this._map.forEach((n, s) => {
      n.deleted || e(n.content.getContent()[n.length - 1], s, this);
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(e) {
    this.doc !== null ? E(this.doc, (n) => {
      ls(n, this, e);
    }) : this._prelimContent.delete(e);
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(e, n) {
    return this.doc !== null ? E(this.doc, (s) => {
      vi(
        s,
        this,
        e,
        /** @type {any} */
        n
      );
    }) : this._prelimContent.set(e, n), n;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(e) {
    return (
      /** @type {any} */
      Ci(this, e)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(e) {
    return za(this, e);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    this.doc !== null ? E(this.doc, (e) => {
      this.forEach(function(n, s, r) {
        ls(e, r, s);
      });
    }) : this._prelimContent.clear();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(Gf);
  }
}
const xf = (t) => new ye(), Me = (t, e) => t === e || typeof t == "object" && typeof e == "object" && t && e && _h(t, e);
class xr {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(e, n, s, r) {
    this.left = e, this.right = n, this.index = s, this.currentAttributes = r;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    this.right === null && ie(), this.right.content.constructor === R ? this.right.deleted || Rt(
      this.currentAttributes,
      /** @type {ContentFormat} */
      this.right.content
    ) : this.right.deleted || (this.index += this.right.length), this.left = this.right, this.right = this.right.right;
  }
}
const ko = (t, e, n) => {
  for (; e.right !== null && n > 0; )
    e.right.content.constructor === R ? e.right.deleted || Rt(
      e.currentAttributes,
      /** @type {ContentFormat} */
      e.right.content
    ) : e.right.deleted || (n < e.right.length && Ne(t, v(e.right.id.client, e.right.id.clock + n)), e.index += e.right.length, n -= e.right.length), e.left = e.right, e.right = e.right.right;
  return e;
}, Pn = (t, e, n, s) => {
  const r = /* @__PURE__ */ new Map(), i = s ? Rs(e, n) : null;
  if (i) {
    const o = new xr(i.p.left, i.p, i.index, r);
    return ko(t, o, n - i.index);
  } else {
    const o = new xr(null, e._start, 0, r);
    return ko(t, o, n);
  }
}, Ba = (t, e, n, s) => {
  for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === R && Me(
    s.get(
      /** @type {ContentFormat} */
      n.right.content.key
    ),
    /** @type {ContentFormat} */
    n.right.content.value
  )); )
    n.right.deleted || s.delete(
      /** @type {ContentFormat} */
      n.right.content.key
    ), n.forward();
  const r = t.doc, i = r.clientID;
  s.forEach((o, c) => {
    const a = n.left, l = n.right, u = new O(v(i, F(r.store, i)), a, a && a.lastId, l, l && l.id, e, null, new R(c, o));
    u.integrate(t, 0), n.right = u, n.forward();
  });
}, Rt = (t, e) => {
  const { key: n, value: s } = e;
  s === null ? t.delete(n) : t.set(n, s);
}, Va = (t, e) => {
  for (; t.right !== null; ) {
    if (!(t.right.deleted || t.right.content.constructor === R && Me(
      e[
        /** @type {ContentFormat} */
        t.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      t.right.content.value
    ))) break;
    t.forward();
  }
}, Ka = (t, e, n, s) => {
  const r = t.doc, i = r.clientID, o = /* @__PURE__ */ new Map();
  for (const c in s) {
    const a = s[c], l = n.currentAttributes.get(c) ?? null;
    if (!Me(l, a)) {
      o.set(c, l);
      const { left: u, right: h } = n;
      n.right = new O(v(i, F(r.store, i)), u, u && u.lastId, h, h && h.id, e, null, new R(c, a)), n.right.integrate(t, 0), n.forward();
    }
  }
  return o;
}, nr = (t, e, n, s, r) => {
  n.currentAttributes.forEach((d, f) => {
    r[f] === void 0 && (r[f] = null);
  });
  const i = t.doc, o = i.clientID;
  Va(n, r);
  const c = Ka(t, e, n, r), a = s.constructor === String ? new we(
    /** @type {string} */
    s
  ) : s instanceof D ? new xe(s) : new ht(s);
  let { left: l, right: u, index: h } = n;
  e._searchMarker && on(e._searchMarker, n.index, a.getLength()), u = new O(v(o, F(i.store, o)), l, l && l.lastId, u, u && u.id, e, null, a), u.integrate(t, 0), n.right = u, n.index = h, n.forward(), Ba(t, e, n, c);
}, xo = (t, e, n, s, r) => {
  const i = t.doc, o = i.clientID;
  Va(n, r);
  const c = Ka(t, e, n, r);
  e: for (; n.right !== null && (s > 0 || c.size > 0 && (n.right.deleted || n.right.content.constructor === R)); ) {
    if (!n.right.deleted)
      switch (n.right.content.constructor) {
        case R: {
          const { key: a, value: l } = (
            /** @type {ContentFormat} */
            n.right.content
          ), u = r[a];
          if (u !== void 0) {
            if (Me(u, l))
              c.delete(a);
            else {
              if (s === 0)
                break e;
              c.set(a, l);
            }
            n.right.delete(t);
          } else
            n.currentAttributes.set(a, l);
          break;
        }
        default:
          s < n.right.length && Ne(t, v(n.right.id.client, n.right.id.clock + s)), s -= n.right.length;
          break;
      }
    n.forward();
  }
  if (s > 0) {
    let a = "";
    for (; s > 0; s--)
      a += `
`;
    n.right = new O(v(o, F(i.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, e, null, new we(a)), n.right.integrate(t, 0), n.forward();
  }
  Ba(t, e, n, c);
}, Wa = (t, e, n, s, r) => {
  let i = e;
  const o = J();
  for (; i && (!i.countable || i.deleted); ) {
    if (!i.deleted && i.content.constructor === R) {
      const l = (
        /** @type {ContentFormat} */
        i.content
      );
      o.set(l.key, l);
    }
    i = i.right;
  }
  let c = 0, a = !1;
  for (; e !== i; ) {
    if (n === e && (a = !0), !e.deleted) {
      const l = e.content;
      if (l.constructor === R) {
        const { key: u, value: h } = (
          /** @type {ContentFormat} */
          l
        ), d = s.get(u) ?? null;
        (o.get(u) !== l || d === h) && (e.delete(t), c++, !a && (r.get(u) ?? null) === h && d !== h && (d === null ? r.delete(u) : r.set(u, d))), !a && !e.deleted && Rt(
          r,
          /** @type {ContentFormat} */
          l
        );
      }
    }
    e = /** @type {Item} */
    e.right;
  }
  return c;
}, Df = (t, e) => {
  for (; e && e.right && (e.right.deleted || !e.right.countable); )
    e = e.right;
  const n = /* @__PURE__ */ new Set();
  for (; e && (e.deleted || !e.countable); ) {
    if (!e.deleted && e.content.constructor === R) {
      const s = (
        /** @type {ContentFormat} */
        e.content.key
      );
      n.has(s) ? e.delete(t) : n.add(s);
    }
    e = e.left;
  }
}, Lf = (t) => {
  let e = 0;
  return E(
    /** @type {Doc} */
    t.doc,
    (n) => {
      let s = (
        /** @type {Item} */
        t._start
      ), r = t._start, i = J();
      const o = Cr(i);
      for (; r; )
        r.deleted === !1 && (r.content.constructor === R ? Rt(
          o,
          /** @type {ContentFormat} */
          r.content
        ) : (e += Wa(n, s, r, i, o), i = Cr(o), s = r)), r = r.right;
    }
  ), e;
}, Tf = (t) => {
  const e = /* @__PURE__ */ new Set(), n = t.doc;
  for (const [s, r] of t.afterState.entries()) {
    const i = t.beforeState.get(s) || 0;
    r !== i && La(
      t,
      /** @type {Array<Item|GC>} */
      n.store.clients.get(s),
      i,
      r,
      (o) => {
        !o.deleted && /** @type {Item} */
        o.content.constructor === R && o.constructor !== Z && e.add(
          /** @type {any} */
          o.parent
        );
      }
    );
  }
  E(n, (s) => {
    ya(t, t.deleteSet, (r) => {
      if (r instanceof Z || !/** @type {YText} */
      r.parent._hasFormatting || e.has(
        /** @type {YText} */
        r.parent
      ))
        return;
      const i = (
        /** @type {YText} */
        r.parent
      );
      r.content.constructor === R ? e.add(i) : Df(s, r);
    });
    for (const r of e)
      Lf(r);
  });
}, Do = (t, e, n) => {
  const s = n, r = Cr(e.currentAttributes), i = e.right;
  for (; n > 0 && e.right !== null; ) {
    if (e.right.deleted === !1)
      switch (e.right.content.constructor) {
        case xe:
        case ht:
        case we:
          n < e.right.length && Ne(t, v(e.right.id.client, e.right.id.clock + n)), n -= e.right.length, e.right.delete(t);
          break;
      }
    e.forward();
  }
  i && Wa(t, i, e.right, r, e.currentAttributes);
  const o = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (e.left || e.right).parent
  );
  return o._searchMarker && on(o._searchMarker, e.index, -s + n), e;
};
class Mf extends Ps {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(e, n, s) {
    super(e, n), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), s.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.keysChanged.add(r);
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const e = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = e;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const e = (
        /** @type {Doc} */
        this.target.doc
      ), n = [];
      E(e, (s) => {
        const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
        let o = this.target._start, c = null;
        const a = {};
        let l = "", u = 0, h = 0;
        const d = () => {
          if (c !== null) {
            let f = null;
            switch (c) {
              case "delete":
                h > 0 && (f = { delete: h }), h = 0;
                break;
              case "insert":
                (typeof l == "object" || l.length > 0) && (f = { insert: l }, r.size > 0 && (f.attributes = {}, r.forEach((p, y) => {
                  p !== null && (f.attributes[y] = p);
                }))), l = "";
                break;
              case "retain":
                u > 0 && (f = { retain: u }, Eh(a) || (f.attributes = bh({}, a))), u = 0;
                break;
            }
            f && n.push(f), c = null;
          }
        };
        for (; o !== null; ) {
          switch (o.content.constructor) {
            case xe:
            case ht:
              this.adds(o) ? this.deletes(o) || (d(), c = "insert", l = o.content.getContent()[0], d()) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), h += 1) : o.deleted || (c !== "retain" && (d(), c = "retain"), u += 1);
              break;
            case we:
              this.adds(o) ? this.deletes(o) || (c !== "insert" && (d(), c = "insert"), l += /** @type {ContentString} */
              o.content.str) : this.deletes(o) ? (c !== "delete" && (d(), c = "delete"), h += o.length) : o.deleted || (c !== "retain" && (d(), c = "retain"), u += o.length);
              break;
            case R: {
              const { key: f, value: p } = (
                /** @type {ContentFormat} */
                o.content
              );
              if (this.adds(o)) {
                if (!this.deletes(o)) {
                  const y = r.get(f) ?? null;
                  Me(y, p) ? p !== null && o.delete(s) : (c === "retain" && d(), Me(p, i.get(f) ?? null) ? delete a[f] : a[f] = p);
                }
              } else if (this.deletes(o)) {
                i.set(f, p);
                const y = r.get(f) ?? null;
                Me(y, p) || (c === "retain" && d(), a[f] = y);
              } else if (!o.deleted) {
                i.set(f, p);
                const y = a[f];
                y !== void 0 && (Me(y, p) ? y !== null && o.delete(s) : (c === "retain" && d(), p === null ? delete a[f] : a[f] = p));
              }
              o.deleted || (c === "insert" && d(), Rt(
                r,
                /** @type {ContentFormat} */
                o.content
              ));
              break;
            }
          }
          o = o.right;
        }
        for (d(); n.length > 0; ) {
          const f = n[n.length - 1];
          if (f.retain !== void 0 && f.attributes === void 0)
            n.pop();
          else
            break;
        }
      }), this._delta = n;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
}
class Ee extends D {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(e) {
    super(), this._pending = e !== void 0 ? [() => this.insert(0, e)] : [], this._searchMarker = [], this._hasFormatting = !1;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    return this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n);
    try {
      this._pending.forEach((s) => s());
    } catch (s) {
      console.error(s);
    }
    this._pending = null;
  }
  _copy() {
    return new Ee();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const e = new Ee();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    super._callObserver(e, n);
    const s = new Mf(this, e, n);
    Ns(this, e, s), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    let e = "", n = this._start;
    for (; n !== null; )
      !n.deleted && n.countable && n.content.constructor === we && (e += /** @type {ContentString} */
      n.content.str), n = n.right;
    return e;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(e, { sanitize: n = !0 } = {}) {
    this.doc !== null ? E(this.doc, (s) => {
      const r = new xr(null, this._start, 0, /* @__PURE__ */ new Map());
      for (let i = 0; i < e.length; i++) {
        const o = e[i];
        if (o.insert !== void 0) {
          const c = !n && typeof o.insert == "string" && i === e.length - 1 && r.right === null && o.insert.slice(-1) === `
` ? o.insert.slice(0, -1) : o.insert;
          (typeof c != "string" || c.length > 0) && nr(s, this, r, c, o.attributes || {});
        } else o.retain !== void 0 ? xo(s, this, r, o.retain, o.attributes || {}) : o.delete !== void 0 && Do(s, r, o.delete);
      }
    }) : this._pending.push(() => this.applyDelta(e));
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(e, n, s) {
    const r = [], i = /* @__PURE__ */ new Map(), o = (
      /** @type {Doc} */
      this.doc
    );
    let c = "", a = this._start;
    function l() {
      if (c.length > 0) {
        const h = {};
        let d = !1;
        i.forEach((p, y) => {
          d = !0, h[y] = p;
        });
        const f = { insert: c };
        d && (f.attributes = h), r.push(f), c = "";
      }
    }
    const u = () => {
      for (; a !== null; ) {
        if (pt(a, e) || n !== void 0 && pt(a, n))
          switch (a.content.constructor) {
            case we: {
              const h = i.get("ychange");
              e !== void 0 && !pt(a, e) ? (h === void 0 || h.user !== a.id.client || h.type !== "removed") && (l(), i.set("ychange", s ? s("removed", a.id) : { type: "removed" })) : n !== void 0 && !pt(a, n) ? (h === void 0 || h.user !== a.id.client || h.type !== "added") && (l(), i.set("ychange", s ? s("added", a.id) : { type: "added" })) : h !== void 0 && (l(), i.delete("ychange")), c += /** @type {ContentString} */
              a.content.str;
              break;
            }
            case xe:
            case ht: {
              l();
              const h = {
                insert: a.content.getContent()[0]
              };
              if (i.size > 0) {
                const d = (
                  /** @type {Object<string,any>} */
                  {}
                );
                h.attributes = d, i.forEach((f, p) => {
                  d[p] = f;
                });
              }
              r.push(h);
              break;
            }
            case R:
              pt(a, e) && (l(), Rt(
                i,
                /** @type {ContentFormat} */
                a.content
              ));
              break;
          }
        a = a.right;
      }
      l();
    };
    return e || n ? E(o, (h) => {
      e && Ar(h, e), n && Ar(h, n), u();
    }, "cleanup") : u(), r;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(e, n, s) {
    if (n.length <= 0)
      return;
    const r = this.doc;
    r !== null ? E(r, (i) => {
      const o = Pn(i, this, e, !s);
      s || (s = {}, o.currentAttributes.forEach((c, a) => {
        s[a] = c;
      })), nr(i, this, o, n, s);
    }) : this._pending.push(() => this.insert(e, n, s));
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(e, n, s) {
    const r = this.doc;
    r !== null ? E(r, (i) => {
      const o = Pn(i, this, e, !s);
      nr(i, this, o, n, s || {});
    }) : this._pending.push(() => this.insertEmbed(e, n, s || {}));
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(e, n) {
    if (n === 0)
      return;
    const s = this.doc;
    s !== null ? E(s, (r) => {
      Do(r, Pn(r, this, e, !0), n);
    }) : this._pending.push(() => this.delete(e, n));
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(e, n, s) {
    if (n === 0)
      return;
    const r = this.doc;
    r !== null ? E(r, (i) => {
      const o = Pn(i, this, e, !1);
      o.right !== null && xo(i, this, o, n, s);
    }) : this._pending.push(() => this.format(e, n, s));
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? E(this.doc, (n) => {
      ls(n, this, e);
    }) : this._pending.push(() => this.removeAttribute(e));
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? E(this.doc, (s) => {
      vi(s, this, e, n);
    }) : this._pending.push(() => this.setAttribute(e, n));
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      Ci(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return Ha(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(Jf);
  }
}
const $f = (t) => new Ee();
class sr {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(e, n = () => !0) {
    this._filter = n, this._root = e, this._currentNode = /** @type {Item} */
    e._start, this._firstCall = !0;
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let e = this._currentNode, n = e && e.content && /** @type {any} */
    e.content.type;
    if (e !== null && (!this._firstCall || e.deleted || !this._filter(n)))
      do
        if (n = /** @type {any} */
        e.content.type, !e.deleted && (n.constructor === _e || n.constructor === me) && n._start !== null)
          e = n._start;
        else
          for (; e !== null; )
            if (e.right !== null) {
              e = e.right;
              break;
            } else e.parent === this._root ? e = null : e = /** @type {AbstractType<any>} */
            e.parent._item;
      while (e !== null && (e.deleted || !this._filter(
        /** @type {ContentType} */
        e.content.type
      )));
    return this._firstCall = !1, e === null ? { value: void 0, done: !0 } : (this._currentNode = e, { value: (
      /** @type {any} */
      e.content.type
    ), done: !1 });
  }
}
class me extends D {
  constructor() {
    super(), this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const e = this._first;
    return e ? e.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    ), this._prelimContent = null;
  }
  _copy() {
    return new me();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const e = new me();
    return e.insert(0, this.toArray().map((n) => n instanceof D ? n.clone() : n)), e;
  }
  get length() {
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(e) {
    return new sr(this, e);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(e) {
    e = e.toUpperCase();
    const s = new sr(this, (r) => r.nodeName && r.nodeName.toUpperCase() === e).next();
    return s.done ? null : s.value;
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(e) {
    return e = e.toUpperCase(), Se(new sr(this, (n) => n.nodeName && n.nodeName.toUpperCase() === e));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(e, n) {
    Ns(this, e, new Pf(this, n, e));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return Ra(this, (e) => e.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = e.createDocumentFragment();
    return s !== void 0 && s._createAssociation(r, this), cn(this, (i) => {
      r.insertBefore(i.toDOM(e, n, s), null);
    }), r;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(e, n) {
    this.doc !== null ? E(this.doc, (s) => {
      Fa(s, this, e, n);
    }) : this._prelimContent.splice(e, 0, ...n);
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(e, n) {
    if (this.doc !== null)
      E(this.doc, (s) => {
        const r = e && e instanceof D ? e._item : e;
        as(s, this, r, n);
      });
    else {
      const s = (
        /** @type {Array<any>} */
        this._prelimContent
      ), r = e === null ? 0 : s.findIndex((i) => i === e) + 1;
      if (r === 0 && e !== null)
        throw ge("Reference item not found");
      s.splice(r, 0, ...n);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(e, n = 1) {
    this.doc !== null ? E(this.doc, (s) => {
      ja(s, this, e, n);
    }) : this._prelimContent.splice(e, n);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return Pa(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(e) {
    this.insert(this.length, e);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(e) {
    this.insert(0, e);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(e) {
    return Na(this, e);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(e = 0, n = this.length) {
    return Ia(this, e, n);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(e) {
    cn(this, e);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(Zf);
  }
}
const Of = (t) => new me();
class _e extends me {
  constructor(e = "UNDEFINED") {
    super(), this.nodeName = e, this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(e, n) {
    super._integrate(e, n), /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((s, r) => {
      this.setAttribute(r, s);
    }), this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new _e(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const e = new _e(this.nodeName), n = this.getAttributes();
    return Ch(n, (s, r) => {
      typeof s == "string" && e.setAttribute(r, s);
    }), e.insert(0, this.toArray().map((s) => s instanceof D ? s.clone() : s)), e;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const e = this.getAttributes(), n = [], s = [];
    for (const c in e)
      s.push(c);
    s.sort();
    const r = s.length;
    for (let c = 0; c < r; c++) {
      const a = s[c];
      n.push(a + '="' + e[a] + '"');
    }
    const i = this.nodeName.toLocaleLowerCase(), o = n.length > 0 ? " " + n.join(" ") : "";
    return `<${i}${o}>${super.toString()}</${i}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(e) {
    this.doc !== null ? E(this.doc, (n) => {
      ls(n, this, e);
    }) : this._prelimAttrs.delete(e);
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(e, n) {
    this.doc !== null ? E(this.doc, (s) => {
      vi(s, this, e, n);
    }) : this._prelimAttrs.set(e, n);
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(e) {
    return (
      /** @type {any} */
      Ci(this, e)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(e) {
    return (
      /** @type {any} */
      za(this, e)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(e) {
    return (
      /** @type {any} */
      e ? Ef(this, e) : Ha(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = e.createElement(this.nodeName), i = this.getAttributes();
    for (const o in i) {
      const c = i[o];
      typeof c == "string" && r.setAttribute(o, c);
    }
    return cn(this, (o) => {
      r.appendChild(o.toDOM(e, n, s));
    }), s !== void 0 && s._createAssociation(r, this), r;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(Xf), e.writeKey(this.nodeName);
  }
}
const If = (t) => new _e(t.readKey());
class Pf extends Ps {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor(e, n, s) {
    super(e, s), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), n.forEach((r) => {
      r === null ? this.childListChanged = !0 : this.attributesChanged.add(r);
    });
  }
}
class Dt extends ye {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(e) {
    super(), this.hookName = e;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new Dt(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const e = new Dt(this.hookName);
    return this.forEach((n, s) => {
      e.set(s, n);
    }), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n = {}, s) {
    const r = n[this.hookName];
    let i;
    return r !== void 0 ? i = r.createDom(this) : i = document.createElement(this.hookName), i.setAttribute("data-yjs-hook", this.hookName), s !== void 0 && s._createAssociation(i, this), i;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(e) {
    e.writeTypeRef(Qf), e.writeKey(this.hookName);
  }
}
const Rf = (t) => new Dt(t.readKey());
class st extends Ee {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const e = this._item ? this._item.next : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const e = this._item ? this._item.prev : null;
    return e ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      e.content.type
    ) : null;
  }
  _copy() {
    return new st();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const e = new st();
    return e.applyDelta(this.toDelta()), e;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(e = document, n, s) {
    const r = e.createTextNode(this.toString());
    return s !== void 0 && s._createAssociation(r, this), r;
  }
  toString() {
    return this.toDelta().map((e) => {
      const n = [];
      for (const r in e.attributes) {
        const i = [];
        for (const o in e.attributes[r])
          i.push({ key: o, value: e.attributes[r][o] });
        i.sort((o, c) => o.key < c.key ? -1 : 1), n.push({ nodeName: r, attrs: i });
      }
      n.sort((r, i) => r.nodeName < i.nodeName ? -1 : 1);
      let s = "";
      for (let r = 0; r < n.length; r++) {
        const i = n[r];
        s += `<${i.nodeName}`;
        for (let o = 0; o < i.attrs.length; o++) {
          const c = i.attrs[o];
          s += ` ${c.key}="${c.value}"`;
        }
        s += ">";
      }
      s += e.insert;
      for (let r = n.length - 1; r >= 0; r--)
        s += `</${n[r].nodeName}>`;
      return s;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(e) {
    e.writeTypeRef(ep);
  }
}
const Nf = (t) => new st();
class Si {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(e, n) {
    this.id = e, this.length = n;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw ae();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(e, n, s) {
    throw ae();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    throw ae();
  }
}
const Uf = 0;
class Z extends Si {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    n > 0 && (this.id.clock += n, this.length -= n), Da(e.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(Uf), e.writeLen(this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
class An {
  /**
   * @param {Uint8Array} content
   */
  constructor(e) {
    this.content = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new An(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(e) {
    throw ae();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
}
const Ff = (t) => new An(t.readBuf());
class an {
  /**
   * @param {number} len
   */
  constructor(e) {
    this.len = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new an(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(e) {
    const n = new an(this.len - e);
    return this.len = e, n;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.len += e.len, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    os(e.deleteSet, n.id.client, n.id.clock, this.len), n.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeLen(this.len - n);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
}
const jf = (t) => new an(t.readLen()), Ya = (t, e) => new ke({ guid: t, ...e, shouldLoad: e.shouldLoad || e.autoLoad || !1 });
class kn {
  /**
   * @param {Doc} doc
   */
  constructor(e) {
    e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
    const n = {};
    this.opts = n, e.gc || (n.gc = !1), e.autoLoad && (n.autoLoad = !0), e.meta !== null && (n.meta = e.meta);
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new kn(Ya(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(e) {
    throw ae();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.doc._item = n, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    e.subdocsAdded.has(this.doc) ? e.subdocsAdded.delete(this.doc) : e.subdocsRemoved.add(this.doc);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(this.doc.guid), e.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
}
const Hf = (t) => new kn(Ya(t.readString(), t.readAny()));
class ht {
  /**
   * @param {Object} embed
   */
  constructor(e) {
    this.embed = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new ht(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(e) {
    throw ae();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
}
const zf = (t) => new ht(t.readJSON());
class R {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(e, n) {
    this.key = e, this.value = n;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !1;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new R(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(e) {
    throw ae();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(e, n) {
    const s = (
      /** @type {YText} */
      n.parent
    );
    s._searchMarker = null, s._hasFormatting = !0;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeKey(this.key), e.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
}
const Bf = (t) => new R(t.readKey(), t.readJSON());
class us {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new us(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(e) {
    const n = new us(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const s = this.arr.length;
    e.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      e.writeString(i === void 0 ? "undefined" : JSON.stringify(i));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
}
const Vf = (t) => {
  const e = t.readLen(), n = [];
  for (let s = 0; s < e; s++) {
    const r = t.readString();
    r === "undefined" ? n.push(void 0) : n.push(JSON.parse(r));
  }
  return new us(n);
};
class rt {
  /**
   * @param {Array<any>} arr
   */
  constructor(e) {
    this.arr = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new rt(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(e) {
    const n = new rt(this.arr.slice(e));
    return this.arr = this.arr.slice(0, e), n;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.arr = this.arr.concat(e.arr), !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    const s = this.arr.length;
    e.writeLen(s - n);
    for (let r = n; r < s; r++) {
      const i = this.arr[r];
      e.writeAny(i);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
}
const Kf = (t) => {
  const e = t.readLen(), n = [];
  for (let s = 0; s < e; s++)
    n.push(t.readAny());
  return new rt(n);
};
class we {
  /**
   * @param {string} str
   */
  constructor(e) {
    this.str = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new we(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(e) {
    const n = new we(this.str.slice(e));
    this.str = this.str.slice(0, e);
    const s = this.str.charCodeAt(e - 1);
    return s >= 55296 && s <= 56319 && (this.str = this.str.slice(0, e - 1) + "�", n.str = "�" + n.str.slice(1)), n;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.str += e.str, !0;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeString(n === 0 ? this.str : this.str.slice(n));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
}
const Wf = (t) => new we(t.readString()), Yf = [
  Af,
  xf,
  $f,
  If,
  Of,
  Rf,
  Nf
], qf = 0, Gf = 1, Jf = 2, Xf = 3, Zf = 4, Qf = 5, ep = 6;
class xe {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(e) {
    this.type = e;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return !0;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new xe(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(e) {
    throw ae();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(e) {
    return !1;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(e, n) {
    this.type._integrate(e.doc, n);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.deleted ? n.id.clock < (e.beforeState.get(n.id.client) || 0) && e._mergeStructs.push(n) : n.delete(e), n = n.right;
    this.type._map.forEach((s) => {
      s.deleted ? s.id.clock < (e.beforeState.get(s.id.client) || 0) && e._mergeStructs.push(s) : s.delete(e);
    }), e.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(e) {
    let n = this.type._start;
    for (; n !== null; )
      n.gc(e, !0), n = n.right;
    this.type._start = null, this.type._map.forEach(
      /** @param {Item | null} item */
      (s) => {
        for (; s !== null; )
          s.gc(e, !0), s = s.left;
      }
    ), this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    this.type._write(e);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
}
const tp = (t) => new xe(Yf[t.readTypeRef()](t)), hs = (t, e, n) => {
  const { client: s, clock: r } = e.id, i = new O(
    v(s, r + n),
    e,
    v(s, r + n - 1),
    e.right,
    e.rightOrigin,
    e.parent,
    e.parentSub,
    e.content.splice(n)
  );
  return e.deleted && i.markDeleted(), e.keep && (i.keep = !0), e.redone !== null && (i.redone = v(e.redone.client, e.redone.clock + n)), e.right = i, i.right !== null && (i.right.left = i), t._mergeStructs.push(i), i.parentSub !== null && i.right === null && i.parent._map.set(i.parentSub, i), e.length = n, i;
};
class O extends Si {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(e, n, s, r, i, o, c, a) {
    super(e, a.getLength()), this.origin = s, this.left = n, this.right = r, this.rightOrigin = i, this.parent = o, this.parentSub = c, this.redone = null, this.content = a, this.info = this.content.isCountable() ? io : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(e) {
    (this.info & qs) > 0 !== e && (this.info ^= qs);
  }
  get marker() {
    return (this.info & qs) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & ro) > 0;
  }
  set keep(e) {
    this.keep !== e && (this.info ^= ro);
  }
  get countable() {
    return (this.info & io) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & Ys) > 0;
  }
  set deleted(e) {
    this.deleted !== e && (this.info ^= Ys);
  }
  markDeleted() {
    this.info |= Ys;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= F(n, this.origin.client))
      return this.origin.client;
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= F(n, this.rightOrigin.client))
      return this.rightOrigin.client;
    if (this.parent && this.parent.constructor === vt && this.id.client !== this.parent.client && this.parent.clock >= F(n, this.parent.client))
      return this.parent.client;
    if (this.origin && (this.left = So(e, n, this.origin), this.origin = this.left.lastId), this.rightOrigin && (this.right = Ne(e, this.rightOrigin), this.rightOrigin = this.right.id), this.left && this.left.constructor === Z || this.right && this.right.constructor === Z)
      this.parent = null;
    else if (!this.parent)
      this.left && this.left.constructor === O && (this.parent = this.left.parent, this.parentSub = this.left.parentSub), this.right && this.right.constructor === O && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
    else if (this.parent.constructor === vt) {
      const s = tr(n, this.parent);
      s.constructor === Z ? this.parent = null : this.parent = /** @type {ContentType} */
      s.content.type;
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    if (n > 0 && (this.id.clock += n, this.left = So(e, e.doc.store, v(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(n), this.length -= n), this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let s = this.left, r;
        if (s !== null)
          r = s.right;
        else if (this.parentSub !== null)
          for (r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; r !== null && r.left !== null; )
            r = r.left;
        else
          r = /** @type {AbstractType<any>} */
          this.parent._start;
        const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
        for (; r !== null && r !== this.right; ) {
          if (o.add(r), i.add(r), On(this.origin, r.origin)) {
            if (r.id.client < this.id.client)
              s = r, i.clear();
            else if (On(this.rightOrigin, r.rightOrigin))
              break;
          } else if (r.origin !== null && o.has(tr(e.doc.store, r.origin)))
            i.has(tr(e.doc.store, r.origin)) || (s = r, i.clear());
          else
            break;
          r = r.right;
        }
        this.left = s;
      }
      if (this.left !== null) {
        const s = this.left.right;
        this.right = s, this.left.right = this;
      } else {
        let s;
        if (this.parentSub !== null)
          for (s = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null; s !== null && s.left !== null; )
            s = s.left;
        else
          s = /** @type {AbstractType<any>} */
          this.parent._start, this.parent._start = this;
        this.right = s;
      }
      this.right !== null ? this.right.left = this : this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)), this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), Da(e.doc.store, this), this.content.integrate(e, this), _o(
        e,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      ), /** @type {AbstractType<any>} */
      (this.parent._item !== null && /** @type {AbstractType<any>} */
      this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
    } else
      new Z(this.id, this.length).integrate(e, 0);
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let e = this.right;
    for (; e !== null && e.deleted; )
      e = e.right;
    return e;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let e = this.left;
    for (; e !== null && e.deleted; )
      e = e.left;
    return e;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : v(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(e) {
    if (this.constructor === e.constructor && On(e.origin, this.lastId) && this.right === e && On(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      return n && n.forEach((s) => {
        s.p === e && (s.p = this, !this.deleted && this.countable && (s.index -= this.length));
      }), e.keep && (this.keep = !0), this.right = e.right, this.right !== null && (this.right.left = this), this.length += e.length, !0;
    }
    return !1;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(e) {
    if (!this.deleted) {
      const n = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      this.countable && this.parentSub === null && (n._length -= this.length), this.markDeleted(), os(e.deleteSet, this.id.client, this.id.clock, this.length), _o(e, n, this.parentSub), this.content.delete(e);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(e, n) {
    if (!this.deleted)
      throw ie();
    this.content.gc(e), n ? cf(e, this, new Z(this.id, this.length)) : this.content = new an(this.length);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(e, n) {
    const s = n > 0 ? v(this.id.client, this.id.clock + n - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, o = this.content.getRef() & _s | (s === null ? 0 : ee) | // origin is defined
    (r === null ? 0 : Ce) | // right origin is defined
    (i === null ? 0 : Qt);
    if (e.writeInfo(o), s !== null && e.writeLeftID(s), r !== null && e.writeRightID(r), s === null && r === null) {
      const c = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (c._item !== void 0) {
        const a = c._item;
        if (a === null) {
          const l = rf(c);
          e.writeParentInfo(!0), e.writeString(l);
        } else
          e.writeParentInfo(!1), e.writeLeftID(a.id);
      } else c.constructor === String ? (e.writeParentInfo(!0), e.writeString(c)) : c.constructor === vt ? (e.writeParentInfo(!1), e.writeLeftID(c)) : ie();
      i !== null && e.writeString(i);
    }
    this.content.write(e, n);
  }
}
const qa = (t, e) => np[e & _s](t), np = [
  () => {
    ie();
  },
  // GC is not ItemContent
  jf,
  // 1
  Vf,
  // 2
  Ff,
  // 3
  Wf,
  // 4
  zf,
  // 5
  Bf,
  // 6
  tp,
  // 7
  Kf,
  // 8
  Hf,
  // 9
  () => {
    ie();
  }
  // 10 - Skip is not ItemContent
], sp = 10;
class se extends Si {
  get deleted() {
    return !0;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(e) {
    return this.constructor !== e.constructor ? !1 : (this.length += e.length, !0);
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(e, n) {
    ie();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(e, n) {
    e.writeInfo(sp), w(e.restEncoder, this.length - n);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(e, n) {
    return null;
  }
}
const Ga = (
  /** @type {any} */
  typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}
), Ja = "__ $YJS$ __";
Ga[Ja] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
Ga[Ja] = !0;
const rr = 3e4;
class rp extends Hc {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const n = _t();
      this.getLocalState() !== null && rr / 2 <= n - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const s = [];
      this.meta.forEach((r, i) => {
        i !== this.clientID && rr <= n - r.lastUpdated && this.states.has(i) && s.push(i);
      }), s.length > 0 && Ei(this, s, "timeout");
    }, ue(rr / 10)), e.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(e) {
    const n = this.clientID, s = this.meta.get(n), r = s === void 0 ? 0 : s.clock + 1, i = this.states.get(n);
    e === null ? this.states.delete(n) : this.states.set(n, e), this.meta.set(n, {
      clock: r,
      lastUpdated: _t()
    });
    const o = [], c = [], a = [], l = [];
    e === null ? l.push(n) : i == null ? e != null && o.push(n) : (c.push(n), wt(i, e) || a.push(n)), (o.length > 0 || a.length > 0 || l.length > 0) && this.emit("change", [{ added: o, updated: a, removed: l }, "local"]), this.emit("update", [{ added: o, updated: c, removed: l }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(e, n) {
    const s = this.getLocalState();
    s !== null && this.setLocalState({
      ...s,
      [e]: n
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const Ei = (t, e, n) => {
  const s = [];
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (t.states.has(i)) {
      if (t.states.delete(i), i === t.clientID) {
        const o = (
          /** @type {MetaClientState} */
          t.meta.get(i)
        );
        t.meta.set(i, {
          clock: o.clock + 1,
          lastUpdated: _t()
        });
      }
      s.push(i);
    }
  }
  s.length > 0 && (t.emit("change", [{ added: [], updated: [], removed: s }, n]), t.emit("update", [{ added: [], updated: [], removed: s }, n]));
}, Yt = (t, e, n = t.states) => {
  const s = e.length, r = V();
  w(r, s);
  for (let i = 0; i < s; i++) {
    const o = e[i], c = n.get(o) || null, a = (
      /** @type {MetaClientState} */
      t.meta.get(o).clock
    );
    w(r, o), w(r, a), Ze(r, JSON.stringify(c));
  }
  return A(r);
}, ip = (t, e, n) => {
  const s = ze(e), r = _t(), i = [], o = [], c = [], a = [], l = b(s);
  for (let u = 0; u < l; u++) {
    const h = b(s);
    let d = b(s);
    const f = JSON.parse(Oe(s)), p = t.meta.get(h), y = t.states.get(h), g = p === void 0 ? 0 : p.clock;
    (g < d || g === d && f === null && t.states.has(h)) && (f === null ? h === t.clientID && t.getLocalState() != null ? d++ : t.states.delete(h) : t.states.set(h, f), t.meta.set(h, {
      clock: d,
      lastUpdated: r
    }), p === void 0 && f !== null ? i.push(h) : p !== void 0 && f === null ? a.push(h) : f !== null && (wt(f, y) || c.push(h), o.push(h)));
  }
  (i.length > 0 || c.length > 0 || a.length > 0) && t.emit("change", [{
    added: i,
    updated: c,
    removed: a
  }, n]), (i.length > 0 || o.length > 0 || a.length > 0) && t.emit("update", [{
    added: i,
    updated: o,
    removed: a
  }, n]);
}, Xa = 0, _i = 1, Za = 2, Dr = (t, e) => {
  w(t, Xa);
  const n = nf(e);
  T(t, n);
}, Qa = (t, e, n) => {
  w(t, _i), T(t, Zd(e, n));
}, op = (t, e, n) => Qa(e, n, B(t)), el = (t, e, n, s) => {
  try {
    Gd(e, B(t), n);
  } catch (r) {
    s?.(
      /** @type {Error} */
      r
    ), console.error("Caught error while handling a Yjs update", r);
  }
}, cp = (t, e) => {
  w(t, Za), T(t, e);
}, ap = el, lp = (t, e, n, s, r) => {
  const i = b(t);
  switch (i) {
    case Xa:
      op(t, e, n);
      break;
    case _i:
      el(t, n, s, r);
      break;
    case Za:
      ap(t, n, s, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
}, tl = /* @__PURE__ */ new Map();
class up {
  /**
   * @param {string} room
   */
  constructor(e) {
    this.room = e, this.onmessage = null, this._onChange = (n) => n.key === e && this.onmessage !== null && this.onmessage({ data: Vh(n.newValue || "") }), Mh(this._onChange);
  }
  /**
   * @param {ArrayBuffer} buf
   */
  postMessage(e) {
    Kc.setItem(this.room, Bh(Uh(e)));
  }
  close() {
    $h(this._onChange);
  }
}
const hp = typeof BroadcastChannel > "u" ? up : BroadcastChannel, Ai = (t) => be(tl, t, () => {
  const e = Re(), n = new hp(t);
  return n.onmessage = (s) => e.forEach((r) => r(s.data, "broadcastchannel")), {
    bc: n,
    subs: e
  };
}), dp = (t, e) => (Ai(t).subs.add(e), e), fp = (t, e) => {
  const n = Ai(t), s = n.subs.delete(e);
  return s && n.subs.size === 0 && (n.bc.close(), tl.delete(t)), s;
}, gt = (t, e, n = null) => {
  const s = Ai(t);
  s.bc.postMessage(e), s.subs.forEach((r) => r(e, n));
}, pp = (t) => Sh(t, (e, n) => `${encodeURIComponent(n)}=${encodeURIComponent(e)}`).join("&");
let gp = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", yp = (t = 21) => {
  let e = "", n = crypto.getRandomValues(new Uint8Array(t |= 0));
  for (; t--; )
    e += gp[n[t] & 63];
  return e;
};
const mp = 0, wp = (t, e, n) => {
  b(t) === mp && n(e, Oe(t));
}, bp = typeof window > "u", xn = [];
xn[0] = (t, e, n, s, r) => {
  w(t, 0);
  const i = lp(
    e,
    t,
    n.doc,
    n
  );
  s && i === _i && !n.synced && (n.synced = !0);
};
xn[3] = (t, e, n, s, r) => {
  w(t, 1), T(
    t,
    Yt(
      n.awareness,
      Array.from(n.awareness.getStates().keys())
    )
  );
};
xn[1] = (t, e, n, s, r) => {
  ip(
    n.awareness,
    B(e),
    n
  );
};
xn[2] = (t, e, n, s, r) => {
  wp(
    e,
    n.doc,
    (i, o) => vp(n, o)
  );
};
function vp(t, e) {
  console.warn(`Permission denied to access ${t.url}.
${e}`);
}
function nl(t, e, n) {
  const s = ze(e), r = V(), i = b(s), o = t.messageHandlers[i];
  return o ? o(r, s, t, n, i) : console.error("Unable to compute message"), r;
}
function Lo(t) {
  if (t.shouldConnect && t.ws === null) {
    if (!t._WS)
      throw new Error(
        "No WebSocket implementation available, did you forget to pass options.WebSocketPolyfill?"
      );
    const e = new t._WS(t.url);
    e.binaryType = "arraybuffer", t.ws = e, t.wsconnecting = !0, t.wsconnected = !1, t.synced = !1, e.addEventListener("message", (n) => {
      if (typeof n.data == "string") {
        if (n.data.startsWith("__YPS:")) {
          const r = n.data.slice(6);
          t.emit("custom-message", [r]);
        }
        return;
      }
      t.wsLastMessageReceived = _t();
      const s = nl(t, new Uint8Array(n.data), !0);
      Qr(s) > 1 && e.send(A(s));
    }), e.addEventListener("error", (n) => {
      t.emit("connection-error", [n, t]);
    }), e.addEventListener("close", (n) => {
      if (t.emit("connection-close", [n, t]), t.ws = null, t.wsconnecting = !1, t.wsconnected) {
        t.wsconnected = !1, t.synced = !1;
        const s = Array.from(
          t.awareness.getStates().keys()
        ).filter((r) => r !== t.doc.clientID);
        Ei(
          t.awareness,
          s,
          t
        );
        for (const r of s)
          t.awareness.meta.delete(r);
        t.emit("status", [{ status: "disconnected" }]);
      } else t.wsUnsuccessfulReconnects++;
      setTimeout(
        () => {
          t.shouldConnect && Promise.resolve(t._reconnectWS()).catch((s) => {
            console.error("Reconnection failed", s);
          });
        },
        Xr(
          Fu(2, t.wsUnsuccessfulReconnects) * 100,
          t.maxBackoffTime
        )
      );
    }), e.addEventListener("open", () => {
      t.wsLastMessageReceived = _t(), t.wsconnecting = !1, t.wsconnected = !0, t.wsUnsuccessfulReconnects = 0, t.emit("status", [{ status: "connected" }]);
      const n = V();
      if (w(n, 0), Dr(n, t.doc), e.send(A(n)), t.awareness.getLocalState() !== null) {
        t.awareness.setLocalState(t.awareness.getLocalState());
        const s = V();
        w(s, 1), T(
          s,
          Yt(t.awareness, [
            t.doc.clientID
          ])
        ), e.send(A(s));
      }
    }), t.emit("status", [{ status: "connecting" }]);
  }
}
function ir(t, e) {
  const n = t.ws;
  t.wsconnected && n && n.readyState === n.OPEN && n.send(e), t.bcconnected && gt(t.bcChannel, e, t);
}
const Cp = typeof WebSocket > "u" ? null : WebSocket;
var Sp = class extends Hc {
  maxBackoffTime;
  bcChannel;
  url;
  roomname;
  doc;
  _WS;
  awareness;
  wsconnected;
  wsconnecting;
  bcconnected;
  disableBc;
  wsUnsuccessfulReconnects;
  messageHandlers;
  _synced;
  ws;
  wsLastMessageReceived;
  shouldConnect;
  _resyncInterval;
  _bcSubscriber;
  _updateHandler;
  _awarenessUpdateHandler;
  _unloadHandler;
  constructor(t, e, n, {
    connect: s = !0,
    awareness: r = new rp(n),
    params: i = {},
    isPrefixedUrl: o = !1,
    WebSocketPolyfill: c = Cp,
    resyncInterval: a = -1,
    maxBackoffTime: l = 2500,
    disableBc: u = bp
  } = {}) {
    for (super(); t[t.length - 1] === "/"; )
      t = t.slice(0, t.length - 1);
    const h = pp(i);
    this.maxBackoffTime = l, this.bcChannel = `${t}/${e}`, this.url = o ? t : `${t}/${e}${h.length === 0 ? "" : `?${h}`}`, this.roomname = e, this.doc = n, this._WS = c, this.awareness = r, this.wsconnected = !1, this.wsconnecting = !1, this.bcconnected = !1, this.disableBc = u, this.wsUnsuccessfulReconnects = 0, this.messageHandlers = xn.slice(), this._synced = !1, this.ws = null, this.wsLastMessageReceived = 0, this.shouldConnect = s, this._resyncInterval = 0, a > 0 && (this._resyncInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const d = V();
        w(d, 0), Dr(d, n), this.ws.send(A(d));
      }
    }, a)), this._bcSubscriber = (d, f) => {
      if (f !== this) {
        const p = nl(this, new Uint8Array(d), !1);
        Qr(p) > 1 && gt(this.bcChannel, A(p), this);
      }
    }, this._updateHandler = (d, f) => {
      if (f !== this) {
        const p = V();
        w(p, 0), cp(p, d), ir(this, A(p));
      }
    }, this.doc.on("update", this._updateHandler), this._awarenessUpdateHandler = ({ added: d, updated: f, removed: p }, y) => {
      const g = d.concat(f).concat(p), m = V();
      w(m, 1), T(
        m,
        Yt(r, g)
      ), ir(this, A(m));
    }, this._unloadHandler = () => {
      Ei(
        this.awareness,
        [n.clientID],
        "window unload"
      );
    }, typeof window < "u" ? window.addEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.on == "function" && process.on("exit", this._unloadHandler), r.on("change", this._awarenessUpdateHandler), clearInterval(r._checkInterval), s && this.connect();
  }
  /**
   * @type {boolean}
   */
  get synced() {
    return this._synced;
  }
  set synced(t) {
    this._synced !== t && (this._synced = t, this.emit("synced", [t]), this.emit("sync", [t]));
  }
  destroy() {
    this._resyncInterval !== 0 && clearInterval(this._resyncInterval), this.disconnect(), typeof window < "u" ? window.removeEventListener("unload", this._unloadHandler) : typeof process < "u" && typeof process.off == "function" && process.off("exit", this._unloadHandler), this.awareness.off("change", this._awarenessUpdateHandler), this.doc.off("update", this._updateHandler), super.destroy();
  }
  connectBc() {
    if (this.disableBc) return;
    this.bcconnected || (dp(this.bcChannel, this._bcSubscriber), this.bcconnected = !0);
    const t = V();
    w(t, 0), Dr(t, this.doc), gt(this.bcChannel, A(t), this);
    const e = V();
    w(e, 0), Qa(e, this.doc), gt(this.bcChannel, A(e), this);
    const n = V();
    w(n, 3), gt(
      this.bcChannel,
      A(n),
      this
    );
    const s = V();
    w(s, 1), T(
      s,
      Yt(this.awareness, [
        this.doc.clientID
      ])
    ), gt(
      this.bcChannel,
      A(s),
      this
    );
  }
  disconnectBc() {
    const t = V();
    w(t, 1), T(
      t,
      Yt(
        this.awareness,
        [this.doc.clientID],
        /* @__PURE__ */ new Map()
      )
    ), ir(this, A(t)), this.bcconnected && (fp(this.bcChannel, this._bcSubscriber), this.bcconnected = !1);
  }
  disconnect() {
    this.shouldConnect = !1, this.disconnectBc(), this.ws !== null && this.ws.close();
  }
  /**
   * Called by the close handler to re-establish the WebSocket.
   * Subclasses (e.g. YProvider) override this to refresh dynamic
   * params before reconnecting.
   */
  _reconnectWS() {
    Lo(this);
  }
  connect() {
    this.shouldConnect = !0, !this.wsconnected && this.ws === null && (Lo(this), this.connectBc());
  }
};
function To(t, e, n) {
  if (typeof t !== n)
    throw new Error(
      `Invalid "${e}" parameter provided to YProvider. Expected: ${n}, received: ${t}`
    );
}
var Ep = class extends Sp {
  id;
  #e;
  constructor(t, e, n, s = {}) {
    To(t, "host", "string"), To(e, "room", "string"), t = t.replace(/^(http|https|ws|wss):\/\//, ""), t.endsWith("/") && (t = t.slice(0, -1));
    const r = `${s.protocol || (t.startsWith("localhost:") || t.startsWith("127.0.0.1:") || t.startsWith("192.168.") || t.startsWith("10.") || t.startsWith("172.") && t.split(".")[1] >= "16" && t.split(".")[1] <= "31" ? "ws" : "wss")}://${t}${s.prefix || `/parties/${s.party || "main"}`}`, i = s.connectionId ?? yp(10), { params: o, connect: c = !0, ...a } = s, l = {
      ...a,
      isPrefixedUrl: !!s.prefix,
      connect: !1
    };
    super(r, e, n ?? new ke(), l), this.id = i, this.#e = o, c && this.connect();
  }
  async #t() {
    const t = typeof this.#e == "function" ? await this.#e() : this.#e, e = new URLSearchParams([["_pk", this.id]]);
    if (t)
      for (const [s, r] of Object.entries(t))
        r != null && e.append(s, r);
    const n = new URL(this.url);
    n.search = e.toString(), this.url = n.toString();
  }
  async connect() {
    try {
      await this.#t(), super.connect();
    } catch (t) {
      throw console.error("Failed to open connecton to PartyServer", t), t;
    }
  }
  async _reconnectWS() {
    try {
      await this.#t();
    } catch (t) {
      console.error(
        "Failed to refresh params, reconnecting with stale params",
        t
      );
    }
    super._reconnectWS();
  }
  sendMessage(t) {
    this.ws?.send(`__YPS:${t}`);
  }
};
const sl = ["data-playhtml-hover", "data-playhtml-focus"], _p = [
  "__playhtml-element",
  "ph-flash",
  "ph-inspect-highlight",
  "ph-inspect-highlight-hover",
  "ph-inspect-selected",
  "playhtml-loading"
], Ap = {
  "aria-busy": "true",
  "aria-live": "polite"
}, Mo = {
  childList: !0,
  attributes: !0,
  subtree: !1,
  characterData: !0
}, kp = {
  defaultData: (t) => qt(t),
  myDefaultAwareness: { hover: !1, focus: !1 },
  onMount: ({ getElement: t, setData: e, setMyAwareness: n }) => {
    const s = t(), r = e, i = xi(
      s,
      (a) => {
        const l = a.filter(
          (u) => u.type !== "attributes" || !sl.includes(u.attributeName || "")
        );
        l.length !== 0 && r((u) => {
          xp(u, l);
        });
      },
      Mo
    );
    s.__playhtml_observer = i, s.addEventListener("mouseenter", () => {
      n({ hover: !0, focus: s.hasAttribute("data-playhtml-focus") }), s.setAttribute("data-playhtml-hover", "");
    }), s.addEventListener("mouseleave", () => {
      n({ hover: !1, focus: s.hasAttribute("data-playhtml-focus") }), s.removeAttribute("data-playhtml-hover");
    }), s.addEventListener("focusin", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !0 }), s.setAttribute("data-playhtml-focus", "");
    }), s.addEventListener("focusout", () => {
      n({ hover: s.hasAttribute("data-playhtml-hover"), focus: !1 }), s.removeAttribute("data-playhtml-focus");
    });
    const o = (a, l) => {
      if (a.formState && (l.formState = a.formState), a.children && l.children)
        for (let u = 0; u < a.children.length; u++) {
          const h = a.children[u];
          h.nodeType === "HTMLElement" && l.children[u] && o(
            h,
            l.children[u]
          );
        }
    }, c = () => {
      r((a) => {
        const l = qt(s);
        o(l, a), l.children && a.children.splice(0, a.children.length, ...l.children);
      });
    };
    s.addEventListener("input", c), s.addEventListener("change", c);
  },
  updateElement: ({ element: t, data: e }) => {
    const n = qt(t);
    if (ki(n, e))
      return;
    const s = t.__playhtml_observer;
    s && (s.takeRecords(), s.disconnect()), Jn(t, e), s && s.observe(t, Mo);
  },
  updateElementAwareness: ({ element: t, awareness: e }) => {
    const n = e.some((r) => r?.hover), s = e.some((r) => r?.focus);
    n ? t.setAttribute("data-playhtml-hover", "") : t.removeAttribute("data-playhtml-hover"), s ? t.setAttribute("data-playhtml-focus", "") : t.removeAttribute("data-playhtml-focus");
  }
};
function $o(t) {
  return t.nodeType === "HTMLElement";
}
function ki(t, e) {
  if (t.nodeType !== e.nodeType)
    return !1;
  if (t.nodeType === "Text" && e.nodeType === "Text")
    return t.textContent === e.textContent;
  if ($o(t) && $o(e)) {
    if (t.tagName !== e.tagName)
      return !1;
    const n = Lr(t.attributes), s = Lr(e.attributes);
    if (Object.keys(n).length !== Object.keys(s).length)
      return !1;
    for (const [a, l] of Object.entries(n))
      if (s[a] !== l)
        return !1;
    const r = t.formState, i = e.formState;
    if ((r || i) && (!r || !i || r.checked !== i.checked || r.value !== i.value || r.selectedIndex !== i.selectedIndex))
      return !1;
    const o = ds(t.children), c = ds(e.children);
    if (o.length !== c.length)
      return !1;
    for (let a = 0; a < o.length; a++)
      if (!ki(o[a], c[a]))
        return !1;
  }
  return !0;
}
function xi(t, e, n) {
  const s = new MutationObserver(e);
  return s.observe(t, n), s;
}
function xp(t, e) {
  e.forEach((n) => {
    switch (n.type) {
      case "attributes":
        Dp(t, n);
        break;
      case "childList":
        Lp(t, n);
        break;
      case "characterData":
        Tp(t, n);
        break;
    }
  });
}
function Dp(t, e) {
  if (t.nodeType !== "Text" && e.target instanceof HTMLElement) {
    const n = e.attributeName, s = e.target.getAttribute(n), r = Ti(e.target);
    if (s !== null) {
      const i = Mi(
        n,
        s,
        r
      );
      i === null ? n in t.attributes && delete t.attributes[n] : t.attributes[n] !== i && (t.attributes[n] = i);
    } else n in t.attributes && delete t.attributes[n];
  }
}
function Lp(t, e) {
  if (t.nodeType === "Text" || !(e.target instanceof HTMLElement))
    return;
  const n = [];
  e.target.childNodes.forEach((r) => {
    Di(r) && n.push(qt(r));
  });
  const s = ds(t.children);
  s.length === t.children.length && Op(s, n) || t.children.splice(0, t.children.length, ...n);
}
function Tp(t, e) {
  const n = e.target;
  switch (t.nodeType) {
    case "Text":
      if (n instanceof Text)
        return t.textContent = n.textContent || "", !0;
      break;
  }
  return !1;
}
function Mp(t) {
  return t instanceof HTMLElement || t instanceof Text;
}
function rl(t) {
  return t instanceof HTMLElement && t.classList.contains("ph-inspect-label");
}
function Di(t) {
  return Mp(t) && !rl(t);
}
function Li(t, e) {
  return !!t?.split(/\s+/).includes(e);
}
function $p(t) {
  return t.nodeType === "HTMLElement" && Li(t.attributes.class, "ph-inspect-label");
}
function ds(t) {
  return t.filter((e) => !$p(e));
}
function Op(t, e) {
  return t.length !== e.length ? !1 : t.every(
    (n, s) => ki(n, e[s])
  );
}
function il(t, e) {
  const n = new Set(_p);
  return e && Li(t, "playhtml-loading") && n.add(e), n;
}
function Ti(t) {
  const e = t.getAttribute("class") || void 0;
  return {
    classValue: e,
    localClassNames: il(
      e,
      t.getAttribute("loading-class")
    )
  };
}
function Ip(t) {
  return {
    classValue: t.class,
    localClassNames: il(
      t.class,
      t["loading-class"]
    )
  };
}
function ol(t, e, n) {
  return sl.includes(t) ? !0 : Li(n.classValue, "playhtml-loading") && Ap[t] === e;
}
function Mi(t, e, n) {
  return ol(t, e, n) ? null : t === "class" ? Pp(
    e,
    n.localClassNames
  ) || null : e;
}
function Lr(t) {
  const e = {}, n = Ip(t);
  for (const [s, r] of Object.entries(t)) {
    const i = Mi(s, r, n);
    i !== null && (e[s] = i);
  }
  return e;
}
function Pp(t, e) {
  return t.split(/\s+/).filter((n) => n && !e.has(n)).join(" ");
}
function cl(t, e) {
  return t.split(/\s+/).filter((n) => e.has(n)).join(" ");
}
function Rp(t, e, n) {
  const s = [
    ...t.split(/\s+/).filter(Boolean),
    ...cl(e, n).split(/\s+/).filter(Boolean)
  ];
  return Array.from(new Set(s)).join(" ");
}
function Np(t) {
  if (t instanceof HTMLInputElement) {
    const e = {};
    return t.type === "checkbox" || t.type === "radio" ? e.checked = t.checked : e.value = t.value, e;
  }
  if (t instanceof HTMLTextAreaElement)
    return { value: t.value };
  if (t instanceof HTMLSelectElement)
    return { selectedIndex: t.selectedIndex, value: t.value };
}
function qt(t) {
  if (t instanceof Text)
    return {
      nodeType: "Text",
      textContent: t.textContent || ""
    };
  const e = {
    nodeType: "HTMLElement",
    tagName: t.tagName.toLowerCase(),
    attributes: {},
    children: []
  }, n = Ti(t);
  for (const r of t.attributes) {
    const i = Mi(
      r.name,
      r.value,
      n
    );
    i !== null && (e.attributes[r.name] = i);
  }
  const s = Np(t);
  return s && (e.formState = s), t.childNodes.forEach((r) => {
    Di(r) && e.children.push(qt(r));
  }), e;
}
function Up(t, e) {
  e && (t instanceof HTMLInputElement ? (t.type === "checkbox" || t.type === "radio") && e.checked !== void 0 ? t.checked = e.checked : e.value !== void 0 && (t.value = e.value) : t instanceof HTMLTextAreaElement && e.value !== void 0 ? t.value = e.value : t instanceof HTMLSelectElement && e.selectedIndex !== void 0 && (t.selectedIndex = e.selectedIndex));
}
function Jn(t, e) {
  Fp(t, e), e.nodeType === "HTMLElement" && (jp(t, e), Up(t, e.formState), zp(t, e));
}
function Fp(t, e) {
  e && e.nodeType === "Text" && t.textContent !== e.textContent && (t.textContent = e.textContent || "");
}
function jp(t, e) {
  if (!e)
    return;
  const n = e.attributes && typeof e.attributes == "object" ? Lr(e.attributes) : {}, s = Ti(t);
  for (const [r, i] of Object.entries(n)) {
    const o = r === "class" ? Rp(
      i,
      t.getAttribute("class") || "",
      s.localClassNames
    ) : i;
    t.getAttribute(r) !== o && t.setAttribute(r, o);
  }
  Array.from(t.attributes).forEach((r) => {
    if (!ol(r.name, r.value, s)) {
      if (r.name === "class") {
        const i = cl(
          r.value,
          s.localClassNames
        );
        if (!("class" in n) && i) {
          t.setAttribute("class", i);
          return;
        }
      }
      r.name in n || t.removeAttribute(r.name);
    }
  });
}
function Oo(t) {
  return t.nodeType === "Text" ? document.createTextNode(t.textContent) : document.createElement(t.tagName);
}
function Hp(t, e) {
  return e.nodeType === "Text" ? t instanceof Text : t instanceof HTMLElement && t.tagName.toLowerCase() === e.tagName;
}
function zp(t, e) {
  const n = Array.from(t.childNodes).filter(Di), s = ds(e.children), r = Math.min(n.length, s.length);
  for (let i = 0; i < r; i++) {
    const o = n[i], c = s[i];
    if (Hp(o, c))
      Jn(o, c);
    else {
      const a = Oo(c);
      t.replaceChild(a, o), Jn(a, c);
    }
  }
  for (let i = r; i < s.length; i++) {
    const o = s[i], c = Oo(o), a = Array.from(t.childNodes).find(rl);
    t.insertBefore(c, a ?? null), Jn(c, o);
  }
  for (let i = n.length - 1; i >= r; i--)
    t.removeChild(n[i]);
}
const Tr = 16, qe = 512, al = /[\u0000-\u001f\u007f]/, Bp = 150;
function Vp() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}
function Io(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function ll(t) {
  if (!Io(t) || !Po(t.publicKey))
    return null;
  const e = Io(t.playerStyle) ? t.playerStyle : {}, n = Array.isArray(e.colorPalette) ? e.colorPalette.filter(Po).slice(0, Tr) : [], s = {
    publicKey: t.publicKey,
    playerStyle: { colorPalette: n }
  }, r = Ro(t.name);
  r !== void 0 && (s.name = r);
  const i = Ro(e.cursorStyle);
  return i !== void 0 && (s.playerStyle.cursorStyle = i), Number.isFinite(t.createdAt) && (s.createdAt = Number(t.createdAt)), s;
}
function Po(t) {
  return typeof t == "string" && t.length > 0 && t.length <= qe && !al.test(t);
}
function Ro(t) {
  if (typeof t == "string" && !al.test(t))
    return t.slice(0, qe);
}
function Kp() {
  const t = crypto.getRandomValues(new Uint8Array(16)).reduce((s, r) => s + r.toString(16).padStart(2, "0"), ""), e = Math.floor(Math.random() * 360), n = [
    `hsl(${e}, 70%, 60%)`,
    `hsl(${(e + 120) % 360}, 70%, 60%)`,
    `hsl(${(e + 240) % 360}, 70%, 60%)`
  ];
  return {
    publicKey: t,
    playerStyle: {
      colorPalette: n
    },
    createdAt: Date.now()
  };
}
function Wp(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  return typeof e == "string" && e.length > 0;
}
function Mr(t) {
  try {
    localStorage.setItem(
      ul,
      JSON.stringify(t)
    );
  } catch (e) {
    console.warn("Failed to save player identity to localStorage:", e);
  }
}
function Yp(t) {
  return Wp(t) ? !1 : (t.playerStyle || (t.playerStyle = { colorPalette: [] }), Array.isArray(t.playerStyle.colorPalette) || (t.playerStyle.colorPalette = []), t.playerStyle.colorPalette[0] = Vp(), !0);
}
const ul = "playhtml_player_identity";
let Rn = null;
function qp() {
  if (Rn) return Rn;
  const t = localStorage.getItem(ul);
  if (t)
    try {
      const n = JSON.parse(t), s = ll(n);
      if (s)
        return (Yp(s) || JSON.stringify(s) !== JSON.stringify(n)) && Mr(s), Rn = s, s;
    } catch {
      console.warn(
        "Failed to parse stored player identity, generating new one"
      );
    }
  const e = Kp();
  return Mr(e), Rn = e, e;
}
const $i = 512, fs = 4096;
function or(t) {
  if (!j(t))
    throw new Error("Presence message must be an object");
  switch (t.type) {
    case "presence-join":
      return Gp(t), t;
    case "presence-update":
      return Uo(t.channel), Jp(t.channel, t.value), t;
    case "presence-clear":
      return Uo(t.channel), t;
    default:
      throw new Error("Unsupported presence message type");
  }
}
function Gp(t) {
  pl(t), ps(t.page, "page", $i), t.identity !== void 0 && hl(t.identity);
}
function Jp(t, e) {
  if (e === void 0)
    throw new Error("Presence value must not be undefined");
  pl(e), t === "cursor" && Xp(e), t === "identity" && hl(e);
}
function Xp(t) {
  if (!j(t))
    throw new Error("cursor presence value must be an object");
  if (!("cursor" in t))
    throw new Error("cursor presence value must include cursor");
  if (t.cursor !== null && eg(t.cursor), t.zone !== void 0 && t.zone !== null && tg(t.zone), ps(t.page, "page", $i), t.at !== void 0 && !Number.isFinite(t.at))
    throw new Error("cursor at must be a finite number");
}
function Zp(t) {
  try {
    return dl(t), !0;
  } catch {
    return !1;
  }
}
function hl(t) {
  dl(t);
}
function dl(t) {
  if (!j(t))
    throw new Error("identity must be an object");
  if (No(
    t,
    ["publicKey", "name", "playerStyle", "createdAt"],
    "identity"
  ), cr(
    t.publicKey,
    "identity.publicKey",
    qe
  ), !j(t.playerStyle))
    throw new Error("identity.playerStyle must be an object");
  No(
    t.playerStyle,
    ["colorPalette", "cursorStyle"],
    "identity.playerStyle"
  );
  const e = t.playerStyle.colorPalette;
  if (!Array.isArray(e))
    throw new Error("identity.playerStyle.colorPalette must be an array");
  if (e.length > Tr)
    throw new Error(
      `identity.playerStyle.colorPalette must have ${Tr} colors or less`
    );
  cr(
    e[0],
    "identity.playerStyle.colorPalette[0]",
    qe
  );
  for (let n = 1; n < e.length; n++)
    cr(
      e[n],
      `identity.playerStyle.colorPalette[${n}]`,
      qe
    );
  if (ps(
    t.name,
    "identity.name",
    qe
  ), ps(
    t.playerStyle.cursorStyle,
    "identity.playerStyle.cursorStyle",
    qe
  ), t.createdAt !== void 0 && !Number.isFinite(t.createdAt))
    throw new Error("identity.createdAt must be a finite number");
}
function No(t, e, n) {
  for (const s of Object.keys(t))
    if (!e.includes(s))
      throw new Error(`${n} must only include public presence fields`);
}
function Qp(t) {
  try {
    return fl(t), !0;
  } catch {
    return !1;
  }
}
function eg(t) {
  fl(t);
}
function fl(t) {
  if (!j(t))
    throw new Error("cursor must be an object");
  if (!Number.isFinite(t.x))
    throw new Error("cursor.x must be a finite number");
  if (!Number.isFinite(t.y))
    throw new Error("cursor.y must be a finite number");
  if (typeof t.pointer != "string" || t.pointer.length === 0)
    throw new Error("cursor.pointer must be a non-empty string");
}
function tg(t) {
  if (!j(t))
    throw new Error("cursor zone must be an object");
  if (typeof t.zoneId != "string" || t.zoneId.length === 0)
    throw new Error("cursor zoneId must be a non-empty string");
  if (!Number.isFinite(t.relX))
    throw new Error("cursor zone relX must be a finite number");
  if (!Number.isFinite(t.relY))
    throw new Error("cursor zone relY must be a finite number");
}
function Uo(t) {
  if (typeof t != "string" || t.length === 0)
    throw new Error("Presence channel must be a non-empty string");
  Oi(t, "Presence channel", 128);
}
function cr(t, e, n) {
  if (typeof t != "string" || t.length === 0)
    throw new Error(`${e} must be a non-empty string`);
  Oi(t, e, n);
}
function ps(t, e, n) {
  if (t !== void 0) {
    if (typeof t != "string")
      throw new Error(`${e} must be a string`);
    Oi(t, e, n);
  }
}
function Oi(t, e, n) {
  if (t.length > n)
    throw new Error(`${e} must be ${n} characters or less`);
  if (/[\u0000-\u001f\u007f]/.test(t))
    throw new Error(`${e} must not contain control characters`);
}
function pl(t) {
  try {
    if (JSON.stringify(t) === void 0)
      throw new Error("Presence value must be JSON-serializable");
  } catch {
    throw new Error("Presence value must be JSON-serializable");
  }
}
function j(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function Gt(t) {
  return t !== null && typeof t == "object" && Object.getPrototypeOf(t) === Object.prototype;
}
function $r(t, e) {
  if (Object.is(t, e)) return !0;
  if (Array.isArray(t) && Array.isArray(e))
    return t.length === e.length && t.every((n, s) => $r(n, e[s]));
  if (Gt(t) && Gt(e)) {
    const n = Object.keys(t), s = Object.keys(e);
    return n.length === s.length && s.every(
      (r) => Object.prototype.hasOwnProperty.call(t, r) && $r(t[r], e[r])
    );
  }
  return !1;
}
function gs(t, e) {
  if (e != null) {
    if (Array.isArray(e)) {
      if ($r(t, e)) return;
      t.splice(0, t.length, ...e);
      return;
    }
    if (Gt(e)) {
      for (const n of Object.keys(t))
        n in e || delete t[n];
      for (const [n, s] of Object.entries(e))
        Array.isArray(s) ? (Array.isArray(t[n]) || (t[n] = []), gs(t[n], s)) : Gt(s) ? (Gt(t[n]) || (t[n] = {}), gs(t[n], s)) : Object.is(t[n], s) || (t[n] = s);
      return;
    }
    t = e;
  }
}
function Ue(t) {
  try {
    if (typeof structuredClone == "function")
      return structuredClone(t);
  } catch {
  }
  return t == null ? t : typeof t == "object" ? JSON.parse(JSON.stringify(t)) : t;
}
function gl(t) {
  const [e, n] = t.split("#");
  if (!e || !n)
    throw new Error("Invalid data-source attribute value");
  const s = e.indexOf("/"), r = s === -1 ? e : e.slice(0, s), i = s === -1 ? "/" : e.slice(s);
  return { domain: r, path: i, elementId: n };
}
const ng = "LOCAL";
function sg(t) {
  return t ? t.replace(/^www\./i, "") : ng;
}
function Fo(t) {
  if (!t) return "/";
  const e = t.replace(/\.[^/.]+$/, "");
  return e.startsWith("/") ? e : `/${e}`;
}
function ys(t) {
  return Math.round(t * 10) / 10 + 0;
}
function Kt(t) {
  const e = t?.trim();
  if (!e) return null;
  const n = e.startsWith("#") ? e.slice(1) : e;
  return document.getElementById(n) ?? document.querySelector(e);
}
function jo(t) {
  return Kt(t.getAttribute(lg));
}
const Ho = 1, zo = 60;
function rg(t) {
  const e = t.getAttribute(ug);
  if (e == null) return Ho;
  const n = parseFloat(e);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : Ho;
}
function ig(t) {
  const e = t.getAttribute(hg);
  if (e == null) return zo;
  const n = parseFloat(e);
  return !Number.isFinite(n) || n < 0 ? zo : n;
}
function Bo(t, e, n) {
  return Math.min(t, Math.max(t * e, n));
}
function Or(t, e, n) {
  const s = t.getBoundingClientRect(), r = e.getBoundingClientRect();
  return {
    x: s.left - r.left - e.clientLeft - n.x,
    y: s.top - r.top - e.clientTop - n.y
  };
}
function og(t, e, n, s, r = Or(t, e, n)) {
  const i = rg(t), o = ig(t), c = t.offsetWidth, a = t.offsetHeight, l = Bo(c, i, o), u = Bo(a, i, o), h = l - c - r.x, d = e.clientWidth - l - r.x, f = u - a - r.y, p = e.clientHeight - u - r.y;
  return {
    x: d < h ? 0 : Math.min(d, Math.max(h, s.x)),
    y: p < f ? 0 : Math.min(p, Math.max(f, s.y))
  };
}
function cg(t) {
  return {
    x: ys(t.x),
    y: ys(t.y)
  };
}
const ag = "can-duplicate-to", lg = "can-move-bounds", ug = "can-move-bounds-min-visible", hg = "can-move-bounds-min-visible-px";
var K = /* @__PURE__ */ ((t) => (t.CanPlay = "can-play", t.CanMove = "can-move", t.CanSpin = "can-spin", t.CanGrow = "can-grow", t.CanToggle = "can-toggle", t.CanDuplicate = "can-duplicate", t.CanHover = "can-hover", t.CanMirror = "can-mirror", t))(K || {});
function Nt(t) {
  return t.getAttribute("data-source") ? dg(t) : t.id;
}
function dg(t) {
  const e = t.getAttribute("data-source");
  if (!e)
    throw new Error("Element has no data-source attribute");
  const [n, s] = e.split("#");
  if (!n || !s)
    throw new Error("Invalid data-source attribute");
  return s;
}
const yl = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='44' height='53' viewport='0 0 100 100' style='fill:black;font-size:26px;'><text y='40%'>🚿</text></svg>")
      16 0,
    auto`, fg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>✂️</text></svg>") 16 0,auto`;
function Vo(t, { getData: e, getElement: n, getLocalData: s, setLocalData: r }) {
  const i = e(), o = s(), c = n();
  if (o.isHovering = !0, t.altKey) {
    if (i.scale <= 0.5) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = fg;
  } else {
    if (i.scale >= i.maxScale) {
      c.style.cursor = "not-allowed";
      return;
    }
    c.style.cursor = yl;
  }
  r(o);
}
function Nn(t) {
  if ("touches" in t) {
    const { clientX: e, clientY: n } = t.touches[0];
    return { clientX: e, clientY: n };
  }
  return { clientX: t.clientX, clientY: t.clientY };
}
const ml = {
  "can-move": {
    defaultData: { x: 0, y: 0 },
    defaultLocalData: { startMouseX: 0, startMouseY: 0 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `translate(${e.x}px, ${e.y}px)`;
    },
    onDragStart: (t, { data: e, element: n, setLocalData: s }) => {
      const { clientX: r, clientY: i } = Nn(t), o = jo(n), c = o ? Or(n, o, e) : void 0;
      s({
        startMouseX: r,
        startMouseY: i,
        dragX: e.x,
        dragY: e.y,
        boundsBaseX: c?.x,
        boundsBaseY: c?.y
      });
    },
    onDrag: (t, { data: e, localData: n, setData: s, setLocalData: r, element: i }) => {
      const { clientX: o, clientY: c } = Nn(t), a = e.x + o - n.startMouseX, l = e.y + c - n.startMouseY, u = jo(i);
      if (u) {
        const m = {
          x: n.dragX ?? e.x,
          y: n.dragY ?? e.y
        }, C = m.x + o - n.startMouseX, S = m.y + c - n.startMouseY, $ = n.boundsBaseX !== void 0 && n.boundsBaseY !== void 0 ? { x: n.boundsBaseX, y: n.boundsBaseY } : Or(i, u, m), z = og(
          i,
          u,
          m,
          {
            x: C,
            y: S
          },
          $
        ), _ = cg(z);
        s(_);
        const Be = z.x - m.x, Nu = z.y - m.y;
        r({
          startMouseX: n.startMouseX + Be,
          startMouseY: n.startMouseY + Nu,
          dragX: _.x,
          dragY: _.y,
          boundsBaseX: $.x,
          boundsBaseY: $.y
        });
        return;
      }
      const { top: h, left: d, bottom: f, right: p } = i.getBoundingClientRect(), y = window.visualViewport?.width ?? window.innerWidth, g = window.visualViewport?.height ?? window.innerHeight;
      p > y && o > n.startMouseX || f > g && c > n.startMouseY || d < 0 && o < n.startMouseX || h < 0 && c < n.startMouseY || (s({
        x: ys(a),
        y: ys(l)
      }), r({ startMouseX: o, startMouseY: c }));
    },
    resetShortcut: "shiftKey"
  },
  "can-spin": {
    defaultData: { rotation: 0 },
    defaultLocalData: { startMouseX: 0 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `rotate(${e.rotation}deg)`;
    },
    onDragStart: (t, { setLocalData: e }) => {
      const { clientX: n } = Nn(t);
      e({
        startMouseX: n
      });
    },
    onDrag: (t, { data: e, localData: n, setData: s, setLocalData: r }) => {
      const { clientX: i } = Nn(t);
      let o = Math.abs(i - n.startMouseX) * 2, c = e.rotation;
      i > n.startMouseX ? c += o : i < n.startMouseX && (c -= o), s({ rotation: c }), r({ startMouseX: i });
    },
    resetShortcut: "shiftKey"
  },
  "can-toggle": {
    defaultData: { on: !1 },
    updateElement: ({ element: t, data: e }) => {
      const n = typeof e == "object" ? e.on : e;
      t.classList.toggle("toggled", n), t.classList.toggle("clicked", n);
    },
    onClick: (t, { data: e, setData: n }) => {
      const s = typeof e == "object" ? e.on : e;
      n({ on: !s });
    },
    resetShortcut: "shiftKey"
  },
  "can-grow": {
    defaultData: { scale: 1 },
    defaultLocalData: { maxScale: 2, isHovering: !1 },
    updateElement: ({ element: t, data: e }) => {
      t.style.transform = `scale(${e.scale})`;
    },
    onClick: (t, { data: e, element: n, setData: s, localData: r }) => {
      let { scale: i } = e;
      if (t.altKey) {
        if (e.scale <= 0.5)
          return;
        i -= 0.1;
      } else {
        if (n.style.cursor = yl, e.scale >= r.maxScale)
          return;
        i += 0.1;
      }
      s({ ...e, scale: i });
    },
    onMount: (t) => {
      const e = t.getElement();
      let n = !1;
      const s = (o) => Vo(o, t), r = (o) => {
        Vo(o, t), !n && (n = !0, document.addEventListener("keydown", s), document.addEventListener("keyup", s));
      }, i = () => {
        n && (n = !1, document.removeEventListener("keydown", s), document.removeEventListener("keyup", s));
      };
      return e.addEventListener("mouseenter", r), e.addEventListener("mouseleave", i), () => {
        e.removeEventListener("mouseenter", r), e.removeEventListener("mouseleave", i), document.removeEventListener("keydown", s), document.removeEventListener("keyup", s);
      };
    },
    resetShortcut: "shiftKey"
  },
  // TODO: add ability to add max # of duplicates
  // TODO: add lifespan to automatically prune
  // TODO: add limit per person / per timeframe.
  "can-duplicate": {
    defaultData: [],
    defaultLocalData: [],
    updateElement: ({ data: t, localData: e, setLocalData: n, element: s }) => {
      const r = s.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      ), i = Kt(r);
      let o = document.getElementById(e.slice(-1)?.[0]) ?? null;
      if (!i) {
        console.error(
          `Element ${r} not found. Cannot duplicate.`
        );
        return;
      }
      const c = Kt(
        s.getAttribute(ag)
      );
      function a(u) {
        if (c) {
          c.appendChild(u);
          return;
        }
        i.parentNode.insertBefore(
          u,
          (o || i).nextSibling
        );
      }
      const l = new Set(e);
      for (const u of t) {
        if (l.has(u)) continue;
        const h = i.cloneNode(!0);
        Object.assign(h, { ...i }), h.id = u, a(h), e.push(u), window.playhtml.setupPlayElement(h), o = h;
      }
      n(e);
    },
    onClick: (t, { data: e, element: n, setData: s }) => {
      const r = Kt(
        n.getAttribute(
          "can-duplicate"
          /* CanDuplicate */
        )
      );
      if (!r) return;
      const i = r.id + "-" + Math.random().toString(36).substr(2, 9);
      s((o) => {
        o.push(i);
      });
    },
    isValidElementForTag: (t) => {
      const e = t.getAttribute(
        "can-duplicate"
        /* CanDuplicate */
      );
      return e ? (Kt(e) || console.warn(
        `can-duplicate element (${t.id}) duplicate element ("${e}") not found.`
      ), !0) : !1;
    }
  },
  // TODO: auto-duplicate :hover CSS rules to [data-playhtml-hover] via CSSOM
  // so users don't need to manually rewrite their hover styles.
  "can-hover": {
    defaultData: {},
    myDefaultAwareness: { hover: !1 },
    onMount: ({ getElement: t, setMyAwareness: e }) => {
      const n = t();
      n.addEventListener("mouseenter", () => {
        e({ hover: !0 }), n.setAttribute("data-playhtml-hover", "");
      }), n.addEventListener("mouseleave", () => {
        e({ hover: !1 }), n.removeAttribute("data-playhtml-hover");
      });
    },
    updateElement: () => {
    },
    updateElementAwareness: ({ element: t, awareness: e }) => {
      e.some((n) => n?.hover) ? t.setAttribute("data-playhtml-hover", "") : t.removeAttribute("data-playhtml-hover");
    }
  },
  "can-mirror": kp
};
function pg() {
  const t = [];
  if (document.querySelectorAll("[shared]").forEach((e) => {
    const n = e, s = n.id;
    if (!s) return;
    const r = `${window.location.host}${Fo(
      window.location.pathname
    )}#${s}`;
    t.push({
      type: "source",
      elementId: s,
      dataSource: r,
      normalized: r,
      permissions: n.getAttribute("shared")?.includes("read-only") ? "read-only" : "read-write",
      element: n
    });
  }), document.querySelectorAll("[data-source]").forEach((e) => {
    const n = e, s = n.getAttribute("data-source") || "", [r, i] = s.split("#");
    if (!r || !i) return;
    const o = r.indexOf("/"), c = o === -1 ? r : r.slice(0, o), a = o === -1 ? "/" : r.slice(o), l = `${c}${Fo(a)}#${i}`;
    t.push({
      type: "consumer",
      elementId: i,
      dataSource: s,
      normalized: l,
      element: n
    });
  }), t.length > 0)
    try {
      console.table(
        t.map((e) => ({
          type: e.type,
          elementId: e.elementId,
          dataSource: e.dataSource,
          normalized: e.normalized,
          permissions: e.permissions || ""
        }))
      );
    } catch {
    }
  return t;
}
function gg(t) {
  let e = !1, n = !1, s = !1;
  async function r() {
    if (!s) {
      if (e) {
        n = !0;
        return;
      }
      e = !0;
      try {
        await t();
      } finally {
        e = !1, n && !s && (n = !1, await r());
      }
    }
  }
  return {
    trigger: r,
    destroy() {
      s = !0, n = !1;
    }
  };
}
function yg(t) {
  const e = () => {
    t.trigger();
  }, n = () => {
    t.trigger();
  };
  window.addEventListener("popstate", e);
  const s = window.navigation;
  return s && typeof s.addEventListener == "function" && s.addEventListener("currententrychange", n), () => {
    window.removeEventListener("popstate", e), s && typeof s.removeEventListener == "function" && s.removeEventListener("currententrychange", n);
  };
}
function wl(t) {
  document.dispatchEvent(
    new CustomEvent("playhtml:navigated", { detail: { room: t } })
  );
}
function ln() {
  return ln = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, ln.apply(this, arguments);
}
function mg(t, e) {
  t.prototype = Object.create(e.prototype), t.prototype.constructor = t, Ir(t, e);
}
function Ir(t, e) {
  return Ir = Object.setPrototypeOf || function(s, r) {
    return s.__proto__ = r, s;
  }, Ir(t, e);
}
function wg(t) {
  if (t === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return t;
}
var bl = /* @__PURE__ */ (function() {
  function t(n) {
    this.trigger = n, this.observing = /* @__PURE__ */ new Map();
  }
  var e = t.prototype;
  return e.registerConnection = function(s) {
    var r = this.observing.get(s.observable);
    r || (r = {
      byKey: /* @__PURE__ */ new Set(),
      iterate: !1
    }, this.observing.set(s.observable, r)), s.type === "iterate" ? r.iterate = !0 : r.byKey.add(s.key);
  }, e.removeObservers = function() {
    var s = this;
    this.observing.forEach(function(r, i) {
      r.iterate && i[I].connections.iterate.delete(s), r.byKey.forEach(function(o) {
        i[I].connections.byKey.get(o).delete(s);
      });
    }), this.observing.clear();
  }, t;
})(), Qe = [], Us = /* @__PURE__ */ (function(t) {
  mg(e, t);
  function e(s, r, i) {
    var o;
    if (o = t.call(this, function() {
      return o._trigger();
    }) || this, o.func = s, o.options = r, o.effect = i, o.isInitial = !0, o.reaction = function() {
      Qe.push(wg(o));
      try {
        o.func();
      } finally {
        Qe.pop();
      }
      o.effect && (!o.isInitial || o.options.fireImmediately) && o.effect(), o.isInitial = !1;
    }, !i && !o.options.fireImmediately)
      throw new Error("if no effect function passed, should always fireImmediately");
    return o.reaction(), o;
  }
  var n = e.prototype;
  return n._trigger = function() {
    if (Qe.includes(this))
      throw new Error("already running reaction");
    this.removeObservers(), this.reaction();
  }, e;
})(bl);
function vl() {
  return !!Qe.length;
}
function Cl() {
  return Qe.length ? Qe[Qe.length - 1] : void 0;
}
function bg(t, e, n) {
  var s = ln({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new Us(t, s, e);
  return r;
}
var Xn = 0;
function Sl() {
  return Xn > 0;
}
function Pr(t) {
  Xn++;
  try {
    return t();
  } finally {
    Xn--, Xn === 0 && Cg();
  }
}
var Rr = !1;
function El() {
  return Rr;
}
function _l(t) {
  Rr = !0;
  try {
    t();
  } finally {
    Rr = !1;
  }
}
function vg(t) {
  return function() {
    return _l(t);
  };
}
var Nr = [];
function Cg() {
  var t = [].concat(Nr);
  Nr = [], Al(t);
}
function Al(t) {
  var e = /* @__PURE__ */ new Set();
  t.forEach(function(n) {
    var s;
    (n.type === "add" || n.type === "delete") && n.observable[I].connections.iterate.forEach(function(r) {
      e.add(r);
    }), (s = n.observable[I].connections.byKey.get(n.key)) == null || s.forEach(function(r) {
      e.add(r);
    });
  }), e.forEach(function(n) {
    n.trigger();
  });
}
function Un(t) {
  if (Sl()) {
    Nr.push(t);
    return;
  }
  Al([t]);
}
function Ko(t, e) {
  if (t.type === "iterate")
    t.observable[I].connections.iterate.add(e);
  else {
    var n = t.observable[I].connections.byKey.get(t.key);
    n || (n = /* @__PURE__ */ new Set(), t.observable[I].connections.byKey.set(t.key, n)), n.add(e);
  }
}
function Fn(t, e) {
  if (!El()) {
    var n = Cl();
    n && (Ko(t, n), n.registerConnection(t)), e && (Ko(t, e), e.registerConnection(t));
  }
}
var Ii = /* @__PURE__ */ Symbol("$skipreactive"), I = /* @__PURE__ */ Symbol("$reactive"), oe = /* @__PURE__ */ Symbol("$reactiveproxy");
function Dn(t, e) {
  return !!(t && t[oe] && t[oe].implicitObserver === e);
}
function Pi(t) {
  return t[Ii] = !0, t;
}
function kl(t) {
  return !!(t && !Dn(t) && t[I]);
}
function Ur(t, e, n) {
  if (n === void 0 && (n = !1), t[Ii] || Dn(t, e))
    return t;
  var s = Sg(t, n);
  if (!e)
    return s;
  var r = s[I].proxiesWithImplicitObserver.get(e);
  if (!r) {
    var i = {
      implicitObserver: e
    };
    Object.setPrototypeOf(i, xl), r = new Proxy(s[I].raw, i), s[I].proxiesWithImplicitObserver.set(e, r);
  }
  return r;
}
var un = Ur;
function Sg(t, e) {
  if (e === void 0 && (e = !1), Dn(t))
    return t;
  if (kl(t))
    return t[I].proxy;
  if (t[I] || t[oe])
    throw new Error("unexpected");
  var n = {
    connections: {
      iterate: /* @__PURE__ */ new Set(),
      byKey: /* @__PURE__ */ new Map()
    },
    proxy: {},
    raw: t,
    proxiesWithImplicitObserver: /* @__PURE__ */ new Map(),
    shallow: e
  };
  Object.defineProperty(t, I, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
  var s = new Proxy(t, xl);
  return n.proxy = s, s;
}
var xl = {
  // Read:
  has: function(e, n) {
    var s = Reflect.has(e, n);
    return typeof n == "symbol" || Fn({
      observable: e,
      key: n,
      type: "has"
    }, this.implicitObserver), s;
  },
  get: function(e, n, s) {
    if (n === oe)
      return {
        implicitObserver: this.implicitObserver
      };
    var r = Reflect.get(e, n, s);
    if (typeof n == "symbol")
      return n.toString() === "Symbol($reactiveproxy)" && console.error("warning, Symbol($reactiveproxy) passed, but does not match $reactiveproxy. Multiple Reactive libraries loaded?"), r;
    if (n === "length" && Array.isArray(e) ? Fn({
      observable: e,
      type: "iterate"
    }, this.implicitObserver) : Fn({
      observable: e,
      key: n,
      type: "get"
    }, this.implicitObserver), kl(r))
      return Ur(r, this.implicitObserver);
    if (e[I].shallow)
      return r;
    if (typeof r == "object" && r !== null && !Dn(r, this.implicitObserver) && !Object.isFrozen(r)) {
      var i = Reflect.getOwnPropertyDescriptor(e, n);
      if ((!i || !(i.writable === !1 && i.configurable === !1)) && (vl() || this.implicitObserver))
        return Ur(r, this.implicitObserver);
    }
    return r;
  },
  ownKeys: function(e) {
    return Fn({
      observable: e,
      type: "iterate"
    }, this.implicitObserver), Reflect.ownKeys(e);
  },
  // Write:
  set: function(e, n, s, r) {
    return Pr(function() {
      if (typeof n == "symbol")
        return Reflect.set(e, n, s, r);
      var i = Object.hasOwnProperty.call(e, n), o = Reflect.get(e, n, r), c = Reflect.set(e, n, s, r);
      if (!i)
        Un({
          observable: e,
          key: n,
          value: s,
          type: "add"
        });
      else if (s !== o)
        if (n === "length" && Array.isArray(e)) {
          if (!(o < s))
            for (var a = s + 1; a <= o; a++)
              Un({
                observable: e,
                key: "" + (a - 1),
                oldValue: void 0,
                type: "delete"
              });
        } else
          Un({
            observable: e,
            key: n,
            value: s,
            oldValue: o,
            type: "update"
          });
      return c;
    });
  },
  deleteProperty: function(e, n) {
    return Pr(function() {
      if (typeof n == "symbol")
        return Reflect.deleteProperty(e, n);
      var s = Object.hasOwnProperty.call(e, n), r = Reflect.get(e, n), i = Reflect.deleteProperty(e, n);
      return s && Un({
        observable: e,
        key: n,
        oldValue: r,
        type: "delete"
      }), i;
    });
  },
  preventExtensions: function(e) {
    throw new Error("Dynamic observable objects cannot be frozen");
  }
};
function Eg(t, e) {
  var n = ln({
    name: "unnamed",
    fireImmediately: !0
  }, e), s = new Us(t, n);
  return s;
}
function _g(t, e, n) {
  var s = ln({
    name: "unnamed",
    fireImmediately: !0
  }, n), r = new Us(function() {
    t(e);
  }, s);
  return e = un(e, r), s.fireImmediately && r.trigger(), r;
}
var Dl = /* @__PURE__ */ (function() {
  function t() {
    this._observable = un({
      _key: 1
    });
  }
  var e = t.prototype;
  return e.reportObserved = function(s) {
    return un(this._observable, s)._key;
  }, e.reportChanged = function() {
    this._observable._key++;
  }, t;
})();
function Ag(t, e, n) {
  return new Dl();
}
const kg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  $reactive: I,
  $reactiveproxy: oe,
  $skipreactive: Ii,
  Atom: Dl,
  Observer: bl,
  Reaction: Us,
  autorun: Eg,
  autorunAsync: _g,
  createAtom: Ag,
  hasRunningReaction: vl,
  isActionRunning: Sl,
  isReactive: Dn,
  isTrackingDisabled: El,
  markRaw: Pi,
  reaction: bg,
  reactive: un,
  runInAction: Pr,
  runningReaction: Cl,
  untracked: _l,
  untrackedCB: vg
}, Symbol.toStringTag, { value: "Module" }));
let Fr, jr, xg = (t) => t();
function Dg(t, e) {
  if (jr)
    return jr(t, e);
  xg(t);
}
function it(t, e, n) {
  if (Fr)
    return Fr.apply(null, arguments);
  throw new Error("observable implementation not provided. Call enableReactiveBindings, enableVueBindings or enableMobxBindings.");
}
function Lg(t) {
  Fr = function(e, n, s) {
    const r = t.createAtom(e);
    return n && n(), r;
  }, jr = (e, n) => t.reaction(e, n, {
    fireImmediately: !1
  });
}
const Wo = /* @__PURE__ */ new WeakSet();
function Tg(t) {
  if (Wo.has(t))
    return t;
  Wo.add(t);
  let e;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!e) {
      const h = (d) => {
        (d.changes.added.size || d.changes.deleted.size || d.changes.keys.size || d.changes.delta.length) && e.reportChanged();
      };
      e = it("map", () => {
        t.observe(h);
      }, () => {
        t.unobserve(h);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  function r(h) {
    let d = n.get(h);
    if (!d) {
      const f = (p) => {
        d.reportChanged();
      };
      d = it(h + "", () => {
        t.observe(f);
      }, () => {
        t.unobserve(f);
      }), n.set(h, d);
    }
    d.reportObserved(t._implicitObserver);
  }
  const i = t.get;
  t.get = function(h) {
    if (typeof h != "number")
      throw new Error("unexpected");
    return r(h), Reflect.apply(i, this, arguments);
  };
  function o(h) {
    const d = t[h];
    t[h] = function() {
      return s(), Reflect.apply(d, this, arguments);
    };
  }
  function c(h) {
    let d = t, f = Object.getOwnPropertyDescriptor(d, h);
    if (f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, h)), f || (d = Object.getPrototypeOf(d), f = Object.getOwnPropertyDescriptor(d, h)), !f)
      throw new Error("property not found");
    const p = f.get;
    f.get = function() {
      return this._disableTracking || s(), Reflect.apply(p, this, arguments);
    }, Object.defineProperty(t, h, f);
  }
  function a(h, d) {
    let f = t, p = Object.getOwnPropertyDescriptor(f, h);
    if (p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, h)), p || (f = Object.getPrototypeOf(f), p = Object.getOwnPropertyDescriptor(f, h)), !p)
      throw new Error("property not found");
    Object.defineProperty(t, d, p);
  }
  o("forEach"), o("toJSON"), o("toArray"), o("slice"), o("map"), a("length", "lengthUntracked"), c("length");
  const l = t.push;
  t.push = function(h) {
    this._disableTracking = !0;
    const d = l.call(this, h);
    return this._disableTracking = !1, d;
  };
  const u = t.slice;
  return t.slice = function(h, d) {
    this._disableTracking = !0;
    const f = u.call(this, h, d);
    return this._disableTracking = !1, f;
  }, t;
}
const Yo = /* @__PURE__ */ new WeakSet();
function Mg(t) {
  if (Yo.has(t))
    return t;
  Yo.add(t);
  let e;
  function n() {
    if (!e) {
      let i = Array.from(t.share.keys());
      const o = (c) => {
        const a = Array.from(t.share.keys());
        JSON.stringify(i) !== JSON.stringify(a) && (i = a, e.reportChanged());
      };
      e = it("map", () => {
        t.on("beforeObserverCalls", o);
      }, () => {
        t.off("beforeObserverCalls", o);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  const s = t.get;
  t.get = function(i) {
    if (typeof i != "string")
      throw new Error("unexpected");
    const o = Reflect.apply(s, this, arguments);
    return Fs(o), o;
  };
  function r(i) {
    const o = t[i];
    let c;
    t[i] = function() {
      let a, l = arguments;
      return n(), c && c.removeObservers(), c = Dg(() => (a = Reflect.apply(o, t, l), a), () => e.reportChanged()), a;
    };
  }
  return r("toJSON"), Object.defineProperty(t, "keys", {
    get: () => (n(), Object.keys(t.share))
  }), t;
}
const qo = /* @__PURE__ */ new WeakSet();
function $g(t) {
  if (qo.has(t))
    return t;
  qo.add(t);
  let e;
  const n = /* @__PURE__ */ new Map();
  function s() {
    if (!e) {
      const c = (a) => {
        (a.changes.added.size || a.changes.deleted.size || a.changes.keys.size || a.changes.delta.length) && e.reportChanged();
      };
      e = it("map", () => {
        t.observe(c);
      }, () => {
        t.unobserve(c);
      });
    }
    e.reportObserved(t._implicitObserver);
  }
  function r(c) {
    let a = n.get(c);
    if (!a) {
      const l = (u) => {
        u.keysChanged.has(c) && (u.changes.added.size || u.changes.deleted.size || u.changes.keys.size || u.changes.delta.length) && a.reportChanged();
      };
      a = it(c, () => {
        t.observe(l);
      }, () => {
        t.unobserve(l);
      }), n.set(c, a);
    }
    a.reportObserved(t._implicitObserver);
  }
  const i = t.get;
  t.get = function(c) {
    if (typeof c != "string")
      throw new Error("unexpected");
    return r(c), Reflect.apply(i, this, arguments);
  };
  function o(c) {
    const a = t[c];
    t[c] = function() {
      return s(), Reflect.apply(a, this, arguments);
    };
  }
  return o("values"), o("entries"), o("keys"), o("forEach"), o("toJSON"), t;
}
const Go = /* @__PURE__ */ new WeakSet();
function Jo(t) {
  if (Go.has(t))
    return t;
  Go.add(t);
  let e;
  const n = (r) => {
    e.reportChanged();
  };
  e = it("text", () => {
    t.observe(n);
  }, () => {
    t.unobserve(n);
  });
  function s(r) {
    const i = t[r];
    t[r] = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(i, this, arguments);
    };
  }
  return s("toString"), s("toJSON"), t;
}
const Xo = /* @__PURE__ */ new WeakSet();
function Zo(t) {
  if (Xo.has(t))
    return t;
  Xo.add(t);
  let e;
  const n = (i) => {
    (i.changes.added.size || i.changes.deleted.size || i.changes.keys.size || i.changes.delta.length) && e.reportChanged();
  };
  e = it("xml", () => {
    t.observe(n);
  }, () => {
    t.unobserve(n);
  });
  function s(i) {
    const o = t[i];
    t[i] = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(o, this, arguments);
    };
  }
  function r(i) {
    let o = t, c = Object.getOwnPropertyDescriptor(o, i);
    if (c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), c || (o = Object.getPrototypeOf(o), c = Object.getOwnPropertyDescriptor(o, i)), !c)
      throw new Error("property not found");
    const a = c.get;
    c.get = function() {
      return e.reportObserved(this._implicitObserver), Reflect.apply(a, this, arguments);
    }, Object.defineProperty(t, i, c);
  }
  return s("toString"), s("toDOM"), s("toArray"), s("getAttribute"), r("firstChild"), t;
}
function Fs(t) {
  return t instanceof st || t instanceof Ee ? Jo(t) : t instanceof pe ? Tg(t) : t instanceof ye ? $g(t) : t instanceof ke || Object.prototype.hasOwnProperty.call(t, "autoLoad") ? Mg(t) : t instanceof me || t instanceof _e ? Zo(t) : t;
}
function Qo(t) {
  t.share.forEach((e) => {
    e.constructor !== D && Fs(e);
  });
}
function ec(t, e) {
  for (let s = t.length - 1; s >= e; s--) {
    let r = t[s];
    if (!r.deleted) {
      var n;
      if (r instanceof Z)
        continue;
      (n = r.content) == null || n.getContent().forEach((i) => {
        i instanceof D && Fs(i);
      });
    }
  }
}
const tc = /* @__PURE__ */ new WeakSet();
function Og(t) {
  tc.has(t) || (tc.add(t), Fs(t), t.store.clients.forEach((e) => {
    e && ec(e, 0);
  }), Qo(t), t.on("beforeObserverCalls", (e) => {
    Qo(t), e.afterState.forEach((n, s) => {
      const r = e.beforeState.get(s) || 0;
      if (r !== n) {
        const i = e.doc.store.clients.get(s);
        if (!i)
          return;
        const o = he(i, r);
        ec(i, o);
      }
    });
  }));
}
class hn {
  constructor(e) {
    this.value = void 0, this.value = e;
  }
}
function Ig(t) {
  return ArrayBuffer.isView(t) ? new hn(t) : new hn(Object.freeze(t));
}
function Pg(t) {
  const e = function() {
    var c;
    let a = (c = this[oe]) == null ? void 0 : c.implicitObserver;
    return t._implicitObserver = a, t.slice.bind(t).apply(t, arguments).map((u) => {
      const h = js(u, a);
      return a && typeof h == "object" ? un(h, a) : h;
    });
  }, n = function(c) {
    return c.map((a) => {
      const l = Ri(a);
      let u = Q(l) || l;
      if (u instanceof hn && (u = u.value), u instanceof D && u.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return u;
    });
  }, s = function() {
    return [].findIndex.apply(e.apply(this), arguments);
  }, r = {
    // get length() {
    //   return arr.length;
    // },
    // set length(val: number) {
    //   throw new Error("set length of yjs array is unsupported");
    // },
    slice: e,
    unshift: (...o) => (t.unshift(n(o)), t.lengthUntracked),
    push: (...o) => (t.push(n(o)), t.lengthUntracked),
    insert: t.insert.bind(t),
    toJSON: t.toJSON.bind(t),
    forEach: function() {
      return [].forEach.apply(e.apply(this), arguments);
    },
    every: function() {
      return [].every.apply(e.apply(this), arguments);
    },
    filter: function() {
      return [].filter.apply(e.apply(this), arguments);
    },
    find: function() {
      return [].find.apply(e.apply(this), arguments);
    },
    findIndex: s,
    some: function() {
      return [].some.apply(e.apply(this), arguments);
    },
    includes: function() {
      return [].includes.apply(e.apply(this), arguments);
    },
    map: function() {
      return [].map.apply(e.apply(this), arguments);
    },
    indexOf: function() {
      const o = arguments[0];
      return s.call(this, (c) => Fg(c, o));
    },
    splice: function() {
      let o = arguments[0] < 0 ? t.length - Math.abs(arguments[0]) : arguments[0], c = arguments[1], a = Array.from(Array.from(arguments).slice(2)), l = e.apply(this, [o, Number.isInteger(c) ? o + c : void 0]);
      return t.doc ? t.doc.transact(() => {
        t.delete(o, c), t.insert(o, n(a));
      }) : (t.delete(o, c), t.insert(o, n(a))), l;
    }
    // toJSON = () => {
    //   return this.arr.toJSON() slice();
    // };
    // delete = this.arr.delete.bind(this.arr) as (Y.Array<T>)["delete"];
  }, i = [];
  for (let o in r)
    i[o] = r[o];
  return i;
}
function Ft(t) {
  if (typeof t == "string" && t.trim().length) {
    const e = Number(t);
    if (Number.isInteger(e))
      return e;
  }
  return t;
}
function nc(t, e = new pe()) {
  if (e[I])
    throw new Error("unexpected");
  const n = Pg(e), s = new Proxy(n, {
    set: (r, i, o) => {
      throw typeof Ft(i) != "number" ? new Error() : new Error("array assignment is not implemented / supported");
    },
    get: (r, i, o) => {
      const c = Ft(i);
      if (c === Hs)
        return e;
      if (typeof c == "number") {
        let u;
        if (o && o[oe]) {
          var a;
          u = (a = o[oe]) == null ? void 0 : a.implicitObserver, e._implicitObserver = u;
        }
        let h = e.get(c);
        return h = js(h, u), h;
      }
      if (c === Symbol.toStringTag)
        return "Array";
      if (c === Symbol.iterator) {
        const u = e.slice();
        return Reflect.get(u, c);
      }
      return c === "length" ? e.length : Reflect.get(r, c, o);
    },
    // getOwnPropertyDescriptor: (target, pArg) => {
    //   const p = propertyToNumber(pArg);
    //   if (typeof p === "number" && p < arr.length && p >= 0) {
    //     return { configurable: true, enumerable: true, value: arr.get(p) };
    //   } else {
    //     return undefined;
    //   }
    // },
    deleteProperty: (r, i) => {
      const o = Ft(i);
      if (typeof o != "number")
        throw new Error();
      return o < e.lengthUntracked && o >= 0 ? (e.delete(o), !0) : !1;
    },
    has: (r, i) => {
      const o = Ft(i);
      return typeof o != "number" ? Reflect.has(r, o) : o < e.lengthUntracked && o >= 0;
    },
    getOwnPropertyDescriptor(r, i) {
      const o = Ft(i);
      if (o === "length")
        return {
          enumerable: !1,
          configurable: !1,
          writable: !0
        };
      if (typeof o == "number" && o >= 0 && o < e.lengthUntracked)
        return {
          enumerable: !0,
          configurable: !0,
          writable: !0
        };
    },
    ownKeys: (r) => {
      const i = [];
      for (let o = 0; o < e.length; o++)
        i.push(o + "");
      return i.push("length"), i;
    }
  });
  return n.push.apply(s, t), s;
}
function sc(t, e = new ye()) {
  if (e[I])
    throw new Error("unexpected");
  const n = new Proxy({}, {
    set: (s, r, i) => {
      if (typeof r != "string")
        throw new Error();
      const o = Ri(i);
      let c = Q(o) || o;
      if (c instanceof hn && (c = c.value), c instanceof D && c.parent)
        throw new Error("Not supported: reassigning object that already occurs in the tree.");
      return e.set(r, c), !0;
    },
    get: (s, r, i) => {
      if (r === Hs)
        return e;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[oe]) {
        var c;
        o = (c = i[oe]) == null ? void 0 : c.implicitObserver, e._implicitObserver = o;
      }
      let a = e.get(r);
      return a = js(a, o), a;
    },
    deleteProperty: (s, r) => {
      if (typeof r != "string")
        throw new Error();
      return e.has(r) ? (e.delete(r), !0) : !1;
    },
    has: (s, r) => !!(typeof r == "string" && e.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && e.has(r))
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(e.keys())
  });
  Jt.set(e, n);
  for (let s in t)
    n[s] = t[s];
  return n;
}
function Rg(t) {
  return t instanceof D;
}
const Jt = /* @__PURE__ */ new WeakMap();
function js(t, e) {
  if (Rg(t)) {
    if (t._implicitObserver = e, t instanceof pe || t instanceof ye) {
      if (!Jt.has(t)) {
        const n = Ri(t);
        Jt.set(t, n);
      }
      t = Jt.get(t);
    } else if (t instanceof _e || t instanceof me || t instanceof st || t instanceof Dt || t instanceof Ee)
      Pi(t), t.__v_skip = !0;
    else
      throw new Error("unknown YType");
    return t;
  } else {
    if (t === null)
      return null;
    if (typeof t == "object")
      return Ig(t);
  }
  return t;
}
function Ri(t) {
  if (t == null)
    return t;
  if (t = Q(t) || t, t instanceof pe)
    return nc([], t);
  if (t instanceof ye)
    return sc({}, t);
  if (typeof t == "string")
    return t;
  if (Array.isArray(t))
    return nc(t);
  if (t instanceof _e || t instanceof me || t instanceof st || t instanceof Dt)
    return t;
  if (t instanceof Ee)
    return t;
  if (typeof t == "object")
    return t instanceof hn ? t : sc(t);
  if (typeof t == "number" || typeof t == "boolean")
    return t;
  throw new Error("invalid");
}
function Ng(t) {
  for (let [e, n] of Object.entries(t))
    if (Array.isArray(n)) {
      if (n.length !== 0)
        throw new Error("Root Array initializer must always be empty array");
    } else if (n && typeof n == "object") {
      if (Object.keys(n).length !== 0 || Object.getPrototypeOf(n) !== Object.prototype)
        throw new Error("Root Object initializer must always be {}");
    } else if (n !== "xml" && n !== "text")
      throw new Error("unknown Root initializer");
}
function rc(t, e, n) {
  let s = e[n];
  if (!s) {
    n !== "__v_raw" && n !== "__v_isRef" && n !== "__v_isReadonly" && console.warn("property not found on root doc", n);
    return;
  }
  return s === "xml" ? t.getXmlFragment(n) : s === "text" ? t.getText(n) : Array.isArray(s) ? t.getArray(n) : t.getMap(n);
}
function Ug(t, e) {
  if (t[I])
    throw new Error("unexpected");
  Ng(e);
  const n = new Proxy({}, {
    set: (s, r, i) => {
      throw typeof r != "string" ? new Error() : new Error("cannot set new elements on root doc");
    },
    get: (s, r, i) => {
      if (r === Hs)
        return t;
      if (typeof r != "string")
        return Reflect.get(s, r);
      let o;
      if (i && i[oe]) {
        var c;
        o = (c = i[oe]) == null ? void 0 : c.implicitObserver, t._implicitObserver = o;
      }
      if (r === "toJSON") {
        for (let u of Object.keys(e))
          rc(t, e, u);
        return Reflect.get(t, r);
      }
      let a = rc(t, e, r);
      return a = js(a, o), a;
    },
    deleteProperty: (s, r) => {
      throw new Error("deleteProperty not available for doc");
    },
    has: (s, r) => !!(typeof r == "string" && t.share.has(r)),
    getOwnPropertyDescriptor(s, r) {
      if (typeof r == "string" && t.share.has(r) || r === "toJSON")
        return {
          enumerable: !0,
          configurable: !0
        };
    },
    ownKeys: (s) => Array.from(t.share.keys())
  });
  return Jt.set(t, n), n;
}
Lg(kg);
const Hs = /* @__PURE__ */ Symbol("INTERNAL_SYMBOL");
function Ll(t) {
  const e = Q(t);
  if (!(e instanceof ke))
    throw new Error("store is not a valid syncedStore that maps to a Y.Doc");
  return e;
}
function Q(t) {
  if (typeof t != "object" || t === null)
    return;
  const e = t[Hs];
  return e && (Pi(e), e.__v_skip = !0), e;
}
function Fg(t, e) {
  if (t === e)
    return !0;
  if (typeof t == "object" && typeof e == "object") {
    const n = Q(t), s = Q(e);
    return !n || !s ? !1 : n === s;
  }
  return !1;
}
function Tl(t, e = new ke()) {
  return Og(e), Ug(e, t);
}
const Ni = globalThis, ic = (t) => t, ms = Ni.trustedTypes, oc = ms ? ms.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ml = "$lit$", Te = `lit$${Math.random().toFixed(9).slice(2)}$`, $l = "?" + Te, jg = `<${$l}>`, ot = document, dn = () => ot.createComment(""), fn = (t) => t === null || typeof t != "object" && typeof t != "function", Ui = Array.isArray, Hg = (t) => Ui(t) || typeof t?.[Symbol.iterator] == "function", ar = `[ 	
\f\r]`, jt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, cc = /-->/g, ac = />/g, Ve = RegExp(`>|${ar}(?:([^\\s"'>=/]+)(${ar}*=${ar}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lc = /'/g, uc = /"/g, Ol = /^(?:script|style|textarea|title)$/i, Il = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), c0 = Il(1), a0 = Il(2), Fe = /* @__PURE__ */ Symbol.for("lit-noChange"), U = /* @__PURE__ */ Symbol.for("lit-nothing"), hc = /* @__PURE__ */ new WeakMap(), Je = ot.createTreeWalker(ot, 129);
function Pl(t, e) {
  if (!Ui(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return oc !== void 0 ? oc.createHTML(e) : e;
}
const zg = (t, e) => {
  const n = t.length - 1, s = [];
  let r, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = jt;
  for (let c = 0; c < n; c++) {
    const a = t[c];
    let l, u, h = -1, d = 0;
    for (; d < a.length && (o.lastIndex = d, u = o.exec(a), u !== null); ) d = o.lastIndex, o === jt ? u[1] === "!--" ? o = cc : u[1] !== void 0 ? o = ac : u[2] !== void 0 ? (Ol.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = Ve) : u[3] !== void 0 && (o = Ve) : o === Ve ? u[0] === ">" ? (o = r ?? jt, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, l = u[1], o = u[3] === void 0 ? Ve : u[3] === '"' ? uc : lc) : o === uc || o === lc ? o = Ve : o === cc || o === ac ? o = jt : (o = Ve, r = void 0);
    const f = o === Ve && t[c + 1].startsWith("/>") ? " " : "";
    i += o === jt ? a + jg : h >= 0 ? (s.push(l), a.slice(0, h) + Ml + a.slice(h) + Te + f) : a + Te + (h === -2 ? c : f);
  }
  return [Pl(t, i + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class pn {
  constructor({ strings: e, _$litType$: n }, s) {
    let r;
    this.parts = [];
    let i = 0, o = 0;
    const c = e.length - 1, a = this.parts, [l, u] = zg(e, n);
    if (this.el = pn.createElement(l, s), Je.currentNode = this.el.content, n === 2 || n === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = Je.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Ml)) {
          const d = u[o++], f = r.getAttribute(h).split(Te), p = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: i, name: p[2], strings: f, ctor: p[1] === "." ? Vg : p[1] === "?" ? Kg : p[1] === "@" ? Wg : zs }), r.removeAttribute(h);
        } else h.startsWith(Te) && (a.push({ type: 6, index: i }), r.removeAttribute(h));
        if (Ol.test(r.tagName)) {
          const h = r.textContent.split(Te), d = h.length - 1;
          if (d > 0) {
            r.textContent = ms ? ms.emptyScript : "";
            for (let f = 0; f < d; f++) r.append(h[f], dn()), Je.nextNode(), a.push({ type: 2, index: ++i });
            r.append(h[d], dn());
          }
        }
      } else if (r.nodeType === 8) if (r.data === $l) a.push({ type: 2, index: i });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(Te, h + 1)) !== -1; ) a.push({ type: 7, index: i }), h += Te.length - 1;
      }
      i++;
    }
  }
  static createElement(e, n) {
    const s = ot.createElement("template");
    return s.innerHTML = e, s;
  }
}
function Lt(t, e, n = t, s) {
  if (e === Fe) return e;
  let r = s !== void 0 ? n._$Co?.[s] : n._$Cl;
  const i = fn(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== i && (r?._$AO?.(!1), i === void 0 ? r = void 0 : (r = new i(t), r._$AT(t, n, s)), s !== void 0 ? (n._$Co ??= [])[s] = r : n._$Cl = r), r !== void 0 && (e = Lt(t, r._$AS(t, e.values), r, s)), e;
}
class Bg {
  constructor(e, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: n }, parts: s } = this._$AD, r = (e?.creationScope ?? ot).importNode(n, !0);
    Je.currentNode = r;
    let i = Je.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new Ut(i, i.nextSibling, this, e) : a.type === 1 ? l = new a.ctor(i, a.name, a.strings, this, e) : a.type === 6 && (l = new Yg(i, this, e)), this._$AV.push(l), a = s[++c];
      }
      o !== a?.index && (i = Je.nextNode(), o++);
    }
    return Je.currentNode = ot, r;
  }
  p(e) {
    let n = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, n), n += s.strings.length - 2) : s._$AI(e[n])), n++;
  }
}
class Ut {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, n, s, r) {
    this.type = 2, this._$AH = U, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && e?.nodeType === 11 && (e = n.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, n = this) {
    e = Lt(this, e, n), fn(e) ? e === U || e == null || e === "" ? (this._$AH !== U && this._$AR(), this._$AH = U) : e !== this._$AH && e !== Fe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Hg(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== U && fn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ot.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: n, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = pn.createElement(Pl(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(n);
    else {
      const i = new Bg(r, this), o = i.u(this.options);
      i.p(n), this.T(o), this._$AH = i;
    }
  }
  _$AC(e) {
    let n = hc.get(e.strings);
    return n === void 0 && hc.set(e.strings, n = new pn(e)), n;
  }
  k(e) {
    Ui(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let s, r = 0;
    for (const i of e) r === n.length ? n.push(s = new Ut(this.O(dn()), this.O(dn()), this, this.options)) : s = n[r], s._$AI(i), r++;
    r < n.length && (this._$AR(s && s._$AB.nextSibling, r), n.length = r);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); e !== this._$AB; ) {
      const s = ic(e).nextSibling;
      ic(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class zs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, s, r, i) {
    this.type = 1, this._$AH = U, this._$AN = void 0, this.element = e, this.name = n, this._$AM = r, this.options = i, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = U;
  }
  _$AI(e, n = this, s, r) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) e = Lt(this, e, n, 0), o = !fn(e) || e !== this._$AH && e !== Fe, o && (this._$AH = e);
    else {
      const c = e;
      let a, l;
      for (e = i[0], a = 0; a < i.length - 1; a++) l = Lt(this, c[s + a], n, a), l === Fe && (l = this._$AH[a]), o ||= !fn(l) || l !== this._$AH[a], l === U ? e = U : e !== U && (e += (l ?? "") + i[a + 1]), this._$AH[a] = l;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === U ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Vg extends zs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === U ? void 0 : e;
  }
}
class Kg extends zs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== U);
  }
}
class Wg extends zs {
  constructor(e, n, s, r, i) {
    super(e, n, s, r, i), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Lt(this, e, n, 0) ?? U) === Fe) return;
    const s = this._$AH, r = e === U && s !== U || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, i = e !== U && (s === U || r);
    r && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Yg {
  constructor(e, n, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Lt(this, e);
  }
}
const qg = { I: Ut }, Gg = Ni.litHtmlPolyfillSupport;
Gg?.(pn, Ut), (Ni.litHtmlVersions ??= []).push("3.3.3");
const Jg = (t, e, n) => {
  const s = e;
  let r = s._$litPart$;
  return r === void 0 && (s._$litPart$ = r = new Ut(e.insertBefore(dn(), null), null, void 0, {})), r._$AI(t), r;
}, dc = (t, e = 300) => {
  let n;
  return function(...s) {
    clearTimeout(n), n = setTimeout(() => t.apply(this, s), e);
  };
};
class Xg {
  defaultData;
  localData;
  awareness = [];
  awarenessByStableId = /* @__PURE__ */ new Map();
  selfAwareness;
  element;
  _data;
  onChange;
  onAwarenessChange;
  debouncedOnChange;
  resetShortcut;
  // TODO: change this to receive the delta instead of the whole data object so you don't have to maintain
  // internal state for expressing the delta.
  update;
  view;
  updateElementAwareness;
  triggerAwarenessUpdate;
  devMode;
  // Set while a `view` render is in flight, so setData/setLocalData/
  // setMyAwareness can detect (and reject) writes made synchronously during
  // render — a re-render loop.
  isRendering = !1;
  // Cleanup returned by onMount, invoked on destroy()/removePlayElement so
  // rAF loops, timers, and event listeners set up in onMount don't leak.
  onUnmount;
  // Allows the runtime to wire up capability descendants emitted by a view
  // (e.g. mount points for `define`d capabilities). Driven by descendantObserver.
  onAfterRender;
  descendantObserver;
  dataUpdateListeners = /* @__PURE__ */ new Set();
  scheduleSetupDataWrite;
  getUsers;
  clickListener;
  touchStartListener;
  mouseDownListener;
  resetShortcutListener;
  activeDragCleanup;
  // event handlers
  onClick;
  onDrag;
  onDragStart;
  constructor(e, n = {}) {
    const {
      element: s,
      onChange: r,
      onAwarenessChange: i,
      defaultData: o,
      defaultLocalData: c,
      live: a,
      myDefaultAwareness: l,
      data: u,
      awareness: h,
      update: d,
      updateElement: f,
      view: p,
      updateElementAwareness: y,
      onMount: g,
      debounceMs: m,
      triggerAwarenessUpdate: C,
      devMode: S
    } = e;
    this.scheduleSetupDataWrite = n.scheduleSetupDataWrite, this.getUsers = n.getUsers ?? (() => []), this.element = s, this.view = p, this.devMode = S, this.defaultData = o instanceof Function ? o(s) : o, this.localData = c instanceof Function ? c(s) : c, this.triggerAwarenessUpdate = C, this.onChange = r, this.debouncedOnChange = dc(this.onChange, m), this.onAwarenessChange = i, this.update = d ?? f, this.updateElementAwareness = y;
    const $ = u === void 0 ? this.defaultData : u;
    h !== void 0 && (this.awareness = h);
    const z = a !== void 0 ? a : l, _ = z instanceof Function ? z(s) : z;
    if (_ !== void 0 && this.setLive(_), this._data = $, this.__data = $, this.reinitializeElementData(e), g) {
      const Be = g(this.getSetupData());
      typeof Be == "function" && (this.onUnmount = Be);
    }
  }
  /**
   * Tears down anything onMount set up (rAF loops, timers, listeners).
   * Called by removePlayElement / unregister(). Idempotent.
   */
  destroy() {
    this.descendantObserver?.disconnect(), this.descendantObserver = void 0, this.clickListener && (this.element.removeEventListener("click", this.clickListener), this.clickListener = void 0), this.touchStartListener && (this.element.removeEventListener("touchstart", this.touchStartListener), this.touchStartListener = void 0), this.mouseDownListener && (this.element.removeEventListener("mousedown", this.mouseDownListener), this.mouseDownListener = void 0), this.resetShortcutListener && (this.element.removeEventListener("click", this.resetShortcutListener), this.resetShortcutListener = void 0), this.removeActiveDragListeners(), this.onClick = void 0, this.onDrag = void 0, this.onDragStart = void 0, this.resetShortcut = void 0;
    const e = this.onUnmount;
    if (this.onUnmount = void 0, e)
      try {
        e();
      } catch (n) {
        console.error(`[playhtml] onMount cleanup for "${this.element.id}" threw`, n);
      }
  }
  reinitializeElementData({
    element: e,
    onChange: n,
    onAwarenessChange: s,
    update: r,
    updateElement: i,
    view: o,
    updateElementAwareness: c,
    onClick: a,
    onDrag: l,
    onDragStart: u,
    resetShortcut: h,
    debounceMs: d,
    triggerAwarenessUpdate: f,
    devMode: p
  }) {
    this.triggerAwarenessUpdate = f, this.onChange = n, this.debouncedOnChange = dc(this.onChange, d), this.onAwarenessChange = s, this.update = r ?? i, this.view = o, this.devMode = p, o && this.update && (console.error(
      `[playhtml] "${e.id}" provides both \`view\` and an imperative update renderer. They are mutually exclusive. \`view\` is used and the imperative renderer is ignored.`
    ), this.update = void 0), o && (a || l || u) && (console.error(
      `[playhtml] "${e.id}" provides a \`view\` alongside onClick/onDrag/onDragStart. In view mode these are ignored — attach events inside the template (e.g. @click). `
    ), a = void 0, l = void 0, u = void 0), this.setEventHandlers({ onClick: a, onDrag: l, onDragStart: u }), h && !this.resetShortcutListener && (e.reset = this.reset, this.resetShortcutListener = (y) => {
      switch (this.resetShortcut) {
        case "ctrlKey":
          if (!y.ctrlKey)
            return;
          break;
        case "altKey":
          if (!y.altKey)
            return;
          break;
        case "shiftKey":
          if (!y.shiftKey)
            return;
          break;
        case "metaKey":
          if (!y.metaKey)
            return;
          break;
        default:
          return;
      }
      this.reset(), y.preventDefault(), y.stopPropagation();
    }, e.addEventListener("click", this.resetShortcutListener)), this.resetShortcut = h;
  }
  setEventHandlers({
    onClick: e,
    onDrag: n,
    onDragStart: s
  }) {
    const r = this.element, i = !!(this.onDrag || this.onDragStart);
    if (this.view) {
      i && this.removeActiveDragListeners(), this.onClick = void 0, this.onDrag = void 0, this.onDragStart = void 0;
      return;
    }
    const o = !!(n || s);
    i && !o && this.removeActiveDragListeners(), e && !this.clickListener && (this.clickListener = (c) => {
      this.onClick?.(c, this.getEventHandlerData());
    }, r.addEventListener("click", this.clickListener)), o && !this.touchStartListener && (this.touchStartListener = (c) => {
      if (!this.onDrag && !this.onDragStart) return;
      c.preventDefault(), this.removeActiveDragListeners(), r.classList.add("cursordown"), this.onDragStart?.(c, this.getEventHandlerData());
      const a = (u) => {
        u.preventDefault(), this.onDrag?.(u, this.getEventHandlerData());
      }, l = () => {
        r.classList.remove("cursordown"), document.removeEventListener("touchmove", a), document.removeEventListener("touchend", l), this.activeDragCleanup === l && (this.activeDragCleanup = void 0);
      };
      this.activeDragCleanup = l, document.addEventListener("touchmove", a), document.addEventListener("touchend", l);
    }, r.addEventListener("touchstart", this.touchStartListener)), o && !this.mouseDownListener && (this.mouseDownListener = (c) => {
      if (!this.onDrag && !this.onDragStart) return;
      c.preventDefault(), this.removeActiveDragListeners(), this.onDragStart?.(c, this.getEventHandlerData()), r.classList.add("cursordown");
      const a = (u) => {
        u.preventDefault(), this.onDrag?.(u, this.getEventHandlerData());
      }, l = () => {
        r.classList.remove("cursordown"), document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", l), this.activeDragCleanup === l && (this.activeDragCleanup = void 0);
      };
      this.activeDragCleanup = l, document.addEventListener("mousemove", a), document.addEventListener("mouseup", l);
    }, r.addEventListener("mousedown", this.mouseDownListener)), this.onClick = e, this.onDrag = n, this.onDragStart = s;
  }
  removeActiveDragListeners() {
    this.activeDragCleanup?.(), this.activeDragCleanup = void 0, this.element.classList.remove("cursordown");
  }
  get data() {
    return this._data;
  }
  onDataUpdate(e) {
    return this.dataUpdateListeners.add(e), () => {
      this.dataUpdateListeners.delete(e);
    };
  }
  setLocalData(e) {
    this.rejectWriteDuringRender("setLocalData") || (typeof e == "function" ? e(this.localData) : this.localData = e, this.view && this.render());
  }
  /**
   * // PRIVATE USE ONLY \\
   *
   * Updates the internal state with the given data and handles all the downstream effects. Should only be used by the sync code to ensure one-way
   * reactivity.
   * (e.g. calling `updateElement`/`view` and `onChange`)
   */
  set __data(e) {
    this._data = e, this.render();
    for (const n of this.dataUpdateListeners)
      n();
  }
  /**
   * Renders the element from current state: runs `view` and patches the
   * result into the DOM via lit-html, or falls back to imperative
   * `updateElement`. Safe to call repeatedly — lit-html diffs.
   */
  render() {
    if (this.view) {
      this.isRendering = !0;
      try {
        Jg(
          this.view(this.getEventHandlerData()),
          this.element
        );
      } finally {
        this.isRendering = !1;
      }
      return;
    }
    this.update?.(this.getEventHandlerData());
  }
  /**
   * Begins binding capability descendants emitted by this view (mount points
   * for `define`d capabilities / `register`ed ids). Binds the current children
   * once, then re-binds only when the subtree's child structure changes — so a
   * text/attribute-only re-render (a ticking timer) does no scanning at all.
   * Called once by the runtime after `onAfterRender` is wired.
   */
  observeDescendants() {
    !this.onAfterRender || this.descendantObserver || (this.onAfterRender(this.element), typeof MutationObserver < "u" && (this.descendantObserver = xi(
      this.element,
      () => {
        this.onAfterRender?.(this.element);
      },
      {
        childList: !0,
        subtree: !0
      }
    )));
  }
  /**
   * Re-runs the view and repaints from current state. No-op for elements
   * without a `view` (it's the view-repaint primitive), and a no-op during an
   * in-flight render (calling it from inside `view` would recurse).
   */
  requestUpdate() {
    !this.view || this.isRendering || this.render();
  }
  /** Warns and returns true if a write was attempted during a view render. */
  rejectWriteDuringRender(e) {
    return this.isRendering ? (console.error(
      `[playhtml] ${e}() was called during a view render for "${this.element.id}". Views must be pure — drive writes from @event handlers (e.g. @click) instead. Ignoring this write.`
    ), !0) : !1;
  }
  updateAwareness(e, n) {
    this.awareness = e, this.awarenessByStableId = n;
    try {
      this.updateElementAwareness?.(this.getAwarenessEventHandlerData());
    } catch (s) {
      console.error(
        "[playhtml] updateElementAwareness callback threw:",
        s
      );
    }
    this.render();
  }
  getEventHandlerData() {
    return {
      element: this.element,
      data: this.data,
      localData: this.localData,
      live: this.selfAwareness,
      users: this.getUsers(this.awarenessByStableId, this.selfAwareness),
      awareness: this.awareness,
      awarenessByStableId: this.awarenessByStableId,
      myAwareness: this.selfAwareness,
      setData: (e) => this.setData(e),
      setLocalData: (e) => this.setLocalData(e),
      setLive: (e) => this.setLive(e),
      setMyAwareness: (e) => this.setLive(e),
      requestUpdate: () => this.requestUpdate()
    };
  }
  getAwarenessEventHandlerData() {
    return {
      ...this.getEventHandlerData()
    };
  }
  getSetupData() {
    return {
      getElement: () => this.element,
      getData: () => this.data,
      getLocalData: () => this.localData,
      getLive: () => this.selfAwareness,
      getUsers: () => this.getUsers(this.awarenessByStableId, this.selfAwareness),
      getAwareness: () => this.awareness,
      setData: (e) => this.setSetupData(e),
      setLocalData: (e) => this.setLocalData(e),
      setLive: (e) => this.setLive(e),
      setMyAwareness: (e) => this.setLive(e),
      requestUpdate: () => this.requestUpdate()
    };
  }
  setSetupData(e) {
    if (!this.scheduleSetupDataWrite) {
      this.setData(e);
      return;
    }
    this.rejectWriteDuringRender("setData") || this.scheduleSetupDataWrite(() => {
      this.onChange(e);
    });
  }
  /**
   * Public setter for element data.
   *
   * Semantics:
   * - Mutator form: setData((draft) => { ... })
   *   When data is backed by SyncedStore/Yjs (dataMode = "syncedstore"),
   *   the draft is a live CRDT proxy. You can mutate nested arrays/objects
   *   and the change will be merged across clients without conflicts.
   *   Example:
   *     setData(d => { d.list.push(item); });
   *
   * - Value form: setData(value)
   *   Replaces the entire data snapshot. Use this when you need canonical
   *   replacement semantics (e.g., snapshot from a mirror) or when running
   *   in legacy plain mode. Example:
   *     setData({ on: true });
   *
   * Notes:
   * - In plain mode, only the value form results in a sync; mutating draft
   *   is a no-op. Prefer the mutator form for merge-friendly edits.
   * - Directly mutating eventData.data may work in SyncedStore mode, but the
   *   recommended portable pattern is setData(draft => { ... }).
   */
  setData(e) {
    this.rejectWriteDuringRender("setData") || this.onChange(e);
  }
  // TODO: this should be keyed on the element to avoid conflicts
  setLive(e) {
    this.rejectWriteDuringRender("setLive") || e !== this.selfAwareness && (this.selfAwareness = e, this.onAwarenessChange(e), this.triggerAwarenessUpdate?.());
  }
  /** @deprecated Use `setLive`. */
  setMyAwareness(e) {
    this.setLive(e);
  }
  setDataDebounced(e) {
    this.debouncedOnChange(e);
  }
  /**
   * Resets the element to its default state.
   */
  reset() {
    this.defaultData !== void 0 && this.setData(this.defaultData);
  }
}
async function Zg(t, e) {
  const n = new TextEncoder().encode(`${t}-${e.outerHTML}}`), s = await crypto.subtle.digest("SHA-1", n);
  return Array.from(new Uint8Array(s)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
class Qg {
  cellSize;
  grid = /* @__PURE__ */ new Map();
  constructor(e = 200) {
    this.cellSize = e;
  }
  getCellKey(e, n) {
    const s = Math.floor(e / this.cellSize), r = Math.floor(n / this.cellSize);
    return `${s},${r}`;
  }
  getNearbyCellKeys(e, n, s) {
    const r = [], i = Math.ceil(s / this.cellSize), o = Math.floor(e / this.cellSize), c = Math.floor(n / this.cellSize);
    for (let a = -i; a <= i; a++)
      for (let l = -i; l <= i; l++)
        r.push(`${o + a},${c + l}`);
    return r;
  }
  insert(e) {
    const n = this.getCellKey(e.x, e.y);
    this.grid.has(n) || this.grid.set(n, /* @__PURE__ */ new Map()), this.grid.get(n).set(e.id, e);
  }
  remove(e, n, s) {
    if (n !== void 0 && s !== void 0) {
      const r = this.getCellKey(n, s), i = this.grid.get(r);
      if (i && i.has(e))
        return i.delete(e), i.size === 0 && this.grid.delete(r), !0;
    } else
      for (const [r, i] of this.grid)
        if (i.has(e))
          return i.delete(e), i.size === 0 && this.grid.delete(r), !0;
    return !1;
  }
  update(e, n, s) {
    n !== void 0 && s !== void 0 ? this.remove(e.id, n, s) : this.remove(e.id), this.insert(e);
  }
  findNearby(e, n, s, r) {
    const i = [], o = this.getNearbyCellKeys(e, n, s), c = s * s;
    for (const a of o) {
      const l = this.grid.get(a);
      if (l)
        for (const u of l.values()) {
          if (r && u.id === r) continue;
          const h = u.x - e, d = u.y - n;
          h * h + d * d <= c && i.push(u);
        }
    }
    return i;
  }
  getAll() {
    const e = [];
    for (const n of this.grid.values())
      e.push(...n.values());
    return e;
  }
  clear() {
    this.grid.clear();
  }
  // Debug info
  getCellCount() {
    return this.grid.size;
  }
  getItemCount() {
    let e = 0;
    for (const n of this.grid.values())
      e += n.size;
    return e;
  }
}
function Fi(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  if (e == null || e === "")
    throw new Error(
      "[playhtml] Player identity must have playerStyle.colorPalette[0] (primary color)."
    );
  return e;
}
function fc(t) {
  if (!t.publicKey)
    throw new Error("[playhtml] Player identity must have publicKey.");
  Fi(t);
}
function jn(t, e) {
  return {
    pid: t.publicKey,
    name: t.name,
    color: Fi(t),
    isMe: e
  };
}
function ey(t, e) {
  let n = t;
  fc(n);
  const s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  let i = null, o = null, c = null;
  function a(g, m, C) {
    for (const S of g)
      try {
        S(m);
      } catch ($) {
        console.error(`[playhtml] ${C} subscriber threw:`, $);
      }
  }
  function l() {
    a(s, n, "users self-change");
  }
  function u(g, m) {
    return g.length === m.length && g.every(
      (C, S) => C.pid === m[S].pid && C.name === m[S].name && C.color === m[S].color && C.isMe === m[S].isMe
    );
  }
  function h(g = !1) {
    if (r.size === 0) return;
    const m = f();
    !g && c && u(c, m) || (c = m, a(r, m, "users change"));
  }
  function d() {
    if (i ??= e.onIdentityPeersChange(h), !o && e.onCursorPresencesChange) {
      const g = e.onCursorPresencesChange(() => {
        h();
      });
      g && (o = g);
    }
  }
  function f() {
    const g = /* @__PURE__ */ new Map(), m = n.publicKey, C = e.getIdentityPeers();
    for (const $ of Array.from(C.keys()).sort()) {
      const _ = C.get($).identity;
      if (!(!_ || _.publicKey === m))
        try {
          g.set(
            _.publicKey,
            jn(_, !1)
          );
        } catch {
        }
    }
    g.set(m, jn(n, !0));
    const S = e.getCursorPresences?.();
    if (S)
      for (const [$, z] of S) {
        if (!z.playerIdentity) continue;
        const _ = $ === m;
        try {
          g.set(
            $,
            _ ? jn(n, !0) : jn(z.playerIdentity, !1)
          );
        } catch {
        }
      }
    return Array.from(g.values());
  }
  function p(g) {
    g(), Mr(n), l(), h(!0);
  }
  return {
    me: {
      get pid() {
        return n.publicKey;
      },
      get name() {
        return n.name;
      },
      set name(g) {
        n.name !== g && p(() => {
          n.name = g;
        });
      },
      get color() {
        return Fi(n);
      },
      set color(g) {
        if (g == null || g === "")
          throw new Error(
            "[playhtml] users.me.color cannot be set to empty; player identity must have a primary color."
          );
        n.playerStyle.colorPalette[0] !== g && p(() => {
          n.playerStyle.colorPalette[0] = g;
        });
      }
    },
    getAll() {
      return d(), f();
    },
    onChange(g) {
      d(), h(), r.add(g);
      const m = f();
      return c = m, g(m), () => {
        r.delete(g);
      };
    },
    onSelfChange(g) {
      return s.add(g), () => {
        s.delete(g);
      };
    },
    adoptIdentity(g) {
      fc(g), n !== g && p(() => {
        n = g;
      });
    },
    getIdentity() {
      return n;
    },
    destroy() {
      s.clear(), r.clear(), o?.(), o = null, i?.(), i = null;
    }
  };
}
function ty() {
  return qp();
}
function lr(t) {
  return Array.from(new Set(t.map((e) => e.color)));
}
class ny {
  listening = !1;
  message = "";
  chatElement = null;
  styleElement = null;
  keydownHandler = null;
  timeout = null;
  options;
  constructor(e = {}) {
    this.options = e, this.initialize();
  }
  initialize() {
    this.setupKeyboardHandlers(), this.createChatElement();
  }
  setupKeyboardHandlers() {
    this.keydownHandler = (e) => {
      if (this.timeout && clearTimeout(this.timeout), this.timeout = setTimeout(() => {
        this.setListening(!1), this.setMessage("");
      }, 1e4), !this.listening)
        e.key === "/" && (this.setMessage(""), this.setListening(!0), e.preventDefault(), e.stopPropagation());
      else if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === "Enter")
          this.setListening(!1);
        else if (e.key === "Escape")
          this.setListening(!1), this.setMessage("");
        else if (e.key === "Backspace")
          this.setMessage(this.message.slice(0, -1));
        else if (e.key.length === 1) {
          const n = this.message.length < 42 ? this.message + e.key : this.message;
          this.setMessage(n);
        }
        return e.preventDefault(), e.stopPropagation(), !1;
      }
    }, document.addEventListener("keydown", this.keydownHandler);
  }
  setListening(e) {
    this.listening = e, this.updateChatDisplay();
  }
  setMessage(e) {
    this.message = e, this.updateChatDisplay(), this.options.onMessageUpdate?.(e.length > 0 ? e : null);
  }
  createChatElement() {
    this.chatElement || (this.styleElement = document.createElement("style"), this.styleElement.textContent = `
      .playhtml-chat-container {
        box-sizing: border-box;
        position: fixed;
        bottom: 24px;
        right: 32px;
        padding: 8px;
        height: 48px;
        border-radius: 24px;
        min-width: 4.4em;
        background-color: rgba(52, 199, 89, 1);
        color: white;
        display: flex;
        justify-content: end;
        align-items: center;
        gap: 8px;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 320;
        z-index: 1000000;
      }
      
      .playhtml-chat-input {
        box-sizing: border-box;
        padding: 0px 4px 0px 4px;
        margin: 0px;
        font-size: 24px;
        line-height: 1;
        white-space: nowrap;
        background: transparent;
        border: none;
        outline: none;
        color: white;
      }
      
      .playhtml-chat-button {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 250;
        padding: 0px;
        margin: 0px;
        border: 0.5px solid rgba(255,255,255,0.75);
        cursor: pointer;
        color: white;
        background-color: transparent;
      }
    `, document.head.appendChild(this.styleElement), this.chatElement = document.createElement("div"), this.chatElement.className = "playhtml-chat-container", this.chatElement.style.display = "none", document.body.appendChild(this.chatElement));
  }
  updateChatDisplay() {
    this.chatElement && (this.listening || this.message ? (this.chatElement.innerHTML = `
        <div class="playhtml-chat-input">${this.message || "..."}</div>
        <div class="playhtml-chat-button">&times;</div>
      `, this.chatElement.style.display = "flex", this.chatElement.querySelector(
      ".playhtml-chat-button"
    )?.addEventListener("click", () => {
      this.setListening(!1), this.setMessage("");
    })) : this.chatElement.style.display = "none");
  }
  showCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.innerHTML = '<div class="playhtml-chat-input">Type / to reply</div>', this.chatElement.style.display = "flex");
  }
  hideCTA() {
    this.chatElement && !this.listening && !this.message && (this.chatElement.style.display = "none");
  }
  getCurrentMessage() {
    return this.message.length > 0 ? this.message : null;
  }
  destroy() {
    this.keydownHandler && (document.removeEventListener("keydown", this.keydownHandler), this.keydownHandler = null), this.timeout !== null && (clearTimeout(this.timeout), this.timeout = null), this.chatElement && (this.chatElement.remove(), this.chatElement = null), this.styleElement && (this.styleElement.remove(), this.styleElement = null);
  }
}
function Hn(t) {
  return t === void 0 ? document.body : typeof t == "string" ? document.querySelector(t) : typeof t == "function" ? t() : t;
}
const sy = 60, ry = 30, iy = 30, oy = 15e4;
function cy(t) {
  const e = Math.max(1, Math.ceil(t));
  return e <= iy ? sy : Math.min(
    ry,
    oy / (e * (e - 1))
  );
}
function ay(t) {
  return 1e3 / cy(t);
}
const Rl = "identity", ji = "element:", Hi = "presence:", ly = /* @__PURE__ */ new Set([
  "playerIdentity",
  "cursor",
  "isMe"
]);
function ur(t) {
  return ly.has(t);
}
function Nl(t) {
  return t.startsWith(ji);
}
function Ul(t) {
  return t.startsWith(Hi);
}
function hr(t) {
  return `${Hi}${t}`;
}
function uy(t) {
  return t.slice(Hi.length);
}
const Bs = 3e4, hy = 1e4;
function dy(t, e, n = Bs) {
  return Number.isFinite(t) ? e - Number(t) <= n : !0;
}
function fy(t, e, n = Bs) {
  return !j(t) || !("at" in t) ? !0 : dy(t.at, e, n);
}
function Fl(t, e = hy) {
  const n = setInterval(() => {
    t();
  }, e);
  return () => clearInterval(n);
}
function py(t, e = Date.now()) {
  return { at: e, value: t };
}
function pc(t) {
  return j(t) && "value" in t && "at" in t ? t.value : t;
}
function jl(t) {
  try {
    const e = JSON.stringify(t);
    return e === void 0 ? 1 / 0 : new TextEncoder().encode(e).byteLength;
  } catch {
    return 1 / 0;
  }
}
function Hr(t) {
  const e = t[Rl];
  return j(e) && typeof e.publicKey == "string" ? e.publicKey : void 0;
}
function Hl(t, e, n, s) {
  if (jl(n) > fs)
    return console.warn(
      `[playhtml] Failed to publish ${s}:`,
      new Error(
        `Presence value must be ${fs} bytes or less`
      )
    ), !1;
  try {
    return t.update(e, n), !0;
  } catch (r) {
    return console.warn(`[playhtml] Failed to publish ${s}:`, r), !1;
  }
}
function ws(t, e, n) {
  try {
    t.clear(e);
  } catch (s) {
    console.warn(`[playhtml] Failed to clear ${n}:`, s);
  }
}
function te(t, e) {
  try {
    return t(), !0;
  } catch (n) {
    return console.error(`[playhtml] ${e} callback threw:`, n), !1;
  }
}
function gy(t) {
  return j(t) && "cursor" in t;
}
function gc(t) {
  return j(t) ? Object.values(t).every(j) : !1;
}
function yy(t) {
  return j(t) ? Object.values(t).every(
    (e) => Array.isArray(e) && e.every((n) => typeof n == "string")
  ) : !1;
}
function my(t) {
  return t == null ? null : typeof t == "string" ? t : null;
}
function wy(t) {
  return typeof t == "string" ? t : void 0;
}
class by {
  constructor(e) {
    this.peerStore = e;
  }
  get peers() {
    return this.peerStore.getPeers();
  }
  getRemotePresences(e) {
    const n = /* @__PURE__ */ new Map(), s = Array.from(this.peers.keys()).sort();
    for (const r of s) {
      const i = this.getPresenceForConnection(r);
      if (!i || i.playerIdentity.publicKey === e) continue;
      const o = i.playerIdentity.publicKey, c = n.get(o);
      (!c || yc(c, i)) && n.set(o, i);
    }
    return n;
  }
  getPresenceByStableId(e) {
    let n = null;
    for (const s of Array.from(this.peers.keys()).sort()) {
      const r = this.getPresenceForConnection(s);
      r?.playerIdentity.publicKey === e && (!n || yc(n, r)) && (n = r);
    }
    return n;
  }
  getPresenceForConnection(e) {
    const n = this.peers.get(e);
    if (!n) return null;
    const s = n.identity;
    if (!Zp(s)) return null;
    const r = n.cursor;
    let i = null, o, c = wy(n.page), a = null;
    if (r !== void 0) {
      if (!gy(r)) return null;
      if (r.cursor !== null) {
        if (!Qp(r.cursor)) return null;
        i = r.cursor;
      }
      o = r.at, c = r.page ?? c, a = r.zone ?? null;
    }
    return {
      cursor: i,
      playerIdentity: s,
      lastSeen: o,
      message: my(n.message),
      page: c,
      zone: a
    };
  }
}
function yc(t, e) {
  if (e.cursor && !t.cursor) return !0;
  if (!e.cursor && t.cursor) return !1;
  const n = mc(t.lastSeen);
  return mc(e.lastSeen) > n;
}
function mc(t) {
  return Number.isFinite(t) ? Number(t) : Number.NEGATIVE_INFINITY;
}
function fe(t) {
  const e = t.playerStyle?.colorPalette?.[0];
  if (e == null || e === "")
    throw new Error(
      "[playhtml] Player identity must have playerStyle.colorPalette[0] (primary color)."
    );
  return e;
}
function vy(t) {
  if (!t.publicKey)
    throw new Error("[playhtml] Player identity must have publicKey.");
  fe(t);
}
function dr(t, e) {
  return Math.sqrt(
    Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)
  );
}
function zl() {
  return window.visualViewport?.scale ?? 1;
}
function Cy(t, e, n) {
  const s = zl();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t + c) / (i * s) * 100,
      y: (e + a) / (o * s) * 100
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t + c) / s + i,
      y: (e + a) / s + o
    };
  }
}
function Sy(t, e, n) {
  const s = zl();
  if (n === "relative") {
    const r = window.visualViewport, i = r?.width ?? window.innerWidth, o = r?.height ?? window.innerHeight, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: t / 100 * i * s - c,
      y: e / 100 * o * s - a
    };
  } else {
    const r = window.visualViewport, i = r ? r.pageLeft : window.scrollX, o = r ? r.pageTop : window.scrollY, c = r?.offsetLeft ?? 0, a = r?.offsetTop ?? 0;
    return {
      x: (t - i) * s - c,
      y: (e - o) * s - a
    };
  }
}
class Ey {
  position;
  velocity;
  target;
  stiffness;
  damping;
  mass;
  animationFrame = null;
  onUpdate;
  constructor(e, n, s = {}) {
    this.position = { ...e }, this.velocity = { x: 0, y: 0 }, this.target = { ...e }, this.onUpdate = n, this.stiffness = s.stiffness ?? 170, this.damping = s.damping ?? 26, this.mass = s.mass ?? 0.5;
  }
  setTarget(e) {
    this.target = { ...e }, this.animationFrame === null && this.animate();
  }
  animate = () => {
    const e = 0.016666666666666666, n = (this.target.x - this.position.x) * this.stiffness, s = (this.target.y - this.position.y) * this.stiffness, r = this.velocity.x * this.damping, i = this.velocity.y * this.damping, o = (n - r) / this.mass, c = (s - i) / this.mass;
    this.velocity.x += o * e, this.velocity.y += c * e, this.position.x += this.velocity.x * e, this.position.y += this.velocity.y * e, this.onUpdate(this.position);
    const a = Math.sqrt(
      Math.pow(this.target.x - this.position.x, 2) + Math.pow(this.target.y - this.position.y, 2)
    ), l = Math.sqrt(
      Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2)
    );
    a < 0.5 && l < 0.5 ? (this.position = { ...this.target }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position), this.animationFrame = null) : this.animationFrame = requestAnimationFrame(this.animate);
  };
  // Immediately jump to a position without spring animation.
  // Used when the viewport changes (scroll/zoom) and cursors need to
  // track content instantly.
  snapTo(e) {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.position = { ...e }, this.target = { ...e }, this.velocity = { x: 0, y: 0 }, this.onUpdate(this.position);
  }
  destroy() {
    this.animationFrame !== null && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null);
  }
}
function Bl(t) {
  t = t.replace(/"/g, "'"), t = t.replace(/>\s{1,}</g, "><"), t = t.replace(/\s{2,}/g, " ");
  const e = /[\r\n%#()<>?[\\\]^`{|}]/g;
  return t.replace(e, encodeURIComponent);
}
function Vl(t) {
  return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 9 18 18"
    width="18"
    height="18"
    fill="none"
    fillRule="evenodd"
  >
    <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="white">
      <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
      <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
    </g>
    <g fill="${t}">
      <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
      <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
    </g>
  </svg>`;
}
function fr(t) {
  return `url("data:image/svg+xml,${Bl(Vl(t))}"), auto`;
}
function wc(t) {
  return t.startsWith("--") ? t : t.replace(/[A-Z]/g, (e) => "-" + e.toLowerCase());
}
function pr(t, e, n) {
  const s = /* @__PURE__ */ new Set();
  for (const r of Object.keys(n)) {
    if (/^\d+$/.test(r)) continue;
    s.add(r);
    const i = n[r];
    t.style.setProperty(wc(r), String(i));
  }
  for (const r of e)
    s.has(r) || t.style.removeProperty(wc(r));
  e.clear();
  for (const r of s)
    e.add(r);
}
function _y(t) {
  if (!t.startsWith('url("'))
    return;
  const e = t.indexOf('")', 5);
  if (e !== -1)
    return t.slice(5, e);
}
function Ie() {
  const t = window.location.pathname;
  return t.length <= $i ? t : void 0;
}
function Ay(t) {
  if (t.trim() !== t || /["'<>\s\u0000-\u001f\u007f]/.test(t))
    return !1;
  try {
    const e = new URL(t, window.location.href);
    return e.protocol === "http:" || e.protocol === "https:" ? !0 : e.protocol !== "data:" ? !1 : /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,/i.test(t);
  } catch {
    return !1;
  }
}
function zn(t) {
  return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ky(t) {
  const e = t.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(e) || /^rgba?\([0-9.,%\s]+\)$/.test(e) || /^hsla?\([0-9.,%\s]+\)$/.test(e) || /^[a-zA-Z]+$/.test(e) ? e : "black";
}
class xy {
  constructor(e = {}, n, s) {
    this.options = e, this.presenceTransport = n, this.users = s, e.playerIdentity && this.users.adoptIdentity(e.playerIdentity), vy(this.playerIdentity), this.visibilityThreshold = e.visibilityThreshold || void 0, this.coordinateMode = e.coordinateMode || "absolute", this.options.enableChat === !0 && (this.chat = new ny({
      onMessageUpdate: (r) => {
        this.currentMessage = r, this.updateCursorAwareness();
      }
    })), this.lastKnownColor = fe(this.playerIdentity), this.lastKnownName = this.playerIdentity.name, this.unsubscribeSelfChange = this.users.onSelfChange(() => {
      this.handleSelfIdentityChange();
    }), this.initialize(), this.setupGlobalAPI(), this.unsubscribeUsersChange = this.users.onChange((r) => {
      this.handleUsersChange(r);
    });
  }
  cursors = /* @__PURE__ */ new Map();
  cursorAnimators = /* @__PURE__ */ new Map();
  // Spring animators for each cursor
  spatialGrid = new Qg(300);
  // 300px cell size
  proximityUsers = /* @__PURE__ */ new Set();
  currentCursor = null;
  users;
  unsubscribeSelfChange = null;
  unsubscribeUsersChange = null;
  awarenessUpdateTimeout = null;
  lastUpdate = 0;
  pointerFrame = null;
  pendingPointerSample = null;
  cursorEventCleanups = [];
  ownCursorSvgCache = null;
  visibilityThreshold;
  isStylesAdded = !1;
  globalApiListeners = /* @__PURE__ */ new Map();
  activeAnimationCleanups = /* @__PURE__ */ new Map();
  // stableId -> cleanup fn
  chat = null;
  currentMessage = null;
  otherUsersWithMessages = /* @__PURE__ */ new Set();
  lastSentMessage = null;
  cursorPresenceChangeCallbacks = /* @__PURE__ */ new Map();
  coordinateMode;
  // Cursor view over the shared PeerStore; only present (and only read) in
  // transport mode. Assigned in setupPresenceTransportHandling.
  presenceStore = null;
  presenceTransportUnsubscribe = null;
  serverCursorMaxHz = null;
  // When the cursor container is a non-body element with a CSS transform,
  // cursors are stored and rendered in container-local coordinates. The
  // matrix is read live from getComputedStyle so host pan/zoom updates flow
  // through automatically. Returns null for the document.body default
  // (identity, fast path) so today's behavior is preserved.
  getContainerMatrix() {
    const e = Hn(this.options.container);
    if (!e || e === document.body || typeof DOMMatrixReadOnly > "u") return null;
    const n = getComputedStyle(e).transform;
    return { matrix: !n || n === "none" ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(n), rect: e.getBoundingClientRect(), el: e };
  }
  clientToStorage(e, n) {
    const s = this.getContainerMatrix();
    if (s) {
      const r = s.matrix.a, i = s.matrix.b, o = s.matrix.c, c = s.matrix.d, a = r * c - i * o;
      if (a === 0) return { x: 0, y: 0 };
      const l = e - s.rect.left, u = n - s.rect.top;
      return {
        x: (c * l - o * u) / a,
        y: (r * u - i * l) / a
      };
    }
    return Cy(e, n, this.coordinateMode);
  }
  storageToClient(e, n) {
    const s = this.getContainerMatrix();
    if (s) {
      const r = s.matrix.a, i = s.matrix.b, o = s.matrix.c, c = s.matrix.d;
      return {
        x: r * e + o * n + s.rect.left,
        y: i * e + c * n + s.rect.top
      };
    }
    return Sy(e, n, this.coordinateMode);
  }
  zones = /* @__PURE__ */ new Map();
  currentZone = null;
  cursorZoneState = /* @__PURE__ */ new Map();
  // stableId -> previous zoneId
  // Keys most recently written by getCursorStyle for each cursor. Tracked so
  // re-applying can remove stale keys when a style function returns fewer
  // properties than the previous call.
  cursorStyleKeys = /* @__PURE__ */ new Map();
  lastKnownContainer = null;
  // Tracks pending fade-out removal timeouts by stableId so they can be
  // cancelled if a new update arrives for the same stableId (e.g. when one
  // tab disconnects but another tab of the same user is still active).
  pendingRemovals = /* @__PURE__ */ new Map();
  // Cursor client no longer owns identity mutation/persistence — it reads the
  // live reference from the users module, which is the sole mutator.
  get playerIdentity() {
    return this.users.getIdentity();
  }
  // Tracks the previously observed color/name so handleSelfIdentityChange
  // can emit CursorEvents only for fields that actually changed (mirroring what
  // the pre-refactor window.cursors setters and configure() did).
  lastKnownColor = "";
  lastKnownName;
  lastKnownAllColors = [];
  // React to any users.me mutation (color/name/whole-identity adopt):
  // invalidate the cached own-cursor SVG, refresh the document cursor style,
  // republish our cursor awareness, and emit the CursorEvents subscribers
  // (window.cursors.on) already rely on, only for fields that changed. The
  // identity channel itself is republished by the shared transport's
  // onSelfChange re-join (see acquirePresenceTransport), not here.
  handleSelfIdentityChange() {
    this.ownCursorSvgCache = null;
    const e = fe(this.playerIdentity);
    document.documentElement.style.cursor = fr(e), this.updateCursorAwareness();
    const n = this.playerIdentity.name;
    e !== this.lastKnownColor && (this.lastKnownColor = e, this.emitGlobalEvent("color", e)), n !== this.lastKnownName && (this.lastKnownName = n, this.emitGlobalEvent("name", n));
  }
  handleUsersChange(e) {
    const n = lr(e);
    n.length === this.lastKnownAllColors.length && n.every(
      (s, r) => s === this.lastKnownAllColors[r]
    ) || (this.lastKnownAllColors = n, this.emitGlobalEvent("allColors", n));
  }
  initialize() {
    this.addCursorStyles(), this.setupCursorTracking(), this.setupPresenceTransportHandling(), document.documentElement.style.cursor = fr(
      fe(this.playerIdentity)
    );
  }
  setupPresenceTransportHandling() {
    this.presenceStore = new by(this.presenceTransport.peers), this.publishPresenceTransportState();
    const e = () => this.onPeerCursorChange(), n = this.presenceTransport.peers.subscribe(
      "cursor",
      e
    ), s = this.presenceTransport.peers.subscribe(
      "identity",
      e
    ), r = this.presenceTransport.subscribe((i) => {
      this.handlePresenceControlMessage(i);
    });
    this.presenceTransportUnsubscribe = () => {
      n(), s(), r();
    };
  }
  onPeerCursorChange() {
    this.renderPresenceStore();
  }
  handlePresenceControlMessage(e) {
    e.type === "presence-rate" && this.handlePresenceRate(e.channel, e.hz);
  }
  handlePresenceRate(e, n) {
    e === "cursor" && (!Number.isFinite(n) || n <= 0 || (this.serverCursorMaxHz = n));
  }
  renderPresenceStore() {
    const e = /* @__PURE__ */ new Set();
    for (const [n, s] of this.cursorPresenceEntries())
      e.add(n), s.cursor ? this.updateCursor(n, {
        ...s,
        cursor: s.cursor
      }) : this.removeCursor(n), s.message ? this.otherUsersWithMessages.add(n) : this.otherUsersWithMessages.delete(n);
    for (const n of Array.from(this.cursors.keys()))
      e.has(n) || (this.otherUsersWithMessages.delete(n), this.removeCursor(n));
    this.rebuildSpatialGrid(), this.updateChatCTA(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
  }
  *cursorPresenceEntries() {
    const e = this.presenceStore?.getRemotePresences(
      this.playerIdentity.publicKey
    );
    if (e)
      for (const [n, s] of e)
        yield [n, s];
  }
  *activeCursorPresenceEntries(e = {}) {
    const n = e.now ?? Date.now();
    for (const [s, r] of this.cursorPresenceEntries())
      r.cursor && (e.freshOnly && !this.isFreshCursorPresence(r, n) || (yield [
        s,
        {
          ...r,
          cursor: r.cursor
        }
      ]));
  }
  // A stricter, SYNCHRONOUS freshness check for proximity (freshOnly): between
  // PeerStore sweep ticks a cursor can be technically stale but not yet swept,
  // and it must not participate in proximity. Distinct from PeerStore's
  // sweep-based channel deletion — both run, at different cadences.
  isFreshCursorPresence(e, n) {
    return Number.isFinite(e.lastSeen) ? n - Number(e.lastSeen) <= Bs : !1;
  }
  rebuildSpatialGrid() {
    this.spatialGrid.clear();
    for (const [e, n] of this.activeCursorPresenceEntries()) {
      const s = this.storageToClient(
        n.cursor.x,
        n.cursor.y
      );
      this.spatialGrid.insert({
        id: e,
        x: s.x,
        y: s.y,
        data: n
      });
    }
  }
  checkProximityOptimized() {
    if (!this.currentCursor) return;
    const e = /* @__PURE__ */ new Set(), n = this.options.proximityThreshold || Bp, s = this.storageToClient(this.currentCursor.x, this.currentCursor.y), r = this.spatialGrid.findNearby(
      s.x,
      s.y,
      n
    );
    for (const i of r) {
      const o = i.data;
      if (!o.cursor) continue;
      const c = this.storageToClient(o.cursor.x, o.cursor.y);
      if (dr(
        {
          x: s.x,
          y: s.y,
          pointer: this.currentCursor.pointer
        },
        {
          x: c.x,
          y: c.y,
          pointer: o.cursor.pointer
        }
      ) < n && (e.add(i.id), !this.proximityUsers.has(i.id))) {
        const u = {
          ours: { x: this.currentCursor.x, y: this.currentCursor.y },
          theirs: { x: o.cursor.x, y: o.cursor.y }
        }, h = o.cursor.x - this.currentCursor.x, d = o.cursor.y - this.currentCursor.y, f = Math.atan2(d, h);
        this.options.onProximityEntered?.(
          o.playerIdentity,
          u,
          f
        );
      }
    }
    for (const i of this.proximityUsers)
      e.has(i) || this.options.onProximityLeft?.(i);
    this.proximityUsers = e;
  }
  addCursorStyles() {
    if (this.isStylesAdded || document.getElementById("playhtml-cursor-styles"))
      return;
    const e = document.createElement("style");
    e.id = "playhtml-cursor-styles", e.textContent = `
      .playhtml-cursor-other {
        position: fixed;
        width: 32px;
        height: 32px;
        pointer-events: none;
        z-index: 999999;
        transition: all 0.1s ease;
        transform-origin: center;
      }
      
      .playhtml-cursor-fade-in {
        animation: cursorFadeIn 0.3s ease-out;
      }
      
      .playhtml-cursor-fade-out {
        animation: cursorFadeOut 0.3s ease-out;
        opacity: 0;
      }
      
      @keyframes cursorFadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes cursorFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
    `;
    const n = Hn(this.options.container);
    n && n !== document.body ? n.appendChild(e) : document.head.appendChild(e), this.isStylesAdded = !0;
  }
  // Build the onUpdate callback for a SpringAnimator. Position values are
  // always in pixel space — zone-relative coordinates are resolved to pixels
  // before being fed to the spring.
  createCursorPositionCallback(e) {
    return (n) => {
      const s = this.cursors.get(e);
      s && (s.style.position = this.coordinateMode === "absolute" || this.getContainerMatrix() ? "absolute" : "fixed", s.style.left = `${n.x}px`, s.style.top = `${n.y}px`, s.style.zIndex = "999999", s.style.pointerEvents = "none");
    };
  }
  // Resolves storage coordinates to the coordinate space used for positioning.
  // In absolute mode (default container) storage coords are document coords
  // and cursors use position:absolute, so no conversion is needed. With a
  // transformed cursor container, storage coords are container-local — and
  // since cursors are appended inside that container with position:absolute,
  // the CSS transform composes them into the right viewport pixels for free,
  // so again no conversion is needed. Relative mode converts to viewport
  // pixels for position:fixed.
  resolveTargetCoords(e, n) {
    return this.coordinateMode === "absolute" || this.getContainerMatrix() ? { x: e, y: n } : this.storageToClient(e, n);
  }
  // Apply zone-specific cursor styling, or revert to global styling when
  // leaving a zone. Uses applyTrackedStyles so keys written by a previous
  // call that aren't in the new style object are removed, rather than
  // lingering on the element.
  applyZoneStyling(e, n, s, r) {
    let i = this.cursorStyleKeys.get(r);
    if (i || (i = /* @__PURE__ */ new Set(), this.cursorStyleKeys.set(r, i)), s) {
      const o = this.zones.get(s);
      if (o?.options?.getCursorStyle) {
        pr(
          e,
          i,
          o.options.getCursorStyle(n)
        );
        return;
      }
    }
    this.options.getCursorStyle ? pr(
      e,
      i,
      this.options.getCursorStyle(n)
    ) : pr(e, i, {});
  }
  hitTestZones(e, n) {
    let s = null, r = 1 / 0;
    for (const [i, { element: o }] of this.zones) {
      if (!document.contains(o)) continue;
      const c = o.getBoundingClientRect();
      if (e >= c.left && e <= c.right && n >= c.top && n <= c.bottom) {
        const a = c.width * c.height;
        a < r && (r = a, s = {
          zoneId: i,
          relX: Math.max(0, Math.min(1, (e - c.left) / c.width)),
          relY: Math.max(0, Math.min(1, (n - c.top) / c.height))
        });
      }
    }
    return s;
  }
  getOwnCursorSvg() {
    const e = fe(this.playerIdentity);
    return this.ownCursorSvgCache?.color !== e && (this.ownCursorSvgCache = {
      color: e,
      svg: Bl(Vl(e))
    }), this.ownCursorSvgCache.svg;
  }
  addCursorEventListener(e, n, s, r) {
    e.addEventListener(n, s, r), this.cursorEventCleanups.push(() => {
      e.removeEventListener(n, s, r);
    });
  }
  requestPointerFrame(e) {
    return typeof window.requestAnimationFrame == "function" ? window.requestAnimationFrame(e) : window.setTimeout(() => e(performance.now()), 1e3 / 60);
  }
  cancelPointerFrame(e) {
    typeof window.cancelAnimationFrame == "function" ? window.cancelAnimationFrame(e) : window.clearTimeout(e);
  }
  queuePointerSample(e, n, s) {
    this.pendingPointerSample = { clientX: e, clientY: n, input: s }, this.pointerFrame === null && (this.pointerFrame = this.requestPointerFrame(() => {
      this.pointerFrame = null;
      const r = this.pendingPointerSample;
      this.pendingPointerSample = null, r && this.processPointerSample(r);
    }));
  }
  processPointerSample(e) {
    let n = e.input;
    if (e.input === "mouse") {
      n = "mouse";
      const r = document.elementFromPoint(e.clientX, e.clientY);
      if (r) {
        const i = window.getComputedStyle(r), o = _y(i.cursor);
        o && !o.includes(this.getOwnCursorSvg()) && (n = o);
      }
      n === "mouse" ? document.documentElement.style.cursor = fr(
        fe(this.playerIdentity)
      ) : document.documentElement.style.cursor = "auto";
    }
    const s = this.clientToStorage(e.clientX, e.clientY);
    this.currentCursor = {
      x: s.x,
      y: s.y,
      pointer: n
    }, this.currentZone = this.hitTestZones(e.clientX, e.clientY), this.scheduleCursorAwarenessUpdate(), this.updateAllCursorVisibility();
  }
  setupCursorTracking() {
    const e = (o) => {
      const c = o;
      this.queuePointerSample(c.clientX, c.clientY, "mouse");
    }, n = (o) => {
      const a = o.touches[0];
      a && this.queuePointerSample(a.clientX, a.clientY, "touch");
    }, s = () => {
    };
    this.addCursorEventListener(document, "mousemove", e), this.addCursorEventListener(document, "touchmove", n, {
      passive: !0
    }), this.addCursorEventListener(document, "touchend", s), this.addCursorEventListener(document, "mouseleave", () => {
      this.showAllCursors();
    });
    let r = null;
    const i = () => {
      r === null && (r = requestAnimationFrame(() => {
        r = null, this.repositionAllCursors();
      }));
    };
    this.addCursorEventListener(window, "scroll", i, {
      passive: !0
    }), this.addCursorEventListener(window, "resize", i), window.visualViewport && (this.addCursorEventListener(
      window.visualViewport,
      "scroll",
      i
    ), this.addCursorEventListener(
      window.visualViewport,
      "resize",
      i
    )), this.addCursorEventListener(window, "beforeunload", () => {
      this.presenceTransport.clear("cursor");
    });
  }
  // Re-derive positions for all remote cursors. In relative mode, this is
  // needed on every scroll/resize since cursors use position:fixed with
  // viewport-relative coords. In absolute mode, non-zone cursors use
  // position:absolute and the browser handles scroll — only zone cursors
  // need re-resolution (getBoundingClientRect changes on scroll).
  repositionAllCursors() {
    for (const [e, n] of this.activeCursorPresenceEntries())
      this.snapCursorToPresence(e, n);
    this.updateAllCursorVisibility();
  }
  snapCursorToPresence(e, n) {
    const s = this.cursorAnimators.get(e);
    if (!s) return;
    if (n.zone) {
      const i = this.zones.get(n.zone.zoneId);
      if (i && document.contains(i.element)) {
        const o = i.element.getBoundingClientRect(), c = this.cursors.get(e), a = c ? c.offsetWidth / 2 : 0, l = c ? c.offsetHeight / 2 : 0, u = o.left + n.zone.relX * o.width - a, h = o.top + n.zone.relY * o.height - l;
        this.coordinateMode === "absolute" ? s.snapTo({
          x: u + window.scrollX,
          y: h + window.scrollY
        }) : s.snapTo({ x: u, y: h });
        return;
      }
    }
    if (this.coordinateMode === "absolute" || this.getContainerMatrix()) return;
    const r = this.storageToClient(
      n.cursor.x,
      n.cursor.y
    );
    s.snapTo({ x: r.x, y: r.y });
  }
  getActiveCursorConnectionCount() {
    const e = this.currentCursor ? 1 : 0;
    let n = 0;
    for (const s of this.activeCursorPresenceEntries({
      freshOnly: !0
    }))
      n++;
    return Math.max(1, e + n);
  }
  scheduleCursorAwarenessUpdate() {
    if (this.awarenessUpdateTimeout !== null) return;
    const n = performance.now() - this.lastUpdate, s = ay(
      this.getActiveCursorConnectionCount()
    ), r = this.serverCursorMaxHz ? 1e3 / this.serverCursorMaxHz : 0, i = Math.max(s, r);
    n >= i ? this.updateCursorAwareness() : this.awarenessUpdateTimeout = setTimeout(() => {
      this.awarenessUpdateTimeout = null, this.updateCursorAwareness();
    }, i - n);
  }
  updateCursorAwareness() {
    this.awarenessUpdateTimeout !== null && (clearTimeout(this.awarenessUpdateTimeout), this.awarenessUpdateTimeout = null);
    const e = Date.now(), n = {
      cursor: this.currentCursor,
      playerIdentity: this.playerIdentity,
      message: this.currentMessage,
      page: Ie(),
      zone: this.currentZone
    };
    this.presenceTransport.update("cursor", {
      cursor: n.cursor,
      page: n.page,
      zone: n.zone,
      at: e
    }), this.currentMessage !== this.lastSentMessage && (this.presenceTransport.update("message", this.currentMessage), this.lastSentMessage = this.currentMessage), this.lastUpdate = performance.now(), this.checkProximityOptimized(), this.notifyCursorPresenceListeners();
  }
  publishPresenceTransportState() {
    const e = Ie();
    this.presenceTransport.join({
      identity: this.playerIdentity,
      page: e
    }), this.currentCursor && this.presenceTransport.update("cursor", {
      cursor: this.currentCursor,
      page: e,
      zone: this.currentZone,
      at: Date.now()
    }), (this.currentMessage !== null || this.lastSentMessage !== null) && (this.presenceTransport.update("message", this.currentMessage), this.lastSentMessage = this.currentMessage);
  }
  getContainer() {
    const e = Hn(this.options.container) ?? document.body;
    return this.lastKnownContainer = e, e;
  }
  refreshContainer() {
    const e = Hn(this.options.container) ?? document.body;
    if (e === this.lastKnownContainer) return;
    const n = this.lastKnownContainer;
    this.lastKnownContainer = e, n && n.querySelectorAll(".playhtml-cursor-other").forEach((o) => e.appendChild(o));
    const r = document.getElementById("playhtml-cursor-styles");
    r && r.parentElement !== e && e.appendChild(r);
  }
  // Re-invoke getCursorStyle for all currently rendered cursors. Called after
  // SPA navigation so consumers can re-evaluate per-page visibility decisions.
  refreshCursorStyles() {
    if (!(!this.options.getCursorStyle && this.zones.size === 0))
      for (const [e, n] of this.cursors.entries()) {
        const s = this.findAwarenessByStableId(e);
        if (!s) continue;
        const r = this.cursorZoneState.get(e) ?? null;
        this.applyZoneStyling(n, s, r, e);
      }
  }
  findAwarenessByStableId(e) {
    for (const [n, s] of this.activeCursorPresenceEntries())
      if (n === e) return s;
    return null;
  }
  updateCursor(e, n) {
    const s = this.pendingRemovals.get(e);
    if (s) {
      clearTimeout(s), this.pendingRemovals.delete(e);
      const m = this.cursors.get(e);
      m && (m.classList.remove("playhtml-cursor-fade-out"), m.classList.add("playhtml-cursor-fade-in"));
    }
    const r = n.playerIdentity;
    if (this.options.shouldRenderCursor && !this.options.shouldRenderCursor(n)) {
      this.removeCursor(e);
      return;
    }
    let i = this.cursors.get(e);
    const o = n.cursor, c = i && i.dataset.pointerType !== o.pointer;
    !i || c ? (i && i.remove(), i = this.createCursorElement(
      r,
      o.pointer,
      n.message,
      e,
      n
    ), i.dataset.pointerType = o.pointer, this.cursors.set(e, i), this.getContainer().appendChild(i)) : i && (this.updateCursorMessage(i, r, n.message), this.updateCursorName(i, r));
    const a = n.zone, l = this.cursorZoneState.get(e) ?? null, u = a?.zoneId ?? null, h = l !== u;
    this.cursorZoneState.set(e, u);
    let d, f = !1;
    if (a) {
      const m = this.zones.get(a.zoneId);
      if (m && document.contains(m.element)) {
        const C = m.element.getBoundingClientRect(), S = this.cursors.get(e), $ = S ? S.offsetWidth / 2 : 0, z = S ? S.offsetHeight / 2 : 0, _ = C.left + a.relX * C.width - $, Be = C.top + a.relY * C.height - z;
        this.coordinateMode === "absolute" ? d = {
          x: _ + window.scrollX,
          y: Be + window.scrollY
        } : d = { x: _, y: Be }, f = !0;
      } else
        d = this.resolveTargetCoords(o.x, o.y);
    } else
      d = this.resolveTargetCoords(o.x, o.y);
    this.applyZoneStyling(
      i,
      n,
      f ? u : null,
      e
    );
    let p = d.x, y = d.y;
    if (this.coordinateMode === "relative") {
      const C = window.innerWidth, S = window.innerHeight;
      p = Math.max(
        -18,
        Math.min(C - 2, d.x)
      ), y = Math.max(
        -18,
        Math.min(S - 2, d.y)
      );
    }
    let g = this.cursorAnimators.get(e);
    if (g || (g = new Ey(
      { x: p, y },
      this.createCursorPositionCallback(e)
    ), this.cursorAnimators.set(e, g)), h ? g.snapTo({ x: p, y }) : g.setTarget({ x: p, y }), this.currentCursor) {
      const m = this.storageToClient(this.currentCursor.x, this.currentCursor.y), C = dr(
        { x: d.x, y: d.y, pointer: o.pointer },
        {
          x: m.x,
          y: m.y,
          pointer: this.currentCursor.pointer
        }
      ), S = this.visibilityThreshold ? C < this.visibilityThreshold : !0;
      i.style.display = S ? "block" : "none", i.style.opacity = S ? "1" : "0", i.dataset.animating || (i.style.transform = S ? "scale(1)" : "scale(0.8)");
    } else
      i.style.display = "block", i.style.opacity = "1", i.dataset.animating || (i.style.transform = "scale(1)");
  }
  createCursorElement(e, n = "mouse", s, r, i) {
    const o = document.createElement("div");
    if (o.className = "playhtml-cursor-other playhtml-cursor-fade-in", r && this.options.onCustomCursorRender) {
      const a = this.options.onCustomCursorRender(
        r,
        o
      );
      if (a)
        return a;
    }
    const c = ky(fe(e));
    switch (n) {
      case "mouse":
        o.innerHTML = this.getMouseCursorSVG(c);
        break;
      case "touch":
        o.innerHTML = this.getTouchCursorSVG(c);
        break;
      default:
        o.innerHTML = Ay(n) ? this.getCustomCursorSVG(c, n) : this.getMouseCursorSVG(c);
        break;
    }
    if (this.options.cursorStyle && (o.style.cssText += this.options.cursorStyle), this.updateCursorMessage(o, e, s), this.updateCursorName(o, e), this.options.getCursorStyle && i) {
      const a = this.options.getCursorStyle(i);
      Object.assign(o.style, a);
    }
    return o;
  }
  getMouseCursorSVG(e) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(10 7)">
          <path
            d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z"
            fill="#fff"
          />
          <path
            d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
            fill="${zn(e)}"
          />
        </g>
      </svg>
    `;
  }
  getTouchCursorSVG(e) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <path
            d="m3.8852309 13.5522788c.15029277.1354048.25406355.2326609.57471053.5372549.31406586.2983172.46594413.439273.60482646.5572091.05791893.0487853.10729946.1792495.12686364.3731628.01609788.1595565.01049553.3375341-.0090192.5090254-.00674888.0593077-.01325791.1020883-.01698742.1224696-.04186639.2287942.13249226.4401222.36507344.4424801.20929712.0021219.37056581.00472.79741331.0123273.10679864.0019014.10679864.0019014.21395196.0037648 1.16029156.0199598 1.75290683.01448 2.1782236-.039003.45462139-.05716.92282087-.6061887 1.32754658-1.2951218.3429437.6096032.818651 1.2048784 1.2990136 1.282277.1525992.0243739.3372104.0319365.5511764.0270146.1595258-.0036697.328349-.0141847.4987188-.0294071.1284742-.0114791.2308379-.0230173.2919821-.0309462.2259121-.0292954.3737346-.2515956.31337-.4712558-.0130388-.0474468-.0339905-.1345046-.0551176-.2441066-.0244927-.1270617-.0421932-.2511642-.0502379-.3642189-.0051002-.0716765-.0061057-.1365707-.0028638-.1926702.0056365-.097781.007395-.1525378.0101327-.2790463.0010457-.0470941.0010457-.0470941.0024433-.0883088.0052898-.134881.0234093-.2629524.0820463-.5422232.0251901-.1212103.1472903-.3531692.3395862-.6402332.0572734-.0854992.1198813-.1747825.1869659-.2669588.127207-.1747861.2641214-.3514011.4010853-.5204043.0820457-.1012383.1454717-.1769623.1807968-.2180763.2962199-.424403.6120842-1.1191696.7281396-1.5253635.111416-.3904017.2005405-1.10937558.2553074-1.81604479.0300143-.40088807.0411211-.72405394.0411211-1.23097561.0000507-.08891816.0000507-.08891816.0002032-.16234685.0002858-.12025251.0003032-.16573976-.0000887-.22195195-.0010706-.15358041-.0055478-.30580145-.0203882-.6940256-.0319191-.81365149-.4778003-1.3396911-1.1348711-1.44115781-.5589865-.08632026-1.2393839.37795756-1.2393839.37795756s-.1514404-.5228127-.2537197-.6842075c-.1661957-.25934741-.5941748-.58982828-.9213451-.65421118-.3365014-.0653413-.7354024-.05811592-1.1017193.00667481-.3207944.05740454-.64034865.34382687-.82518751.65277182-.13223727.22039488-.00786932-.01169164-.14013104-.2396787-.1830552-.31402315-.60932935-.59522407-1.01524567-.67822294-.34396352-.07112559-.73801897-.04403625-1.09795562.06293793-.46304125.13836397-.53675291.49073282-.55516748.38984626-.06158674-.3382385-.06727482-.3160095-.105656-.55729603-.14258072-.89527436-.30213161-1.51473549-.54406219-2.05528331.01391678.0310773-.08860981-.20214701-.12592279-.28256779-.06461002-.13925416-.12910532-.2652956-.19999629-.38652204-.21850342-.37364978-.46891278-.65340904-.7830908-.81233894-.54561037-.27629378-1.3634177-.14183064-1.75105565.31064856-.38495968.44966797-.4491432 1.20149287-.3521966 2.13184003.03702376.36121263.16678627 1.02066144.28444961 1.50812387.04160602.1691894.07805979.32348903.14491578.60851331.01149723.04848415.01149723.04848415.02309483.09698036.05172236.21571896.09707607.39320067.15122332.5879629-.00568154-.02030261.09701461.344086.11888835.42472961.00727686.02691587.00727686.02691587.01448296.05395339.04082856.15377935.08074083.31959314.14309954.5963099.03412572.1521447.06742545.31468601.09999775.48699018.08883553.46993091.089274.37207374.00375852.27186198-.05907319-.06922522-.11463055-.13209255-.16830659-.19003644-.09976937-.10770214-.19148509-.19677225-.2785569-.2678141-.6343975-.51905295-1.02312991-.74839425-1.55681885-.79878106-.87541567-.08410158-1.70619803.53426712-1.83111632 1.36882761-.07682697.51169638-.05207639.74723271.18463583 1.19942735.13026223.24432805.35060714.53942202.76172732 1.04735429.02515953.031068.02515953.031068.05030428.06206416.50464537.62186746.55962098.69095396.67961467.86473786.32435479.4706845 1.1139501 1.8221455 1.25748612 2.0035872z"
            fill="${zn(e)}"
          />
          <path
            d="m1.68266944 9.2716401c-.02488625-.03067752-.02488625-.03067752-.04970567-.06132555-.37729166-.46613768-.58418002-.74321015-.68156241-.9258495-.15281729-.29195235-.1611316-.37107459-.10605794-.73788601.06473349-.43247455.53181583-.78013371 1.01829549-.73339767.33660502.03178017.63068475.20527903 1.15339692.63295262.0565942.04617564.12482853.1124417.20288232.19670163.04616569.04983637.09513192.10524534.14800114.16720042.0794093.0930562.34702847.42052231.30761424.37286894.05814283.06991619.09971852.12407704.14721655.19045018.0941062.13434104.14705111.20894642.21874992.30454484-.0336171-.04487143.21473082.29843305.26732159.34863333.27859812.26593456.68203289.04195871.65675979-.31244785-.00421914-.05916537-.01812774-.12308431-.04717934-.23466885-.11487425-.81923739-.15505751-1.08218312-.24678252-1.56739907-.03407352-.18024544-.06905328-.35098727-.10521102-.5121905-.06435409-.28557213-.10635725-.46007245-.14994794-.62425526-.00774801-.02907063-.00774801-.02907063-.01552357-.05783095-.02300644-.08481964-.12725123-.45470311-.12030828-.42989063-.05134381-.18468043-.0945453-.35373996-.14431997-.56133562-.01130896-.04728909-.01130896-.04728909-.02259904-.09489949-.06649254-.28350912-.10387999-.44176072-.14606063-.6132721-.10998732-.45567652-.23425389-1.08719519-.2671036-1.40768017-.07546665-.72422018-.02339381-1.33418457.17582284-1.56688778.15554834-.1815673.59641015-.25405339.84271752-.12932486.16107512.0814814.32204278.26131571.47435101.521769.05764302.09857191.11172763.20426801.16708381.32357735.0335256.07225783.13292567.29837003.12172905.27336705.21032209.46992469.354801 1.03086841.48791736 1.86671535.03939531.24766201.08813662.52823537.15063928.87150416.01857903.10178746.01857903.10178746.03722922.20314381.30139226 1.63533599.27933797 1.51139381.28367122 1.64182468.01580667.47578071.71810567.4869267.74900255.01188722.00979855-.15065269.00630989-.2851661-.01107827-.67146517-.00245496-.05465243-.00245496-.05465243-.00481877-.10910149-.01521525-.35590459-.01433687-.56066672.00670546-.67705709.03834708-.21223125.22887-.4499778.40434754-.50241339.24641865-.07323589.51640341-.09179599.73269877-.04707051.20703808.0423346.44864736.20171736.51796318.32062499.08353628.14399789.15516008.36337367.21006107.63530456.04431149.21947986.07480439.45493493.0962536.70624261.00667352.0781897.01103024.13859819.01772256.23854675.00285005.04183594.00285005.04183594.00568968.07635213.00160285.01731471.00160285.01731471.00551199.04467336.00303535.01917374.00303535.01917374.01734216.06773608.00727602.13782339.00727602.13782339.56081544.18893151.16530264-.19982737.16530264-.19982737.16077268-.23486454.02708074-.1183491.04365279-.250265.06727822-.49813693.01508098-.16112409.02268576-.24033521.03157416-.32249887.036794-.34012028.0835164-.55621578.140511-.65120691.0707148-.11819408.3197845-.28280909.4314962-.30279961.2805348-.04961763.5886064-.0551978.8264635-.00901194.1077347.021202.3705429.22413969.4327499.32121002.1277282.20156171.2519621.8513817.3219188 1.49611734-.0110122.04228902-.0110122.04228902.1607163.28760404.5903408-.06730286.5903408-.06730286.5737568-.17389206.0155734-.03799147.0279666-.08191522.0455068-.15013809.0421947-.1597068.0701719-.25243998.1118273-.35635899.0288165-.07188915.0591935-.13335501.0903398-.18227881.120675-.18992919.4330876-.31896311.7070596-.2766556.2942545.0454396.4817569.26665023.4998934.72896761.0145423.38042999.0188438.52667972.0198445.67022961.0003693.0529684.0003531.09548963.0000723.21509672-.0001536.07391241-.0001536.07391241-.000205.16397385 0 .48892448-.010469.79353263-.0389535 1.17400348-.0506294.653266-.1361064 1.34281542-.228649 1.66708482-.094456.330596-.3764591.9508823-.5997469 1.2734975-.0158389.0153017-.0838055.0964468-.1706932.2036597-.1445918.1784155-.2892331.364998-.4248114.5512865-.0725632.099704-.140705.1968792-.2036767.2908847-.2436695.3637558-.4000227.6607868-.4506249.9042828-.0664376.3164194-.0901813.4842425-.0973169.666189-.0017426.0515155-.0017426.0515155-.0028439.1014735-.0025547.1180556-.0040857.165727-.0090621.2520573-.0052398.0906702-.0037444.1871795.0035093.2891187.0103883.145992.0000001.3454812.0000001.3454812s-.1266332-.0118299-.2678551-.0085813c-.1725177.0039685-.3159859-.0019087-.4151297-.0177442-.143046-.0230487-.5293508-.5064503-.7271506-.8830611-.3022704-.5764228-1.03604858-.5484427-1.33684295-.0394061-.27130191.4618137-.65965243.9172085-.77493336.9317029-.37460536.047106-.95471158.0524702-2.07175566.0332544-.10679478-.0018572-.10679478-.0018572-.21348729-.0037567-.42889761-.0076439-.41241496.0647655-.40363307-.0124079.02506967-.2203068.02222332-.1790312.00000011-.3992999-.03726222-.36933-.15125405-.6704984-.38877094-.8705429-.12286946-.1043424-.26983033-.2407345-.56500741-.5211097-.33722428-.3203411-.44283686-.4193233-.57299128-.5337266l-.80130455-.8907189c-.08795856-.1124788-.86002339-1.4339349-1.21248613-1.9454077-.13710846-.19857111-.18839645-.26302343-.71461353-.9114734zm9.50873056.0037599v3.459c0 .5.75.5.75 0v-3.459c0-.5-.75-.5-.75 0zm-2.03159602-.00057241.016 3.47300001c.00230346.4999947.7522955.4965395.74999204-.0034552l-.016-3.47299999c-.00230346-.4999947-.7522955-.49653951-.74999204.00345518zm-1.20911102 3.45357381-.021-3.42599996c-.00306475-.4999906-.75305066-.49539349-.74998592.00459712l.021 3.42600004c.00306475.4999906.75305066.4953935.74998592-.0045972z"
            fill="#fff"
          />
        </g>
      </svg>
    `;
  }
  getCustomCursorSVG(e, n) {
    return `
      <svg
        height="32"
        viewBox="0 0 32 32"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0 0 0.25rem ${zn(e)}); pointer-events: none;"
      >
        <g fill="none" fillRule="evenodd" transform="translate(9 8)">
          <image href="${zn(n)}" width="32" height="32"></image>
        </g>
      </svg>
    `;
  }
  removeCursor(e) {
    const n = this.cursors.get(e);
    if (n) {
      n.classList.remove("playhtml-cursor-fade-in"), n.classList.add("playhtml-cursor-fade-out");
      const r = this.pendingRemovals.get(e);
      r && clearTimeout(r);
      const i = setTimeout(() => {
        n.remove(), this.cursors.delete(e), this.pendingRemovals.delete(e);
      }, 300);
      this.pendingRemovals.set(e, i);
    }
    const s = this.cursorAnimators.get(e);
    s && (s.destroy(), this.cursorAnimators.delete(e)), this.cursorZoneState.delete(e), this.cursorStyleKeys.delete(e);
  }
  setupGlobalAPI() {
    const e = this;
    window.cursors = {
      get allColors() {
        return lr(e.users.getAll());
      },
      get color() {
        return e.users.me.color;
      },
      set color(n) {
        e.users.me.color = n;
      },
      get name() {
        return e.users.me.name;
      },
      set name(n) {
        e.users.me.name = n;
      },
      on: (n, s) => {
        e.globalApiListeners.has(n) || e.globalApiListeners.set(n, /* @__PURE__ */ new Set()), e.globalApiListeners.get(n).add(s);
      },
      off: (n, s) => {
        const r = e.globalApiListeners.get(n);
        r && r.delete(s);
      }
    };
  }
  emitGlobalEvent(e, n) {
    const s = this.globalApiListeners.get(e);
    if (s)
      for (const r of s)
        try {
          r(n);
        } catch (i) {
          console.error(
            `[playhtml] cursors "${e}" subscriber threw:`,
            i
          );
        }
  }
  updateChatCTA() {
    this.chat && (this.otherUsersWithMessages.size > 0 ? this.chat.showCTA() : this.chat.hideCTA());
  }
  updateCursorMessage(e, n, s) {
    const r = e.querySelector(".playhtml-cursor-message");
    if (r && r.remove(), s) {
      const i = document.createElement("div");
      i.className = "playhtml-cursor-message", i.style.cssText = `
        position: absolute;
        font-size: 16px;
        font-style: normal;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        color: white;
        padding: 4px 9px 4px 9px;
        border-radius: 16px 16px 16px 16px;
        white-space: nowrap;
        background-color: rgba(52,199,89,1);
        top: 17px;
        left: 22px;
      `, i.textContent = s, e.appendChild(i);
    }
  }
  updateCursorName(e, n) {
    const s = e.querySelector(".playhtml-cursor-name");
    s && s.remove();
    const r = n?.name;
    if (r && n) {
      const i = fe(n), o = r.length > 10 ? r.slice(0, 10) + ".." : r, c = this.opacifyColor(i, 0.6), a = this.opacifyColor(i, 0.3), l = this.getContrastColor(i), u = document.createElement("div");
      u.className = "playhtml-cursor-name", u.style.cssText = `
        position: absolute;
        white-space: nowrap;
        padding: 4px 6px;
        font-size: 12px;
        background: ${i};
        border-radius: 14px;
        top: 14px;
        left: 18px;
        opacity: 0.75;
        border: 1px solid ${c};
        box-shadow: 1px 1px 4px 2px ${a};
        color: ${l};
      `, u.textContent = o, e.appendChild(u);
    }
  }
  opacifyColor(e, n) {
    if (e.startsWith("#")) {
      const s = e.replace("#", ""), r = parseInt(s.substring(0, 2), 16), i = parseInt(s.substring(2, 4), 16), o = parseInt(s.substring(4, 6), 16);
      return `rgba(${r}, ${i}, ${o}, ${n})`;
    } else {
      if (e.startsWith("rgba"))
        return e.replace(/[\d\.]+\)$/, `${n})`);
      if (e.startsWith("rgb"))
        return e.replace("rgb", "rgba").replace(")", `, ${n})`);
      if (e.startsWith("hsl")) {
        const s = e.match(
          /hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/
        );
        if (s) {
          const [, r, i, o] = s.map(Number), [c, a, l] = this.hslToRgb(r, i, o);
          return `rgba(${c}, ${a}, ${l}, ${n})`;
        }
      }
    }
    return e;
  }
  hslToRgb(e, n, s) {
    e /= 360, n /= 100, s /= 100;
    let r, i, o;
    if (n === 0)
      r = i = o = s;
    else {
      const c = (u, h, d) => (d < 0 && (d += 1), d > 1 && (d -= 1), d < 0.16666666666666666 ? u + (h - u) * 6 * d : d < 0.5 ? h : d < 0.6666666666666666 ? u + (h - u) * (0.6666666666666666 - d) * 6 : u), a = s < 0.5 ? s * (1 + n) : s + n - s * n, l = 2 * s - a;
      r = c(l, a, e + 1 / 3), i = c(l, a, e), o = c(l, a, e - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(i * 255), Math.round(o * 255)];
  }
  getLuminance(e) {
    let n, s, r;
    if (e.startsWith("#")) {
      const a = e.replace("#", "");
      n = parseInt(a.substring(0, 2), 16), s = parseInt(a.substring(2, 4), 16), r = parseInt(a.substring(4, 6), 16);
    } else if (e.startsWith("rgb")) {
      const a = e.match(/\d+/g);
      if (!a || a.length < 3) return 0;
      [n, s, r] = a.map(Number);
    } else if (e.startsWith("hsl")) {
      const a = e.match(/\d+(\.\d+)?/g);
      if (!a || a.length < 3) return 0;
      const [l, u, h] = a.map(Number);
      [n, s, r] = this.hslToRgb(l, u, h);
    } else
      return 0;
    const [i, o, c] = [n / 255, s / 255, r / 255].map(
      (a) => a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * i + 0.7152 * o + 0.0722 * c;
  }
  getContrastColor(e) {
    return this.getLuminance(e) > 0.5 ? "#000000" : "#ffffff";
  }
  updateAllCursorVisibility() {
    if (!this.currentCursor || !this.visibilityThreshold) return;
    const e = this.storageToClient(this.currentCursor.x, this.currentCursor.y);
    this.cursors.forEach((n, s) => {
      const i = this.spatialGrid.getAll().find((o) => o.id === s)?.data;
      if (i && i.cursor) {
        const o = this.storageToClient(i.cursor.x, i.cursor.y), a = dr(
          { ...e, pointer: this.currentCursor.pointer },
          { ...o, pointer: i.cursor.pointer }
        ) < this.visibilityThreshold;
        n.style.display = a ? "block" : "none", n.style.opacity = a ? "1" : "0", n.dataset.animating || (n.style.transform = a ? "scale(1)" : "scale(0.8)");
      }
    });
  }
  showAllCursors() {
    this.cursors.forEach((e) => {
      e.style.display = "block", e.style.opacity = "1", e.dataset.animating || (e.style.transform = "scale(1)");
    });
  }
  configure(e) {
    if (Object.assign(this.options, e), e.shouldRenderCursor !== void 0)
      for (const [n, s] of this.activeCursorPresenceEntries())
        this.updateCursor(n, s);
    e.visibilityThreshold !== void 0 && (this.visibilityThreshold = e.visibilityThreshold, this.updateAllCursorVisibility()), e.playerIdentity !== void 0 && this.users.adoptIdentity(e.playerIdentity);
  }
  registerZone(e, n) {
    if (!e.id)
      throw new Error("[playhtml] Zone element must have an id attribute.");
    this.zones.set(e.id, { element: e, options: n });
  }
  unregisterZone(e) {
    this.zones.delete(e);
  }
  hideCursor(e) {
    const n = this.cursors.get(e);
    n && (n.style.display = "none");
  }
  showCursor(e) {
    const n = this.cursors.get(e);
    n && (n.style.display = "block");
  }
  destroy() {
    this.unsubscribeSelfChange?.(), this.unsubscribeSelfChange = null, this.unsubscribeUsersChange?.(), this.unsubscribeUsersChange = null, this.cursorEventCleanups.forEach((e) => e()), this.cursorEventCleanups = [], this.pointerFrame !== null && (this.cancelPointerFrame(this.pointerFrame), this.pointerFrame = null), this.pendingPointerSample = null, this.awarenessUpdateTimeout !== null && (clearTimeout(this.awarenessUpdateTimeout), this.awarenessUpdateTimeout = null), this.cursors.forEach((e) => e.remove()), this.cursors.clear(), this.cursorAnimators.forEach((e) => e.destroy()), this.cursorAnimators.clear(), this.spatialGrid.clear(), this.zones.clear(), this.cursorZoneState.clear(), this.cursorStyleKeys.clear(), this.pendingRemovals.forEach((e) => clearTimeout(e)), this.pendingRemovals.clear(), this.chat && this.chat.destroy(), this.presenceTransportUnsubscribe?.(), this.presenceTransportUnsubscribe = null, this.presenceTransport.clear("cursor");
  }
  // Debug method to inspect spatial partitioning efficiency
  getDebugInfo() {
    const e = this.spatialGrid.getItemCount(), n = this.spatialGrid.getCellCount();
    return {
      totalCursors: e,
      gridCells: n,
      avgCursorsPerCell: n > 0 ? e / n : 0
    };
  }
  // Instance-level subscription API (mirrors window.cursors.on/off)
  on(e, n) {
    this.globalApiListeners.has(e) || this.globalApiListeners.set(e, /* @__PURE__ */ new Set()), this.globalApiListeners.get(e).add(n);
  }
  off(e, n) {
    const s = this.globalApiListeners.get(e);
    s && s.delete(n);
  }
  // Snapshot of current cursor-related values for consumers
  getSnapshot() {
    return {
      allColors: lr(this.users.getAll()),
      color: fe(this.playerIdentity),
      name: this.playerIdentity.name ?? void 0
    };
  }
  // Get my player identity (including stable publicKey)
  getMyPlayerIdentity() {
    return this.playerIdentity;
  }
  // Get all cursor presences keyed by stable ID (slim shape for rendering).
  // Cursor coordinates are converted from storage (e.g. viewport % when coordinateMode is "relative")
  // to client pixel coordinates so consumers can use them directly for CSS left/top.
  getCursorPresences() {
    const e = /* @__PURE__ */ new Map(), n = Ie(), s = this.currentCursor ? this.storageToClient(this.currentCursor.x, this.currentCursor.y) : null;
    e.set(this.playerIdentity.publicKey, {
      cursor: s && this.currentCursor ? {
        x: s.x,
        y: s.y,
        pointer: this.currentCursor.pointer
      } : null,
      playerIdentity: this.playerIdentity,
      zone: this.currentZone,
      page: n
    });
    for (const [r, i] of this.cursorPresenceEntries()) {
      const o = i.cursor ? this.storageToClient(i.cursor.x, i.cursor.y) : null;
      e.set(r, {
        cursor: o && i.cursor ? {
          x: o.x,
          y: o.y,
          pointer: i.cursor.pointer
        } : null,
        playerIdentity: i.playerIdentity,
        zone: i.zone,
        // Expose the reader's pathname so consumers can group presences by
        // page — e.g. a docs sidebar can show "who is reading which page"
        // without maintaining a parallel room-per-page structure.
        page: i.page
      });
    }
    return e;
  }
  // Subscribe to cursor presence changes
  onCursorPresencesChange(e) {
    const n = Math.random().toString(36);
    return this.cursorPresenceChangeCallbacks.set(n, e), () => {
      this.cursorPresenceChangeCallbacks.delete(n);
    };
  }
  // Notify listeners of cursor presence changes
  notifyCursorPresenceListeners() {
    const e = this.getCursorPresences();
    this.cursorPresenceChangeCallbacks.forEach((n) => n(e));
  }
  /**
   * Apply a CSS class to a specific cursor element identified by the player's stableId (publicKey).
   * The class is added to the actual rendered cursor DOM element and removed after `durationMs`.
   * Returns true if the cursor element was found and the animation was applied.
   */
  triggerCursorAnimation(e, n, s = 1500) {
    const r = this.activeAnimationCleanups.get(e);
    if (r && r(), e === this.playerIdentity.publicKey)
      return this.triggerSelfCursorAnimation(n, s);
    const o = this.cursors.get(e);
    if (!o) return !1;
    const c = o.querySelector("svg") ?? o;
    o.dataset.animating = "true";
    const a = o.style.display, l = o.style.opacity;
    o.style.display = "block", o.style.opacity = "1";
    const u = o.style.transition;
    o.style.transition = "none", c.classList.add(n);
    let h = !1;
    const d = () => {
      h || (h = !0, c.classList.remove(n), delete o.dataset.animating, o.style.transition = u, o.style.display = a, o.style.opacity = l, this.activeAnimationCleanups.delete(e));
    };
    this.activeAnimationCleanups.set(e, d);
    const f = () => {
      d(), c.removeEventListener("animationend", f);
    };
    return c.addEventListener("animationend", f), window.setTimeout(f, s), !0;
  }
  // Create a temporary ghost cursor at the local player's position and animate it
  triggerSelfCursorAnimation(e, n) {
    if (!this.currentCursor) return !1;
    const s = fe(this.playerIdentity), r = this.storageToClient(this.currentCursor.x, this.currentCursor.y), i = document.createElement("div");
    i.className = `playhtml-cursor-other ${e}`, i.style.cssText = `
      position: fixed;
      left: ${r.x - 16}px;
      top: ${r.y - 16}px;
      width: 32px;
      height: 32px;
      z-index: 999999;
      pointer-events: none;
      opacity: 0.3;
      transform-origin: top left;
    `, i.innerHTML = this.getMouseCursorSVG(s), document.body.appendChild(i);
    const o = this.playerIdentity.publicKey;
    let c = !1;
    const a = () => {
      c || (c = !0, i.removeEventListener("animationend", l), i.remove(), this.activeAnimationCleanups.delete(o));
    };
    this.activeAnimationCleanups.set(o, a);
    const l = () => a();
    return i.addEventListener("animationend", l), window.setTimeout(a, n), !0;
  }
}
const Kl = /* @__PURE__ */ new Map();
function Wl(t, e) {
  Kl.set(t, e);
}
function Dy() {
  const t = [];
  return document.querySelectorAll("[shared]").forEach((e) => {
    if (!e.id) return;
    let n = "read-write";
    const s = e.getAttribute("shared");
    if (s && s !== "") {
      const r = s.toLowerCase();
      (r.includes("read-only") || r === "ro") && (n = "read-only");
    }
    t.push({
      elementId: e.id,
      permissions: n,
      path: window.location.pathname
    });
  }), t;
}
function Ly() {
  const t = [];
  return document.querySelectorAll("[data-source]").forEach((e) => {
    const n = e.getAttribute("data-source");
    if (n)
      try {
        const { domain: s, path: r, elementId: i } = gl(n);
        t.push({ domain: s, path: r, elementId: i });
      } catch {
      }
  }), t;
}
function Ty(t, e) {
  if (t.hasAttribute("data-source") && t.hasAttribute("data-source-read-only")) return !0;
  const r = e ?? Nt(t);
  return r ? Kl.get(r) === "read-only" : !1;
}
const k = "__page__";
function Yl(t) {
  return `${k}:${t}`;
}
function bc(t, e) {
  if (typeof t != "function") return t;
  if (e !== null && typeof e == "object") {
    const n = t(e);
    return n === null ? n : e;
  }
  return t(e);
}
function ql(t, e, n) {
  const s = e.getStorePlay()[k]?.[t];
  if (s === void 0) return;
  const r = Ue(s);
  for (const i of n)
    i(r);
}
function zr(t, e) {
  const n = Yl(t), s = My(e, n);
  s && (s.mode === "deep" && s.target?.unobserveDeep(s), s.mode === "shallow" && s.target?.unobserve(s), s.parentTarget?.unobserve(s.parentObserver), e.yObserverByKey.delete(n));
}
function My(t, e) {
  return t.yObserverByKey.get(e);
}
function bs(t, e, n) {
  const { getStorePlay: s, yObserverByKey: r } = e, i = Yl(t);
  if (r.has(i)) return;
  const o = s()[k]?.[t], c = Q(o);
  let a = !1;
  const l = () => {
    a || (a = !0, queueMicrotask(() => {
      a = !1, ql(t, e, n);
    }));
  };
  if (c && typeof c.observeDeep == "function") {
    const d = l, f = Q(s()[k]), p = ((y) => {
      y.keysChanged?.has(t) && (l(), zr(t, e), bs(t, e, n));
    });
    d.target = c, d.mode = "deep", d.parentTarget = f, d.parentObserver = p, c.observeDeep(d), f.observe(p), r.set(i, d);
    return;
  }
  const u = Q(s()[k]);
  if (!u || typeof u.observe != "function") return;
  const h = ((d) => {
    if (!d.keysChanged?.has(t)) return;
    l();
    const f = s()[k]?.[t], p = Q(f);
    p && typeof p.observeDeep == "function" && (zr(t, e), bs(t, e, n));
  });
  h.target = u, h.mode = "shallow", u.observe(h), r.set(i, h);
}
function Gl(t) {
  const { channelListeners: e, getStorePlay: n } = t;
  for (const [s, r] of e)
    n()[k]?.[s] !== void 0 && (bs(s, t, r), ql(s, t, r));
}
function $y(t, e, n) {
  const {
    ensureProxy: s,
    getProxy: r,
    getDoc: i,
    getStorePlay: o,
    proxyByTagAndId: c,
    channelRefCounts: a,
    channelListeners: l
  } = n, u = () => o(), h = () => i();
  u()[k] ??= {}, s(k, t, e), l.has(t) || l.set(t, /* @__PURE__ */ new Set());
  const d = l.get(t), f = /* @__PURE__ */ new Set();
  function p() {
    bs(t, n, d);
  }
  const y = (a.get(t) ?? 0) + 1;
  a.set(t, y), p();
  let g = !1;
  return {
    getData() {
      if (g) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      const m = u()[k]?.[t];
      return Ue(m === void 0 ? e : m);
    },
    setData(m) {
      if (g) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      let C = r(k, t);
      C === void 0 && (C = s(k, t, e), p());
      const S = C, $ = S !== null && typeof S == "object", z = $ ? S : u()[k]?.[t];
      let _ = z;
      if (typeof m == "function" && $) {
        if (h().transact(() => {
          _ = bc(m, S);
        }), _ === S) return;
      } else
        _ = bc(m, z);
      if ($ && _ !== null && typeof _ == "object" && Array.isArray(S) === Array.isArray(_)) {
        h().transact(() => {
          gs(S, _);
        });
        return;
      }
      h().transact(() => {
        u()[k] ??= {}, u()[k][t] = Ue(_), c.get(k)?.set(t, u()[k][t]);
      });
    },
    onUpdate(m) {
      if (g) throw new Error(`PageDataChannel "${t}" has been destroyed`);
      return d.add(m), f.add(m), () => {
        d.delete(m), f.delete(m);
      };
    },
    destroy() {
      if (g) return;
      g = !0;
      for (const C of f)
        d.delete(C);
      f.clear();
      const m = (a.get(t) ?? 1) - 1;
      if (a.set(t, m), m <= 0) {
        a.delete(t), l.delete(t), zr(t, n);
        const C = c.get(k);
        C && C.delete(t);
      }
    }
  };
}
const Oy = "playhtml.syncedStore is read-only.", Iy = /* @__PURE__ */ new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function ft() {
  throw new Error(Oy);
}
function Py(t) {
  return Array.isArray(t) ? [] : {};
}
function vc(t, e) {
  !Array.isArray(t) || !Array.isArray(e) || (e.length = t.length);
}
function Jl(t) {
  const e = /* @__PURE__ */ new WeakMap();
  function n(s) {
    if (s === null || typeof s != "object")
      return s;
    const r = e.get(s);
    if (r)
      return r;
    const i = s, o = Py(i), c = new Proxy(o, {
      get(a, l) {
        return Array.isArray(i) && Iy.has(l) ? ft : n(Reflect.get(i, l, i));
      },
      getOwnPropertyDescriptor(a, l) {
        if (vc(i, o), Array.isArray(i) && l === "length")
          return Reflect.getOwnPropertyDescriptor(o, l);
        const u = Reflect.getOwnPropertyDescriptor(
          i,
          l
        );
        return u && ("value" in u ? {
          ...u,
          configurable: !0,
          value: n(u.value),
          writable: !1
        } : {
          configurable: !0,
          enumerable: u.enumerable,
          value: n(
            Reflect.get(i, l, i)
          ),
          writable: !1
        });
      },
      has(a, l) {
        return l in i;
      },
      ownKeys() {
        return vc(i, o), Reflect.ownKeys(i);
      },
      getPrototypeOf() {
        return Reflect.getPrototypeOf(i);
      },
      set: ft,
      deleteProperty: ft,
      defineProperty: ft,
      setPrototypeOf: ft,
      preventExtensions: ft
    });
    return e.set(s, c), c;
  }
  return n(t);
}
(!globalThis.EventTarget || !globalThis.Event) && console.error(`
  PartySocket requires a global 'EventTarget' class to be available!
  You can polyfill this global by adding this to your code before any partysocket imports: 
  
  \`\`\`
  import 'partysocket/event-target-polyfill';
  \`\`\`
  Please file an issue at https://github.com/partykit/partykit if you're still having trouble.
`);
var Xl = class extends Event {
  message;
  error;
  constructor(t, e) {
    super("error", e), this.message = t.message, this.error = t;
  }
}, Zl = class extends Event {
  code;
  reason;
  wasClean = !0;
  constructor(t = 1e3, e = "", n) {
    super("close", n), this.code = t, this.reason = e;
  }
};
const gr = {
  Event,
  ErrorEvent: Xl,
  CloseEvent: Zl
};
function Ry(t, e) {
  if (!t) throw new Error(e);
}
function Ny(t) {
  return new t.constructor(t.type, t);
}
function Uy(t) {
  return "data" in t ? new MessageEvent(t.type, t) : "code" in t || "reason" in t ? new Zl(t.code || 1999, t.reason || "unknown reason", t) : "error" in t ? new Xl(t.error, t) : new Event(t.type, t);
}
const Fy = typeof process < "u" && typeof process.versions?.node < "u", jy = typeof navigator < "u" && navigator.product === "ReactNative", Bn = Fy || jy ? Uy : Ny, Ke = {
  maxReconnectionDelay: 1e4,
  minReconnectionDelay: 3e3,
  minUptime: 5e3,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4e3,
  maxRetries: Number.POSITIVE_INFINITY,
  maxEnqueuedMessages: Number.POSITIVE_INFINITY
};
let Cc = !1;
function Hy() {
}
var zy = class De extends EventTarget {
  _ws;
  _retryCount = -1;
  _uptimeTimeout;
  _connectTimeout;
  _shouldReconnect = !0;
  _connectLock = !1;
  _binaryType = "blob";
  _closeCalled = !1;
  _didWarnAboutClosedSend = !1;
  _messageQueue = [];
  _debugLogger = console.log.bind(console);
  _url;
  _protocols;
  _options;
  constructor(e, n, s = {}) {
    super(), this._url = e, this._protocols = n, this._options = s, this._options.startClosed && (this._shouldReconnect = !1), this._options.debugLogger && (this._debugLogger = this._options.debugLogger), this._connect();
  }
  static get CONNECTING() {
    return 0;
  }
  static get OPEN() {
    return 1;
  }
  static get CLOSING() {
    return 2;
  }
  static get CLOSED() {
    return 3;
  }
  get CONNECTING() {
    return De.CONNECTING;
  }
  get OPEN() {
    return De.OPEN;
  }
  get CLOSING() {
    return De.CLOSING;
  }
  get CLOSED() {
    return De.CLOSED;
  }
  get binaryType() {
    return this._ws ? this._ws.binaryType : this._binaryType;
  }
  set binaryType(e) {
    this._binaryType = e, this._ws && (this._ws.binaryType = e);
  }
  /**
   * Returns the number or connection retries
   */
  get retryCount() {
    return Math.max(this._retryCount, 0);
  }
  /**
   * The number of bytes of data that have been queued using calls to send() but not yet
   * transmitted to the network. This value resets to zero once all queued data has been sent.
   * This value does not reset to zero when the connection is closed; if you keep calling send(),
   * this will continue to climb. Read only
   */
  get bufferedAmount() {
    return this._messageQueue.reduce((e, n) => (typeof n == "string" ? e += n.length : n instanceof Blob ? e += n.size : e += n.byteLength, e), 0) + (this._ws ? this._ws.bufferedAmount : 0);
  }
  /**
   * The extensions selected by the server. This is currently only the empty string or a list of
   * extensions as negotiated by the connection
   */
  get extensions() {
    return this._ws ? this._ws.extensions : "";
  }
  /**
   * A string indicating the name of the sub-protocol the server selected;
   * this will be one of the strings specified in the protocols parameter when creating the
   * WebSocket object
   */
  get protocol() {
    return this._ws ? this._ws.protocol : "";
  }
  /**
   * The current state of the connection; this is one of the Ready state constants
   */
  get readyState() {
    return this._closeCalled ? De.CLOSED : this._ws ? this._ws.readyState : this._options.startClosed ? De.CLOSED : De.CONNECTING;
  }
  /**
   * The URL as resolved by the constructor
   */
  get url() {
    return this._ws ? this._ws.url : "";
  }
  /**
   * Whether the websocket object is now in reconnectable state
   */
  get shouldReconnect() {
    return this._shouldReconnect;
  }
  /**
   * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
   */
  onclose = null;
  /**
   * An event listener to be called when an error occurs
   */
  onerror = null;
  /**
   * An event listener to be called when a message is received from the server
   */
  onmessage = null;
  /**
   * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
   * this indicates that the connection is ready to send and receive data
   */
  onopen = null;
  /**
   * Closes the WebSocket connection or connection attempt, if any. If the connection is already
   * CLOSED or CLOSING, this method does nothing.
   *
   * The `close` event is dispatched synchronously (mirroring how
   * `reconnect()` dispatches its synthetic close). This guarantees
   * consumers observe a terminal event for every explicit close, even
   * if their listeners are detached right after this call — previously
   * the real (asynchronous) browser close event could fire after
   * listeners were removed and go unobserved entirely.
   */
  close(e = 1e3, n) {
    if (this._closeCalled = !0, this._shouldReconnect = !1, this._clearTimeouts(), !this._ws) {
      this._debug("close enqueued: no ws instance");
      return;
    }
    if (this._ws.readyState === this.CLOSED || this._ws.readyState === this.CLOSING) {
      this._debug("close: already closing or closed");
      return;
    }
    this._disconnect(e, n);
  }
  /**
   * Closes the WebSocket connection or connection attempt and connects again.
   * Resets retry counter;
   */
  reconnect(e, n) {
    this._shouldReconnect = !0, this._closeCalled = !1, this._didWarnAboutClosedSend = !1, this._retryCount = -1, !this._ws || this._ws.readyState === this.CLOSED || this._ws.readyState === this.CLOSING ? this._connect() : (this._disconnect(e, n), this._connect());
  }
  /**
   * Enqueue specified data to be transmitted to the server over the WebSocket connection.
   *
   * @returns `true` if the message was transmitted immediately over an open
   * connection; `false` if it was buffered (sent when the connection next
   * opens — the buffer is always flushed before the `open` event is
   * dispatched) or dropped because `maxEnqueuedMessages` was reached.
   */
  send(e) {
    if (this._ws && this._ws.readyState === this.OPEN)
      return this._debug("send", e), this._ws.send(e), !0;
    this._closeCalled && !this._didWarnAboutClosedSend && (this._didWarnAboutClosedSend = !0, console.warn(
      "ReconnectingWebSocket: send() was called after close(). The message has been buffered, but it will only be delivered if reconnect() is called on this socket. If this socket has been discarded, the message is lost — this usually means a stale socket reference is being used."
    ));
    const { maxEnqueuedMessages: n = Ke.maxEnqueuedMessages } = this._options;
    return this._messageQueue.length < n && (this._debug("enqueue", e), this._messageQueue.push(e)), !1;
  }
  /**
   * Removes and returns all messages that were passed to send() but never
   * transmitted (they were buffered while the connection wasn't open).
   *
   * Useful when a socket is being discarded and replaced (e.g. the React
   * hooks recreate the socket when connection options change): the
   * replacement socket can re-send these messages, instead of them being
   * silently lost with the old instance.
   */
  drainQueuedMessages() {
    const e = this._messageQueue;
    return this._messageQueue = [], e;
  }
  _debug(...e) {
    this._options.debug && this._debugLogger("RWS>", ...e);
  }
  _getNextDelay() {
    const {
      reconnectionDelayGrowFactor: e = Ke.reconnectionDelayGrowFactor,
      minReconnectionDelay: n = Ke.minReconnectionDelay,
      maxReconnectionDelay: s = Ke.maxReconnectionDelay
    } = this._options;
    let r = 0;
    return this._retryCount > 0 && (r = n * e ** (this._retryCount - 1), r > s && (r = s)), this._debug("next delay", r), r;
  }
  _wait() {
    return new Promise((e) => {
      setTimeout(e, this._getNextDelay());
    });
  }
  _getNextProtocols(e) {
    if (!e) return Promise.resolve(null);
    if (typeof e == "string" || Array.isArray(e))
      return Promise.resolve(e);
    if (typeof e == "function") {
      const n = e();
      if (!n) return Promise.resolve(null);
      if (typeof n == "string" || Array.isArray(n))
        return Promise.resolve(n);
      if (n.then) return n;
    }
    throw Error("Invalid protocols");
  }
  _getNextUrl(e) {
    if (typeof e == "string") return Promise.resolve(e);
    if (typeof e == "function") {
      const n = e();
      if (typeof n == "string") return Promise.resolve(n);
      if (n.then) return n;
    }
    throw Error("Invalid URL");
  }
  _connect() {
    if (this._connectLock || !this._shouldReconnect) return;
    this._connectLock = !0;
    const {
      maxRetries: e = Ke.maxRetries,
      connectionTimeout: n = Ke.connectionTimeout
    } = this._options;
    if (this._retryCount >= e) {
      this._debug("max retries reached", this._retryCount, ">=", e), this._connectLock = !1;
      return;
    }
    this._retryCount++, this._debug("connect", this._retryCount), this._removeListeners(), this._wait().then(
      () => Promise.all([
        this._getNextUrl(this._url),
        this._getNextProtocols(this._protocols || null)
      ])
    ).then(([s, r]) => {
      if (this._closeCalled) {
        this._connectLock = !1;
        return;
      }
      !this._options.WebSocket && typeof WebSocket > "u" && !Cc && (console.error(`‼️ No WebSocket implementation available. You should define options.WebSocket. 

For example, if you're using node.js, run \`npm install ws\`, and then in your code:

import PartySocket from 'partysocket';
import WS from 'ws';

const partysocket = new PartySocket({
  host: "127.0.0.1:1999",
  room: "test-room",
  WebSocket: WS
});

`), Cc = !0);
      const i = this._options.WebSocket || WebSocket;
      this._debug("connect", {
        url: s,
        protocols: r
      }), this._ws = r ? new i(s, r) : new i(s), this._ws.binaryType = this._binaryType, this._connectLock = !1, this._addListeners(), this._connectTimeout = setTimeout(
        () => this._handleTimeout(),
        n
      );
    }).catch((s) => {
      this._connectLock = !1, this._handleError(new gr.ErrorEvent(Error(s.message), this));
    });
  }
  _handleTimeout() {
    this._debug("timeout event"), this._handleError(new gr.ErrorEvent(Error("TIMEOUT"), this));
  }
  _disconnect(e = 1e3, n) {
    if (this._clearTimeouts(), !!this._ws) {
      this._removeListeners();
      try {
        (this._ws.readyState === this.OPEN || this._ws.readyState === this.CONNECTING) && this._ws.close(e, n), this._handleClose(new gr.CloseEvent(e, n, this));
      } catch {
      }
    }
  }
  _acceptOpen() {
    this._debug("accept open"), this._retryCount = 0;
  }
  _handleOpen = (e) => {
    this._debug("open event");
    const { minUptime: n = Ke.minUptime } = this._options;
    clearTimeout(this._connectTimeout), this._uptimeTimeout = setTimeout(() => this._acceptOpen(), n), Ry(this._ws, "WebSocket is not defined"), this._ws.binaryType = this._binaryType, this._messageQueue.forEach((s) => {
      this._ws?.send(s);
    }), this._messageQueue = [], this.onopen && this.onopen(e), this.dispatchEvent(Bn(e));
  };
  _handleMessage = (e) => {
    this._debug("message event"), this.onmessage && this.onmessage(e), this.dispatchEvent(Bn(e));
  };
  _handleError = (e) => {
    this._debug("error event", e.message), this._disconnect(void 0, e.message === "TIMEOUT" ? "timeout" : void 0), this.onerror && this.onerror(e), this._debug("exec error listeners"), this.dispatchEvent(Bn(e)), this._connect();
  };
  _handleClose = (e) => {
    this._debug("close event"), this._clearTimeouts(), this._shouldReconnect && this._connect(), this.onclose && this.onclose(e), this.dispatchEvent(Bn(e));
  };
  _removeListeners() {
    this._ws && (this._debug("removeListeners"), this._ws.removeEventListener("open", this._handleOpen), this._ws.removeEventListener("close", this._handleClose), this._ws.removeEventListener("message", this._handleMessage), this._ws.removeEventListener("error", this._handleError), this._ws.addEventListener("error", Hy));
  }
  _addListeners() {
    this._ws && (this._debug("addListeners"), this._ws.addEventListener("open", this._handleOpen), this._ws.addEventListener("close", this._handleClose), this._ws.addEventListener("message", this._handleMessage), this._ws.addEventListener("error", this._handleError));
  }
  _clearTimeouts() {
    clearTimeout(this._connectTimeout), clearTimeout(this._uptimeTimeout);
  }
};
const By = (t) => t[1] !== null && t[1] !== void 0;
function Vy() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  let t = Date.now(), e = performance?.now && performance.now() * 1e3 || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(n) {
    let s = Math.random() * 16;
    return t > 0 ? (s = (t + s) % 16 | 0, t = Math.floor(t / 16)) : (s = (e + s) % 16 | 0, e = Math.floor(e / 16)), (n === "x" ? s : s & 3 | 8).toString(16);
  });
}
function Ql(t, e, n = {}) {
  const {
    host: s,
    path: r,
    protocol: i,
    room: o,
    party: c,
    basePath: a,
    prefix: l,
    query: u
  } = t;
  let h = s.replace(/^(http|https|ws|wss):\/\//, "");
  if (h.endsWith("/") && (h = h.slice(0, -1)), r?.startsWith("/"))
    throw new Error("path must not start with a slash");
  const d = c ?? "main", f = r ? `/${r}` : "", p = i || (h.startsWith("localhost:") || h.startsWith("127.0.0.1:") || h.startsWith("192.168.") || h.startsWith("10.") || h.startsWith("172.") && h.split(".")[1] >= "16" && h.split(".")[1] <= "31" || h.startsWith("[::ffff:7f00:1]:") ? e : `${e}s`), y = `${p}://${h}/${a || `${l || "parties"}/${d}/${o}`}${f}`, g = (C = {}) => `${y}?${new URLSearchParams([...Object.entries(n), ...Object.entries(C).filter(By)])}`, m = typeof u == "function" ? async () => g(await u()) : g(u);
  return {
    host: h,
    path: f,
    room: o,
    name: d,
    protocol: p,
    partyUrl: y,
    urlProvider: m
  };
}
var Ky = class extends zy {
  _pk;
  _pkurl;
  name;
  room;
  host;
  path;
  basePath;
  constructor(t) {
    const e = Sc(t);
    if (super(e.urlProvider, e.protocols, e.socketOptions), this.partySocketOptions = t, this.setWSProperties(e), !t.startClosed && !this.room && !this.basePath)
      throw this.close(), new Error(
        "Either room or basePath must be provided to connect. Use startClosed: true to create a socket and set them via updateProperties before calling reconnect()."
      );
    t.disableNameValidation || (t.party?.includes("/") && console.warn(
      `PartySocket: party name "${t.party}" contains forward slash which may cause routing issues. Consider using a name without forward slashes or set disableNameValidation: true to bypass this warning.`
    ), t.room?.includes("/") && console.warn(
      `PartySocket: room name "${t.room}" contains forward slash which may cause routing issues. Consider using a name without forward slashes or set disableNameValidation: true to bypass this warning.`
    ));
  }
  updateProperties(t) {
    const e = Sc({
      ...this.partySocketOptions,
      ...t,
      host: t.host ?? this.host,
      room: t.room ?? this.room,
      path: t.path ?? this.path,
      basePath: t.basePath ?? this.basePath
    });
    this._url = e.urlProvider, this._protocols = e.protocols, this._options = e.socketOptions, this.setWSProperties(e);
  }
  setWSProperties(t) {
    const { _pk: e, _pkurl: n, name: s, room: r, host: i, path: o, basePath: c } = t;
    this._pk = e, this._pkurl = n, this.name = s, this.room = r, this.host = i, this.path = o, this.basePath = c;
  }
  reconnect(t, e) {
    if (!this.host)
      throw new Error(
        "The host must be set before connecting, use `updateProperties` method to set it or pass it to the constructor."
      );
    if (!this.room && !this.basePath)
      throw new Error(
        "The room (or basePath) must be set before connecting, use `updateProperties` method to set it or pass it to the constructor."
      );
    super.reconnect(t, e);
  }
  get id() {
    return this._pk;
  }
  /**
   * Exposes the static PartyKit room URL without applying query parameters.
   * To access the currently connected WebSocket url, use PartySocket#url.
   */
  get roomUrl() {
    return this._pkurl;
  }
  static async fetch(t, e) {
    const n = Ql(t, "http"), s = typeof n.urlProvider == "string" ? n.urlProvider : await n.urlProvider();
    return (t.fetch ?? fetch)(s, e);
  }
};
function Sc(t) {
  const {
    id: e,
    host: n,
    path: s,
    party: r,
    room: i,
    protocol: o,
    query: c,
    protocols: a,
    ...l
  } = t, u = e || Vy(), h = Ql(t, "ws", { _pk: u });
  return {
    _pk: u,
    _pkurl: h.partyUrl,
    name: h.name,
    room: h.room,
    host: h.host,
    path: h.path,
    basePath: t.basePath,
    protocols: a,
    socketOptions: l,
    urlProvider: h.urlProvider
  };
}
const Wy = 1e3;
function Ht(t) {
  return t === Rl ? "identity" : Nl(t) ? "element" : Ul(t) ? "presence" : "cursor";
}
class Yy {
  constructor(e, n) {
    this.localConnectionId = n, this.unsubscribe = e.subscribe((s) => this.handleMessage(s)), this.sweepTimer = setInterval(() => {
      this.sweepExpired(Date.now());
    }, Wy);
  }
  peers = /* @__PURE__ */ new Map();
  listeners = {
    cursor: /* @__PURE__ */ new Set(),
    element: /* @__PURE__ */ new Set(),
    presence: /* @__PURE__ */ new Set(),
    identity: /* @__PURE__ */ new Set()
  };
  unsubscribe;
  sweepTimer = null;
  /** Remote peers keyed by connection id. Local state belongs to each view. */
  getPeers() {
    return this.peers;
  }
  /**
   * Subscribe to a namespace. The callback fires whenever a message touched that
   * namespace, and once immediately with the current snapshot (replay). Returns
   * an unsubscribe function.
   */
  subscribe(e, n) {
    return this.listeners[e].add(n), te(n, "peer store namespace"), () => {
      this.listeners[e].delete(n);
    };
  }
  destroy() {
    this.sweepTimer !== null && (clearInterval(this.sweepTimer), this.sweepTimer = null), this.unsubscribe();
    for (const e of Object.values(this.listeners)) e.clear();
  }
  handleMessage(e) {
    if (e.type === "presence-sync") {
      this.applySync(e.peers), this.pruneExpired(Date.now()), this.notify(/* @__PURE__ */ new Set(["cursor", "element", "presence", "identity"]));
      return;
    }
    if (e.type === "presence-changes") {
      const n = this.applyChanges(e);
      this.pruneExpired(Date.now(), n), n.size > 0 && this.notify(n);
    }
  }
  applySync(e) {
    this.peers.clear();
    for (const [n, s] of Object.entries(e))
      n !== this.localConnectionId && this.peers.set(n, { ...s });
  }
  applyChanges(e) {
    const n = /* @__PURE__ */ new Set();
    for (const [s, r] of Object.entries(e.updates)) {
      if (s === this.localConnectionId) {
        for (const o of Object.keys(r))
          n.add(Ht(o));
        continue;
      }
      const i = this.peers.get(s) ?? {};
      this.peers.set(s, i);
      for (const [o, c] of Object.entries(r))
        i[o] = c, n.add(Ht(o));
    }
    for (const [s, r] of Object.entries(e.removes)) {
      if (s === this.localConnectionId) {
        for (const o of r) n.add(Ht(o));
        continue;
      }
      const i = this.peers.get(s);
      if (i) {
        for (const o of r)
          o in i && (delete i[o], n.add(Ht(o)));
        Object.keys(i).length === 0 && this.peers.delete(s);
      }
    }
    return n;
  }
  notify(e) {
    const n = /* @__PURE__ */ new Set();
    for (const s of e)
      for (const r of this.listeners[s])
        n.has(r) || (n.add(r), te(r, "peer store namespace"));
  }
  /** Periodic sweep for peers that went silent: prune expired channels and
   * notify only the namespaces that actually lost one (no-op when nothing
   * expired, so a quiet room never re-fires callbacks). */
  sweepExpired(e) {
    const n = /* @__PURE__ */ new Set();
    this.pruneExpired(e, n), n.size > 0 && this.notify(n);
  }
  /**
   * Delete every peer channel whose stamped `at` has aged past the staleness
   * window, recording the touched namespaces into `touched`. Never removes a
   * peer wholesale for having only unstamped channels (identity persists) —
   * only prunes a now-empty peer row. Unstamped channels (identity) are always
   * live, so they are never swept. This is the single implementation of
   * client-side staleness for cursor, element, and presence views.
   */
  pruneExpired(e, n = /* @__PURE__ */ new Set()) {
    for (const [s, r] of this.peers) {
      for (const [i, o] of Object.entries(r))
        fy(o, e, Bs) || (delete r[i], n.add(Ht(i)));
      Object.keys(r).length === 0 && this.peers.delete(s);
    }
    return n;
  }
}
const qy = 1, Gy = 3, Jy = 15e3, Xy = 5e3;
class eu {
  socket;
  room;
  listeners = /* @__PURE__ */ new Set();
  latestJoin = null;
  channelValues = /* @__PURE__ */ new Map();
  // One peer-folding layer per socket, shared by every consumer (cursors,
  // element awareness, page presence). It subscribes to this transport's raw
  // message stream and exposes per-namespace subscriptions + the folded peers.
  peers;
  // Observability state (see PresenceConnectionState). Internal, for tests/debug.
  _connectionState = "connecting";
  hasEverOpened = !1;
  failedReconnects = 0;
  unreachableLogged = !1;
  unreachableTimer = null;
  lastControlLogAt = /* @__PURE__ */ new Map();
  usesHandlerProperties = !1;
  onMessage = (e) => {
    const n = Zy(e.data);
    if (n) {
      this.handleControlMessage(n);
      for (const s of this.listeners)
        te(() => s(n), "presence transport listener");
    }
  };
  onOpen = () => {
    this._connectionState = "open", this.hasEverOpened = !0, this.failedReconnects = 0, this.unreachableLogged = !1, this.unreachableTimer !== null && (clearTimeout(this.unreachableTimer), this.unreachableTimer = null), this.flushCurrentState();
  };
  onCloseOrError = () => {
    this._connectionState !== "open" && (this.failedReconnects += 1), this._connectionState !== "unreachable" && (this._connectionState = "connecting"), this.failedReconnects >= Gy && this.markUnreachable();
  };
  constructor(e) {
    this.room = e.room;
    const n = e.socketFactory ?? ((s) => new Ky(s));
    this.socket = n({
      host: e.host,
      room: e.room,
      party: "presence",
      maxEnqueuedMessages: 0
    }), Ec(this.socket) ? (this.socket.onmessage = this.onMessage, this.socket.onopen = this.onOpen, this.socket.onclose = this.onCloseOrError, this.socket.onerror = this.onCloseOrError, this.usesHandlerProperties = !0) : (this.socket.addEventListener("message", this.onMessage), this.socket.addEventListener("open", this.onOpen), this.socket.addEventListener("close", this.onCloseOrError), this.socket.addEventListener("error", this.onCloseOrError)), this.unreachableTimer = setTimeout(() => {
      this.unreachableTimer = null, this.hasEverOpened || this.markUnreachable();
    }, Jy), this.peers = new Yy(this, this.socket.id);
  }
  /** Observability flag: whether the realtime socket is connecting, open, or
   * has been declared unreachable. Never gates behavior — for tests/debugging. */
  get connectionState() {
    return this._connectionState;
  }
  markUnreachable() {
    this.unreachableLogged || (this.unreachableLogged = !0, this._connectionState = "unreachable", console.error(
      `[playhtml] presence transport unreachable — realtime presence degraded (room ${this.room}). Cursors, element awareness, and custom presence will not sync until the connection recovers.`
    ));
  }
  /**
   * Base handling of server control messages, on EVERY socket (not just the
   * cursor client's). Consumers still layer their own reactions (e.g. the cursor
   * client's hz pacing) via subscribe(); this only guarantees rejections, the
   * channel cap, and force-close loops are never fully silent. Logging is
   * rate-limited per event type so a loop can't spam the console.
   */
  handleControlMessage(e) {
    e.type === "presence-error" ? this.logControl(
      "presence-error",
      () => console.warn(
        `[playhtml] presence server rejected a message (room ${this.room}):`,
        e.message
      )
    ) : e.type === "presence-rate" && this.logControl(
      "presence-rate",
      () => console.warn(
        `[playhtml] presence channel "${e.channel}" is rate-limited to ${e.hz}Hz (room ${this.room}).`
      )
    );
  }
  logControl(e, n) {
    const s = Date.now(), r = this.lastControlLogAt.get(e) ?? 0;
    s - r < Xy || (this.lastControlLogAt.set(e, s), n());
  }
  join(e) {
    const n = Ue(e), s = {
      type: "presence-join",
      identity: n.identity,
      page: n.page
    };
    or(s), this.latestJoin = n, this.sendIfOpen(s);
  }
  update(e, n) {
    const s = Ue(n), r = {
      type: "presence-update",
      channel: e,
      value: s
    };
    or(r), this.channelValues.set(e, s), this.sendIfOpen(r);
  }
  clear(e) {
    this.channelValues.delete(e), this.sendIfOpen({
      type: "presence-clear",
      channel: e
    });
  }
  subscribe(e) {
    return this.listeners.add(e), () => {
      this.listeners.delete(e);
    };
  }
  destroy() {
    this.unreachableTimer !== null && (clearTimeout(this.unreachableTimer), this.unreachableTimer = null), this.peers.destroy(), this.usesHandlerProperties && Ec(this.socket) ? (this.socket.onmessage === this.onMessage && (this.socket.onmessage = null), this.socket.onopen === this.onOpen && (this.socket.onopen = null), this.socket.onclose === this.onCloseOrError && (this.socket.onclose = null), this.socket.onerror === this.onCloseOrError && (this.socket.onerror = null)) : (this.socket.removeEventListener(
      "message",
      this.onMessage
    ), this.socket.removeEventListener("open", this.onOpen), this.socket.removeEventListener("close", this.onCloseOrError), this.socket.removeEventListener("error", this.onCloseOrError)), this.socket.close(), this.listeners.clear();
  }
  flushCurrentState() {
    this.latestJoin && this.sendIfOpen({
      type: "presence-join",
      identity: this.latestJoin.identity,
      page: this.latestJoin.page
    });
    for (const [e, n] of this.channelValues)
      this.sendIfOpen({
        type: "presence-update",
        channel: e,
        value: n
      });
  }
  sendIfOpen(e) {
    or(e), this.isSocketOpen() && this.socket.send(JSON.stringify(e));
  }
  isSocketOpen() {
    return this.socket.readyState === void 0 || this.socket.readyState === qy;
  }
}
function Ec(t) {
  return "onmessage" in t && "onopen" in t && "onclose" in t && "onerror" in t;
}
function Zy(t) {
  if (typeof t != "string") return null;
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return null;
  }
  if (!j(e)) return null;
  switch (e.type) {
    case "presence-sync":
      return gc(e.peers) ? e : null;
    case "presence-changes":
      return gc(e.updates) && yy(e.removes) ? e : null;
    case "presence-rate":
      return typeof e.channel == "string" && typeof e.hz == "number" ? e : null;
    case "presence-error":
      return typeof e.message == "string" ? e : null;
    default:
      return null;
  }
}
const _c = `${ji}shard:`, tu = 1, zt = 8, Qy = 1100;
class em {
  transport;
  getIdentity;
  getPage;
  onAwareness;
  onAwarenessChange;
  localTags = /* @__PURE__ */ new Map();
  currentAwareness = /* @__PURE__ */ new Map();
  publishedChannels = /* @__PURE__ */ new Set();
  // Shard channels whose clear may not have reached the server yet. A dropped
  // clear is otherwise permanent: publishedChannels is updated immediately, so a
  // later publish wouldn't re-issue it. Held until a trailing republish re-sends.
  pendingClears = /* @__PURE__ */ new Set();
  unsubscribe;
  stopKeepalive;
  publishScheduled = !1;
  republishTimer = null;
  destroyed = !1;
  lastAwarenessFingerprint = "";
  localStableId;
  constructor(e) {
    this.transport = e.transport, this.getIdentity = e.getIdentity, this.getPage = e.getPage, this.onAwareness = e.onAwareness, this.onAwarenessChange = e.onAwarenessChange, this.localStableId = this.getIdentity().publicKey;
    const n = () => this.emit(), s = this.transport.peers.subscribe("element", n), r = this.transport.peers.subscribe("identity", n);
    this.unsubscribe = () => {
      s(), r();
    }, this.stopKeepalive = Fl(() => {
      this.destroyed || this.localTags.size === 0 || this.publishLocalAwareness();
    }), this.join();
  }
  setLocalAwareness(e, n, s) {
    this.stageLocalAwareness(e, n, s) && (this.schedulePublish(), this.emitLocalAwareness(e, n));
  }
  /**
   * Sets many elements' awareness at once, coalescing into a single publish
   * while delivering each changed element once. Used to reseed retained
   * handlers after a room change without a full-shard publish per element.
   */
  setLocalAwarenessBatch(e) {
    const n = [];
    for (const [s, r, i] of e)
      this.stageLocalAwareness(s, r, i) && n.push([s, r]);
    if (n.length !== 0) {
      this.schedulePublish();
      for (const [s, r] of n)
        this.emitLocalAwareness(s, r);
    }
  }
  /** Stages a local write into localTags; returns true if it changed. */
  stageLocalAwareness(e, n, s) {
    const r = this.localTags.get(e);
    return r ? r[n] === s ? !1 : (r[n] = s, !0) : (this.localTags.set(e, { [n]: s }), !0);
  }
  removeLocalAwareness(e, n) {
    const s = this.localTags.get(e);
    !s || !(n in s) || (delete s[n], Object.keys(s).length === 0 && this.localTags.delete(e), this.schedulePublish(), this.emitLocalAwareness(e, n));
  }
  getLocalAwareness(e, n) {
    return this.localTags.get(e)?.[n];
  }
  getAwareness(e, n) {
    return this.currentAwareness.get(`${e}:${n}`);
  }
  refresh() {
    this.emit();
  }
  destroy() {
    this.destroyed = !0, this.republishTimer !== null && (clearTimeout(this.republishTimer), this.republishTimer = null), this.stopKeepalive(), this.unsubscribe();
  }
  /**
   * Coalesce publishes: multiple local writes in one tick collapse into a single
   * shard-set publish on the next microtask. Bursts (e.g. every element on a
   * heavy page initializing at once) thus cost one publish, not O(N).
   */
  schedulePublish() {
    this.publishScheduled || this.destroyed || (this.publishScheduled = !0, queueMicrotask(() => {
      this.publishScheduled = !1, !this.destroyed && (this.onAwarenessChange && (this.lastAwarenessFingerprint = this.fingerprintCurrentAwareness(
        this.currentAwareness
      )), this.publishLocalAwareness(), this.scheduleRepublish());
    }));
  }
  /**
   * After a publish, re-send the latest snapshot once things quiet down. The
   * server drops updates past its per-connection budget under a burst and never
   * tells us which; a single trailing re-publish re-sends whatever was dropped.
   */
  scheduleRepublish() {
    this.destroyed || (this.republishTimer !== null && clearTimeout(this.republishTimer), this.republishTimer = setTimeout(() => {
      if (this.republishTimer = null, !this.destroyed) {
        for (const e of this.pendingClears)
          ws(this.transport, e, "element awareness");
        this.pendingClears.clear(), this.publishLocalAwareness();
      }
    }, Qy));
  }
  join() {
    try {
      this.transport.join({
        identity: this.getIdentity(),
        page: this.getPage()
      });
    } catch (e) {
      console.warn("[playhtml] Failed to join element awareness room:", e);
    }
  }
  publishLocalAwareness() {
    const e = /* @__PURE__ */ new Set(), n = nm(this.localTags), s = n.slice(0, zt);
    if (n.length > zt) {
      const r = rm(
        n.slice(zt)
      );
      console.error(
        `[playhtml] Element awareness exceeded ${zt} shards (~${zt * fs} bytes); dropping overflow so under-budget elements keep syncing. Affected tags: ${r.join(", ")}.`
      );
    }
    for (let r = 0; r < s.length; r += 1) {
      const i = `${_c}${r}`;
      Hl(
        this.transport,
        i,
        // Each shard already carries an `at` stamp (createElementPresenceShard)
        // so it ages out client-side if this peer disconnects ungracefully.
        s[r],
        "element awareness"
      ) && e.add(i), this.pendingClears.delete(i);
    }
    for (const r of this.publishedChannels)
      e.has(r) || (this.pendingClears.add(r), ws(this.transport, r, "element awareness"));
    this.publishedChannels = e;
  }
  emit() {
    const e = this.buildElementAwareness(), n = this.fingerprintCurrentAwareness(e);
    n !== this.lastAwarenessFingerprint && (this.lastAwarenessFingerprint = n, this.currentAwareness = e, this.onAwareness(e));
  }
  fingerprintCurrentAwareness(e) {
    const n = tm(e), s = /* @__PURE__ */ new Set();
    for (const c of e.values())
      for (const a of c.byStableId.keys())
        s.add(a);
    const r = [], i = this.getIdentity();
    s.has(i.publicKey) && r.push(
      `${i.publicKey}:${JSON.stringify(i)}`
    );
    const o = this.transport.peers.getPeers();
    for (const c of Array.from(o.keys()).sort()) {
      const a = o.get(c);
      if (!a) continue;
      const l = Hr(a) ?? c;
      s.has(l) && r.push(
        `${l}:${JSON.stringify(a.identity ?? null)}`
      );
    }
    return `${n}|${r.sort().join("|")}`;
  }
  emitLocalAwareness(e, n) {
    if (!this.onAwarenessChange) {
      this.emit();
      return;
    }
    const s = `${e}:${n}`, r = this.currentAwareness.get(s), i = this.getIdentity().publicKey;
    if (i !== this.localStableId) {
      this.localStableId = i, this.emit();
      return;
    }
    const o = /* @__PURE__ */ new Map(), c = this.localTags.get(e);
    c && n in c && o.set(i, c[n]);
    for (const [l, u] of r?.byStableId ?? [])
      l === this.localStableId || l === i || o.set(l, u);
    if (o.size === 0) {
      this.currentAwareness.delete(s), this.onAwarenessChange(s, void 0);
      return;
    }
    const a = {
      array: Array.from(o.values()),
      byStableId: o
    };
    this.currentAwareness.set(s, a), this.onAwarenessChange(s, a);
  }
  buildElementAwareness() {
    const e = /* @__PURE__ */ new Map(), n = this.getIdentity().publicKey;
    for (const [r, i] of this.localTags)
      for (const [o, c] of Object.entries(i))
        Br(e, r, o, c, n);
    const s = this.transport.peers.getPeers();
    for (const r of Array.from(s.keys()).sort()) {
      const i = s.get(r), o = Hr(i);
      if (o === n) continue;
      const c = o ?? r;
      for (const [a, l] of Object.entries(i))
        if (Nl(a)) {
          if (a.startsWith(_c))
            im(e, l, c);
          else if (j(l)) {
            const u = a.slice(ji.length);
            for (const [h, d] of Object.entries(l))
              Br(e, u, h, d, c);
          }
        }
    }
    return e;
  }
}
function tm(t) {
  const e = [];
  for (const n of Array.from(t.keys()).sort()) {
    const s = t.get(n);
    for (const r of Array.from(s.byStableId.keys()).sort()) {
      let i;
      try {
        i = JSON.stringify(s.byStableId.get(r)) ?? "null";
      } catch {
        i = "null";
      }
      e.push(`${n}:${r}:${i}`);
    }
  }
  return e.join("|");
}
function Br(t, e, n, s, r) {
  const i = `${e}:${n}`;
  let o = t.get(i);
  o || (o = { array: [], byStableId: /* @__PURE__ */ new Map() }, t.set(i, o)), o.array.push(s), o.byStableId.set(r, s);
}
function nm(t) {
  const e = [];
  let n = [];
  for (const s of sm(t)) {
    const r = [...n, s];
    n.length > 0 && jl(yr(r)) > fs ? (e.push(yr(n)), n = [s]) : n = r;
  }
  return n.length > 0 && e.push(yr(n)), e;
}
function sm(t) {
  const e = [];
  for (const n of Array.from(t.keys()).sort()) {
    const s = t.get(n);
    for (const r of Object.keys(s).sort())
      e.push([n, r, s[r]]);
  }
  return e;
}
function yr(t) {
  return {
    v: tu,
    // Stamp the publish time here (not at send) so shard sizing accounts for the
    // `at` field and a near-4KB shard can't tip over the cap once stamped. The
    // exact value doesn't affect byte length (always a ~13-digit epoch ms).
    at: Date.now(),
    entries: t
  };
}
function rm(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    for (const [s] of n.entries) e.add(s);
  return Array.from(e).sort();
}
function im(t, e, n) {
  if (om(e))
    for (const s of e.entries) {
      const [r, i, o] = s;
      Br(t, r, i, o, n);
    }
}
function om(t) {
  return !j(t) || t.v !== tu || !Array.isArray(t.entries) ? !1 : t.entries.every(
    (e) => Array.isArray(e) && e.length === 3 && typeof e[0] == "string" && typeof e[1] == "string"
  );
}
const cm = 1100;
class nu {
  transport;
  getIdentity;
  getPage;
  getCursorPresences;
  onCursorPresencesChange;
  localChannels = /* @__PURE__ */ new Map();
  // Wire channels whose clear may not have reached the server yet (a dropped
  // clear is otherwise permanent: localChannels no longer holds the value, so
  // the trailing republish wouldn't re-send it). Cleared channels are held here
  // until a trailing republish re-issues the clear.
  pendingClears = /* @__PURE__ */ new Set();
  listeners = /* @__PURE__ */ new Map();
  nextListenerId = 0;
  unsubscribe;
  stopKeepalive;
  republishTimer = null;
  destroyed = !1;
  constructor(e) {
    this.transport = e.transport, this.getIdentity = e.getIdentity, this.getPage = e.getPage, this.getCursorPresences = e.getCursorPresences, this.onCursorPresencesChange = e.onCursorPresencesChange;
    const n = () => this.emit(), s = this.transport.peers.subscribe("presence", n), r = this.transport.peers.subscribe("identity", n);
    this.unsubscribe = () => {
      s(), r();
    }, this.stopKeepalive = Fl(() => {
      this.destroyed || this.localChannels.size === 0 || this.republishLiveChannels();
    }), this.join();
  }
  setMyPresence(e, n) {
    if (ur(e))
      throw new Error(
        `[playhtml] "${e}" is a reserved presence field and cannot be used as a channel name. playerIdentity, cursor, and isMe are populated by playhtml; choose a different channel name.`
      );
    const s = hr(e);
    if (n == null) {
      if (!this.localChannels.has(e) && this.pendingClears.has(s))
        return;
      this.localChannels.delete(e), this.pendingClears.add(s), ws(this.transport, s, "presence");
    } else
      this.localChannels.set(e, n), this.pendingClears.delete(s), this.publishChannel(e, n);
    this.scheduleRepublish(), this.emit();
  }
  /** Publish a live channel wrapped in the staleness envelope ({at, value}). */
  publishChannel(e, n) {
    Hl(
      this.transport,
      hr(e),
      py(n),
      "presence"
    );
  }
  getPresences() {
    return this.buildPresences();
  }
  onPresenceChange(e, n) {
    if (e === "cursor" && this.onCursorPresencesChange) {
      const r = this.onCursorPresencesChange(() => {
        n(this.buildPresences());
      });
      return te(() => n(this.buildPresences()), "presence subscriber"), r ?? (() => {
      });
    }
    const s = String(this.nextListenerId++);
    return this.listeners.set(s, {
      channel: e,
      callback: n,
      lastFingerprint: this.channelFingerprint(e)
    }), te(() => n(this.buildPresences()), "presence subscriber"), () => {
      this.listeners.delete(s);
    };
  }
  getMyIdentity() {
    return this.getIdentity();
  }
  destroy() {
    this.destroyed = !0, this.republishTimer !== null && (clearTimeout(this.republishTimer), this.republishTimer = null), this.stopKeepalive(), this.unsubscribe();
  }
  /**
   * After a publish burst settles, re-send the latest value of every live
   * channel once, recovering anything the server dropped over its rate budget.
   */
  scheduleRepublish() {
    this.destroyed || (this.republishTimer !== null && clearTimeout(this.republishTimer), this.republishTimer = setTimeout(() => {
      if (this.republishTimer = null, !this.destroyed) {
        this.republishLiveChannels();
        for (const e of this.pendingClears)
          ws(this.transport, e, "presence");
        this.pendingClears.clear();
      }
    }, cm));
  }
  /** Re-send every live channel with a fresh timestamp. Shared by the burst
   * recovery (scheduleRepublish) and the keepalive re-stamp. */
  republishLiveChannels() {
    for (const [e, n] of this.localChannels)
      this.publishChannel(e, n);
  }
  join() {
    try {
      this.transport.join({
        identity: this.getIdentity(),
        page: this.getPage()
      });
    } catch (e) {
      console.warn("[playhtml] Failed to join presence room:", e);
    }
  }
  /** The shared PeerStore's folded peer map. Views read all channels and filter
   * to the presence + identity namespaces they care about. */
  get peers() {
    return this.transport.peers.getPeers();
  }
  emit() {
    if (this.listeners.size === 0) return;
    let e = null;
    const n = () => (e || (e = this.buildPresences()), e);
    for (const s of this.listeners.values()) {
      const r = this.channelFingerprint(s.channel);
      if (r === s.lastFingerprint) continue;
      te(
        () => s.callback(n()),
        "presence subscriber"
      ) && (s.lastFingerprint = r);
    }
  }
  /** Fingerprint of one channel and its participants' identities, so a listener
   * follows identity changes as well as channel values. Fingerprints the UNWRAPPED
   * payload so a keepalive re-stamp (which only bumps the envelope `at`) does
   * not count as a change and re-fire subscribers. */
  channelFingerprint(e) {
    const n = [`self-identity:${Vn(this.getIdentity())}`];
    this.localChannels.has(e) && n.push(`self:${Vn(this.localChannels.get(e))}`);
    const s = hr(e);
    for (const r of Array.from(this.peers.keys()).sort()) {
      const i = this.peers.get(r), o = i[s];
      o !== void 0 && n.push(`${r}:${Vn(i.identity)}:${Vn(pc(o))}`);
    }
    return n.join("|");
  }
  buildPresences() {
    const e = /* @__PURE__ */ new Map(), n = this.getIdentity().publicKey;
    e.set(n, this.buildSelfView());
    for (const s of Array.from(this.peers.keys()).sort()) {
      const r = this.peers.get(s), i = r.identity, o = Hr(r);
      if (o === n) continue;
      const c = o ?? s, a = e.get(c) ?? {
        playerIdentity: j(i) ? i : void 0,
        cursor: null,
        isMe: !1
      };
      !a.playerIdentity && j(i) && (a.playerIdentity = i);
      for (const [l, u] of Object.entries(r)) {
        if (!Ul(l)) continue;
        const h = uy(l);
        ur(h) || (a[h] = pc(u));
      }
      e.set(c, a);
    }
    return this.mergeCursorPresences(e, n), e;
  }
  buildSelfView() {
    const e = {
      playerIdentity: this.getIdentity(),
      cursor: null,
      isMe: !0
    };
    for (const [n, s] of this.localChannels)
      ur(n) || (e[n] = s);
    return e;
  }
  mergeCursorPresences(e, n) {
    const s = this.getCursorPresences?.();
    if (s)
      for (const [r, i] of s) {
        const o = e.get(r);
        e.set(r, {
          ...o,
          playerIdentity: i.playerIdentity ?? o?.playerIdentity,
          cursor: i.cursor ?? null,
          isMe: r === n
        });
      }
  }
}
function Vn(t) {
  try {
    return JSON.stringify(t ?? null);
  } catch {
    return "null";
  }
}
class am {
  inner;
  subscriptions = /* @__PURE__ */ new Map();
  nextSubscriptionId = 0;
  constructor(e) {
    this.inner = e;
  }
  /** Swap the delegate, re-attaching every active subscription to it. */
  setInner(e) {
    if (e !== this.inner) {
      this.inner = e;
      for (const n of this.subscriptions.values()) {
        try {
          n.innerUnsub();
        } catch {
        }
        let s = () => {
        };
        te(() => {
          s = e.onPresenceChange(
            n.channel,
            n.callback
          );
        }, "presence facade re-attach"), n.innerUnsub = s;
      }
    }
  }
  setMyPresence(e, n) {
    this.inner.setMyPresence(e, n);
  }
  getPresences() {
    return this.inner.getPresences();
  }
  onPresenceChange(e, n) {
    const s = this.nextSubscriptionId++, r = this.inner.onPresenceChange(e, n);
    return this.subscriptions.set(s, { channel: e, callback: n, innerUnsub: r }), () => {
      const i = this.subscriptions.get(s);
      if (i) {
        this.subscriptions.delete(s);
        try {
          i.innerUnsub();
        } catch {
        }
      }
    };
  }
  getMyIdentity() {
    return this.inner.getMyIdentity();
  }
}
class lm {
  pendingChanges = [];
  cancelFlush = null;
  getDoc;
  constructor(e) {
    this.getDoc = e;
  }
  queue(e) {
    this.pendingChanges.push({ targetDoc: this.getDoc(), apply: e }), this.requestFlush();
  }
  clear() {
    this.cancelFlush && (this.cancelFlush(), this.cancelFlush = null), this.pendingChanges = [];
  }
  flush() {
    this.cancelFlush = null;
    const e = this.pendingChanges;
    if (this.pendingChanges = [], !e.length)
      return;
    const n = /* @__PURE__ */ new Map();
    for (const s of e) {
      const r = n.get(s.targetDoc) ?? [];
      r.push(s.apply), n.set(s.targetDoc, r);
    }
    for (const [s, r] of n)
      s.transact(() => {
        for (const i of r)
          i();
      });
  }
  requestFlush() {
    if (this.cancelFlush)
      return;
    const e = () => this.flush();
    if (typeof window.requestAnimationFrame == "function") {
      const s = window.requestAnimationFrame(e);
      this.cancelFlush = () => window.cancelAnimationFrame(s);
      return;
    }
    const n = window.setTimeout(e, 0);
    this.cancelFlush = () => window.clearTimeout(n);
  }
}
function um(t, e) {
  if (t.host || t.protocol !== "about:") return t.host;
  try {
    return new URL(e).host;
  } catch {
    return t.host;
  }
}
const zi = { ATTRIBUTE: 1, CHILD: 2 }, Bi = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Vi = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, n, s) {
    this._$Ct = e, this._$AM = n, this._$Ci = s;
  }
  _$AS(e, n) {
    return this.update(e, n);
  }
  update(e, n) {
    return this.render(...n);
  }
};
const { I: hm } = qg, Ac = (t) => t, kc = () => document.createComment(""), Bt = (t, e, n) => {
  const s = t._$AA.parentNode, r = e === void 0 ? t._$AB : e._$AA;
  if (n === void 0) {
    const i = s.insertBefore(kc(), r), o = s.insertBefore(kc(), r);
    n = new hm(i, o, t, t.options);
  } else {
    const i = n._$AB.nextSibling, o = n._$AM, c = o !== t;
    if (c) {
      let a;
      n._$AQ?.(t), n._$AM = t, n._$AP !== void 0 && (a = t._$AU) !== o._$AU && n._$AP(a);
    }
    if (i !== r || c) {
      let a = n._$AA;
      for (; a !== i; ) {
        const l = Ac(a).nextSibling;
        Ac(s).insertBefore(a, r), a = l;
      }
    }
  }
  return n;
}, We = (t, e, n = t) => (t._$AI(e, n), t), dm = {}, fm = (t, e = dm) => t._$AH = e, pm = (t) => t._$AH, mr = (t) => {
  t._$AR(), t._$AA.remove();
};
const xc = (t, e, n) => {
  const s = /* @__PURE__ */ new Map();
  for (let r = e; r <= n; r++) s.set(t[r], r);
  return s;
}, u0 = Bi(class extends Vi {
  constructor(t) {
    if (super(t), t.type !== zi.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, n) {
    let s;
    n === void 0 ? n = e : e !== void 0 && (s = e);
    const r = [], i = [];
    let o = 0;
    for (const c of t) r[o] = s ? s(c, o) : o, i[o] = n(c, o), o++;
    return { values: i, keys: r };
  }
  render(t, e, n) {
    return this.dt(t, e, n).values;
  }
  update(t, [e, n, s]) {
    const r = pm(t), { values: i, keys: o } = this.dt(e, n, s);
    if (!Array.isArray(r)) return this.ut = o, i;
    const c = this.ut ??= [], a = [];
    let l, u, h = 0, d = r.length - 1, f = 0, p = i.length - 1;
    for (; h <= d && f <= p; ) if (r[h] === null) h++;
    else if (r[d] === null) d--;
    else if (c[h] === o[f]) a[f] = We(r[h], i[f]), h++, f++;
    else if (c[d] === o[p]) a[p] = We(r[d], i[p]), d--, p--;
    else if (c[h] === o[p]) a[p] = We(r[h], i[p]), Bt(t, a[p + 1], r[h]), h++, p--;
    else if (c[d] === o[f]) a[f] = We(r[d], i[f]), Bt(t, r[h], r[d]), d--, f++;
    else if (l === void 0 && (l = xc(o, f, p), u = xc(c, h, d)), l.has(c[h])) if (l.has(c[d])) {
      const y = u.get(o[f]), g = y !== void 0 ? r[y] : null;
      if (g === null) {
        const m = Bt(t, r[h]);
        We(m, i[f]), a[f] = m;
      } else a[f] = We(g, i[f]), Bt(t, r[h], g), r[y] = null;
      f++;
    } else mr(r[d]), d--;
    else mr(r[h]), h++;
    for (; f <= p; ) {
      const y = Bt(t, a[p + 1]);
      We(y, i[f]), a[f++] = y;
    }
    for (; h <= d; ) {
      const y = r[h++];
      y !== null && mr(y);
    }
    return this.ut = o, fm(t, a), Fe;
  }
});
const h0 = Bi(class extends Vi {
  constructor(t) {
    if (super(t), t.type !== zi.ATTRIBUTE || t.name !== "class" || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return " " + Object.keys(t).filter((e) => t[e]).join(" ") + " ";
  }
  update(t, [e]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), t.strings !== void 0 && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in e) e[s] && !this.nt?.has(s) && this.st.add(s);
      return this.render(e);
    }
    const n = t.element.classList;
    for (const s of this.st) s in e || (n.remove(s), this.st.delete(s));
    for (const s in e) {
      const r = !!e[s];
      r === this.st.has(s) || this.nt?.has(s) || (r ? (n.add(s), this.st.add(s)) : (n.remove(s), this.st.delete(s)));
    }
    return Fe;
  }
});
const su = "important", gm = " !" + su, d0 = Bi(class extends Vi {
  constructor(t) {
    if (super(t), t.type !== zi.ATTRIBUTE || t.name !== "style" || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t) {
    return Object.keys(t).reduce((e, n) => {
      const s = t[n];
      return s == null ? e : e + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
    }, "");
  }
  update(t, [e]) {
    const { style: n } = t.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(e)), this.render(e);
    for (const s of this.ft) e[s] == null && (this.ft.delete(s), s.includes("-") ? n.removeProperty(s) : n[s] = null);
    for (const s in e) {
      const r = e[s];
      if (r != null) {
        this.ft.add(s);
        const i = typeof r == "string" && r.endsWith(gm);
        s.includes("-") || i ? n.setProperty(s, i ? r.slice(0, -11) : r, i ? su : "") : n[s] = r;
      }
    }
    return Fe;
  }
}), ym = "api.playhtml.fun", mm = "api-staging.playhtml.fun";
function wm(t) {
  if (t)
    return t;
  const e = window.location.hostname;
  return e.includes("staging") || e.includes("ngrok-free") ? mm : ym;
}
let X = Tl({ play: {} }), ct = Ll(X), ru = Jl(X.play), Vr = null;
function iu({ includeSearch: t }) {
  const e = window.location.pathname.replace(/\.[^/.]+$/, "");
  return t ? e + window.location.search : e;
}
function Kn(t) {
  return t.replace(/\.[^/.]+$/, "");
}
function ou(t) {
  const e = {
    domain: Tt(),
    pathname: window.location.pathname,
    search: window.location.search
  };
  if (typeof t == "function") {
    const n = t(e);
    return n && n.startsWith("/") ? Kn(n) : n;
  }
  switch (t) {
    case "page":
      return Kn(e.pathname);
    case "domain":
      return "";
    case "section":
      return `/${Kn(e.pathname).split("/").filter(Boolean)[0] || ""}`;
    default:
      return Kn(e.pathname);
  }
}
function gn(t, e) {
  const n = sg(t), s = e === "" ? n : `${n}-${e}`;
  return encodeURIComponent(s);
}
function Tt() {
  return um(window.location, document.referrer);
}
let G, le = null, yt = "", yn = null, P = null, Kr = null, vs = null;
const at = {
  subscribers: /* @__PURE__ */ new Set(),
  feedUnsub: null,
  getPresences() {
    return le?.getCursorPresences() ?? /* @__PURE__ */ new Map();
  },
  subscribe(t) {
    return this.subscribers.add(t), () => {
      this.subscribers.delete(t);
    };
  },
  notify(t) {
    for (const e of this.subscribers)
      te(() => e(t), "cursor presence subscriber");
  },
  // Point the hub at a freshly built cursor client: drop the previous feed and
  // forward the new client's presence changes to hub subscribers.
  connect(t) {
    this.feedUnsub?.(), this.feedUnsub = t.onCursorPresencesChange((e) => {
      this.notify(e);
    });
  },
  disconnect() {
    this.feedUnsub?.(), this.feedUnsub = null;
  }
};
function lt() {
  return P?.getIdentity() ?? ty();
}
const Pe = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map(), cu = /* @__PURE__ */ new Map(), au = /* @__PURE__ */ new Map(), Cs = /* @__PURE__ */ new Set(), et = /* @__PURE__ */ new Map(), Wr = /* @__PURE__ */ new Set();
function bm(t) {
  const e = t.getAttribute("data-source");
  if (!e) return;
  let n, s, r;
  try {
    ({ domain: n, path: s, elementId: r } = gl(e));
  } catch {
    return;
  }
  const i = `${n}${s}#${r}`;
  if (!Wr.has(i) && (Wr.add(i), G?.wsconnected))
    try {
      const o = { domain: n, path: s, elementId: r };
      G.sendMessage(
        JSON.stringify({
          type: "add-shared-reference",
          reference: o
        })
      ), G.sendMessage(
        JSON.stringify({
          type: "export-permissions",
          elementIds: [r]
        })
      );
    } catch (o) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared reference:",
        o
      );
    }
}
function vm(t) {
  if (!t.id) return;
  const e = t.id, n = t.getAttribute("shared");
  let s = "read-write";
  if (n && n !== "") {
    const r = n.toLowerCase();
    (r.includes("read-only") || r === "ro") && (s = "read-only");
  }
  if (Wl(e, s), G?.wsconnected)
    try {
      const r = {
        elementId: e,
        permissions: s,
        path: window.location.pathname
      };
      G.sendMessage(
        JSON.stringify({
          type: "register-shared-element",
          element: r
        })
      );
    } catch (r) {
      console.warn(
        "[PLAYHTML] Failed to notify server of new shared element:",
        r
      );
    }
}
function lu(t, e, n) {
  Pe.has(t) || Pe.set(t, /* @__PURE__ */ new Map());
  const s = Pe.get(t);
  if (!s.has(e)) {
    X.play[t] ??= {};
    const r = X.play[t];
    if (r[e] === void 0) {
      const i = Ue(n);
      r[e] = i;
    }
    s.set(e, r[e]);
  }
  return s.get(e);
}
const L = /* @__PURE__ */ new Map(), Dc = /* @__PURE__ */ new WeakMap();
let Mt = /* @__PURE__ */ new Map();
const Lc = /* @__PURE__ */ new Set(), Ki = new lm(() => ct), Tc = /* @__PURE__ */ new Map();
let Cm = 0, Vs = ml;
const re = /* @__PURE__ */ new Map();
let Ss = null;
function uu() {
  Ss || re.size === 0 || typeof MutationObserver > "u" || (Ss = xi(
    document.documentElement,
    (t) => {
      for (const e of t)
        for (const n of e.addedNodes)
          ce(n) && (n.id && re.has(n.id) && vn(n), n.querySelectorAll("[id]").forEach((s) => {
            re.has(s.id) && vn(s);
          }));
    },
    { childList: !0, subtree: !0 }
  ));
}
function hu() {
  Ss?.disconnect(), Ss = null;
}
function Ln() {
  return [K.CanPlay, ...Object.keys(Vs)];
}
function Sm(t) {
  G.sendMessage(JSON.stringify(t));
}
function Wi(t) {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return;
  }
  if (e.type === "room-reset") {
    const i = Number(e.resetEpoch);
    if (!Number.isFinite(i)) {
      console.error("[PLAYHTML] Received room-reset without a resetEpoch"), window.location.reload();
      return;
    }
    Mm(i);
    return;
  }
  const { type: n, eventPayload: s } = e, r = Mt.get(n);
  if (!r) {
    if (e.permissions)
      try {
        const i = e.permissions;
        Object.entries(i).forEach(([o, c]) => {
          if (Wl(o, c), c === "read-only") {
            const a = document.querySelector(
              `[data-source$="#${CSS.escape(o)}"]`
            );
            a && a.setAttribute("data-source-read-only", "");
          }
        });
      } catch {
      }
    return;
  }
  for (const i of r)
    i.onEvent(s);
}
let W = !1, mn = !0, Ks = !0, mt = !1, du = () => {
}, Yr = () => {
};
function fu() {
  const t = new Promise((e, n) => {
    du = e, Yr = n;
  });
  return t.catch(() => {
  }), t;
}
let Ge = fu();
function Em(t) {
  return typeof t == "object" && t !== null && "then" in t && typeof t.then == "function";
}
let $t = /* @__PURE__ */ new Set(), Y = "", He = "", tt = null, Zn = null, Ct = null;
function pu() {
  const t = x?.room;
  return typeof t == "function" ? t() : t;
}
const Ot = /* @__PURE__ */ new Map();
let Xt = null, ne = null, St = null, Zt = null, Qn = null, es = null;
const Es = {
  store: null,
  storeUnsubscribe: null,
  subscribers: /* @__PURE__ */ new Set(),
  getPeers() {
    return this.store?.getPeers() ?? /* @__PURE__ */ new Map();
  },
  subscribe(t) {
    return this.subscribers.add(t), () => this.subscribers.delete(t);
  },
  connect(t) {
    this.storeUnsubscribe?.(), this.store = t, this.storeUnsubscribe = t.subscribe("identity", () => {
      for (const e of this.subscribers)
        te(e, "users identity subscriber");
    });
  },
  disconnect() {
    this.storeUnsubscribe?.(), this.storeUnsubscribe = null, this.store = null;
  }
};
function Ws(t) {
  const e = Ot.get(t);
  if (e)
    return e.refCount++, e.transport;
  const n = new eu({
    host: He,
    room: t
  }), s = P?.onSelfChange(() => {
    try {
      n.join({
        identity: lt(),
        page: Ie()
      }), t === St && ne?.refresh();
    } catch (r) {
      console.warn("[playhtml] Failed to republish identity on change:", r);
    }
  }) ?? null;
  return Ot.set(t, {
    transport: n,
    refCount: 1,
    selfChangeUnsub: s
  }), n;
}
function gu(t) {
  const e = Ws(t);
  es = t, Es.connect(e.peers);
}
function yu() {
  Es.disconnect(), es !== null && (Tn(es), es = null);
}
function Tn(t) {
  const e = Ot.get(t);
  if (e && (e.refCount--, !(e.refCount > 0))) {
    Ot.delete(t);
    try {
      e.selfChangeUnsub?.();
    } catch {
    }
    try {
      e.transport.destroy();
    } catch {
    }
  }
}
let ts = null, $e = null;
const _m = 5e3, wn = /* @__PURE__ */ new Set();
let x = null, Yi = !1;
function bn(t) {
  if (typeof t != "function") {
    if (Array.isArray(t)) {
      const e = t.map(bn);
      return e.length === 0 ? void 0 : e;
    }
    if (t && typeof t == "object") {
      const e = {};
      for (const n of Object.keys(t).sort()) {
        const s = bn(t[n]);
        s !== void 0 && (e[n] = s);
      }
      return Object.keys(e).length === 0 ? void 0 : e;
    }
    return t;
  }
}
function qr(t) {
  return typeof t == "function" ? !0 : Array.isArray(t) ? t.some(qr) : t && typeof t == "object" ? Object.values(t).some(qr) : !1;
}
function Am(t, e) {
  for (const r of Object.keys(e)) {
    const i = typeof e[r] == "function", o = typeof t[r] == "function", c = t[r] !== void 0;
    if (i && c && !o || o && e[r] !== void 0 && !i) return !0;
  }
  const n = bn(t) ?? {}, s = bn(e) ?? {};
  for (const r of Object.keys(s))
    if (r in n && JSON.stringify(s[r]) !== JSON.stringify(n[r]))
      return !0;
  return !1;
}
function km(t) {
  return bn(t) === void 0 && !qr(t);
}
function Gr(t) {
  if (x) {
    Am(x, t) && console.warn(
      "[playhtml] Ignoring conflicting config passed after playhtml was already configured. Config is locked to the first declaration. Declare it once up front with playhtml.configure(...) (or matching options at every call site)."
    );
    return;
  }
  if (!km(t)) {
    if (Yi) {
      console.warn(
        "[playhtml] Ignoring config passed after playhtml already connected. Declare it before init() — e.g. with playhtml.configure(...) in a script that runs before any component mounts."
      );
      return;
    }
    if (t.extraCapabilities)
      for (const [e, n] of Object.entries(t.extraCapabilities))
        Pu(e, n);
    if (x = {
      ...t,
      ...t.defaultRoomOptions ? { defaultRoomOptions: { ...t.defaultRoomOptions } } : {},
      ...t.cursors ? { cursors: { ...t.cursors } } : {}
    }, t.extraCapabilities)
      for (const [e, n] of Object.entries(t.extraCapabilities))
        Iu(e, n);
    if (t.events)
      for (const [e, n] of Object.entries(t.events))
        Ru(e, n);
  }
}
function xm() {
  Yi = !0;
}
function qi(t) {
  const { room: e, partykitHost: n, onError: s, onMessage: r } = t, i = Dy(), o = Ly();
  o.forEach((u) => {
    const h = `${u.domain}${u.path}#${u.elementId}`;
    Wr.add(h);
  });
  const c = `playhtml_resetEpoch_${e}`, a = localStorage.getItem(c), l = a ? parseInt(a, 10) : null;
  return G = new Ep(n, e, ct, {
    params: {
      sharedElements: JSON.stringify(i),
      sharedReferences: JSON.stringify(o),
      clientResetEpoch: l !== null ? String(l) : null
    }
  }), G.on("error", () => {
    s?.();
  }), G.on("sync", Tm), G.on("custom-message", r), { sharedReferences: o };
}
function Gi() {
  at.disconnect();
  try {
    le?.destroy?.();
  } catch {
  }
  le = null, Xt !== null && (Tn(Xt), Xt = null);
}
function Ji() {
  try {
    G?.disconnect?.();
  } catch {
  }
  try {
    G?.destroy?.();
  } catch {
  }
}
function mu() {
  Ki.clear();
  const t = ct;
  X = Tl({ play: {} }), ct = Ll(X), ru = Jl(X.play), Pe.clear(), je.clear();
  try {
    t.destroy();
  } catch {
  }
}
function wu() {
  const t = Ws(Y), e = Y;
  St = e;
  try {
    ne = new em({
      transport: t,
      getIdentity: lt,
      getPage: Ie,
      onAwareness: xu,
      onAwarenessChange: Ym
    });
  } catch (n) {
    St = null, Tn(e), console.error("[playhtml] Failed to build element awareness client:", n);
    return;
  }
}
function bu() {
  if (ne) {
    try {
      ne.destroy();
    } catch {
    }
    ne = null, St !== null && (Tn(St), St = null);
  }
}
function Dm() {
  if (!ne) return;
  const t = [];
  for (const [e, n] of L)
    for (const [s, r] of n)
      r.selfAwareness !== void 0 && t.push([e, s, r.selfAwareness]);
  t.length !== 0 && ne.setLocalAwarenessBatch(t);
}
function vu() {
  const t = Ws(Y);
  return Qn = Y, Zt = new nu({
    transport: t,
    getIdentity: lt,
    getPage: Ie,
    getCursorPresences: () => at.getPresences(),
    onCursorPresencesChange: (n) => at.subscribe(n)
  }), Zt;
}
function Cu() {
  if (Zt) {
    try {
      Zt.destroy();
    } catch {
    }
    Zt = null, Qn !== null && (Tn(Qn), Qn = null);
  }
}
function Xi(t) {
  const { cursors: e, mainRoom: n } = t;
  if (!e.enabled) {
    yt = "";
    return;
  }
  if (!P)
    throw new Error("[playhtml] buildCursors requires the users module to exist first.");
  const s = { ...e };
  if (s.room) {
    const i = ou(s.room);
    yt = gn(
      Tt(),
      i
    );
  } else
    yt = n;
  const r = Ws(yt);
  Xt = yt, le = new xy(
    s,
    r,
    P
  ), at.connect(le);
}
function Lm(t, e) {
  const n = `playhtml_resetEpoch_${t}`;
  localStorage.setItem(n, String(e)), console.log(
    `[PLAYHTML] Stored resetEpoch=${e} in localStorage key=${n}`
  );
}
function Zi(t) {
  return new Promise((e, n) => {
    if (W) {
      e();
      return;
    }
    let s = !1, r = null;
    const i = (o) => {
      s || (s = !0, r !== null && clearTimeout(r), wn.delete(i), o ? n(o) : e());
    };
    wn.add(i), t !== void 0 && (r = setTimeout(() => {
      i(new Error("Timed out waiting for playhtml room reset sync"));
    }, t));
  });
}
function Tm(t) {
  if (t || console.error("Issue connecting to yjs..."), W) return;
  W = !0;
  const e = [...wn];
  wn.clear(), e.forEach((n) => n());
}
function Mm(t) {
  if (Lm(Y, t), ts) {
    $e = Math.max($e ?? 0, t);
    return;
  }
  ts = $m(t).catch((e) => {
    console.error("[PLAYHTML] Failed to reconnect after room-reset:", e), window.location.reload();
  }).finally(() => {
    ts = null, $e = null;
  });
}
async function $m(t) {
  let e = t;
  for (; ; ) {
    const n = e;
    if ($e = null, await Om(), $e === null || $e <= n)
      return;
    e = $e;
  }
}
async function Om() {
  if (!Y || !He)
    throw new Error("playhtml cannot reset before init()");
  Ji(), Gi(), W = !1, $t.clear(), mu(), qi({
    room: Y,
    partykitHost: He,
    onError: x?.onError,
    onMessage: Wi
  });
  const t = x?.cursors;
  t?.enabled && Xi({
    cursors: t,
    mainRoom: Y
  }), P?.getAll(), Qi(), await Zi(_m), Gl(so()), Du(), eo(), le?.refreshContainer?.(), le?.refreshCursorStyles?.(), wl(Y);
}
function Im() {
  Ct || (Ct = ((t) => {
    const e = ll(t.detail?.playerIdentity);
    if (!e?.playerStyle.colorPalette[0] || !P) return;
    const n = lt(), s = {
      ...e,
      ...typeof n.name == "string" ? { name: n.name } : {}
    };
    P.adoptIdentity(s), console.log("[playhtml] Merged extension identity via CustomEvent");
  }), document.addEventListener(
    "playhtml:configure-identity",
    Ct
  ), document.dispatchEvent(new CustomEvent("playhtml:ready")));
}
async function Pm() {
  if (mn) return;
  const t = pu() ?? iu(
    x?.defaultRoomOptions ?? { includeSearch: !1 }
  ), e = gn(Tt(), t), n = e !== Y, s = x?.cursors, r = !!s?.enabled, o = r !== (le !== null);
  let c = !1;
  if (s?.enabled)
    if (s.room) {
      const a = ou(s.room);
      c = gn(Tt(), a) !== yt;
    } else
      c = n;
  for (const [a, l] of L)
    for (const [u, h] of [...l.entries()]) {
      const d = h.element;
      (!d || !d.isConnected) && (h.destroy?.(), l.delete(u), ne?.removeLocalAwareness(a, u));
    }
  n && (Ji(), bu(), Cu(), yu(), W = !1, xu(/* @__PURE__ */ new Map()), mu(), qi({
    room: e,
    partykitHost: He,
    onError: x?.onError,
    onMessage: Wi
  }), Y = e, gu(e), wu(), Dm()), (o || c && s) && (Gi(), r && s && Xi({
    cursors: s,
    mainRoom: e
  })), n && yn?.setInner(vu()), (n || o || c) && P?.getAll(), Qi(), n && (await Zi(), Gl(so())), n ? Du() : no(), eo(), le?.refreshContainer?.(), le?.refreshCursorStyles?.(), wl(Y);
}
function Rm(t = {}) {
  Gr(t);
}
function Nm(t = {}) {
  if (mt)
    return Gr(t), Ge;
  const e = window.playhtml;
  if (e) {
    if (Em(e.ready))
      return Ge = e.ready, Ge.then(
        () => {
          Ks = !1;
        },
        () => {
        }
      ), mt = !0, Ge;
    const s = new Error(
      "playhtml is already set up by an incompatible instance. Make sure @playhtml/react and playhtml use matching versions."
    );
    return Yr(s), mt = !0, Ge;
  }
  mt = !0, Gr(t);
  const n = Um();
  return n.catch((s) => {
    Yr(s);
  }), n;
}
async function Um() {
  xm();
  const t = x?.host, e = x?.cursors ?? {}, n = pu() ?? iu(
    x?.defaultRoomOptions ?? { includeSearch: !1 }
  ), s = x?.onError;
  window.playhtml = $c, document.documentElement.dataset.playhtml = "true";
  const r = gn(Tt(), n), i = wm(t);
  Y = r, He = i, console.log(
    `࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂
࿂࿂࿂࿂  ࿂    ࿂    ࿂    ࿂    ࿂  ࿂࿂࿂࿂
࿂࿂࿂࿂ booting up playhtml... ࿂࿂࿂࿂
࿂࿂࿂࿂  https://playhtml.fun  ࿂࿂࿂࿂
࿂࿂࿂࿂   ࿂     ࿂     ࿂     ࿂   ࿂࿂࿂࿂
࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂࿂`
  );
  const { sharedReferences: o } = qi({
    room: r,
    partykitHost: i,
    onError: s,
    onMessage: Wi
  }), c = e.playerIdentity ?? x?.playerIdentity ?? lt();
  P = ey(c, {
    getIdentityPeers: () => Es.getPeers(),
    onIdentityPeersChange: (l) => Es.subscribe(l),
    getCursorPresences: () => at.getPresences(),
    onCursorPresencesChange: (l) => at.subscribe(l)
  }), gu(r), vs = null, Kr = P.onChange(
    Vm
  ), Xi({
    cursors: e,
    mainRoom: r
  }), P.getAll(), wu(), Im(), yn = new am(vu());
  const a = document.createElement("link");
  if (a.rel = "stylesheet", a.href = new URL("./style.css", import.meta.url).href, document.head.appendChild(a), x?.developmentMode && (Vr = await import("./development-1NyEy4D6.js"), Vr.setupDevUI($c, L)), Qi(), await Zi(), console.log("[PLAYHTML]: Setting up elements... Time to have some fun 🛝"), no(), eo(), Ks = !1, du(), o.length > 0)
    try {
      const l = o.map((u) => u.elementId);
      G.sendMessage(
        JSON.stringify({ type: "export-permissions", elementIds: l })
      );
    } catch (l) {
      console.error("[PLAYHTML] Error during post-sync setup:", l);
    }
  return G;
}
function Fm(t, e) {
  return ne?.getLocalAwareness(t, e);
}
function ce(t) {
  return t instanceof HTMLElement;
}
function Su(t) {
  return t.hasAttribute("can-play") ? "none" : "animate";
}
function Eu(t) {
  if ((t.getAttribute("loading-behavior") || Su(t)) === "none") return;
  t.classList.add("playhtml-loading");
  const n = t.getAttribute("loading-class");
  n && t.classList.add(n), t.setAttribute("aria-busy", "true"), t.setAttribute("aria-live", "polite");
}
function _u(t) {
  if ((t.getAttribute("loading-behavior") || Su(t)) === "none") return;
  t.classList.remove("playhtml-loading");
  const n = t.getAttribute("loading-class");
  n && t.classList.remove(n), t.removeAttribute("aria-busy"), t.removeAttribute("aria-live");
}
function Au() {
  const t = /* @__PURE__ */ new Set();
  for (const e of Ln())
    for (const n of document.querySelectorAll(`[${e}]`))
      ce(n) && t.add(n);
  for (const e of re.keys()) {
    const n = document.getElementById(e);
    n && ce(n) && t.add(n);
  }
  return t;
}
function Qi() {
  Au().forEach(Eu);
}
function eo() {
  Au().forEach(_u);
}
function jm(t, e, n) {
  if (typeof n == "function") {
    const s = n(e);
    x?.developmentMode && s !== void 0 && typeof s == "object" && console.warn(
      `[playhtml] A setData() mutator for "${t}" returned an object. Mutators must mutate the draft in place (e.g. \`d => { d.count++ }\`); the return value is ignored. To replace the whole snapshot, pass a value instead of a function.`
    );
    return;
  }
  gs(e, n);
}
function Hm(t) {
  const e = Nt(t);
  return !Ty(t, e);
}
function zm(t, e, n, s) {
  const r = n.defaultData instanceof Function ? n.defaultData(t) : n.defaultData, i = n.defaultData === void 0 ? void 0 : lu(e, s, r), o = Fm(e, s), c = n.live !== void 0 ? n.live : n.myDefaultAwareness, a = o ?? (c instanceof Function ? c(t) : c);
  return {
    ...n,
    live: a,
    devMode: x?.developmentMode ?? !1,
    // Always provide a plain snapshot to render paths
    data: Ue(i),
    awareness: a !== void 0 ? [a] : void 0,
    element: t,
    onChange: (u) => {
      if (i === void 0) {
        console.error(
          `[playhtml] setData() was called for "${s}", but its initializer does not define \`defaultData\`.`
        );
        return;
      }
      Hm(t) && ct.transact(() => {
        jm(s, i, u);
      });
    },
    onAwarenessChange: (u) => {
      ne?.setLocalAwareness(
        e,
        s,
        u
      );
    },
    triggerAwarenessUpdate: () => {
    }
  };
}
function Bm(t, e) {
  if (!P) return [];
  const n = new Map(t);
  e !== void 0 && n.set(P.me.pid, e);
  const s = [];
  for (const r of P.getAll()) {
    const i = n.get(r.pid);
    i !== void 0 && s.push({ user: r, live: i });
  }
  return s;
}
function Vm(t) {
  const e = JSON.stringify(
    [...t].sort((n, s) => n.pid.localeCompare(s.pid))
  );
  if (e !== vs) {
    vs = e;
    for (const n of L.values())
      for (const s of n.values())
        s.selfAwareness === void 0 && s.awarenessByStableId.size === 0 || te(() => s.render(), "element users render");
  }
}
function Km(t) {
  return to(t).length === 0;
}
function to(t) {
  if (t == null)
    return ["initializer"];
  const e = [], n = t.defaultData !== void 0, s = n && t.defaultData !== null && (typeof t.defaultData == "object" || typeof t.defaultData == "function"), r = typeof t.update == "function", i = typeof t.updateElement == "function", o = typeof t.view == "function", c = r || i || o, a = t.live !== void 0, l = t.myDefaultAwareness !== void 0, u = typeof t.updateElementAwareness == "function", h = c || u;
  return r && i && e.push("update and updateElement are mutually exclusive"), a && l && e.push("live and myDefaultAwareness are mutually exclusive"), n && !s && e.push("defaultData must be an object or function"), n && !c ? e.push("defaultData requires update, updateElement, or view") : !n && !a && !l && c && e.push("update, updateElement, or view requires defaultData or live"), a && !c && e.push("live requires update, updateElement, or view"), l && !c && !u && e.push(
    "myDefaultAwareness requires update, updateElement, view, or updateElementAwareness"
  ), e.length === 0 && !h && e.push("update, updateElement, view, or updateElementAwareness"), e;
}
function Mc(t) {
  const e = t, n = {}, s = [
    "defaultData",
    "defaultLocalData",
    "live",
    "myDefaultAwareness",
    "update",
    "updateElement",
    "view",
    "updateElementAwareness",
    "onDrag",
    "onDragStart",
    "onClick",
    "onMount",
    "resetShortcut",
    "debounceMs",
    "isValidElementForTag"
  ];
  for (const r of s)
    e[r] !== void 0 && (n[r] = e[r]);
  return n;
}
function ku(t, e) {
  return t === K.CanPlay || !e.hasAttribute(K.CanPlay);
}
function Wm(t, e) {
  if (t === K.CanPlay) {
    const r = re.get(e.id);
    return r || Mc(e);
  }
  const n = Vs[t];
  if (!n) return;
  if (!ku(t, e))
    return n;
  const s = Mc(e);
  return { ...n, ...s };
}
function xu(t) {
  t.forEach(({ array: e, byStableId: n }, s) => {
    te(
      () => Jr(s, e, n),
      "element awareness handler"
    );
  });
  for (const e of $t)
    t.has(e) || te(
      () => Jr(e, [], /* @__PURE__ */ new Map()),
      "element awareness handler"
    );
  $t = new Set(t.keys());
}
function Ym(t, e) {
  te(
    () => Jr(
      t,
      e?.array ?? [],
      e?.byStableId ?? /* @__PURE__ */ new Map()
    ),
    "element awareness handler"
  ), e ? $t.add(t) : $t.delete(t);
}
function Jr(t, e, n) {
  const s = t.indexOf(":"), r = t.slice(0, s), i = t.slice(s + 1), o = L.get(r);
  if (!o) return;
  const c = o.get(i);
  c && c.updateAwareness(e, n);
}
function no() {
  Lu(!1);
}
function Du() {
  Lu(!0);
}
function Lu(t) {
  if (W) {
    uu();
    for (const e of Ln()) {
      const n = new Set(
        Array.from(document.querySelectorAll(`[${e}]`)).filter(ce)
      );
      if (e === K.CanPlay)
        for (const s of re.keys()) {
          const r = document.getElementById(s);
          r && ce(r) && n.add(r);
        }
      n.size !== 0 && Promise.all(
        Array.from(n).map((s) => {
          const r = Nt(s), i = r ? L.get(e)?.get(r) : void 0;
          if (!(!t && i?.element === s))
            return Mn(s, e);
        })
      );
    }
    mn && (ne?.refresh(), tt = gg(async () => {
      await Pm();
    }), Zn = yg(tt), mn = !1);
  }
}
function so() {
  return {
    ensureProxy: lu,
    getProxy: (t, e) => Pe.get(t)?.get(e),
    // Getters so a handle held across a room change (which recreates store/doc)
    // reads the current ones, not stale references captured at creation.
    getDoc: () => ct,
    getStorePlay: () => X.play,
    proxyByTagAndId: Pe,
    yObserverByKey: je,
    channelRefCounts: cu,
    channelListeners: au
  };
}
function qm(t, e) {
  if (!W)
    throw new Error("playhtml.createPageData is not available before init()");
  return $y(t, e, so());
}
function Gm(t) {
  if (!W)
    throw new Error("playhtml.createPresenceRoom is not available before init()");
  const e = gn(Tt(), t), n = new eu({
    host: He,
    room: e
  }), s = P?.onSelfChange(() => {
    n.join({ identity: lt(), page: Ie() });
  }) ?? null, r = new nu({
    transport: n,
    getIdentity: lt,
    getPage: Ie
  });
  let i = !1;
  return {
    presence: r,
    destroy: () => {
      i || (i = !0, s?.(), r.destroy(), n.destroy());
    }
  };
}
async function f0() {
  if (!(mn && !mt)) {
    Ki.clear(), tt && (tt.destroy(), tt = null), Zn && (Zn(), Zn = null), Ct && (document.removeEventListener(
      "playhtml:configure-identity",
      Ct
    ), Ct = null);
    for (const [, t] of L) {
      for (const e of t.values())
        try {
          e.destroy?.();
        } catch {
        }
      t.clear();
    }
    L.clear(), cu.clear(), au.clear(), wn.clear(), hu(), bu(), Cu(), Gi(), yu(), Ji(), Kr?.(), Kr = null, vs = null;
    try {
      P?.destroy();
    } catch {
    }
    P = null;
    for (const [, t] of Ot) {
      try {
        t.selfChangeUnsub?.();
      } catch {
      }
      try {
        t.transport.destroy();
      } catch {
      }
    }
    Ot.clear(), Xt = null;
    try {
      Vr?.teardownDevUI();
    } catch {
    }
    document.head.querySelectorAll("link[href*='playhtml']").forEach((t) => t.remove()), document.querySelectorAll("#playhtml-cursor-styles").forEach((t) => t.remove()), delete window.playhtml, delete document.documentElement.dataset.playhtml, W = !1, $t.clear(), mn = !0, Ks = !0, mt = !1, Ge = fu(), Y = "", He = "", yn = null, at.subscribers.clear(), ts = null, $e = null, x = null, Yi = !1;
  }
}
const $c = {
  init: Nm,
  configure: Rm,
  get isLoading() {
    return Ks;
  },
  get ready() {
    return Ge;
  },
  handleNavigation: async function() {
    tt && await tt.trigger();
  },
  setupPlayElements: no,
  setupPlayElement: vn,
  removePlayElement: $n,
  deleteElementData: s0,
  setupPlayElementForTag: Mn,
  register: e0,
  define: t0,
  getHandle: Ou,
  get syncedStore() {
    return ru;
  },
  elementHandlers: L,
  dispatchPlayEvent: r0,
  registerPlayEventListener: Ru,
  removePlayEventListener: i0,
  get cursorClient() {
    return le;
  },
  get presence() {
    if (!yn)
      throw new Error("playhtml.presence is not available before init()");
    return yn;
  },
  get users() {
    if (!P)
      throw new Error("playhtml.users is not available before init()");
    return P;
  },
  // Filled after init
  get roomId() {
    return Y;
  },
  get host() {
    return He;
  },
  createPageData: qm,
  createPresenceRoom: Gm,
  listSharedElements: pg
};
function Jm(t) {
  if (t === k)
    throw new Error(`"${k}" is a reserved tag name for page-level data`);
  L.has(t) || W && (L.has(t) || L.set(t, /* @__PURE__ */ new Map()), X.play[t] ??= {});
}
function Xm(t, e) {
  const n = e === K.CanPlay ? re.get(t.id)?.isValidElementForTag : void 0;
  if (n)
    return n(t);
  const s = ku(e, t) ? t.isValidElementForTag : void 0;
  return typeof s == "function" ? s(t) : Vs[e]?.isValidElementForTag?.(t) ?? !0;
}
function Oc(t) {
  const e = t.tagName.toLowerCase(), n = t.id ? `#${t.id}` : "", s = Array.from(t.classList).map((r) => `.${r}`).join("");
  return `<${e}${n}${s}>`;
}
function Zm(t, e, n, s) {
  console.error(
    `[playhtml] Duplicate element id "${e}" for ${t}. Element IDs must be unique per capability tag because playhtml stores shared data by tag and ID. Keeping ${Oc(n)} and ignoring ${Oc(s)}.`,
    { existingElement: n, duplicateElement: s }
  );
}
function Qm(t, e, n) {
  const s = L.get(t)?.get(e);
  !s || s.element === n || s.element.isConnected || $n(s.element);
}
async function Mn(t, e) {
  if (!Xm(t, e) || !W)
    return;
  if (!t.id) {
    const a = t.getAttribute("selector-id");
    if (a) {
      const l = Tc.get(a) ?? 0;
      t.id = btoa(`${e}-${a}-${l}`), Tc.set(a, l + 1);
    } else
      t.id = await Zg(e, t);
  }
  const n = Nt(t);
  if (!n) {
    console.error(
      `Element ${t} does not have an acceptable ID. Please add an ID to the element to register it as a playhtml element.`
    );
    return;
  }
  Jm(e);
  const s = L.get(e);
  Qm(e, n, t);
  const r = Wm(
    e,
    t
  );
  if (!Km(r)) {
    const a = to(r);
    console.error(
      `Element ${n} does not have proper info to initialize a playhtml element. Missing or invalid initializer properties: ${a.join(", ")}. Please refer to https://github.com/spencerc99/playhtml#can-play for troubleshooting help.`
    );
    return;
  }
  const i = zm(
    t,
    e,
    r,
    n
  ), o = s.get(n);
  if (o) {
    if (o.element !== t) {
      Zm(
        e,
        n,
        o.element,
        t
      );
      return;
    }
    o.reinitializeElementData(i), Tu(e, n, o), Ic(e, n);
    return;
  } else {
    const a = new Xg(i, {
      getUsers: Bm,
      ...e === K.CanMirror ? { scheduleSetupDataWrite: (l) => Ki.queue(l) } : {}
    });
    s.set(n, a), r.view && (a.onAfterRender = n0, a.observeDescendants()), e === K.CanMirror && Mu(t);
  }
  const c = ne?.getAwareness(e, n);
  c ? s.get(n)?.updateAwareness(c.array, c.byStableId) : i.triggerAwarenessUpdate?.(), t.classList.add("__playhtml-element"), t.style.setProperty("--jiggle-delay", `${Math.random() * 1}s;}`), Ic(e, n);
}
function Tu(t, e, n) {
  const s = X.play[t]?.[e];
  if (s === void 0) return !1;
  const r = `${t}:${e}`;
  Lc.add(r);
  try {
    n.__data = Ue(s), t === K.CanMirror && Mu(n.element);
  } finally {
    Lc.delete(r);
  }
  return !0;
}
function Ic(t, e) {
  const n = `${t}:${e}`, s = L.get(t);
  if (!s) return;
  const r = s.get(e);
  if (!r) return;
  const i = Q(X.play[t]?.[e]);
  if (!i || typeof i.observeDeep != "function") return;
  const o = je.get(n);
  o && i.unobserveDeep(o);
  let c = !1;
  const a = () => {
    c || (c = !0, queueMicrotask(() => {
      c = !1, Tu(t, e, r) && Cs.add(n);
    }));
  };
  if (i.observeDeep(a), je.set(n, a), x?.developmentMode) {
    const l = r.element;
    if (l && l.hasAttribute && l.hasAttribute("data-source") && !et.has(n)) {
      const u = window.setTimeout(() => {
        Cs.has(n) || console.warn(
          `[playhtml] Shared reference ${t}:${e} has not received data. Check data-source and source availability.`
        ), et.delete(n);
      }, 3e3);
      et.set(n, u);
    }
  }
}
function vn(t, { ignoreIfAlreadySetup: e } = {}) {
  if (t.hasAttribute?.("data-source") && t.hasAttribute?.("shared")) {
    const s = t.id || "<no-id>";
    console.error(
      `[playhtml] Element ${s} has both 'data-source' and 'shared'. Ignoring. A single element cannot be both a consumer and a source.`
    );
    return;
  }
  if (e && Array.from(L.values()).some(
    (s) => s.has(t.id)
  ))
    return;
  if (!ce(t)) {
    console.log(`Element ${t.id} not an HTML element. Ignoring.`);
    return;
  }
  t.hasAttribute("data-source") && bm(t), t.hasAttribute("shared") && vm(t);
  const n = new Set(
    Ln().filter((s) => t.hasAttribute(s))
  );
  t.id && re.has(t.id) && n.add(K.CanPlay), n.size > 0 && (W ? _u(t) : Eu(t)), Promise.all(
    Array.from(n).map((s) => Mn(t, s))
  );
}
function Mu(t) {
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map();
  for (const r of Ln())
    t.querySelectorAll(`[${r}]`).forEach((i) => {
      if (ce(i)) {
        e.add(i);
        const o = Nt(i);
        o && n.set(`${r}:${o}`, i);
      }
    });
  Dc.get(t)?.forEach((r, i) => {
    n.get(i) !== r && $n(r);
  }), e.forEach((r) => {
    vn(r);
  }), Dc.set(t, n);
}
function $n(t) {
  if (!t || !t.id)
    return;
  const e = Nt(t);
  if (e)
    for (const [n, s] of L) {
      const r = s.get(e);
      if (!r || r.element !== t)
        continue;
      const i = `${n}:${e}`, o = Q(X.play[n]?.[e]), c = je.get(i);
      o && c && typeof o.unobserveDeep == "function" && o.unobserveDeep(c), je.delete(i), Cs.delete(i);
      const a = et.get(i);
      a !== void 0 && (clearTimeout(a), et.delete(i)), r.destroy?.(), ne?.removeLocalAwareness(n, e), s.delete(e);
    }
}
function $u(t, e) {
  if (e.update && e.updateElement)
    throw new Error(
      `[playhtml] "${t}" defines both \`update\` and \`updateElement\`. Pick one imperative renderer.`
    );
  if (e.live !== void 0 && e.myDefaultAwareness !== void 0)
    throw new Error(
      `[playhtml] "${t}" defines both \`live\` and \`myDefaultAwareness\`. Pick one element live default.`
    );
  if (e.view && (e.update || e.updateElement))
    throw new Error(
      `[playhtml] "${t}" defines both \`view\` and an imperative update renderer. They are mutually exclusive. Pick one.`
    );
  if (e.view && (e.onClick || e.onDrag || e.onDragStart))
    throw new Error(
      `[playhtml] "${t}" defines \`view\` alongside an element event handler (onClick/onDrag/onDragStart). In view mode, attach events inside the template (e.g. \`@click=\${...}\`) instead.`
    );
  if (e.defaultData !== void 0 && typeof e.defaultData != "function" && (typeof e.defaultData != "object" || e.defaultData === null))
    throw new Error(
      `[playhtml] "${t}" has a non-object \`defaultData\`. Use an object (e.g. \`{ count: 0 }\`) so the shape can grow without a data migration.`
    );
  const n = to(e);
  if (n.length > 0)
    throw new Error(
      `[playhtml] "${t}" has an invalid initializer: ${n.join(", ")}.`
    );
}
function Ye(t, e) {
  if (e !== void 0)
    return L.get(e)?.get(t);
  const n = L.get(K.CanPlay)?.get(t);
  if (n) return n;
  for (const [, s] of L) {
    const r = s.get(t);
    if (r) return r;
  }
}
function Vt(t, e) {
  x?.developmentMode && console.warn(
    `[playhtml] ${t}("${e}") — no bound element with that id yet; the write was dropped. Register/add the element first, or check the id.`
  );
}
function Ou(t, e) {
  return {
    id: t,
    getElement: () => document.getElementById(t),
    getData: () => Ye(t, e)?.data,
    setData: (n) => {
      const s = Ye(t, e);
      if (!s) return Vt("setData", t);
      s.setData(n);
    },
    setLocalData: (n) => {
      const s = Ye(t, e);
      if (!s) return Vt("setLocalData", t);
      s.setLocalData(n);
    },
    setLive: (n) => {
      const s = Ye(t, e);
      if (!s) return Vt("setLive", t);
      s.setLive(n);
    },
    setMyAwareness: (n) => {
      const s = Ye(t, e);
      if (!s) return Vt("setMyAwareness", t);
      s.setLive(n);
    },
    requestUpdate: () => {
      const n = Ye(t, e);
      if (!n) return Vt("requestUpdate", t);
      n.requestUpdate();
    },
    unregister: () => {
      const n = Ye(t, e)?.element;
      re.delete(t), re.size === 0 && hu();
      const s = n ?? document.getElementById(t);
      s && $n(s);
    }
  };
}
function e0(t, e) {
  let n, s;
  if (typeof t == "string")
    s = t, n = document.getElementById(s);
  else {
    if (!ce(t))
      throw new Error(
        "[playhtml] register(element, initializer) requires an HTML element."
      );
    if (!t.id)
      throw new Error(
        "[playhtml] register(element, initializer) requires an element with a non-empty id."
      );
    n = t, s = n.id;
  }
  return $u(s, e), re.set(s, e), W && uu(), n && ce(n) && vn(n), x?.developmentMode && W && !n && console.warn(
    `[playhtml] register("${s}") — no element with that id is in the DOM yet. It will bind automatically when the element appears.`
  ), Ou(
    s,
    K.CanPlay
  );
}
function t0(t, e) {
  Iu(t, e);
}
function Iu(t, e) {
  if (Pu(t, e), Vs[t] = e, W) {
    const n = Array.from(
      document.querySelectorAll(`[${t}]`)
    ).filter(ce);
    Promise.all(
      n.map((s) => Mn(s, t))
    );
  }
}
function Pu(t, e) {
  if (t === k)
    throw new Error(`"${k}" is a reserved tag name for page-level data`);
  if (t === K.CanPlay)
    throw new Error(
      `[playhtml] "${K.CanPlay}" is reserved — use register(elementOrId, init) for single elements.`
    );
  if (Object.prototype.hasOwnProperty.call(ml, t))
    throw new Error(
      `[playhtml] "${t}" is a built-in capability and cannot be redefined.`
    );
  $u(t, e);
}
const Pc = /* @__PURE__ */ new WeakMap();
function n0(t) {
  const e = /* @__PURE__ */ new Map();
  for (const s of re.keys()) {
    if (s === t.id) continue;
    const r = document.getElementById(s);
    r && t.contains(r) && ce(r) && e.set(`${K.CanPlay}:${s}`, r);
  }
  for (const s of Ln()) {
    const r = Array.from(t.querySelectorAll(`[${s}]`)).filter(
      ce
    );
    for (const i of r)
      if (i !== t) {
        if (!i.id) {
          x?.developmentMode && console.warn(
            `[playhtml] a view rendered a "${s}" element with no id; it won't bind. Give capability children a stable, unique id (key keyed lists by it).`
          );
          continue;
        }
        e.set(`${s}:${i.id}`, i);
      }
  }
  for (const [s, r] of e) {
    const i = s.slice(0, s.indexOf(":"));
    L.get(i)?.get(r.id)?.element !== r && Mn(r, i);
  }
  const n = Pc.get(t);
  if (n)
    for (const [s, r] of n)
      e.has(s) || $n(r);
  Pc.set(t, e);
}
function s0(t, e) {
  if (!W) {
    console.warn(
      `[PLAYHTML] Cannot remove element data before sync: ${t}:${e}`
    );
    return;
  }
  const n = `${t}:${e}`, s = Q(X.play[t]?.[e]);
  if (s && typeof s.observeDeep == "function") {
    const a = je.get(n);
    if (a) {
      try {
        s.unobserveDeep(a);
      } catch (l) {
        console.warn(`[PLAYHTML] Failed to remove observer for ${n}:`, l);
      }
      je.delete(n);
    }
  }
  const r = X.play[t];
  if (r && e in r)
    try {
      ct.transact(() => {
        delete r[e];
      });
    } catch (a) {
      console.warn(
        `[PLAYHTML] Failed to remove SyncedStore data for ${n}:`,
        a
      );
    }
  const i = Pe.get(t);
  i && (i.delete(e), i.size === 0 && Pe.delete(t));
  const o = L.get(t);
  o && o.delete(e), Cs.delete(n);
  const c = et.get(n);
  c !== void 0 && (clearTimeout(c), et.delete(n));
}
function r0(t) {
  const { type: e } = t;
  if (!Mt.has(e)) {
    console.error(`[playhtml] event "${e}" not registered.`);
    return;
  }
  Sm(t);
}
function Ru(t, e) {
  const n = String(Cm++);
  return Mt.set(t, [
    ...Mt.get(t) ?? [],
    { type: t, ...e, id: n }
  ]), n;
}
function i0(t, e) {
  const n = Mt.get(t);
  if (!n)
    return;
  const s = n.findIndex((r) => r.id === e);
  s !== -1 && (n.splice(s, 1), n.length === 0 && Mt.delete(t));
}
export {
  U as A,
  ml as S,
  K as a,
  c0 as b,
  hg as c,
  a0 as d,
  L as e,
  u0 as f,
  h0 as g,
  d0 as h,
  lg as i,
  pg as l,
  ag as o,
  $c as p,
  f0 as r,
  ug as s,
  Nt as w
};

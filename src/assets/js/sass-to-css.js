/*! sass.js - v0.9.4 (bfade3e) - built 2015-10-27
  providing libsass 3.3.1 (42e22fb)
  via emscripten 1.35.4 (e37f843)
 */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      root.Sass = factory();
    }
  }(this, function () {/*global document*/
  // identify the path sass.js is located at in case we're loaded by a simple
  // <script src="path/to/sass.js"></script>
  // this path can be used to identify the location of
  // * sass.worker.js from sass.js
  // * libsass.js.mem from sass.sync.js
  // see https://github.com/medialize/sass.js/pull/32#issuecomment-103142214
  // see https://github.com/medialize/sass.js/issues/33
  var SASSJS_RELATIVE_PATH = (function() {
    'use strict';
  
    // in Node things are rather simple
    if (typeof __dirname !== 'undefined') {
      return __dirname;
    }
  
    // we can only run this test in the browser,
    // so make sure we actually have a DOM to work with.
    if (typeof document === 'undefined' || !document.getElementsByTagName) {
      return null;
    }
  
    // http://www.2ality.com/2014/05/current-script.html
    var currentScript = document.currentScript || (function() {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
  
    var path = currentScript && currentScript.src;
    if (!path) {
      return null;
    }
  
    // [worker] make sure we're not running in some concatenated thing
    if (path.slice(-8) === '/sass.js') {
      return path.slice(0, -8);
    }
  
    // [sync] make sure we're not running in some concatenated thing
    if (path.slice(-13) === '/sass.sync.js') {
      return path.slice(0, -13);
    }
  
    return null;
  })() || '.';
  
  /*global Worker, SASSJS_RELATIVE_PATH*/
  'use strict';
  
  var noop = function(){};
  var slice = [].slice;
  // defined upon first Sass.initialize() call
  var globalWorkerUrl;
  
  function Sass(workerUrl) {
    if (!workerUrl && !globalWorkerUrl) {
      /*jshint laxbreak:true */
      throw new Error(
        'Sass needs to be initialized with the URL of sass.worker.js - '
        + 'either via Sass.setWorkerUrl(url) or by new Sass(url)'
      );
      /*jshint laxbreak:false */
    }
  
    if (!globalWorkerUrl) {
      globalWorkerUrl = workerUrl;
    }
  
    // bind all functions
    // we're doing this because we used to have a single hard-wired instance that allowed
    // [].map(Sass.removeFile) and we need to maintain that for now (at least until 1.0.0)
    for (var key in this) {
      if (typeof this[key] === 'function') {
        this[key] = this[key].bind(this);
      }
    }
  
    this._callbacks = {};
    this._worker = new Worker(workerUrl || globalWorkerUrl);
    this._worker.addEventListener('message', this._handleWorkerMessage, false);
  }
  
  // allow setting the workerUrl before the first Sass instance is initialized,
  // where registering the global workerUrl would've happened automatically
  Sass.setWorkerUrl = function(workerUrl) {
    globalWorkerUrl = workerUrl;
  };
  
  Sass.style = {
    nested: 0,
    expanded: 1,
    compact: 2,
    compressed: 3
  };
  
  Sass.comments = {
    'none': 0,
    'default': 1
  };
  
  Sass.prototype = {
    style: Sass.style,
    comments: Sass.comments,
  
    destroy: function() {
      this._worker && this._worker.terminate();
      this._worker = null;
      this._callbacks = {};
      this._importer = null;
    },
  
    _handleWorkerMessage: function(event) {
      if (event.data.command) {
        this[event.data.command](event.data.args);
      }
  
      this._callbacks[event.data.id] && this._callbacks[event.data.id](event.data.result);
      delete this._callbacks[event.data.id];
    },
  
    _dispatch: function(options, callback) {
      if (!this._worker) {
        throw new Error('Sass worker has been terminated');
      }
  
      options.id = 'cb' + Date.now() + Math.random();
      this._callbacks[options.id] = callback;
      this._worker.postMessage(options);
    },
  
    _importerInit: function(args) {
      // importer API done callback pushing results
      // back to the worker
      var done = function done(result) {
        this._worker.postMessage({
          command: '_importerFinish',
          args: [result]
        });
      }.bind(this);
  
      try {
        this._importer(args[0], done);
      } catch(e) {
        done({ error: e.message });
        throw e;
      }
    },
  
    importer: function(importerCallback, callback) {
      if (typeof importerCallback !== 'function' && importerCallback !== null) {
        throw new Error('importer callback must either be a function or null');
      }
  
      // callback is executed in the main EventLoop
      this._importer = importerCallback;
      // tell worker to activate importer callback
      this._worker.postMessage({
        command: 'importer',
        args: [Boolean(importerCallback)]
      });
  
      callback && callback();
    },
  };
  
  var commands = 'writeFile readFile listFiles removeFile clearFiles lazyFiles preloadFiles options compile compileFile';
  commands.split(' ').forEach(function(command) {
    Sass.prototype[command] = function() {
      var callback = slice.call(arguments, -1)[0];
      var args = slice.call(arguments, 0, -1);
      if (typeof callback !== 'function') {
        args.push(callback);
        callback = noop;
      }
  
      this._dispatch({
        command: command,
        args: args
      }, callback);
    };
  });
  
  // automatically set the workerUrl in case we're loaded by a simple
  // <script src="path/to/sass.js"></script>
  // see https://github.com/medialize/sass.js/pull/32#issuecomment-103142214
  Sass.setWorkerUrl(SASSJS_RELATIVE_PATH + '/sass.worker.js');
  return Sass;
  }));
!function(e) {
    function t(r) {
        if (n[r])
            return n[r].exports;
        var i = n[r] = {
            exports: {},
            id: r,
            loaded: !1
        };
        return e[r].call(i.exports, i, i.exports, t),
        i.loaded = !0,
        i.exports
    }
    var n = {};
    return t.m = e,
    t.c = n,
    t.p = "",
    t(0)
}([function(e, t, n) {
    var r = n(1)
      , i = n(3)
      , o = n(4)
      , s = n(5);
    r.init(),
    i.init(),
    o.init(),
    s.init()
}
, function(e, t, n) {
    var r = n(2)
      , i = {}
      , o = []
      , s = function() {
        i.list.forEach(function(e) {
            i[e].resize()
        })
    }
      , a = function(e) {
        e.selection.moveCursorFileStart()
    }
      , u = function() {
        o.forEach(function(e) {
            e.editor.session.removeMarker(e.error)
        })
    }
      , l = function(e, t, n) {
        var r = t - 1
          , o = n
          , s = r
          , a = e.session.getAWordRange(r, o).end.column
          , u = new i.Range(r,o,s,a);
        return e.session.addMarker(u, "errorHighlight", "text", !0)
    }
      , c = function() {
        i.Range = ace.require("ace/range").Range,
        i.list = ["input", "output", "sourcemap", "file_content"],
        i.list.forEach(function(e) {
            i[e] = ace.edit(e);
            var t = i[e].getSession();
            i[e].setOption("fontSize", "16px"),
            i[e].setTheme("ace/theme/tomorrow"),
            t.setMode("ace/mode/scss"),
            t.setUseWrapMode(!0),
            i[e].$blockScrolling = 1 / 0
        }),
        i.output.setReadOnly(!0),
        i.input.on("change", u),
        i.file_content.on("change", u),
        i.input.setValue('@import "_variables";\n@import "_demo";\n\n.selector {\n  margin: $size;\n  background-color: $brandColor;\n\n  .nested {\n    margin: $size / 2;\n  }\n}'),
        a(i.input),
        r(window).on("resize", s)
    };
    e.exports = {
        resizeEditors: s,
        resetCursor: a,
        clearErrors: u,
        highlightError: l,
        editors: i,
        errors: o,
        init: c
    }
}
, function(e, t, n) {
    var r, i;
    /*!
	 * jQuery JavaScript Library v2.1.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-04-28T16:01Z
	 */
    !function(t, n) {
        "object" == typeof e && "object" == typeof e.exports ? e.exports = t.document ? n(t, !0) : function(e) {
            if (!e.document)
                throw new Error("jQuery requires a window with a document");
            return n(e)
        }
        : n(t)
    }("undefined" != typeof window ? window : this, function(n, o) {
        function s(e) {
            var t = "length"in e && e.length
              , n = re.type(e);
            return "function" === n || re.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
        }
        function a(e, t, n) {
            if (re.isFunction(t))
                return re.grep(e, function(e, r) {
                    return !!t.call(e, r, e) !== n
                });
            if (t.nodeType)
                return re.grep(e, function(e) {
                    return e === t !== n
                });
            if ("string" == typeof t) {
                if (fe.test(t))
                    return re.filter(t, e, n);
                t = re.filter(t, e)
            }
            return re.grep(e, function(e) {
                return J.call(t, e) >= 0 !== n
            })
        }
        function u(e, t) {
            for (; (e = e[t]) && 1 !== e.nodeType; )
                ;
            return e
        }
        function l(e) {
            var t = ye[e] = {};
            return re.each(e.match(ve) || [], function(e, n) {
                t[n] = !0
            }),
            t
        }
        function c() {
            te.removeEventListener("DOMContentLoaded", c, !1),
            n.removeEventListener("load", c, !1),
            re.ready()
        }
        function f() {
            Object.defineProperty(this.cache = {}, 0, {
                get: function() {
                    return {}
                }
            }),
            this.expando = re.expando + f.uid++
        }
        function p(e, t, n) {
            var r;
            if (void 0 === n && 1 === e.nodeType)
                if (r = "data-" + t.replace(ke, "-$1").toLowerCase(),
                n = e.getAttribute(r),
                "string" == typeof n) {
                    try {
                        n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Te.test(n) ? re.parseJSON(n) : n
                    } catch (i) {}
                    Ce.set(e, t, n)
                } else
                    n = void 0;
            return n
        }
        function d() {
            return !0
        }
        function h() {
            return !1
        }
        function g() {
            try {
                return te.activeElement
            } catch (e) {}
        }
        function m(e, t) {
            return re.nodeName(e, "table") && re.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
        }
        function v(e) {
            return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
            e
        }
        function y(e) {
            var t = We.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"),
            e
        }
        function x(e, t) {
            for (var n = 0, r = e.length; r > n; n++)
                we.set(e[n], "globalEval", !t || we.get(t[n], "globalEval"))
        }
        function b(e, t) {
            var n, r, i, o, s, a, u, l;
            if (1 === t.nodeType) {
                if (we.hasData(e) && (o = we.access(e),
                s = we.set(t, o),
                l = o.events)) {
                    delete s.handle,
                    s.events = {};
                    for (i in l)
                        for (n = 0,
                        r = l[i].length; r > n; n++)
                            re.event.add(t, i, l[i][n])
                }
                Ce.hasData(e) && (a = Ce.access(e),
                u = re.extend({}, a),
                Ce.set(t, u))
            }
        }
        function w(e, t) {
            var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
            return void 0 === t || t && re.nodeName(e, t) ? re.merge([e], n) : n
        }
        function C(e, t) {
            var n = t.nodeName.toLowerCase();
            "input" === n && De.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
        function T(e, t) {
            var r, i = re(t.createElement(e)).appendTo(t.body), o = n.getDefaultComputedStyle && (r = n.getDefaultComputedStyle(i[0])) ? r.display : re.css(i[0], "display");
            return i.detach(),
            o
        }
        function k(e) {
            var t = te
              , n = ze[e];
            return n || (n = T(e, t),
            "none" !== n && n || (Be = (Be || re("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),
            t = Be[0].contentDocument,
            t.write(),
            t.close(),
            n = T(e, t),
            Be.detach()),
            ze[e] = n),
            n
        }
        function E(e, t, n) {
            var r, i, o, s, a = e.style;
            return n = n || Ue(e),
            n && (s = n.getPropertyValue(t) || n[t]),
            n && ("" !== s || re.contains(e.ownerDocument, e) || (s = re.style(e, t)),
            Ve.test(s) && Xe.test(t) && (r = a.width,
            i = a.minWidth,
            o = a.maxWidth,
            a.minWidth = a.maxWidth = a.width = s,
            s = n.width,
            a.width = r,
            a.minWidth = i,
            a.maxWidth = o)),
            void 0 !== s ? s + "" : s
        }
        function N(e, t) {
            return {
                get: function() {
                    return e() ? void delete this.get : (this.get = t).apply(this, arguments)
                }
            }
        }
        function S(e, t) {
            if (t in e)
                return t;
            for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Ze.length; i--; )
                if (t = Ze[i] + n,
                t in e)
                    return t;
            return r
        }
        function D(e, t, n) {
            var r = Ge.exec(t);
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
        }
        function j(e, t, n, r, i) {
            for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > o; o += 2)
                "margin" === n && (s += re.css(e, n + Ne[o], !0, i)),
                r ? ("content" === n && (s -= re.css(e, "padding" + Ne[o], !0, i)),
                "margin" !== n && (s -= re.css(e, "border" + Ne[o] + "Width", !0, i))) : (s += re.css(e, "padding" + Ne[o], !0, i),
                "padding" !== n && (s += re.css(e, "border" + Ne[o] + "Width", !0, i)));
            return s
        }
        function A(e, t, n) {
            var r = !0
              , i = "width" === t ? e.offsetWidth : e.offsetHeight
              , o = Ue(e)
              , s = "border-box" === re.css(e, "boxSizing", !1, o);
            if (0 >= i || null == i) {
                if (i = E(e, t, o),
                (0 > i || null == i) && (i = e.style[t]),
                Ve.test(i))
                    return i;
                r = s && (ee.boxSizingReliable() || i === e.style[t]),
                i = parseFloat(i) || 0
            }
            return i + j(e, t, n || (s ? "border" : "content"), r, o) + "px"
        }
        function L(e, t) {
            for (var n, r, i, o = [], s = 0, a = e.length; a > s; s++)
                r = e[s],
                r.style && (o[s] = we.get(r, "olddisplay"),
                n = r.style.display,
                t ? (o[s] || "none" !== n || (r.style.display = ""),
                "" === r.style.display && Se(r) && (o[s] = we.access(r, "olddisplay", k(r.nodeName)))) : (i = Se(r),
                "none" === n && i || we.set(r, "olddisplay", i ? n : re.css(r, "display"))));
            for (s = 0; a > s; s++)
                r = e[s],
                r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[s] || "" : "none"));
            return e
        }
        function q(e, t, n, r, i) {
            return new q.prototype.init(e,t,n,r,i)
        }
        function H() {
            return setTimeout(function() {
                et = void 0
            }),
            et = re.now()
        }
        function F(e, t) {
            var n, r = 0, i = {
                height: e
            };
            for (t = t ? 1 : 0; 4 > r; r += 2 - t)
                n = Ne[r],
                i["margin" + n] = i["padding" + n] = e;
            return t && (i.opacity = i.width = e),
            i
        }
        function O(e, t, n) {
            for (var r, i = (st[t] || []).concat(st["*"]), o = 0, s = i.length; s > o; o++)
                if (r = i[o].call(n, t, e))
                    return r
        }
        function R(e, t, n) {
            var r, i, o, s, a, u, l, c, f = this, p = {}, d = e.style, h = e.nodeType && Se(e), g = we.get(e, "fxshow");
            n.queue || (a = re._queueHooks(e, "fx"),
            null == a.unqueued && (a.unqueued = 0,
            u = a.empty.fire,
            a.empty.fire = function() {
                a.unqueued || u()
            }
            ),
            a.unqueued++,
            f.always(function() {
                f.always(function() {
                    a.unqueued--,
                    re.queue(e, "fx").length || a.empty.fire()
                })
            })),
            1 === e.nodeType && ("height"in t || "width"in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY],
            l = re.css(e, "display"),
            c = "none" === l ? we.get(e, "olddisplay") || k(e.nodeName) : l,
            "inline" === c && "none" === re.css(e, "float") && (d.display = "inline-block")),
            n.overflow && (d.overflow = "hidden",
            f.always(function() {
                d.overflow = n.overflow[0],
                d.overflowX = n.overflow[1],
                d.overflowY = n.overflow[2]
            }));
            for (r in t)
                if (i = t[r],
                nt.exec(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (h ? "hide" : "show")) {
                        if ("show" !== i || !g || void 0 === g[r])
                            continue;
                        h = !0
                    }
                    p[r] = g && g[r] || re.style(e, r)
                } else
                    l = void 0;
            if (re.isEmptyObject(p))
                "inline" === ("none" === l ? k(e.nodeName) : l) && (d.display = l);
            else {
                g ? "hidden"in g && (h = g.hidden) : g = we.access(e, "fxshow", {}),
                o && (g.hidden = !h),
                h ? re(e).show() : f.done(function() {
                    re(e).hide()
                }),
                f.done(function() {
                    var t;
                    we.remove(e, "fxshow");
                    for (t in p)
                        re.style(e, t, p[t])
                });
                for (r in p)
                    s = O(h ? g[r] : 0, r, f),
                    r in g || (g[r] = s.start,
                    h && (s.end = s.start,
                    s.start = "width" === r || "height" === r ? 1 : 0))
            }
        }
        function P(e, t) {
            var n, r, i, o, s;
            for (n in e)
                if (r = re.camelCase(n),
                i = t[r],
                o = e[n],
                re.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
                n !== r && (e[r] = o,
                delete e[n]),
                s = re.cssHooks[r],
                s && "expand"in s) {
                    o = s.expand(o),
                    delete e[r];
                    for (n in o)
                        n in e || (e[n] = o[n],
                        t[n] = i)
                } else
                    t[r] = i
        }
        function M(e, t, n) {
            var r, i, o = 0, s = ot.length, a = re.Deferred().always(function() {
                delete u.elem
            }), u = function() {
                if (i)
                    return !1;
                for (var t = et || H(), n = Math.max(0, l.startTime + l.duration - t), r = n / l.duration || 0, o = 1 - r, s = 0, u = l.tweens.length; u > s; s++)
                    l.tweens[s].run(o);
                return a.notifyWith(e, [l, o, n]),
                1 > o && u ? n : (a.resolveWith(e, [l]),
                !1)
            }, l = a.promise({
                elem: e,
                props: re.extend({}, t),
                opts: re.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: et || H(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = re.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                    return l.tweens.push(r),
                    r
                },
                stop: function(t) {
                    var n = 0
                      , r = t ? l.tweens.length : 0;
                    if (i)
                        return this;
                    for (i = !0; r > n; n++)
                        l.tweens[n].run(1);
                    return t ? a.resolveWith(e, [l, t]) : a.rejectWith(e, [l, t]),
                    this
                }
            }), c = l.props;
            for (P(c, l.opts.specialEasing); s > o; o++)
                if (r = ot[o].call(l, e, c, l.opts))
                    return r;
            return re.map(c, O, l),
            re.isFunction(l.opts.start) && l.opts.start.call(e, l),
            re.fx.timer(re.extend(u, {
                elem: e,
                anim: l,
                queue: l.opts.queue
            })),
            l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
        }
        function $(e) {
            return function(t, n) {
                "string" != typeof t && (n = t,
                t = "*");
                var r, i = 0, o = t.toLowerCase().match(ve) || [];
                if (re.isFunction(n))
                    for (; r = o[i++]; )
                        "+" === r[0] ? (r = r.slice(1) || "*",
                        (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
            }
        }
        function W(e, t, n, r) {
            function i(a) {
                var u;
                return o[a] = !0,
                re.each(e[a] || [], function(e, a) {
                    var l = a(t, n, r);
                    return "string" != typeof l || s || o[l] ? s ? !(u = l) : void 0 : (t.dataTypes.unshift(l),
                    i(l),
                    !1)
                }),
                u
            }
            var o = {}
              , s = e === Tt;
            return i(t.dataTypes[0]) || !o["*"] && i("*")
        }
        function _(e, t) {
            var n, r, i = re.ajaxSettings.flatOptions || {};
            for (n in t)
                void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
            return r && re.extend(!0, e, r),
            e
        }
        function I(e, t, n) {
            for (var r, i, o, s, a = e.contents, u = e.dataTypes; "*" === u[0]; )
                u.shift(),
                void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
            if (r)
                for (i in a)
                    if (a[i] && a[i].test(r)) {
                        u.unshift(i);
                        break
                    }
            if (u[0]in n)
                o = u[0];
            else {
                for (i in n) {
                    if (!u[0] || e.converters[i + " " + u[0]]) {
                        o = i;
                        break
                    }
                    s || (s = i)
                }
                o = o || s
            }
            return o ? (o !== u[0] && u.unshift(o),
            n[o]) : void 0
        }
        function B(e, t, n, r) {
            var i, o, s, a, u, l = {}, c = e.dataTypes.slice();
            if (c[1])
                for (s in e.converters)
                    l[s.toLowerCase()] = e.converters[s];
            for (o = c.shift(); o; )
                if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                u = o,
                o = c.shift())
                    if ("*" === o)
                        o = u;
                    else if ("*" !== u && u !== o) {
                        if (s = l[u + " " + o] || l["* " + o],
                        !s)
                            for (i in l)
                                if (a = i.split(" "),
                                a[1] === o && (s = l[u + " " + a[0]] || l["* " + a[0]])) {
                                    s === !0 ? s = l[i] : l[i] !== !0 && (o = a[0],
                                    c.unshift(a[1]));
                                    break
                                }
                        if (s !== !0)
                            if (s && e["throws"])
                                t = s(t);
                            else
                                try {
                                    t = s(t)
                                } catch (f) {
                                    return {
                                        state: "parsererror",
                                        error: s ? f : "No conversion from " + u + " to " + o
                                    }
                                }
                    }
            return {
                state: "success",
                data: t
            }
        }
        function z(e, t, n, r) {
            var i;
            if (re.isArray(t))
                re.each(t, function(t, i) {
                    n || Dt.test(e) ? r(e, i) : z(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
                });
            else if (n || "object" !== re.type(t))
                r(e, t);
            else
                for (i in t)
                    z(e + "[" + i + "]", t[i], n, r)
        }
        function X(e) {
            return re.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
        }
        var V = []
          , U = V.slice
          , Y = V.concat
          , G = V.push
          , J = V.indexOf
          , Q = {}
          , K = Q.toString
          , Z = Q.hasOwnProperty
          , ee = {}
          , te = n.document
          , ne = "2.1.4"
          , re = function(e, t) {
            return new re.fn.init(e,t)
        }
          , ie = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
          , oe = /^-ms-/
          , se = /-([\da-z])/gi
          , ae = function(e, t) {
            return t.toUpperCase()
        };
        re.fn = re.prototype = {
            jquery: ne,
            constructor: re,
            selector: "",
            length: 0,
            toArray: function() {
                return U.call(this)
            },
            get: function(e) {
                return null != e ? 0 > e ? this[e + this.length] : this[e] : U.call(this)
            },
            pushStack: function(e) {
                var t = re.merge(this.constructor(), e);
                return t.prevObject = this,
                t.context = this.context,
                t
            },
            each: function(e, t) {
                return re.each(this, e, t)
            },
            map: function(e) {
                return this.pushStack(re.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            slice: function() {
                return this.pushStack(U.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length
                  , n = +e + (0 > e ? t : 0);
                return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: G,
            sort: V.sort,
            splice: V.splice
        },
        re.extend = re.fn.extend = function() {
            var e, t, n, r, i, o, s = arguments[0] || {}, a = 1, u = arguments.length, l = !1;
            for ("boolean" == typeof s && (l = s,
            s = arguments[a] || {},
            a++),
            "object" == typeof s || re.isFunction(s) || (s = {}),
            a === u && (s = this,
            a--); u > a; a++)
                if (null != (e = arguments[a]))
                    for (t in e)
                        n = s[t],
                        r = e[t],
                        s !== r && (l && r && (re.isPlainObject(r) || (i = re.isArray(r))) ? (i ? (i = !1,
                        o = n && re.isArray(n) ? n : []) : o = n && re.isPlainObject(n) ? n : {},
                        s[t] = re.extend(l, o, r)) : void 0 !== r && (s[t] = r));
            return s
        }
        ,
        re.extend({
            expando: "jQuery" + (ne + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === re.type(e)
            },
            isArray: Array.isArray,
            isWindow: function(e) {
                return null != e && e === e.window
            },
            isNumeric: function(e) {
                return !re.isArray(e) && e - parseFloat(e) + 1 >= 0
            },
            isPlainObject: function(e) {
                return "object" !== re.type(e) || e.nodeType || re.isWindow(e) ? !1 : e.constructor && !Z.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Q[K.call(e)] || "object" : typeof e
            },
            globalEval: function(e) {
                var t, n = eval;
                e = re.trim(e),
                e && (1 === e.indexOf("use strict") ? (t = te.createElement("script"),
                t.text = e,
                te.head.appendChild(t).parentNode.removeChild(t)) : n(e))
            },
            camelCase: function(e) {
                return e.replace(oe, "ms-").replace(se, ae)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function(e, t, n) {
                var r, i = 0, o = e.length, a = s(e);
                if (n) {
                    if (a)
                        for (; o > i && (r = t.apply(e[i], n),
                        r !== !1); i++)
                            ;
                    else
                        for (i in e)
                            if (r = t.apply(e[i], n),
                            r === !1)
                                break
                } else if (a)
                    for (; o > i && (r = t.call(e[i], i, e[i]),
                    r !== !1); i++)
                        ;
                else
                    for (i in e)
                        if (r = t.call(e[i], i, e[i]),
                        r === !1)
                            break;
                return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(ie, "")
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (s(Object(e)) ? re.merge(n, "string" == typeof e ? [e] : e) : G.call(n, e)),
                n
            },
            inArray: function(e, t, n) {
                return null == t ? -1 : J.call(t, e, n)
            },
            merge: function(e, t) {
                for (var n = +t.length, r = 0, i = e.length; n > r; r++)
                    e[i++] = t[r];
                return e.length = i,
                e
            },
            grep: function(e, t, n) {
                for (var r, i = [], o = 0, s = e.length, a = !n; s > o; o++)
                    r = !t(e[o], o),
                    r !== a && i.push(e[o]);
                return i
            },
            map: function(e, t, n) {
                var r, i = 0, o = e.length, a = s(e), u = [];
                if (a)
                    for (; o > i; i++)
                        r = t(e[i], i, n),
                        null != r && u.push(r);
                else
                    for (i in e)
                        r = t(e[i], i, n),
                        null != r && u.push(r);
                return Y.apply([], u)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, r, i;
                return "string" == typeof t && (n = e[t],
                t = e,
                e = n),
                re.isFunction(e) ? (r = U.call(arguments, 2),
                i = function() {
                    return e.apply(t || this, r.concat(U.call(arguments)))
                }
                ,
                i.guid = e.guid = e.guid || re.guid++,
                i) : void 0
            },
            now: Date.now,
            support: ee
        }),
        re.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
            Q["[object " + t + "]"] = t.toLowerCase()
        });
        var ue = /*!
	 * Sizzle CSS Selector Engine v2.2.0-pre
	 * http://sizzlejs.com/
	 *
	 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-12-16
	 */
        function(e) {
            function t(e, t, n, r) {
                var i, o, s, a, u, l, f, d, h, g;
                if ((t ? t.ownerDocument || t : W) !== q && L(t),
                t = t || q,
                n = n || [],
                a = t.nodeType,
                "string" != typeof e || !e || 1 !== a && 9 !== a && 11 !== a)
                    return n;
                if (!r && F) {
                    if (11 !== a && (i = ye.exec(e)))
                        if (s = i[1]) {
                            if (9 === a) {
                                if (o = t.getElementById(s),
                                !o || !o.parentNode)
                                    return n;
                                if (o.id === s)
                                    return n.push(o),
                                    n
                            } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(s)) && M(t, o) && o.id === s)
                                return n.push(o),
                                n
                        } else {
                            if (i[2])
                                return K.apply(n, t.getElementsByTagName(e)),
                                n;
                            if ((s = i[3]) && w.getElementsByClassName)
                                return K.apply(n, t.getElementsByClassName(s)),
                                n
                        }
                    if (w.qsa && (!O || !O.test(e))) {
                        if (d = f = $,
                        h = t,
                        g = 1 !== a && e,
                        1 === a && "object" !== t.nodeName.toLowerCase()) {
                            for (l = E(e),
                            (f = t.getAttribute("id")) ? d = f.replace(be, "\\$&") : t.setAttribute("id", d),
                            d = "[id='" + d + "'] ",
                            u = l.length; u--; )
                                l[u] = d + p(l[u]);
                            h = xe.test(e) && c(t.parentNode) || t,
                            g = l.join(",")
                        }
                        if (g)
                            try {
                                return K.apply(n, h.querySelectorAll(g)),
                                n
                            } catch (m) {} finally {
                                f || t.removeAttribute("id")
                            }
                    }
                }
                return S(e.replace(ue, "$1"), t, n, r)
            }
            function n() {
                function e(n, r) {
                    return t.push(n + " ") > C.cacheLength && delete e[t.shift()],
                    e[n + " "] = r
                }
                var t = [];
                return e
            }
            function r(e) {
                return e[$] = !0,
                e
            }
            function i(e) {
                var t = q.createElement("div");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t),
                    t = null
                }
            }
            function o(e, t) {
                for (var n = e.split("|"), r = e.length; r--; )
                    C.attrHandle[n[r]] = t
            }
            function s(e, t) {
                var n = t && e
                  , r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || U) - (~e.sourceIndex || U);
                if (r)
                    return r;
                if (n)
                    for (; n = n.nextSibling; )
                        if (n === t)
                            return -1;
                return e ? 1 : -1
            }
            function a(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return "input" === n && t.type === e
                }
            }
            function u(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }
            function l(e) {
                return r(function(t) {
                    return t = +t,
                    r(function(n, r) {
                        for (var i, o = e([], n.length, t), s = o.length; s--; )
                            n[i = o[s]] && (n[i] = !(r[i] = n[i]))
                    })
                })
            }
            function c(e) {
                return e && "undefined" != typeof e.getElementsByTagName && e
            }
            function f() {}
            function p(e) {
                for (var t = 0, n = e.length, r = ""; n > t; t++)
                    r += e[t].value;
                return r
            }
            function d(e, t, n) {
                var r = t.dir
                  , i = n && "parentNode" === r
                  , o = I++;
                return t.first ? function(t, n, o) {
                    for (; t = t[r]; )
                        if (1 === t.nodeType || i)
                            return e(t, n, o)
                }
                : function(t, n, s) {
                    var a, u, l = [_, o];
                    if (s) {
                        for (; t = t[r]; )
                            if ((1 === t.nodeType || i) && e(t, n, s))
                                return !0
                    } else
                        for (; t = t[r]; )
                            if (1 === t.nodeType || i) {
                                if (u = t[$] || (t[$] = {}),
                                (a = u[r]) && a[0] === _ && a[1] === o)
                                    return l[2] = a[2];
                                if (u[r] = l,
                                l[2] = e(t, n, s))
                                    return !0
                            }
                }
            }
            function h(e) {
                return e.length > 1 ? function(t, n, r) {
                    for (var i = e.length; i--; )
                        if (!e[i](t, n, r))
                            return !1;
                    return !0
                }
                : e[0]
            }
            function g(e, n, r) {
                for (var i = 0, o = n.length; o > i; i++)
                    t(e, n[i], r);
                return r
            }
            function m(e, t, n, r, i) {
                for (var o, s = [], a = 0, u = e.length, l = null != t; u > a; a++)
                    (o = e[a]) && (!n || n(o, r, i)) && (s.push(o),
                    l && t.push(a));
                return s
            }
            function v(e, t, n, i, o, s) {
                return i && !i[$] && (i = v(i)),
                o && !o[$] && (o = v(o, s)),
                r(function(r, s, a, u) {
                    var l, c, f, p = [], d = [], h = s.length, v = r || g(t || "*", a.nodeType ? [a] : a, []), y = !e || !r && t ? v : m(v, p, e, a, u), x = n ? o || (r ? e : h || i) ? [] : s : y;
                    if (n && n(y, x, a, u),
                    i)
                        for (l = m(x, d),
                        i(l, [], a, u),
                        c = l.length; c--; )
                            (f = l[c]) && (x[d[c]] = !(y[d[c]] = f));
                    if (r) {
                        if (o || e) {
                            if (o) {
                                for (l = [],
                                c = x.length; c--; )
                                    (f = x[c]) && l.push(y[c] = f);
                                o(null, x = [], l, u)
                            }
                            for (c = x.length; c--; )
                                (f = x[c]) && (l = o ? ee(r, f) : p[c]) > -1 && (r[l] = !(s[l] = f))
                        }
                    } else
                        x = m(x === s ? x.splice(h, x.length) : x),
                        o ? o(null, s, x, u) : K.apply(s, x)
                })
            }
            function y(e) {
                for (var t, n, r, i = e.length, o = C.relative[e[0].type], s = o || C.relative[" "], a = o ? 1 : 0, u = d(function(e) {
                    return e === t
                }, s, !0), l = d(function(e) {
                    return ee(t, e) > -1
                }, s, !0), c = [function(e, n, r) {
                    var i = !o && (r || n !== D) || ((t = n).nodeType ? u(e, n, r) : l(e, n, r));
                    return t = null,
                    i
                }
                ]; i > a; a++)
                    if (n = C.relative[e[a].type])
                        c = [d(h(c), n)];
                    else {
                        if (n = C.filter[e[a].type].apply(null, e[a].matches),
                        n[$]) {
                            for (r = ++a; i > r && !C.relative[e[r].type]; r++)
                                ;
                            return v(a > 1 && h(c), a > 1 && p(e.slice(0, a - 1).concat({
                                value: " " === e[a - 2].type ? "*" : ""
                            })).replace(ue, "$1"), n, r > a && y(e.slice(a, r)), i > r && y(e = e.slice(r)), i > r && p(e))
                        }
                        c.push(n)
                    }
                return h(c)
            }
            function x(e, n) {
                var i = n.length > 0
                  , o = e.length > 0
                  , s = function(r, s, a, u, l) {
                    var c, f, p, d = 0, h = "0", g = r && [], v = [], y = D, x = r || o && C.find.TAG("*", l), b = _ += null == y ? 1 : Math.random() || .1, w = x.length;
                    for (l && (D = s !== q && s); h !== w && null != (c = x[h]); h++) {
                        if (o && c) {
                            for (f = 0; p = e[f++]; )
                                if (p(c, s, a)) {
                                    u.push(c);
                                    break
                                }
                            l && (_ = b)
                        }
                        i && ((c = !p && c) && d--,
                        r && g.push(c))
                    }
                    if (d += h,
                    i && h !== d) {
                        for (f = 0; p = n[f++]; )
                            p(g, v, s, a);
                        if (r) {
                            if (d > 0)
                                for (; h--; )
                                    g[h] || v[h] || (v[h] = J.call(u));
                            v = m(v)
                        }
                        K.apply(u, v),
                        l && !r && v.length > 0 && d + n.length > 1 && t.uniqueSort(u)
                    }
                    return l && (_ = b,
                    D = y),
                    g
                };
                return i ? r(s) : s
            }
            var b, w, C, T, k, E, N, S, D, j, A, L, q, H, F, O, R, P, M, $ = "sizzle" + 1 * new Date, W = e.document, _ = 0, I = 0, B = n(), z = n(), X = n(), V = function(e, t) {
                return e === t && (A = !0),
                0
            }, U = 1 << 31, Y = {}.hasOwnProperty, G = [], J = G.pop, Q = G.push, K = G.push, Z = G.slice, ee = function(e, t) {
                for (var n = 0, r = e.length; r > n; n++)
                    if (e[n] === t)
                        return n;
                return -1
            }, te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", ne = "[\\x20\\t\\r\\n\\f]", re = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", ie = re.replace("w", "w#"), oe = "\\[" + ne + "*(" + re + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ie + "))|)" + ne + "*\\]", se = ":(" + re + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)", ae = new RegExp(ne + "+","g"), ue = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$","g"), le = new RegExp("^" + ne + "*," + ne + "*"), ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"), fe = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]","g"), pe = new RegExp(se), de = new RegExp("^" + ie + "$"), he = {
                ID: new RegExp("^#(" + re + ")"),
                CLASS: new RegExp("^\\.(" + re + ")"),
                TAG: new RegExp("^(" + re.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + oe),
                PSEUDO: new RegExp("^" + se),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)","i"),
                bool: new RegExp("^(?:" + te + ")$","i"),
                needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)","i")
            }, ge = /^(?:input|select|textarea|button)$/i, me = /^h\d$/i, ve = /^[^{]+\{\s*\[native \w/, ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, xe = /[+~]/, be = /'|\\/g, we = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)","ig"), Ce = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            }, Te = function() {
                L()
            };
            try {
                K.apply(G = Z.call(W.childNodes), W.childNodes),
                G[W.childNodes.length].nodeType
            } catch (ke) {
                K = {
                    apply: G.length ? function(e, t) {
                        Q.apply(e, Z.call(t))
                    }
                    : function(e, t) {
                        for (var n = e.length, r = 0; e[n++] = t[r++]; )
                            ;
                        e.length = n - 1
                    }
                }
            }
            w = t.support = {},
            k = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? "HTML" !== t.nodeName : !1
            }
            ,
            L = t.setDocument = function(e) {
                var t, n, r = e ? e.ownerDocument || e : W;
                return r !== q && 9 === r.nodeType && r.documentElement ? (q = r,
                H = r.documentElement,
                n = r.defaultView,
                n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)),
                F = !k(r),
                w.attributes = i(function(e) {
                    return e.className = "i",
                    !e.getAttribute("className")
                }),
                w.getElementsByTagName = i(function(e) {
                    return e.appendChild(r.createComment("")),
                    !e.getElementsByTagName("*").length
                }),
                w.getElementsByClassName = ve.test(r.getElementsByClassName),
                w.getById = i(function(e) {
                    return H.appendChild(e).id = $,
                    !r.getElementsByName || !r.getElementsByName($).length
                }),
                w.getById ? (C.find.ID = function(e, t) {
                    if ("undefined" != typeof t.getElementById && F) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }
                ,
                C.filter.ID = function(e) {
                    var t = e.replace(we, Ce);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }
                ) : (delete C.find.ID,
                C.filter.ID = function(e) {
                    var t = e.replace(we, Ce);
                    return function(e) {
                        var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }
                ),
                C.find.TAG = w.getElementsByTagName ? function(e, t) {
                    return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
                }
                : function(e, t) {
                    var n, r = [], i = 0, o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = o[i++]; )
                            1 === n.nodeType && r.push(n);
                        return r
                    }
                    return o
                }
                ,
                C.find.CLASS = w.getElementsByClassName && function(e, t) {
                    return F ? t.getElementsByClassName(e) : void 0
                }
                ,
                R = [],
                O = [],
                (w.qsa = ve.test(r.querySelectorAll)) && (i(function(e) {
                    H.appendChild(e).innerHTML = "<a id='" + $ + "'></a><select id='" + $ + "-\f]' msallowcapture=''><option selected=''></option></select>",
                    e.querySelectorAll("[msallowcapture^='']").length && O.push("[*^$]=" + ne + "*(?:''|\"\")"),
                    e.querySelectorAll("[selected]").length || O.push("\\[" + ne + "*(?:value|" + te + ")"),
                    e.querySelectorAll("[id~=" + $ + "-]").length || O.push("~="),
                    e.querySelectorAll(":checked").length || O.push(":checked"),
                    e.querySelectorAll("a#" + $ + "+*").length || O.push(".#.+[+~]")
                }),
                i(function(e) {
                    var t = r.createElement("input");
                    t.setAttribute("type", "hidden"),
                    e.appendChild(t).setAttribute("name", "D"),
                    e.querySelectorAll("[name=d]").length && O.push("name" + ne + "*[*^$|!~]?="),
                    e.querySelectorAll(":enabled").length || O.push(":enabled", ":disabled"),
                    e.querySelectorAll("*,:x"),
                    O.push(",.*:")
                })),
                (w.matchesSelector = ve.test(P = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && i(function(e) {
                    w.disconnectedMatch = P.call(e, "div"),
                    P.call(e, "[s!='']:x"),
                    R.push("!=", se)
                }),
                O = O.length && new RegExp(O.join("|")),
                R = R.length && new RegExp(R.join("|")),
                t = ve.test(H.compareDocumentPosition),
                M = t || ve.test(H.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e
                      , r = t && t.parentNode;
                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                }
                : function(e, t) {
                    if (t)
                        for (; t = t.parentNode; )
                            if (t === e)
                                return !0;
                    return !1
                }
                ,
                V = t ? function(e, t) {
                    if (e === t)
                        return A = !0,
                        0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                    1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === r || e.ownerDocument === W && M(W, e) ? -1 : t === r || t.ownerDocument === W && M(W, t) ? 1 : j ? ee(j, e) - ee(j, t) : 0 : 4 & n ? -1 : 1)
                }
                : function(e, t) {
                    if (e === t)
                        return A = !0,
                        0;
                    var n, i = 0, o = e.parentNode, a = t.parentNode, u = [e], l = [t];
                    if (!o || !a)
                        return e === r ? -1 : t === r ? 1 : o ? -1 : a ? 1 : j ? ee(j, e) - ee(j, t) : 0;
                    if (o === a)
                        return s(e, t);
                    for (n = e; n = n.parentNode; )
                        u.unshift(n);
                    for (n = t; n = n.parentNode; )
                        l.unshift(n);
                    for (; u[i] === l[i]; )
                        i++;
                    return i ? s(u[i], l[i]) : u[i] === W ? -1 : l[i] === W ? 1 : 0
                }
                ,
                r) : q
            }
            ,
            t.matches = function(e, n) {
                return t(e, null, null, n)
            }
            ,
            t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== q && L(e),
                n = n.replace(fe, "='$1']"),
                w.matchesSelector && F && (!R || !R.test(n)) && (!O || !O.test(n)))
                    try {
                        var r = P.call(e, n);
                        if (r || w.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                            return r
                    } catch (i) {}
                return t(n, q, null, [e]).length > 0
            }
            ,
            t.contains = function(e, t) {
                return (e.ownerDocument || e) !== q && L(e),
                M(e, t)
            }
            ,
            t.attr = function(e, t) {
                (e.ownerDocument || e) !== q && L(e);
                var n = C.attrHandle[t.toLowerCase()]
                  , r = n && Y.call(C.attrHandle, t.toLowerCase()) ? n(e, t, !F) : void 0;
                return void 0 !== r ? r : w.attributes || !F ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
            }
            ,
            t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }
            ,
            t.uniqueSort = function(e) {
                var t, n = [], r = 0, i = 0;
                if (A = !w.detectDuplicates,
                j = !w.sortStable && e.slice(0),
                e.sort(V),
                A) {
                    for (; t = e[i++]; )
                        t === e[i] && (r = n.push(i));
                    for (; r--; )
                        e.splice(n[r], 1)
                }
                return j = null,
                e
            }
            ,
            T = t.getText = function(e) {
                var t, n = "", r = 0, i = e.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof e.textContent)
                            return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling)
                            n += T(e)
                    } else if (3 === i || 4 === i)
                        return e.nodeValue
                } else
                    for (; t = e[r++]; )
                        n += T(t);
                return n
            }
            ,
            C = t.selectors = {
                cacheLength: 50,
                createPseudo: r,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(we, Ce),
                        e[3] = (e[3] || e[4] || e[5] || "").replace(we, Ce),
                        "~=" === e[2] && (e[3] = " " + e[3] + " "),
                        e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(),
                        "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                        e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                        e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                        e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                        e[2] = n.slice(0, t)),
                        e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(we, Ce).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        }
                        : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = B[e + " "];
                        return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && B(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, r) {
                        return function(i) {
                            var o = t.attr(i, e);
                            return null == o ? "!=" === n : n ? (o += "",
                            "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                        }
                    },
                    CHILD: function(e, t, n, r, i) {
                        var o = "nth" !== e.slice(0, 3)
                          , s = "last" !== e.slice(-4)
                          , a = "of-type" === t;
                        return 1 === r && 0 === i ? function(e) {
                            return !!e.parentNode
                        }
                        : function(t, n, u) {
                            var l, c, f, p, d, h, g = o !== s ? "nextSibling" : "previousSibling", m = t.parentNode, v = a && t.nodeName.toLowerCase(), y = !u && !a;
                            if (m) {
                                if (o) {
                                    for (; g; ) {
                                        for (f = t; f = f[g]; )
                                            if (a ? f.nodeName.toLowerCase() === v : 1 === f.nodeType)
                                                return !1;
                                        h = g = "only" === e && !h && "nextSibling"
                                    }
                                    return !0
                                }
                                if (h = [s ? m.firstChild : m.lastChild],
                                s && y) {
                                    for (c = m[$] || (m[$] = {}),
                                    l = c[e] || [],
                                    d = l[0] === _ && l[1],
                                    p = l[0] === _ && l[2],
                                    f = d && m.childNodes[d]; f = ++d && f && f[g] || (p = d = 0) || h.pop(); )
                                        if (1 === f.nodeType && ++p && f === t) {
                                            c[e] = [_, d, p];
                                            break
                                        }
                                } else if (y && (l = (t[$] || (t[$] = {}))[e]) && l[0] === _)
                                    p = l[1];
                                else
                                    for (; (f = ++d && f && f[g] || (p = d = 0) || h.pop()) && ((a ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++p || (y && ((f[$] || (f[$] = {}))[e] = [_, p]),
                                    f !== t)); )
                                        ;
                                return p -= i,
                                p === r || p % r === 0 && p / r >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, n) {
                        var i, o = C.pseudos[e] || C.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return o[$] ? o(n) : o.length > 1 ? (i = [e, e, "", n],
                        C.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                            for (var r, i = o(e, n), s = i.length; s--; )
                                r = ee(e, i[s]),
                                e[r] = !(t[r] = i[s])
                        }) : function(e) {
                            return o(e, 0, i)
                        }
                        ) : o
                    }
                },
                pseudos: {
                    not: r(function(e) {
                        var t = []
                          , n = []
                          , i = N(e.replace(ue, "$1"));
                        return i[$] ? r(function(e, t, n, r) {
                            for (var o, s = i(e, null, r, []), a = e.length; a--; )
                                (o = s[a]) && (e[a] = !(t[a] = o))
                        }) : function(e, r, o) {
                            return t[0] = e,
                            i(t, null, o, n),
                            t[0] = null,
                            !n.pop()
                        }
                    }),
                    has: r(function(e) {
                        return function(n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: r(function(e) {
                        return e = e.replace(we, Ce),
                        function(t) {
                            return (t.textContent || t.innerText || T(t)).indexOf(e) > -1
                        }
                    }),
                    lang: r(function(e) {
                        return de.test(e || "") || t.error("unsupported lang: " + e),
                        e = e.replace(we, Ce).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = F ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                    return n = n.toLowerCase(),
                                    n === e || 0 === n.indexOf(e + "-");
                            while ((t = t.parentNode) && 1 === t.nodeType);return !1
                        }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === H
                    },
                    focus: function(e) {
                        return e === q.activeElement && (!q.hasFocus || q.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return e.disabled === !1
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex,
                        e.selected === !0
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !C.pseudos.empty(e)
                    },
                    header: function(e) {
                        return me.test(e.nodeName)
                    },
                    input: function(e) {
                        return ge.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: l(function() {
                        return [0]
                    }),
                    last: l(function(e, t) {
                        return [t - 1]
                    }),
                    eq: l(function(e, t, n) {
                        return [0 > n ? n + t : n]
                    }),
                    even: l(function(e, t) {
                        for (var n = 0; t > n; n += 2)
                            e.push(n);
                        return e
                    }),
                    odd: l(function(e, t) {
                        for (var n = 1; t > n; n += 2)
                            e.push(n);
                        return e
                    }),
                    lt: l(function(e, t, n) {
                        for (var r = 0 > n ? n + t : n; --r >= 0; )
                            e.push(r);
                        return e
                    }),
                    gt: l(function(e, t, n) {
                        for (var r = 0 > n ? n + t : n; ++r < t; )
                            e.push(r);
                        return e
                    })
                }
            },
            C.pseudos.nth = C.pseudos.eq;
            for (b in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            })
                C.pseudos[b] = a(b);
            for (b in {
                submit: !0,
                reset: !0
            })
                C.pseudos[b] = u(b);
            return f.prototype = C.filters = C.pseudos,
            C.setFilters = new f,
            E = t.tokenize = function(e, n) {
                var r, i, o, s, a, u, l, c = z[e + " "];
                if (c)
                    return n ? 0 : c.slice(0);
                for (a = e,
                u = [],
                l = C.preFilter; a; ) {
                    (!r || (i = le.exec(a))) && (i && (a = a.slice(i[0].length) || a),
                    u.push(o = [])),
                    r = !1,
                    (i = ce.exec(a)) && (r = i.shift(),
                    o.push({
                        value: r,
                        type: i[0].replace(ue, " ")
                    }),
                    a = a.slice(r.length));
                    for (s in C.filter)
                        !(i = he[s].exec(a)) || l[s] && !(i = l[s](i)) || (r = i.shift(),
                        o.push({
                            value: r,
                            type: s,
                            matches: i
                        }),
                        a = a.slice(r.length));
                    if (!r)
                        break
                }
                return n ? a.length : a ? t.error(e) : z(e, u).slice(0)
            }
            ,
            N = t.compile = function(e, t) {
                var n, r = [], i = [], o = X[e + " "];
                if (!o) {
                    for (t || (t = E(e)),
                    n = t.length; n--; )
                        o = y(t[n]),
                        o[$] ? r.push(o) : i.push(o);
                    o = X(e, x(i, r)),
                    o.selector = e
                }
                return o
            }
            ,
            S = t.select = function(e, t, n, r) {
                var i, o, s, a, u, l = "function" == typeof e && e, f = !r && E(e = l.selector || e);
                if (n = n || [],
                1 === f.length) {
                    if (o = f[0] = f[0].slice(0),
                    o.length > 2 && "ID" === (s = o[0]).type && w.getById && 9 === t.nodeType && F && C.relative[o[1].type]) {
                        if (t = (C.find.ID(s.matches[0].replace(we, Ce), t) || [])[0],
                        !t)
                            return n;
                        l && (t = t.parentNode),
                        e = e.slice(o.shift().value.length)
                    }
                    for (i = he.needsContext.test(e) ? 0 : o.length; i-- && (s = o[i],
                    !C.relative[a = s.type]); )
                        if ((u = C.find[a]) && (r = u(s.matches[0].replace(we, Ce), xe.test(o[0].type) && c(t.parentNode) || t))) {
                            if (o.splice(i, 1),
                            e = r.length && p(o),
                            !e)
                                return K.apply(n, r),
                                n;
                            break
                        }
                }
                return (l || N(e, f))(r, t, !F, n, xe.test(e) && c(t.parentNode) || t),
                n
            }
            ,
            w.sortStable = $.split("").sort(V).join("") === $,
            w.detectDuplicates = !!A,
            L(),
            w.sortDetached = i(function(e) {
                return 1 & e.compareDocumentPosition(q.createElement("div"))
            }),
            i(function(e) {
                return e.innerHTML = "<a href='#'></a>",
                "#" === e.firstChild.getAttribute("href")
            }) || o("type|href|height|width", function(e, t, n) {
                return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }),
            w.attributes && i(function(e) {
                return e.innerHTML = "<input/>",
                e.firstChild.setAttribute("value", ""),
                "" === e.firstChild.getAttribute("value")
            }) || o("value", function(e, t, n) {
                return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
            }),
            i(function(e) {
                return null == e.getAttribute("disabled")
            }) || o(te, function(e, t, n) {
                var r;
                return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
            }),
            t
        }(n);
        re.find = ue,
        re.expr = ue.selectors,
        re.expr[":"] = re.expr.pseudos,
        re.unique = ue.uniqueSort,
        re.text = ue.getText,
        re.isXMLDoc = ue.isXML,
        re.contains = ue.contains;
        var le = re.expr.match.needsContext
          , ce = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
          , fe = /^.[^:#\[\.,]*$/;
        re.filter = function(e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"),
            1 === t.length && 1 === r.nodeType ? re.find.matchesSelector(r, e) ? [r] : [] : re.find.matches(e, re.grep(t, function(e) {
                return 1 === e.nodeType
            }))
        }
        ,
        re.fn.extend({
            find: function(e) {
                var t, n = this.length, r = [], i = this;
                if ("string" != typeof e)
                    return this.pushStack(re(e).filter(function() {
                        for (t = 0; n > t; t++)
                            if (re.contains(i[t], this))
                                return !0
                    }));
                for (t = 0; n > t; t++)
                    re.find(e, i[t], r);
                return r = this.pushStack(n > 1 ? re.unique(r) : r),
                r.selector = this.selector ? this.selector + " " + e : e,
                r
            },
            filter: function(e) {
                return this.pushStack(a(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(a(this, e || [], !0))
            },
            is: function(e) {
                return !!a(this, "string" == typeof e && le.test(e) ? re(e) : e || [], !1).length
            }
        });
        var pe, de = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, he = re.fn.init = function(e, t) {
            var n, r;
            if (!e)
                return this;
            if ("string" == typeof e) {
                if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : de.exec(e),
                !n || !n[1] && t)
                    return !t || t.jquery ? (t || pe).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof re ? t[0] : t,
                    re.merge(this, re.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : te, !0)),
                    ce.test(n[1]) && re.isPlainObject(t))
                        for (n in t)
                            re.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                return r = te.getElementById(n[2]),
                r && r.parentNode && (this.length = 1,
                this[0] = r),
                this.context = te,
                this.selector = e,
                this
            }
            return e.nodeType ? (this.context = this[0] = e,
            this.length = 1,
            this) : re.isFunction(e) ? "undefined" != typeof pe.ready ? pe.ready(e) : e(re) : (void 0 !== e.selector && (this.selector = e.selector,
            this.context = e.context),
            re.makeArray(e, this))
        }
        ;
        he.prototype = re.fn,
        pe = re(te);
        var ge = /^(?:parents|prev(?:Until|All))/
          , me = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
        re.extend({
            dir: function(e, t, n) {
                for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
                    if (1 === e.nodeType) {
                        if (i && re(e).is(n))
                            break;
                        r.push(e)
                    }
                return r
            },
            sibling: function(e, t) {
                for (var n = []; e; e = e.nextSibling)
                    1 === e.nodeType && e !== t && n.push(e);
                return n
            }
        }),
        re.fn.extend({
            has: function(e) {
                var t = re(e, this)
                  , n = t.length;
                return this.filter(function() {
                    for (var e = 0; n > e; e++)
                        if (re.contains(this, t[e]))
                            return !0
                })
            },
            closest: function(e, t) {
                for (var n, r = 0, i = this.length, o = [], s = le.test(e) || "string" != typeof e ? re(e, t || this.context) : 0; i > r; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && re.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
                return this.pushStack(o.length > 1 ? re.unique(o) : o)
            },
            index: function(e) {
                return e ? "string" == typeof e ? J.call(re(e), this[0]) : J.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(re.unique(re.merge(this.get(), re(e, t))))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }),
        re.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return re.dir(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return re.dir(e, "parentNode", n)
            },
            next: function(e) {
                return u(e, "nextSibling")
            },
            prev: function(e) {
                return u(e, "previousSibling")
            },
            nextAll: function(e) {
                return re.dir(e, "nextSibling")
            },
            prevAll: function(e) {
                return re.dir(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return re.dir(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return re.dir(e, "previousSibling", n)
            },
            siblings: function(e) {
                return re.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return re.sibling(e.firstChild)
            },
            contents: function(e) {
                return e.contentDocument || re.merge([], e.childNodes)
            }
        }, function(e, t) {
            re.fn[e] = function(n, r) {
                var i = re.map(this, t, n);
                return "Until" !== e.slice(-5) && (r = n),
                r && "string" == typeof r && (i = re.filter(r, i)),
                this.length > 1 && (me[e] || re.unique(i),
                ge.test(e) && i.reverse()),
                this.pushStack(i)
            }
        });
        var ve = /\S+/g
          , ye = {};
        re.Callbacks = function(e) {
            e = "string" == typeof e ? ye[e] || l(e) : re.extend({}, e);
            var t, n, r, i, o, s, a = [], u = !e.once && [], c = function(l) {
                for (t = e.memory && l,
                n = !0,
                s = i || 0,
                i = 0,
                o = a.length,
                r = !0; a && o > s; s++)
                    if (a[s].apply(l[0], l[1]) === !1 && e.stopOnFalse) {
                        t = !1;
                        break
                    }
                r = !1,
                a && (u ? u.length && c(u.shift()) : t ? a = [] : f.disable())
            }, f = {
                add: function() {
                    if (a) {
                        var n = a.length;
                        !function s(t) {
                            re.each(t, function(t, n) {
                                var r = re.type(n);
                                "function" === r ? e.unique && f.has(n) || a.push(n) : n && n.length && "string" !== r && s(n)
                            })
                        }(arguments),
                        r ? o = a.length : t && (i = n,
                        c(t))
                    }
                    return this
                },
                remove: function() {
                    return a && re.each(arguments, function(e, t) {
                        for (var n; (n = re.inArray(t, a, n)) > -1; )
                            a.splice(n, 1),
                            r && (o >= n && o--,
                            s >= n && s--)
                    }),
                    this
                },
                has: function(e) {
                    return e ? re.inArray(e, a) > -1 : !(!a || !a.length)
                },
                empty: function() {
                    return a = [],
                    o = 0,
                    this
                },
                disable: function() {
                    return a = u = t = void 0,
                    this
                },
                disabled: function() {
                    return !a
                },
                lock: function() {
                    return u = void 0,
                    t || f.disable(),
                    this
                },
                locked: function() {
                    return !u
                },
                fireWith: function(e, t) {
                    return !a || n && !u || (t = t || [],
                    t = [e, t.slice ? t.slice() : t],
                    r ? u.push(t) : c(t)),
                    this
                },
                fire: function() {
                    return f.fireWith(this, arguments),
                    this
                },
                fired: function() {
                    return !!n
                }
            };
            return f
        }
        ,
        re.extend({
            Deferred: function(e) {
                var t = [["resolve", "done", re.Callbacks("once memory"), "resolved"], ["reject", "fail", re.Callbacks("once memory"), "rejected"], ["notify", "progress", re.Callbacks("memory")]]
                  , n = "pending"
                  , r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments),
                        this
                    },
                    then: function() {
                        var e = arguments;
                        return re.Deferred(function(n) {
                            re.each(t, function(t, o) {
                                var s = re.isFunction(e[t]) && e[t];
                                i[o[1]](function() {
                                    var e = s && s.apply(this, arguments);
                                    e && re.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === r ? n.promise() : this, s ? [e] : arguments)
                                })
                            }),
                            e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? re.extend(e, r) : r
                    }
                }
                  , i = {};
                return r.pipe = r.then,
                re.each(t, function(e, o) {
                    var s = o[2]
                      , a = o[3];
                    r[o[1]] = s.add,
                    a && s.add(function() {
                        n = a
                    }, t[1 ^ e][2].disable, t[2][2].lock),
                    i[o[0]] = function() {
                        return i[o[0] + "With"](this === i ? r : this, arguments),
                        this
                    }
                    ,
                    i[o[0] + "With"] = s.fireWith
                }),
                r.promise(i),
                e && e.call(i, i),
                i
            },
            when: function(e) {
                var t, n, r, i = 0, o = U.call(arguments), s = o.length, a = 1 !== s || e && re.isFunction(e.promise) ? s : 0, u = 1 === a ? e : re.Deferred(), l = function(e, n, r) {
                    return function(i) {
                        n[e] = this,
                        r[e] = arguments.length > 1 ? U.call(arguments) : i,
                        r === t ? u.notifyWith(n, r) : --a || u.resolveWith(n, r)
                    }
                };
                if (s > 1)
                    for (t = new Array(s),
                    n = new Array(s),
                    r = new Array(s); s > i; i++)
                        o[i] && re.isFunction(o[i].promise) ? o[i].promise().done(l(i, r, o)).fail(u.reject).progress(l(i, n, t)) : --a;
                return a || u.resolveWith(r, o),
                u.promise()
            }
        });
        var xe;
        re.fn.ready = function(e) {
            return re.ready.promise().done(e),
            this
        }
        ,
        re.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? re.readyWait++ : re.ready(!0)
            },
            ready: function(e) {
                (e === !0 ? --re.readyWait : re.isReady) || (re.isReady = !0,
                e !== !0 && --re.readyWait > 0 || (xe.resolveWith(te, [re]),
                re.fn.triggerHandler && (re(te).triggerHandler("ready"),
                re(te).off("ready"))))
            }
        }),
        re.ready.promise = function(e) {
            return xe || (xe = re.Deferred(),
            "complete" === te.readyState ? setTimeout(re.ready) : (te.addEventListener("DOMContentLoaded", c, !1),
            n.addEventListener("load", c, !1))),
            xe.promise(e)
        }
        ,
        re.ready.promise();
        var be = re.access = function(e, t, n, r, i, o, s) {
            var a = 0
              , u = e.length
              , l = null == n;
            if ("object" === re.type(n)) {
                i = !0;
                for (a in n)
                    re.access(e, t, a, n[a], !0, o, s)
            } else if (void 0 !== r && (i = !0,
            re.isFunction(r) || (s = !0),
            l && (s ? (t.call(e, r),
            t = null) : (l = t,
            t = function(e, t, n) {
                return l.call(re(e), n)
            }
            )),
            t))
                for (; u > a; a++)
                    t(e[a], n, s ? r : r.call(e[a], a, t(e[a], n)));
            return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
        }
        ;
        re.acceptData = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        }
        ,
        f.uid = 1,
        f.accepts = re.acceptData,
        f.prototype = {
            key: function(e) {
                if (!f.accepts(e))
                    return 0;
                var t = {}
                  , n = e[this.expando];
                if (!n) {
                    n = f.uid++;
                    try {
                        t[this.expando] = {
                            value: n
                        },
                        Object.defineProperties(e, t)
                    } catch (r) {
                        t[this.expando] = n,
                        re.extend(e, t)
                    }
                }
                return this.cache[n] || (this.cache[n] = {}),
                n
            },
            set: function(e, t, n) {
                var r, i = this.key(e), o = this.cache[i];
                if ("string" == typeof t)
                    o[t] = n;
                else if (re.isEmptyObject(o))
                    re.extend(this.cache[i], t);
                else
                    for (r in t)
                        o[r] = t[r];
                return o
            },
            get: function(e, t) {
                var n = this.cache[this.key(e)];
                return void 0 === t ? n : n[t]
            },
            access: function(e, t, n) {
                var r;
                return void 0 === t || t && "string" == typeof t && void 0 === n ? (r = this.get(e, t),
                void 0 !== r ? r : this.get(e, re.camelCase(t))) : (this.set(e, t, n),
                void 0 !== n ? n : t)
            },
            remove: function(e, t) {
                var n, r, i, o = this.key(e), s = this.cache[o];
                if (void 0 === t)
                    this.cache[o] = {};
                else {
                    re.isArray(t) ? r = t.concat(t.map(re.camelCase)) : (i = re.camelCase(t),
                    t in s ? r = [t, i] : (r = i,
                    r = r in s ? [r] : r.match(ve) || [])),
                    n = r.length;
                    for (; n--; )
                        delete s[r[n]]
                }
            },
            hasData: function(e) {
                return !re.isEmptyObject(this.cache[e[this.expando]] || {})
            },
            discard: function(e) {
                e[this.expando] && delete this.cache[e[this.expando]]
            }
        };
        var we = new f
          , Ce = new f
          , Te = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
          , ke = /([A-Z])/g;
        re.extend({
            hasData: function(e) {
                return Ce.hasData(e) || we.hasData(e)
            },
            data: function(e, t, n) {
                return Ce.access(e, t, n)
            },
            removeData: function(e, t) {
                Ce.remove(e, t)
            },
            _data: function(e, t, n) {
                return we.access(e, t, n)
            },
            _removeData: function(e, t) {
                we.remove(e, t)
            }
        }),
        re.fn.extend({
            data: function(e, t) {
                var n, r, i, o = this[0], s = o && o.attributes;
                if (void 0 === e) {
                    if (this.length && (i = Ce.get(o),
                    1 === o.nodeType && !we.get(o, "hasDataAttrs"))) {
                        for (n = s.length; n--; )
                            s[n] && (r = s[n].name,
                            0 === r.indexOf("data-") && (r = re.camelCase(r.slice(5)),
                            p(o, r, i[r])));
                        we.set(o, "hasDataAttrs", !0)
                    }
                    return i
                }
                return "object" == typeof e ? this.each(function() {
                    Ce.set(this, e)
                }) : be(this, function(t) {
                    var n, r = re.camelCase(e);
                    if (o && void 0 === t) {
                        if (n = Ce.get(o, e),
                        void 0 !== n)
                            return n;
                        if (n = Ce.get(o, r),
                        void 0 !== n)
                            return n;
                        if (n = p(o, r, void 0),
                        void 0 !== n)
                            return n
                    } else
                        this.each(function() {
                            var n = Ce.get(this, r);
                            Ce.set(this, r, t),
                            -1 !== e.indexOf("-") && void 0 !== n && Ce.set(this, e, t)
                        })
                }, null, t, arguments.length > 1, null, !0)
            },
            removeData: function(e) {
                return this.each(function() {
                    Ce.remove(this, e)
                })
            }
        }),
        re.extend({
            queue: function(e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue",
                r = we.get(e, t),
                n && (!r || re.isArray(n) ? r = we.access(e, t, re.makeArray(n)) : r.push(n)),
                r || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = re.queue(e, t)
                  , r = n.length
                  , i = n.shift()
                  , o = re._queueHooks(e, t)
                  , s = function() {
                    re.dequeue(e, t)
                };
                "inprogress" === i && (i = n.shift(),
                r--),
                i && ("fx" === t && n.unshift("inprogress"),
                delete o.stop,
                i.call(e, s, o)),
                !r && o && o.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return we.get(e, n) || we.access(e, n, {
                    empty: re.Callbacks("once memory").add(function() {
                        we.remove(e, [t + "queue", n])
                    })
                })
            }
        }),
        re.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e,
                e = "fx",
                n--),
                arguments.length < n ? re.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                    var n = re.queue(this, e, t);
                    re._queueHooks(this, e),
                    "fx" === e && "inprogress" !== n[0] && re.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    re.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, r = 1, i = re.Deferred(), o = this, s = this.length, a = function() {
                    --r || i.resolveWith(o, [o])
                };
                for ("string" != typeof e && (t = e,
                e = void 0),
                e = e || "fx"; s--; )
                    n = we.get(o[s], e + "queueHooks"),
                    n && n.empty && (r++,
                    n.empty.add(a));
                return a(),
                i.promise(t)
            }
        });
        var Ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
          , Ne = ["Top", "Right", "Bottom", "Left"]
          , Se = function(e, t) {
            return e = t || e,
            "none" === re.css(e, "display") || !re.contains(e.ownerDocument, e)
        }
          , De = /^(?:checkbox|radio)$/i;
        !function() {
            var e = te.createDocumentFragment()
              , t = e.appendChild(te.createElement("div"))
              , n = te.createElement("input");
            n.setAttribute("type", "radio"),
            n.setAttribute("checked", "checked"),
            n.setAttribute("name", "t"),
            t.appendChild(n),
            ee.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
            t.innerHTML = "<textarea>x</textarea>",
            ee.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
        }();
        var je = "undefined";
        ee.focusinBubbles = "onfocusin"in n;
        var Ae = /^key/
          , Le = /^(?:mouse|pointer|contextmenu)|click/
          , qe = /^(?:focusinfocus|focusoutblur)$/
          , He = /^([^.]*)(?:\.(.+)|)$/;
        re.event = {
            global: {},
            add: function(e, t, n, r, i) {
                var o, s, a, u, l, c, f, p, d, h, g, m = we.get(e);
                if (m)
                    for (n.handler && (o = n,
                    n = o.handler,
                    i = o.selector),
                    n.guid || (n.guid = re.guid++),
                    (u = m.events) || (u = m.events = {}),
                    (s = m.handle) || (s = m.handle = function(t) {
                        return typeof re !== je && re.event.triggered !== t.type ? re.event.dispatch.apply(e, arguments) : void 0
                    }
                    ),
                    t = (t || "").match(ve) || [""],
                    l = t.length; l--; )
                        a = He.exec(t[l]) || [],
                        d = g = a[1],
                        h = (a[2] || "").split(".").sort(),
                        d && (f = re.event.special[d] || {},
                        d = (i ? f.delegateType : f.bindType) || d,
                        f = re.event.special[d] || {},
                        c = re.extend({
                            type: d,
                            origType: g,
                            data: r,
                            handler: n,
                            guid: n.guid,
                            selector: i,
                            needsContext: i && re.expr.match.needsContext.test(i),
                            namespace: h.join(".")
                        }, o),
                        (p = u[d]) || (p = u[d] = [],
                        p.delegateCount = 0,
                        f.setup && f.setup.call(e, r, h, s) !== !1 || e.addEventListener && e.addEventListener(d, s, !1)),
                        f.add && (f.add.call(e, c),
                        c.handler.guid || (c.handler.guid = n.guid)),
                        i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                        re.event.global[d] = !0)
            },
            remove: function(e, t, n, r, i) {
                var o, s, a, u, l, c, f, p, d, h, g, m = we.hasData(e) && we.get(e);
                if (m && (u = m.events)) {
                    for (t = (t || "").match(ve) || [""],
                    l = t.length; l--; )
                        if (a = He.exec(t[l]) || [],
                        d = g = a[1],
                        h = (a[2] || "").split(".").sort(),
                        d) {
                            for (f = re.event.special[d] || {},
                            d = (r ? f.delegateType : f.bindType) || d,
                            p = u[d] || [],
                            a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                            s = o = p.length; o--; )
                                c = p[o],
                                !i && g !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                                c.selector && p.delegateCount--,
                                f.remove && f.remove.call(e, c));
                            s && !p.length && (f.teardown && f.teardown.call(e, h, m.handle) !== !1 || re.removeEvent(e, d, m.handle),
                            delete u[d])
                        } else
                            for (d in u)
                                re.event.remove(e, d + t[l], n, r, !0);
                    re.isEmptyObject(u) && (delete m.handle,
                    we.remove(e, "events"))
                }
            },
            trigger: function(e, t, r, i) {
                var o, s, a, u, l, c, f, p = [r || te], d = Z.call(e, "type") ? e.type : e, h = Z.call(e, "namespace") ? e.namespace.split(".") : [];
                if (s = a = r = r || te,
                3 !== r.nodeType && 8 !== r.nodeType && !qe.test(d + re.event.triggered) && (d.indexOf(".") >= 0 && (h = d.split("."),
                d = h.shift(),
                h.sort()),
                l = d.indexOf(":") < 0 && "on" + d,
                e = e[re.expando] ? e : new re.Event(d,"object" == typeof e && e),
                e.isTrigger = i ? 2 : 3,
                e.namespace = h.join("."),
                e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                e.result = void 0,
                e.target || (e.target = r),
                t = null == t ? [e] : re.makeArray(t, [e]),
                f = re.event.special[d] || {},
                i || !f.trigger || f.trigger.apply(r, t) !== !1)) {
                    if (!i && !f.noBubble && !re.isWindow(r)) {
                        for (u = f.delegateType || d,
                        qe.test(u + d) || (s = s.parentNode); s; s = s.parentNode)
                            p.push(s),
                            a = s;
                        a === (r.ownerDocument || te) && p.push(a.defaultView || a.parentWindow || n)
                    }
                    for (o = 0; (s = p[o++]) && !e.isPropagationStopped(); )
                        e.type = o > 1 ? u : f.bindType || d,
                        c = (we.get(s, "events") || {})[e.type] && we.get(s, "handle"),
                        c && c.apply(s, t),
                        c = l && s[l],
                        c && c.apply && re.acceptData(s) && (e.result = c.apply(s, t),
                        e.result === !1 && e.preventDefault());
                    return e.type = d,
                    i || e.isDefaultPrevented() || f._default && f._default.apply(p.pop(), t) !== !1 || !re.acceptData(r) || l && re.isFunction(r[d]) && !re.isWindow(r) && (a = r[l],
                    a && (r[l] = null),
                    re.event.triggered = d,
                    r[d](),
                    re.event.triggered = void 0,
                    a && (r[l] = a)),
                    e.result
                }
            },
            dispatch: function(e) {
                e = re.event.fix(e);
                var t, n, r, i, o, s = [], a = U.call(arguments), u = (we.get(this, "events") || {})[e.type] || [], l = re.event.special[e.type] || {};
                if (a[0] = e,
                e.delegateTarget = this,
                !l.preDispatch || l.preDispatch.call(this, e) !== !1) {
                    for (s = re.event.handlers.call(this, e, u),
                    t = 0; (i = s[t++]) && !e.isPropagationStopped(); )
                        for (e.currentTarget = i.elem,
                        n = 0; (o = i.handlers[n++]) && !e.isImmediatePropagationStopped(); )
                            (!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o,
                            e.data = o.data,
                            r = ((re.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, a),
                            void 0 !== r && (e.result = r) === !1 && (e.preventDefault(),
                            e.stopPropagation()));
                    return l.postDispatch && l.postDispatch.call(this, e),
                    e.result
                }
            },
            handlers: function(e, t) {
                var n, r, i, o, s = [], a = t.delegateCount, u = e.target;
                if (a && u.nodeType && (!e.button || "click" !== e.type))
                    for (; u !== this; u = u.parentNode || this)
                        if (u.disabled !== !0 || "click" !== e.type) {
                            for (r = [],
                            n = 0; a > n; n++)
                                o = t[n],
                                i = o.selector + " ",
                                void 0 === r[i] && (r[i] = o.needsContext ? re(i, this).index(u) >= 0 : re.find(i, this, null, [u]).length),
                                r[i] && r.push(o);
                            r.length && s.push({
                                elem: u,
                                handlers: r
                            })
                        }
                return a < t.length && s.push({
                    elem: this,
                    handlers: t.slice(a)
                }),
                s
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                    e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, t) {
                    var n, r, i, o = t.button;
                    return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || te,
                    r = n.documentElement,
                    i = n.body,
                    e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0),
                    e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)),
                    e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                    e
                }
            },
            fix: function(e) {
                if (e[re.expando])
                    return e;
                var t, n, r, i = e.type, o = e, s = this.fixHooks[i];
                for (s || (this.fixHooks[i] = s = Le.test(i) ? this.mouseHooks : Ae.test(i) ? this.keyHooks : {}),
                r = s.props ? this.props.concat(s.props) : this.props,
                e = new re.Event(o),
                t = r.length; t--; )
                    n = r[t],
                    e[n] = o[n];
                return e.target || (e.target = te),
                3 === e.target.nodeType && (e.target = e.target.parentNode),
                s.filter ? s.filter(e, o) : e
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        return this !== g() && this.focus ? (this.focus(),
                        !1) : void 0
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === g() && this.blur ? (this.blur(),
                        !1) : void 0
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return "checkbox" === this.type && this.click && re.nodeName(this, "input") ? (this.click(),
                        !1) : void 0
                    },
                    _default: function(e) {
                        return re.nodeName(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = re.extend(new re.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? re.event.trigger(i, null, t) : re.event.dispatch.call(t, i),
                i.isDefaultPrevented() && n.preventDefault()
            }
        },
        re.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        }
        ,
        re.Event = function(e, t) {
            return this instanceof re.Event ? (e && e.type ? (this.originalEvent = e,
            this.type = e.type,
            this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? d : h) : this.type = e,
            t && re.extend(this, t),
            this.timeStamp = e && e.timeStamp || re.now(),
            void (this[re.expando] = !0)) : new re.Event(e,t)
        }
        ,
        re.Event.prototype = {
            isDefaultPrevented: h,
            isPropagationStopped: h,
            isImmediatePropagationStopped: h,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = d,
                e && e.preventDefault && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = d,
                e && e.stopPropagation && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = d,
                e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
                this.stopPropagation()
            }
        },
        re.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            re.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this, i = e.relatedTarget, o = e.handleObj;
                    return (!i || i !== r && !re.contains(r, i)) && (e.type = o.origType,
                    n = o.handler.apply(this, arguments),
                    e.type = t),
                    n
                }
            }
        }),
        ee.focusinBubbles || re.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                re.event.simulate(t, e.target, re.event.fix(e), !0)
            };
            re.event.special[t] = {
                setup: function() {
                    var r = this.ownerDocument || this
                      , i = we.access(r, t);
                    i || r.addEventListener(e, n, !0),
                    we.access(r, t, (i || 0) + 1)
                },
                teardown: function() {
                    var r = this.ownerDocument || this
                      , i = we.access(r, t) - 1;
                    i ? we.access(r, t, i) : (r.removeEventListener(e, n, !0),
                    we.remove(r, t))
                }
            }
        }),
        re.fn.extend({
            on: function(e, t, n, r, i) {
                var o, s;
                if ("object" == typeof e) {
                    "string" != typeof t && (n = n || t,
                    t = void 0);
                    for (s in e)
                        this.on(s, t, n, e[s], i);
                    return this
                }
                if (null == n && null == r ? (r = t,
                n = t = void 0) : null == r && ("string" == typeof t ? (r = n,
                n = void 0) : (r = n,
                n = t,
                t = void 0)),
                r === !1)
                    r = h;
                else if (!r)
                    return this;
                return 1 === i && (o = r,
                r = function(e) {
                    return re().off(e),
                    o.apply(this, arguments)
                }
                ,
                r.guid = o.guid || (o.guid = re.guid++)),
                this.each(function() {
                    re.event.add(this, e, r, n, t)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj)
                    return r = e.handleObj,
                    re(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                    this;
                if ("object" == typeof e) {
                    for (i in e)
                        this.off(i, t, e[i]);
                    return this
                }
                return (t === !1 || "function" == typeof t) && (n = t,
                t = void 0),
                n === !1 && (n = h),
                this.each(function() {
                    re.event.remove(this, e, n, t)
                })
            },
            trigger: function(e, t) {
                return this.each(function() {
                    re.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                return n ? re.event.trigger(e, t, n, !0) : void 0
            }
        });
        var Fe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
          , Oe = /<([\w:]+)/
          , Re = /<|&#?\w+;/
          , Pe = /<(?:script|style|link)/i
          , Me = /checked\s*(?:[^=]|=\s*.checked.)/i
          , $e = /^$|\/(?:java|ecma)script/i
          , We = /^true\/(.*)/
          , _e = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
          , Ie = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
        Ie.optgroup = Ie.option,
        Ie.tbody = Ie.tfoot = Ie.colgroup = Ie.caption = Ie.thead,
        Ie.th = Ie.td,
        re.extend({
            clone: function(e, t, n) {
                var r, i, o, s, a = e.cloneNode(!0), u = re.contains(e.ownerDocument, e);
                if (!(ee.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || re.isXMLDoc(e)))
                    for (s = w(a),
                    o = w(e),
                    r = 0,
                    i = o.length; i > r; r++)
                        C(o[r], s[r]);
                if (t)
                    if (n)
                        for (o = o || w(e),
                        s = s || w(a),
                        r = 0,
                        i = o.length; i > r; r++)
                            b(o[r], s[r]);
                    else
                        b(e, a);
                return s = w(a, "script"),
                s.length > 0 && x(s, !u && w(e, "script")),
                a
            },
            buildFragment: function(e, t, n, r) {
                for (var i, o, s, a, u, l, c = t.createDocumentFragment(), f = [], p = 0, d = e.length; d > p; p++)
                    if (i = e[p],
                    i || 0 === i)
                        if ("object" === re.type(i))
                            re.merge(f, i.nodeType ? [i] : i);
                        else if (Re.test(i)) {
                            for (o = o || c.appendChild(t.createElement("div")),
                            s = (Oe.exec(i) || ["", ""])[1].toLowerCase(),
                            a = Ie[s] || Ie._default,
                            o.innerHTML = a[1] + i.replace(Fe, "<$1></$2>") + a[2],
                            l = a[0]; l--; )
                                o = o.lastChild;
                            re.merge(f, o.childNodes),
                            o = c.firstChild,
                            o.textContent = ""
                        } else
                            f.push(t.createTextNode(i));
                for (c.textContent = "",
                p = 0; i = f[p++]; )
                    if ((!r || -1 === re.inArray(i, r)) && (u = re.contains(i.ownerDocument, i),
                    o = w(c.appendChild(i), "script"),
                    u && x(o),
                    n))
                        for (l = 0; i = o[l++]; )
                            $e.test(i.type || "") && n.push(i);
                return c
            },
            cleanData: function(e) {
                for (var t, n, r, i, o = re.event.special, s = 0; void 0 !== (n = e[s]); s++) {
                    if (re.acceptData(n) && (i = n[we.expando],
                    i && (t = we.cache[i]))) {
                        if (t.events)
                            for (r in t.events)
                                o[r] ? re.event.remove(n, r) : re.removeEvent(n, r, t.handle);
                        we.cache[i] && delete we.cache[i]
                    }
                    delete Ce.cache[n[Ce.expando]]
                }
            }
        }),
        re.fn.extend({
            text: function(e) {
                return be(this, function(e) {
                    return void 0 === e ? re.text(this) : this.empty().each(function() {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = m(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = m(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            remove: function(e, t) {
                for (var n, r = e ? re.filter(e, this) : this, i = 0; null != (n = r[i]); i++)
                    t || 1 !== n.nodeType || re.cleanData(w(n)),
                    n.parentNode && (t && re.contains(n.ownerDocument, n) && x(w(n, "script")),
                    n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++)
                    1 === e.nodeType && (re.cleanData(w(e, !1)),
                    e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e,
                t = null == t ? e : t,
                this.map(function() {
                    return re.clone(this, e, t)
                })
            },
            html: function(e) {
                return be(this, function(e) {
                    var t = this[0] || {}
                      , n = 0
                      , r = this.length;
                    if (void 0 === e && 1 === t.nodeType)
                        return t.innerHTML;
                    if ("string" == typeof e && !Pe.test(e) && !Ie[(Oe.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = e.replace(Fe, "<$1></$2>");
                        try {
                            for (; r > n; n++)
                                t = this[n] || {},
                                1 === t.nodeType && (re.cleanData(w(t, !1)),
                                t.innerHTML = e);
                            t = 0
                        } catch (i) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = arguments[0];
                return this.domManip(arguments, function(t) {
                    e = this.parentNode,
                    re.cleanData(w(this)),
                    e && e.replaceChild(t, this)
                }),
                e && (e.length || e.nodeType) ? this : this.remove()
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, t) {
                e = Y.apply([], e);
                var n, r, i, o, s, a, u = 0, l = this.length, c = this, f = l - 1, p = e[0], d = re.isFunction(p);
                if (d || l > 1 && "string" == typeof p && !ee.checkClone && Me.test(p))
                    return this.each(function(n) {
                        var r = c.eq(n);
                        d && (e[0] = p.call(this, n, r.html())),
                        r.domManip(e, t)
                    });
                if (l && (n = re.buildFragment(e, this[0].ownerDocument, !1, this),
                r = n.firstChild,
                1 === n.childNodes.length && (n = r),
                r)) {
                    for (i = re.map(w(n, "script"), v),
                    o = i.length; l > u; u++)
                        s = n,
                        u !== f && (s = re.clone(s, !0, !0),
                        o && re.merge(i, w(s, "script"))),
                        t.call(this[u], s, u);
                    if (o)
                        for (a = i[i.length - 1].ownerDocument,
                        re.map(i, y),
                        u = 0; o > u; u++)
                            s = i[u],
                            $e.test(s.type || "") && !we.access(s, "globalEval") && re.contains(a, s) && (s.src ? re._evalUrl && re._evalUrl(s.src) : re.globalEval(s.textContent.replace(_e, "")))
                }
                return this
            }
        }),
        re.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            re.fn[e] = function(e) {
                for (var n, r = [], i = re(e), o = i.length - 1, s = 0; o >= s; s++)
                    n = s === o ? this : this.clone(!0),
                    re(i[s])[t](n),
                    G.apply(r, n.get());
                return this.pushStack(r)
            }
        });
        var Be, ze = {}, Xe = /^margin/, Ve = new RegExp("^(" + Ee + ")(?!px)[a-z%]+$","i"), Ue = function(e) {
            return e.ownerDocument.defaultView.opener ? e.ownerDocument.defaultView.getComputedStyle(e, null) : n.getComputedStyle(e, null)
        };
        !function() {
            function e() {
                s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                s.innerHTML = "",
                i.appendChild(o);
                var e = n.getComputedStyle(s, null);
                t = "1%" !== e.top,
                r = "4px" === e.width,
                i.removeChild(o)
            }
            var t, r, i = te.documentElement, o = te.createElement("div"), s = te.createElement("div");
            s.style && (s.style.backgroundClip = "content-box",
            s.cloneNode(!0).style.backgroundClip = "",
            ee.clearCloneStyle = "content-box" === s.style.backgroundClip,
            o.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",
            o.appendChild(s),
            n.getComputedStyle && re.extend(ee, {
                pixelPosition: function() {
                    return e(),
                    t
                },
                boxSizingReliable: function() {
                    return null == r && e(),
                    r
                },
                reliableMarginRight: function() {
                    var e, t = s.appendChild(te.createElement("div"));
                    return t.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                    t.style.marginRight = t.style.width = "0",
                    s.style.width = "1px",
                    i.appendChild(o),
                    e = !parseFloat(n.getComputedStyle(t, null).marginRight),
                    i.removeChild(o),
                    s.removeChild(t),
                    e
                }
            }))
        }(),
        re.swap = function(e, t, n, r) {
            var i, o, s = {};
            for (o in t)
                s[o] = e.style[o],
                e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t)
                e.style[o] = s[o];
            return i
        }
        ;
        var Ye = /^(none|table(?!-c[ea]).+)/
          , Ge = new RegExp("^(" + Ee + ")(.*)$","i")
          , Je = new RegExp("^([+-])=(" + Ee + ")","i")
          , Qe = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }
          , Ke = {
            letterSpacing: "0",
            fontWeight: "400"
        }
          , Ze = ["Webkit", "O", "Moz", "ms"];
        re.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = E(e, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": "cssFloat"
            },
            style: function(e, t, n, r) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var i, o, s, a = re.camelCase(t), u = e.style;
                    return t = re.cssProps[a] || (re.cssProps[a] = S(u, a)),
                    s = re.cssHooks[t] || re.cssHooks[a],
                    void 0 === n ? s && "get"in s && void 0 !== (i = s.get(e, !1, r)) ? i : u[t] : (o = typeof n,
                    "string" === o && (i = Je.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(re.css(e, t)),
                    o = "number"),
                    null != n && n === n && ("number" !== o || re.cssNumber[a] || (n += "px"),
                    ee.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"),
                    s && "set"in s && void 0 === (n = s.set(e, n, r)) || (u[t] = n)),
                    void 0)
                }
            },
            css: function(e, t, n, r) {
                var i, o, s, a = re.camelCase(t);
                return t = re.cssProps[a] || (re.cssProps[a] = S(e.style, a)),
                s = re.cssHooks[t] || re.cssHooks[a],
                s && "get"in s && (i = s.get(e, !0, n)),
                void 0 === i && (i = E(e, t, r)),
                "normal" === i && t in Ke && (i = Ke[t]),
                "" === n || n ? (o = parseFloat(i),
                n === !0 || re.isNumeric(o) ? o || 0 : i) : i
            }
        }),
        re.each(["height", "width"], function(e, t) {
            re.cssHooks[t] = {
                get: function(e, n, r) {
                    return n ? Ye.test(re.css(e, "display")) && 0 === e.offsetWidth ? re.swap(e, Qe, function() {
                        return A(e, t, r)
                    }) : A(e, t, r) : void 0
                },
                set: function(e, n, r) {
                    var i = r && Ue(e);
                    return D(e, n, r ? j(e, t, r, "border-box" === re.css(e, "boxSizing", !1, i), i) : 0)
                }
            }
        }),
        re.cssHooks.marginRight = N(ee.reliableMarginRight, function(e, t) {
            return t ? re.swap(e, {
                display: "inline-block"
            }, E, [e, "marginRight"]) : void 0
        }),
        re.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            re.cssHooks[e + t] = {
                expand: function(n) {
                    for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++)
                        i[e + Ne[r] + t] = o[r] || o[r - 2] || o[0];
                    return i
                }
            },
            Xe.test(e) || (re.cssHooks[e + t].set = D)
        }),
        re.fn.extend({
            css: function(e, t) {
                return be(this, function(e, t, n) {
                    var r, i, o = {}, s = 0;
                    if (re.isArray(t)) {
                        for (r = Ue(e),
                        i = t.length; i > s; s++)
                            o[t[s]] = re.css(e, t[s], !1, r);
                        return o
                    }
                    return void 0 !== n ? re.style(e, t, n) : re.css(e, t)
                }, e, t, arguments.length > 1)
            },
            show: function() {
                return L(this, !0)
            },
            hide: function() {
                return L(this)
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                    Se(this) ? re(this).show() : re(this).hide()
                })
            }
        }),
        re.Tween = q,
        q.prototype = {
            constructor: q,
            init: function(e, t, n, r, i, o) {
                this.elem = e,
                this.prop = n,
                this.easing = i || "swing",
                this.options = t,
                this.start = this.now = this.cur(),
                this.end = r,
                this.unit = o || (re.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = q.propHooks[this.prop];
                return e && e.get ? e.get(this) : q.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = q.propHooks[this.prop];
                return this.options.duration ? this.pos = t = re.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
                this.now = (this.end - this.start) * t + this.start,
                this.options.step && this.options.step.call(this.elem, this.now, this),
                n && n.set ? n.set(this) : q.propHooks._default.set(this),
                this
            }
        },
        q.prototype.init.prototype = q.prototype,
        q.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = re.css(e.elem, e.prop, ""),
                    t && "auto" !== t ? t : 0) : e.elem[e.prop]
                },
                set: function(e) {
                    re.fx.step[e.prop] ? re.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[re.cssProps[e.prop]] || re.cssHooks[e.prop]) ? re.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        },
        q.propHooks.scrollTop = q.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        },
        re.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        },
        re.fx = q.prototype.init,
        re.fx.step = {};
        var et, tt, nt = /^(?:toggle|show|hide)$/, rt = new RegExp("^(?:([+-])=|)(" + Ee + ")([a-z%]*)$","i"), it = /queueHooks$/, ot = [R], st = {
            "*": [function(e, t) {
                var n = this.createTween(e, t)
                  , r = n.cur()
                  , i = rt.exec(t)
                  , o = i && i[3] || (re.cssNumber[e] ? "" : "px")
                  , s = (re.cssNumber[e] || "px" !== o && +r) && rt.exec(re.css(n.elem, e))
                  , a = 1
                  , u = 20;
                if (s && s[3] !== o) {
                    o = o || s[3],
                    i = i || [],
                    s = +r || 1;
                    do
                        a = a || ".5",
                        s /= a,
                        re.style(n.elem, e, s + o);
                    while (a !== (a = n.cur() / r) && 1 !== a && --u)
                }
                return i && (s = n.start = +s || +r || 0,
                n.unit = o,
                n.end = i[1] ? s + (i[1] + 1) * i[2] : +i[2]),
                n
            }
            ]
        };
        re.Animation = re.extend(M, {
            tweener: function(e, t) {
                re.isFunction(e) ? (t = e,
                e = ["*"]) : e = e.split(" ");
                for (var n, r = 0, i = e.length; i > r; r++)
                    n = e[r],
                    st[n] = st[n] || [],
                    st[n].unshift(t)
            },
            prefilter: function(e, t) {
                t ? ot.unshift(e) : ot.push(e)
            }
        }),
        re.speed = function(e, t, n) {
            var r = e && "object" == typeof e ? re.extend({}, e) : {
                complete: n || !n && t || re.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !re.isFunction(t) && t
            };
            return r.duration = re.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in re.fx.speeds ? re.fx.speeds[r.duration] : re.fx.speeds._default,
            (null == r.queue || r.queue === !0) && (r.queue = "fx"),
            r.old = r.complete,
            r.complete = function() {
                re.isFunction(r.old) && r.old.call(this),
                r.queue && re.dequeue(this, r.queue)
            }
            ,
            r
        }
        ,
        re.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(Se).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r)
            },
            animate: function(e, t, n, r) {
                var i = re.isEmptyObject(e)
                  , o = re.speed(t, n, r)
                  , s = function() {
                    var t = M(this, re.extend({}, e), o);
                    (i || we.get(this, "finish")) && t.stop(!0)
                };
                return s.finish = s,
                i || o.queue === !1 ? this.each(s) : this.queue(o.queue, s)
            },
            stop: function(e, t, n) {
                var r = function(e) {
                    var t = e.stop;
                    delete e.stop,
                    t(n)
                };
                return "string" != typeof e && (n = t,
                t = e,
                e = void 0),
                t && e !== !1 && this.queue(e || "fx", []),
                this.each(function() {
                    var t = !0
                      , i = null != e && e + "queueHooks"
                      , o = re.timers
                      , s = we.get(this);
                    if (i)
                        s[i] && s[i].stop && r(s[i]);
                    else
                        for (i in s)
                            s[i] && s[i].stop && it.test(i) && r(s[i]);
                    for (i = o.length; i--; )
                        o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n),
                        t = !1,
                        o.splice(i, 1));
                    (t || !n) && re.dequeue(this, e)
                })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"),
                this.each(function() {
                    var t, n = we.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = re.timers, s = r ? r.length : 0;
                    for (n.finish = !0,
                    re.queue(this, e, []),
                    i && i.stop && i.stop.call(this, !0),
                    t = o.length; t--; )
                        o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                        o.splice(t, 1));
                    for (t = 0; s > t; t++)
                        r[t] && r[t].finish && r[t].finish.call(this);
                    delete n.finish
                })
            }
        }),
        re.each(["toggle", "show", "hide"], function(e, t) {
            var n = re.fn[t];
            re.fn[t] = function(e, r, i) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(F(t, !0), e, r, i)
            }
        }),
        re.each({
            slideDown: F("show"),
            slideUp: F("hide"),
            slideToggle: F("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            re.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r)
            }
        }),
        re.timers = [],
        re.fx.tick = function() {
            var e, t = 0, n = re.timers;
            for (et = re.now(); t < n.length; t++)
                e = n[t],
                e() || n[t] !== e || n.splice(t--, 1);
            n.length || re.fx.stop(),
            et = void 0
        }
        ,
        re.fx.timer = function(e) {
            re.timers.push(e),
            e() ? re.fx.start() : re.timers.pop()
        }
        ,
        re.fx.interval = 13,
        re.fx.start = function() {
            tt || (tt = setInterval(re.fx.tick, re.fx.interval))
        }
        ,
        re.fx.stop = function() {
            clearInterval(tt),
            tt = null
        }
        ,
        re.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        re.fn.delay = function(e, t) {
            return e = re.fx ? re.fx.speeds[e] || e : e,
            t = t || "fx",
            this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        }
        ,
        function() {
            var e = te.createElement("input")
              , t = te.createElement("select")
              , n = t.appendChild(te.createElement("option"));
            e.type = "checkbox",
            ee.checkOn = "" !== e.value,
            ee.optSelected = n.selected,
            t.disabled = !0,
            ee.optDisabled = !n.disabled,
            e = te.createElement("input"),
            e.value = "t",
            e.type = "radio",
            ee.radioValue = "t" === e.value
        }();
        var at, ut, lt = re.expr.attrHandle;
        re.fn.extend({
            attr: function(e, t) {
                return be(this, re.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    re.removeAttr(this, e)
                })
            }
        }),
        re.extend({
            attr: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (e && 3 !== o && 8 !== o && 2 !== o)
                    return typeof e.getAttribute === je ? re.prop(e, t, n) : (1 === o && re.isXMLDoc(e) || (t = t.toLowerCase(),
                    r = re.attrHooks[t] || (re.expr.match.bool.test(t) ? ut : at)),
                    void 0 === n ? r && "get"in r && null !== (i = r.get(e, t)) ? i : (i = re.find.attr(e, t),
                    null == i ? void 0 : i) : null !== n ? r && "set"in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""),
                    n) : void re.removeAttr(e, t))
            },
            removeAttr: function(e, t) {
                var n, r, i = 0, o = t && t.match(ve);
                if (o && 1 === e.nodeType)
                    for (; n = o[i++]; )
                        r = re.propFix[n] || n,
                        re.expr.match.bool.test(n) && (e[r] = !1),
                        e.removeAttribute(n)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!ee.radioValue && "radio" === t && re.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t),
                            n && (e.value = n),
                            t
                        }
                    }
                }
            }
        }),
        ut = {
            set: function(e, t, n) {
                return t === !1 ? re.removeAttr(e, n) : e.setAttribute(n, n),
                n
            }
        },
        re.each(re.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = lt[t] || re.find.attr;
            lt[t] = function(e, t, r) {
                var i, o;
                return r || (o = lt[t],
                lt[t] = i,
                i = null != n(e, t, r) ? t.toLowerCase() : null,
                lt[t] = o),
                i
            }
        });
        var ct = /^(?:input|select|textarea|button)$/i;
        re.fn.extend({
            prop: function(e, t) {
                return be(this, re.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return this.each(function() {
                    delete this[re.propFix[e] || e]
                })
            }
        }),
        re.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(e, t, n) {
                var r, i, o, s = e.nodeType;
                if (e && 3 !== s && 8 !== s && 2 !== s)
                    return o = 1 !== s || !re.isXMLDoc(e),
                    o && (t = re.propFix[t] || t,
                    i = re.propHooks[t]),
                    void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        return e.hasAttribute("tabindex") || ct.test(e.nodeName) || e.href ? e.tabIndex : -1
                    }
                }
            }
        }),
        ee.optSelected || (re.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex,
                null
            }
        }),
        re.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            re.propFix[this.toLowerCase()] = this
        });
        var ft = /[\t\r\n\f]/g;
        re.fn.extend({
            addClass: function(e) {
                var t, n, r, i, o, s, a = "string" == typeof e && e, u = 0, l = this.length;
                if (re.isFunction(e))
                    return this.each(function(t) {
                        re(this).addClass(e.call(this, t, this.className))
                    });
                if (a)
                    for (t = (e || "").match(ve) || []; l > u; u++)
                        if (n = this[u],
                        r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ft, " ") : " ")) {
                            for (o = 0; i = t[o++]; )
                                r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                            s = re.trim(r),
                            n.className !== s && (n.className = s)
                        }
                return this
            },
            removeClass: function(e) {
                var t, n, r, i, o, s, a = 0 === arguments.length || "string" == typeof e && e, u = 0, l = this.length;
                if (re.isFunction(e))
                    return this.each(function(t) {
                        re(this).removeClass(e.call(this, t, this.className))
                    });
                if (a)
                    for (t = (e || "").match(ve) || []; l > u; u++)
                        if (n = this[u],
                        r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ft, " ") : "")) {
                            for (o = 0; i = t[o++]; )
                                for (; r.indexOf(" " + i + " ") >= 0; )
                                    r = r.replace(" " + i + " ", " ");
                            s = e ? re.trim(r) : "",
                            n.className !== s && (n.className = s)
                        }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : re.isFunction(e) ? this.each(function(n) {
                    re(this).toggleClass(e.call(this, n, this.className, t), t)
                }) : this.each(function() {
                    if ("string" === n)
                        for (var t, r = 0, i = re(this), o = e.match(ve) || []; t = o[r++]; )
                            i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                    else
                        (n === je || "boolean" === n) && (this.className && we.set(this, "__className__", this.className),
                        this.className = this.className || e === !1 ? "" : we.get(this, "__className__") || "")
                })
            },
            hasClass: function(e) {
                for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
                    if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(ft, " ").indexOf(t) >= 0)
                        return !0;
                return !1
            }
        });
        var pt = /\r/g;
        re.fn.extend({
            val: function(e) {
                var t, n, r, i = this[0];
                {
                    if (arguments.length)
                        return r = re.isFunction(e),
                        this.each(function(n) {
                            var i;
                            1 === this.nodeType && (i = r ? e.call(this, n, re(this).val()) : e,
                            null == i ? i = "" : "number" == typeof i ? i += "" : re.isArray(i) && (i = re.map(i, function(e) {
                                return null == e ? "" : e + ""
                            })),
                            t = re.valHooks[this.type] || re.valHooks[this.nodeName.toLowerCase()],
                            t && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                        });
                    if (i)
                        return t = re.valHooks[i.type] || re.valHooks[i.nodeName.toLowerCase()],
                        t && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value,
                        "string" == typeof n ? n.replace(pt, "") : null == n ? "" : n)
                }
            }
        }),
        re.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = re.find.attr(e, "value");
                        return null != t ? t : re.trim(re.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, s = o ? null : [], a = o ? i + 1 : r.length, u = 0 > i ? a : o ? i : 0; a > u; u++)
                            if (n = r[u],
                            (n.selected || u === i) && (ee.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !re.nodeName(n.parentNode, "optgroup"))) {
                                if (t = re(n).val(),
                                o)
                                    return t;
                                s.push(t)
                            }
                        return s
                    },
                    set: function(e, t) {
                        for (var n, r, i = e.options, o = re.makeArray(t), s = i.length; s--; )
                            r = i[s],
                            (r.selected = re.inArray(r.value, o) >= 0) && (n = !0);
                        return n || (e.selectedIndex = -1),
                        o
                    }
                }
            }
        }),
        re.each(["radio", "checkbox"], function() {
            re.valHooks[this] = {
                set: function(e, t) {
                    return re.isArray(t) ? e.checked = re.inArray(re(e).val(), t) >= 0 : void 0
                }
            },
            ee.checkOn || (re.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value
            }
            )
        }),
        re.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            re.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }),
        re.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        });
        var dt = re.now()
          , ht = /\?/;
        re.parseJSON = function(e) {
            return JSON.parse(e + "")
        }
        ,
        re.parseXML = function(e) {
            var t, n;
            if (!e || "string" != typeof e)
                return null;
            try {
                n = new DOMParser,
                t = n.parseFromString(e, "text/xml")
            } catch (r) {
                t = void 0
            }
            return (!t || t.getElementsByTagName("parsererror").length) && re.error("Invalid XML: " + e),
            t
        }
        ;
        var gt = /#.*$/
          , mt = /([?&])_=[^&]*/
          , vt = /^(.*?):[ \t]*([^\r\n]*)$/gm
          , yt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
          , xt = /^(?:GET|HEAD)$/
          , bt = /^\/\//
          , wt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/
          , Ct = {}
          , Tt = {}
          , kt = "*/".concat("*")
          , Et = n.location.href
          , Nt = wt.exec(Et.toLowerCase()) || [];
        re.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Et,
                type: "GET",
                isLocal: yt.test(Nt[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": kt,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": re.parseJSON,
                    "text xml": re.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? _(_(e, re.ajaxSettings), t) : _(re.ajaxSettings, e)
            },
            ajaxPrefilter: $(Ct),
            ajaxTransport: $(Tt),
            ajax: function(e, t) {
                function n(e, t, n, s) {
                    var u, c, v, y, b, C = t;
                    2 !== x && (x = 2,
                    a && clearTimeout(a),
                    r = void 0,
                    o = s || "",
                    w.readyState = e > 0 ? 4 : 0,
                    u = e >= 200 && 300 > e || 304 === e,
                    n && (y = I(f, w, n)),
                    y = B(f, y, w, u),
                    u ? (f.ifModified && (b = w.getResponseHeader("Last-Modified"),
                    b && (re.lastModified[i] = b),
                    b = w.getResponseHeader("etag"),
                    b && (re.etag[i] = b)),
                    204 === e || "HEAD" === f.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = y.state,
                    c = y.data,
                    v = y.error,
                    u = !v)) : (v = C,
                    (e || !C) && (C = "error",
                    0 > e && (e = 0))),
                    w.status = e,
                    w.statusText = (t || C) + "",
                    u ? h.resolveWith(p, [c, C, w]) : h.rejectWith(p, [w, C, v]),
                    w.statusCode(m),
                    m = void 0,
                    l && d.trigger(u ? "ajaxSuccess" : "ajaxError", [w, f, u ? c : v]),
                    g.fireWith(p, [w, C]),
                    l && (d.trigger("ajaxComplete", [w, f]),
                    --re.active || re.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (t = e,
                e = void 0),
                t = t || {};
                var r, i, o, s, a, u, l, c, f = re.ajaxSetup({}, t), p = f.context || f, d = f.context && (p.nodeType || p.jquery) ? re(p) : re.event, h = re.Deferred(), g = re.Callbacks("once memory"), m = f.statusCode || {}, v = {}, y = {}, x = 0, b = "canceled", w = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === x) {
                            if (!s)
                                for (s = {}; t = vt.exec(o); )
                                    s[t[1].toLowerCase()] = t[2];
                            t = s[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === x ? o : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return x || (e = y[n] = y[n] || e,
                        v[e] = t),
                        this
                    },
                    overrideMimeType: function(e) {
                        return x || (f.mimeType = e),
                        this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > x)
                                for (t in e)
                                    m[t] = [m[t], e[t]];
                            else
                                w.always(e[w.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || b;
                        return r && r.abort(t),
                        n(0, t),
                        this
                    }
                };
                if (h.promise(w).complete = g.add,
                w.success = w.done,
                w.error = w.fail,
                f.url = ((e || f.url || Et) + "").replace(gt, "").replace(bt, Nt[1] + "//"),
                f.type = t.method || t.type || f.method || f.type,
                f.dataTypes = re.trim(f.dataType || "*").toLowerCase().match(ve) || [""],
                null == f.crossDomain && (u = wt.exec(f.url.toLowerCase()),
                f.crossDomain = !(!u || u[1] === Nt[1] && u[2] === Nt[2] && (u[3] || ("http:" === u[1] ? "80" : "443")) === (Nt[3] || ("http:" === Nt[1] ? "80" : "443")))),
                f.data && f.processData && "string" != typeof f.data && (f.data = re.param(f.data, f.traditional)),
                W(Ct, f, t, w),
                2 === x)
                    return w;
                l = re.event && f.global,
                l && 0 === re.active++ && re.event.trigger("ajaxStart"),
                f.type = f.type.toUpperCase(),
                f.hasContent = !xt.test(f.type),
                i = f.url,
                f.hasContent || (f.data && (i = f.url += (ht.test(i) ? "&" : "?") + f.data,
                delete f.data),
                f.cache === !1 && (f.url = mt.test(i) ? i.replace(mt, "$1_=" + dt++) : i + (ht.test(i) ? "&" : "?") + "_=" + dt++)),
                f.ifModified && (re.lastModified[i] && w.setRequestHeader("If-Modified-Since", re.lastModified[i]),
                re.etag[i] && w.setRequestHeader("If-None-Match", re.etag[i])),
                (f.data && f.hasContent && f.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", f.contentType),
                w.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + kt + "; q=0.01" : "") : f.accepts["*"]);
                for (c in f.headers)
                    w.setRequestHeader(c, f.headers[c]);
                if (f.beforeSend && (f.beforeSend.call(p, w, f) === !1 || 2 === x))
                    return w.abort();
                b = "abort";
                for (c in {
                    success: 1,
                    error: 1,
                    complete: 1
                })
                    w[c](f[c]);
                if (r = W(Tt, f, t, w)) {
                    w.readyState = 1,
                    l && d.trigger("ajaxSend", [w, f]),
                    f.async && f.timeout > 0 && (a = setTimeout(function() {
                        w.abort("timeout")
                    }, f.timeout));
                    try {
                        x = 1,
                        r.send(v, n)
                    } catch (C) {
                        if (!(2 > x))
                            throw C;
                        n(-1, C)
                    }
                } else
                    n(-1, "No Transport");
                return w
            },
            getJSON: function(e, t, n) {
                return re.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return re.get(e, void 0, t, "script")
            }
        }),
        re.each(["get", "post"], function(e, t) {
            re[t] = function(e, n, r, i) {
                return re.isFunction(n) && (i = i || r,
                r = n,
                n = void 0),
                re.ajax({
                    url: e,
                    type: t,
                    dataType: i,
                    data: n,
                    success: r
                })
            }
        }),
        re._evalUrl = function(e) {
            return re.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
        ,
        re.fn.extend({
            wrapAll: function(e) {
                var t;
                return re.isFunction(e) ? this.each(function(t) {
                    re(this).wrapAll(e.call(this, t))
                }) : (this[0] && (t = re(e, this[0].ownerDocument).eq(0).clone(!0),
                this[0].parentNode && t.insertBefore(this[0]),
                t.map(function() {
                    for (var e = this; e.firstElementChild; )
                        e = e.firstElementChild;
                    return e
                }).append(this)),
                this)
            },
            wrapInner: function(e) {
                return re.isFunction(e) ? this.each(function(t) {
                    re(this).wrapInner(e.call(this, t))
                }) : this.each(function() {
                    var t = re(this)
                      , n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = re.isFunction(e);
                return this.each(function(n) {
                    re(this).wrapAll(t ? e.call(this, n) : e);
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    re.nodeName(this, "body") || re(this).replaceWith(this.childNodes)
                }).end()
            }
        }),
        re.expr.filters.hidden = function(e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0
        }
        ,
        re.expr.filters.visible = function(e) {
            return !re.expr.filters.hidden(e)
        }
        ;
        var St = /%20/g
          , Dt = /\[\]$/
          , jt = /\r?\n/g
          , At = /^(?:submit|button|image|reset|file)$/i
          , Lt = /^(?:input|select|textarea|keygen)/i;
        re.param = function(e, t) {
            var n, r = [], i = function(e, t) {
                t = re.isFunction(t) ? t() : null == t ? "" : t,
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
            if (void 0 === t && (t = re.ajaxSettings && re.ajaxSettings.traditional),
            re.isArray(e) || e.jquery && !re.isPlainObject(e))
                re.each(e, function() {
                    i(this.name, this.value)
                });
            else
                for (n in e)
                    z(n, e[n], t, i);
            return r.join("&").replace(St, "+")
        }
        ,
        re.fn.extend({
            serialize: function() {
                return re.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = re.prop(this, "elements");
                    return e ? re.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !re(this).is(":disabled") && Lt.test(this.nodeName) && !At.test(e) && (this.checked || !De.test(e))
                }).map(function(e, t) {
                    var n = re(this).val();
                    return null == n ? null : re.isArray(n) ? re.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(jt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(jt, "\r\n")
                    }
                }).get()
            }
        }),
        re.ajaxSettings.xhr = function() {
            try {
                return new XMLHttpRequest
            } catch (e) {}
        }
        ;
        var qt = 0
          , Ht = {}
          , Ft = {
            0: 200,
            1223: 204
        }
          , Ot = re.ajaxSettings.xhr();
        n.attachEvent && n.attachEvent("onunload", function() {
            for (var e in Ht)
                Ht[e]()
        }),
        ee.cors = !!Ot && "withCredentials"in Ot,
        ee.ajax = Ot = !!Ot,
        re.ajaxTransport(function(e) {
            var t;
            return ee.cors || Ot && !e.crossDomain ? {
                send: function(n, r) {
                    var i, o = e.xhr(), s = ++qt;
                    if (o.open(e.type, e.url, e.async, e.username, e.password),
                    e.xhrFields)
                        for (i in e.xhrFields)
                            o[i] = e.xhrFields[i];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType),
                    e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (i in n)
                        o.setRequestHeader(i, n[i]);
                    t = function(e) {
                        return function() {
                            t && (delete Ht[s],
                            t = o.onload = o.onerror = null,
                            "abort" === e ? o.abort() : "error" === e ? r(o.status, o.statusText) : r(Ft[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                                text: o.responseText
                            } : void 0, o.getAllResponseHeaders()))
                        }
                    }
                    ,
                    o.onload = t(),
                    o.onerror = t("error"),
                    t = Ht[s] = t("abort");
                    try {
                        o.send(e.hasContent && e.data || null)
                    } catch (a) {
                        if (t)
                            throw a
                    }
                },
                abort: function() {
                    t && t()
                }
            } : void 0
        }),
        re.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(e) {
                    return re.globalEval(e),
                    e
                }
            }
        }),
        re.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1),
            e.crossDomain && (e.type = "GET")
        }),
        re.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var t, n;
                return {
                    send: function(r, i) {
                        t = re("<script>").prop({
                            async: !0,
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                            t.remove(),
                            n = null,
                            e && i("error" === e.type ? 404 : 200, e.type)
                        }
                        ),
                        te.head.appendChild(t[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        });
        var Rt = []
          , Pt = /(=)\?(?=&|$)|\?\?/;
        re.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = Rt.pop() || re.expando + "_" + dt++;
                return this[e] = !0,
                e
            }
        }),
        re.ajaxPrefilter("json jsonp", function(e, t, r) {
            var i, o, s, a = e.jsonp !== !1 && (Pt.test(e.url) ? "url" : "string" == typeof e.data && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && Pt.test(e.data) && "data");
            return a || "jsonp" === e.dataTypes[0] ? (i = e.jsonpCallback = re.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback,
            a ? e[a] = e[a].replace(Pt, "$1" + i) : e.jsonp !== !1 && (e.url += (ht.test(e.url) ? "&" : "?") + e.jsonp + "=" + i),
            e.converters["script json"] = function() {
                return s || re.error(i + " was not called"),
                s[0]
            }
            ,
            e.dataTypes[0] = "json",
            o = n[i],
            n[i] = function() {
                s = arguments
            }
            ,
            r.always(function() {
                n[i] = o,
                e[i] && (e.jsonpCallback = t.jsonpCallback,
                Rt.push(i)),
                s && re.isFunction(o) && o(s[0]),
                s = o = void 0
            }),
            "script") : void 0
        }),
        re.parseHTML = function(e, t, n) {
            if (!e || "string" != typeof e)
                return null;
            "boolean" == typeof t && (n = t,
            t = !1),
            t = t || te;
            var r = ce.exec(e)
              , i = !n && [];
            return r ? [t.createElement(r[1])] : (r = re.buildFragment([e], t, i),
            i && i.length && re(i).remove(),
            re.merge([], r.childNodes))
        }
        ;
        var Mt = re.fn.load;
        re.fn.load = function(e, t, n) {
            if ("string" != typeof e && Mt)
                return Mt.apply(this, arguments);
            var r, i, o, s = this, a = e.indexOf(" ");
            return a >= 0 && (r = re.trim(e.slice(a)),
            e = e.slice(0, a)),
            re.isFunction(t) ? (n = t,
            t = void 0) : t && "object" == typeof t && (i = "POST"),
            s.length > 0 && re.ajax({
                url: e,
                type: i,
                dataType: "html",
                data: t
            }).done(function(e) {
                o = arguments,
                s.html(r ? re("<div>").append(re.parseHTML(e)).find(r) : e)
            }).complete(n && function(e, t) {
                s.each(n, o || [e.responseText, t, e])
            }
            ),
            this
        }
        ,
        re.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            re.fn[t] = function(e) {
                return this.on(t, e)
            }
        }),
        re.expr.filters.animated = function(e) {
            return re.grep(re.timers, function(t) {
                return e === t.elem
            }).length
        }
        ;
        var $t = n.document.documentElement;
        re.offset = {
            setOffset: function(e, t, n) {
                var r, i, o, s, a, u, l, c = re.css(e, "position"), f = re(e), p = {};
                "static" === c && (e.style.position = "relative"),
                a = f.offset(),
                o = re.css(e, "top"),
                u = re.css(e, "left"),
                l = ("absolute" === c || "fixed" === c) && (o + u).indexOf("auto") > -1,
                l ? (r = f.position(),
                s = r.top,
                i = r.left) : (s = parseFloat(o) || 0,
                i = parseFloat(u) || 0),
                re.isFunction(t) && (t = t.call(e, n, a)),
                null != t.top && (p.top = t.top - a.top + s),
                null != t.left && (p.left = t.left - a.left + i),
                "using"in t ? t.using.call(e, p) : f.css(p)
            }
        },
        re.fn.extend({
            offset: function(e) {
                if (arguments.length)
                    return void 0 === e ? this : this.each(function(t) {
                        re.offset.setOffset(this, e, t)
                    });
                var t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                }, o = r && r.ownerDocument;
                if (o)
                    return t = o.documentElement,
                    re.contains(t, r) ? (typeof r.getBoundingClientRect !== je && (i = r.getBoundingClientRect()),
                    n = X(o),
                    {
                        top: i.top + n.pageYOffset - t.clientTop,
                        left: i.left + n.pageXOffset - t.clientLeft
                    }) : i
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = this[0], r = {
                        top: 0,
                        left: 0
                    };
                    return "fixed" === re.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(),
                    t = this.offset(),
                    re.nodeName(e[0], "html") || (r = e.offset()),
                    r.top += re.css(e[0], "borderTopWidth", !0),
                    r.left += re.css(e[0], "borderLeftWidth", !0)),
                    {
                        top: t.top - r.top - re.css(n, "marginTop", !0),
                        left: t.left - r.left - re.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent || $t; e && !re.nodeName(e, "html") && "static" === re.css(e, "position"); )
                        e = e.offsetParent;
                    return e || $t
                })
            }
        }),
        re.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, t) {
            var r = "pageYOffset" === t;
            re.fn[e] = function(i) {
                return be(this, function(e, i, o) {
                    var s = X(e);
                    return void 0 === o ? s ? s[t] : e[i] : void (s ? s.scrollTo(r ? n.pageXOffset : o, r ? o : n.pageYOffset) : e[i] = o)
                }, e, i, arguments.length, null)
            }
        }),
        re.each(["top", "left"], function(e, t) {
            re.cssHooks[t] = N(ee.pixelPosition, function(e, n) {
                return n ? (n = E(e, t),
                Ve.test(n) ? re(e).position()[t] + "px" : n) : void 0
            })
        }),
        re.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            re.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, r) {
                re.fn[r] = function(r, i) {
                    var o = arguments.length && (n || "boolean" != typeof r)
                      , s = n || (r === !0 || i === !0 ? "margin" : "border");
                    return be(this, function(t, n, r) {
                        var i;
                        return re.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement,
                        Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? re.css(t, n, s) : re.style(t, n, r, s)
                    }, t, o ? r : void 0, o, null)
                }
            })
        }),
        re.fn.size = function() {
            return this.length
        }
        ,
        re.fn.andSelf = re.fn.addBack,
        r = [],
        i = function() {
            return re
        }
        .apply(t, r),
        !(void 0 !== i && (e.exports = i));
        var Wt = n.jQuery
          , _t = n.$;
        return re.noConflict = function(e) {
            return n.$ === re && (n.$ = _t),
            e && n.jQuery === re && (n.jQuery = Wt),
            re
        }
        ,
        typeof o === je && (n.jQuery = n.$ = re),
        re
    })
}
, function(e, t, n) {
    var r = n(2)
      , i = n(1)
      , o = function() {
        r(".close-options").on("click", function(e) {
            r("#options-container").toggleClass("active")
        }),
        r("#options-container").on("click", function(e) {
            e.target == this && r("#options-container").toggleClass("active")
        }),
        r(".close-information").on("click", function(e) {
            r("#information-container").toggleClass("active")
        }),
        r("#information-container").on("click", function(e) {
            e.target == this && r("#information-container").toggleClass("active")
        }),
        r("#filesystem-btn").on("click", function(e) {
            r(this).toggleClass("active"),
            r("#filesystem").toggleClass("active"),
            i.resizeEditors()
        }),
        r("#sourcemap-btn").on("click", function(e) {
            r(this).toggleClass("active"),
            r("#sourcemap-wrap").toggleClass("active"),
            i.resizeEditors()
        })
    };
    e.exports = {
        init: o
    }
}
, function(e, t, n) {
    var r = n(1)
      , i = window.sass = new Sass
      , o = n(2)
      , s = function() {
        var e = {}
          , t = o("#options input, #options select");
        return t.each(function(t, n) {
            if ("option-" === o(n).attr("id").slice(0, 7)) {
                var r = o(n).attr("id").slice(7);
                e[r] = o(n).val()
            }
        }),
        e.linefeed = {
            "\\n": "\n",
            "\\r\\n": "\r\n"
        }[e.linefeed],
        e
    }
      , a = function() {
        var e = o("#convert");
        e.on("click", function(t) {
            e.prop("disabled", !1),
            r.clearErrors(),
            i.options(s(), function() {
                i.compile(r.editors.input.getValue(), function(e) {
                    if (e.status) {
                        if ("stdin" === e.file)
                            r.errors.push({
                                editor: r.editors.input,
                                error: r.highlightError(r.editors.input, e.line, e.column)
                            }),
                            r.editors.input.gotoLine(e.line);
                        else {
                            var t = o("#filesystem");
                            t.addClass("active"),
                            t.trigger("readFile", {
                                file: e.file.replace("/sass/", "")
                            }),
                            r.errors.push({
                                editor: r.editors.file_content,
                                error: r.highlightError(r.editors.file_content, e.line, e.column)
                            }),
                            r.editors.file_content.gotoLine(e.line)
                        }
                        var n = e.formatted;
                        delete e.formatted,
                        r.editors.output.setValue(n + "\n\n" + JSON.stringify(e, null, 2)),
                        r.editors.sourcemap.setValue("")
                    } else
                        r.editors.output.setValue(e.text || ""),
                        r.editors.sourcemap.setValue(JSON.stringify(e.map, null, 2));
                    r.resetCursor(r.editors.output),
                    r.resetCursor(r.editors.sourcemap)
                })
            })
        })
    };
    e.exports = {
        sass: i,
        init: a
    }
}
, function(e, t, n) {
    var r, i, o, s, a, u = n(2), l = n(4), c = n(1), f = function() {
        u(".file").removeClass("selected")
    }, p = function(e) {
        s.text(e + " file")
    }, d = function(e) {
        f(),
        u(e).addClass("selected"),
        p("Save")
    }, h = function() {
        var e = o.val()
          , t = document.getElementById(e);
        return t
    }, g = function(e) {
        d(e),
        o.val(u(e).data("file")),
        c.editors.file_content.setValue(u(e).data("content")),
        c.resetCursor(c.editors.file_content)
    }, m = function(e) {
        l.sass.removeFile(u(e).data("file")),
        u(e).remove(),
        o.val(""),
        c.editors.file_content.setValue(""),
        f(),
        p("Create")
    }, v = function(e, t) {
        var n = document.getElementById(e);
        return n = u(n),
        n.length || (n = u("<li></li>"),
        n.attr("class", "file edit-file"),
        n.attr("id", e),
        n.data("file", e),
        n.append('<i class="icon-file"></i><span class="file_title"></span><button type="button" class="error remove-file"><i class="icon-trash"></i></button>'),
        n.appendTo(r)),
        n.find(".file_title").text(e),
        n.data("content", t),
        l.sass.writeFile(e, t),
        n
    }, y = function() {
        var e = [{
            name: "_variables.scss",
            content: "$brandColor: #f60;\n$size: 1em;"
        }, {
            name: "_demo.scss",
            content: '.imported {\n  content: "yay, file support!";\n}'
        }];
        e.forEach(function(e) {
            v(e.name, e.content)
        })
    }, x = function() {
        r = u("#file_list"),
        i = u("#new_file"),
        o = u("#file_name"),
        s = u("#save_file"),
        a = u("#filesystem"),
        o.on("input", function(e) {
            var t = h();
            t ? d(t) : (f(),
            p("Create"))
        }),
        s.on("click", function(e) {
            if (o.val()) {
                v(o.val(), c.editors.file_content.getValue());
                var t = h();
                t && d(t)
            }
        }),
        i.on("click", function(e) {
            r.find(".file").removeClass("selected"),
            o.val(""),
            c.editors.file_content.setValue(""),
            c.resetCursor(c.editors.file_content)
        }),
        r.on("click", function(e) {
            var t = u(e.target);
            (t.is("i") || t.is("span")) && (t = t.parent()),
            t.hasClass("edit-file") ? g(t) : t.hasClass("remove-file") && confirm("Are you sure you want to delete this file?") && m(t.parent())
        }),
        a.on("readFile", function(e, t) {
            g(u('[id="' + t.file + '"]'))
        }),
        y()
    };
    e.exports = {
        readFile: g,
        init: x,
        prepareDemo: y
    }
}
]);

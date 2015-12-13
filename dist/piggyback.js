/**
 * piggyback.js - Reuse function results for multiple callers
 *
 * @version 0.0.1
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["piggyback"] = factory();
	else
		root["piggyback"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1).wrap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generateCallback = generateCallback;
	exports.invoke = invoke;
	exports.notify = notify;
	exports.wrap = wrap;

	var _lie = __webpack_require__(2);

	var _lie2 = _interopRequireDefault(_lie);

	var _blueimpMd = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @todo
	 */
	var STATE = {};

	/**
	 * Convert a promise's resolve and reject functions into a node-style
	 * callback.
	 *
	 * @param {function} resolve A Promise resolution function.
	 * @param {function} reject A Promise rejection function.
	 * @returns {function} A node-style callback that wraps the resolve/reject functions.
	 */
	function generateCallback(resolve, reject) {
	  return function (err, result) {
	    if (err) {
	      return reject(err);
	    }

	    resolve(result);
	  };
	}

	/**
	 * Invoke the given function and return a `Promise`. `fn` must either return
	 * a `Promise` or accept a single callback that it will invoke upon
	 * completion.
	 *
	 * @param {function} fn A function to invoke and wrap in a `Promise`.
	 * @returns {mixed} The return value from `fn`.
	 */
	function invoke(fn) {
	  return new _lie2.default(function (resolve, reject) {
	    var done = generateCallback(resolve, reject);
	    _lie2.default.resolve(fn(done)).then(resolve).catch(reject);
	  });
	}

	/**
	 * Iterates over `fns` and invokes `apply()` using `args`
	 *
	 * @param {function[]} fns An array of functions.
	 * @param {*[]} args An array of args to invoke each function in `fns` with.
	 * @returns {undefined}
	 */
	function notify(fns, args) {
	  fns.forEach(function (done) {
	    return done.apply(null, args);
	  });
	}

	/**
	 * Wrap a function to prevent it from processing simultaneously
	 *
	 * @param {string} key A unique identifier.
	 * @param {function} fn The function to wrap.
	 * @param {function} [done] An optional callback that will be invoked upon `fn` completion.
	 * @returns {Promise} A `Promise` that resolves or rejects based on `fn` resolving, rejecting, returning, or throwing.
	 */
	function wrap(key, fn, done) {
	  if (typeof key === 'function') {
	    var _ref = [fn, key, 'pb:' + (0, _blueimpMd.md5)(key.toString())];
	    done = _ref[0];
	    fn = _ref[1];
	    key = _ref[2];
	  }

	  var state = STATE[key];

	  if (!state) {
	    var promise = invoke(fn).then(function (result) {
	      notify(state.notify, [null, result]);
	      delete STATE[key];
	      return result;
	    }).catch(function (err) {
	      notify(state.notify, [err]);
	      delete STATE[key];

	      if (state.promise.queue.length) {
	        throw err;
	      }
	    });

	    STATE[key] = state = {
	      notify: [],
	      promise: promise
	    };
	  }

	  if (done) {
	    state.notify.push(done);
	  }

	  return state.promise;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var immediate = __webpack_require__(4);

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	/* istanbul ignore else */
	if (!process.browser) {
	  // in which we actually take advantage of JS scoping
	  var UNHANDLED = ['UNHANDLED'];
	}

	module.exports = exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    this.handled = UNHANDLED;
	  }
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype.catch = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (typeof onRejected === 'function' && this.handled === UNHANDLED) {
	      this.handled = null;
	    }
	  }
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (self.handled === UNHANDLED) {
	      immediate(function () {
	        if (self.handled === UNHANDLED) {
	          process.emit('unhandledRejection', error, self);
	        }
	      });
	    }
	  }
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && typeof obj === 'object' && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	exports.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	exports.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	exports.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	exports.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	if (process.browser) {
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	} else {
	  scheduleDrain = function () {
	    process.nextTick(nextTick);
	  };
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * JavaScript MD5 1.0.1
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * http://www.opensource.org/licenses/MIT
	 * 
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*jslint bitwise: true */
	/*global unescape, define */

	(function ($) {
	    'use strict';

	    /*
	    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	    * to work around bugs in some JS interpreters.
	    */
	    function safe_add(x, y) {
	        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
	            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	        return (msw << 16) | (lsw & 0xFFFF);
	    }

	    /*
	    * Bitwise rotate a 32-bit number to the left.
	    */
	    function bit_rol(num, cnt) {
	        return (num << cnt) | (num >>> (32 - cnt));
	    }

	    /*
	    * These functions implement the four basic operations the algorithm uses.
	    */
	    function md5_cmn(q, a, b, x, s, t) {
	        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
	    }
	    function md5_ff(a, b, c, d, x, s, t) {
	        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	    }
	    function md5_gg(a, b, c, d, x, s, t) {
	        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	    }
	    function md5_hh(a, b, c, d, x, s, t) {
	        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	    }
	    function md5_ii(a, b, c, d, x, s, t) {
	        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	    }

	    /*
	    * Calculate the MD5 of an array of little-endian words, and a bit length.
	    */
	    function binl_md5(x, len) {
	        /* append padding */
	        x[len >> 5] |= 0x80 << (len % 32);
	        x[(((len + 64) >>> 9) << 4) + 14] = len;

	        var i, olda, oldb, oldc, oldd,
	            a =  1732584193,
	            b = -271733879,
	            c = -1732584194,
	            d =  271733878;

	        for (i = 0; i < x.length; i += 16) {
	            olda = a;
	            oldb = b;
	            oldc = c;
	            oldd = d;

	            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
	            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
	            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
	            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
	            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
	            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
	            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
	            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
	            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
	            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
	            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
	            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
	            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
	            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
	            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
	            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

	            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
	            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
	            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
	            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
	            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
	            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
	            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
	            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
	            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
	            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
	            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
	            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
	            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
	            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
	            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
	            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

	            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
	            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
	            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
	            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
	            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
	            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
	            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
	            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
	            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
	            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
	            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
	            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
	            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
	            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
	            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
	            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

	            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
	            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
	            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
	            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
	            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
	            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
	            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
	            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
	            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
	            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
	            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
	            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
	            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
	            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
	            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
	            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

	            a = safe_add(a, olda);
	            b = safe_add(b, oldb);
	            c = safe_add(c, oldc);
	            d = safe_add(d, oldd);
	        }
	        return [a, b, c, d];
	    }

	    /*
	    * Convert an array of little-endian words to a string
	    */
	    function binl2rstr(input) {
	        var i,
	            output = '';
	        for (i = 0; i < input.length * 32; i += 8) {
	            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
	        }
	        return output;
	    }

	    /*
	    * Convert a raw string to an array of little-endian words
	    * Characters >255 have their high-byte silently ignored.
	    */
	    function rstr2binl(input) {
	        var i,
	            output = [];
	        output[(input.length >> 2) - 1] = undefined;
	        for (i = 0; i < output.length; i += 1) {
	            output[i] = 0;
	        }
	        for (i = 0; i < input.length * 8; i += 8) {
	            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
	        }
	        return output;
	    }

	    /*
	    * Calculate the MD5 of a raw string
	    */
	    function rstr_md5(s) {
	        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
	    }

	    /*
	    * Calculate the HMAC-MD5, of a key and some data (raw strings)
	    */
	    function rstr_hmac_md5(key, data) {
	        var i,
	            bkey = rstr2binl(key),
	            ipad = [],
	            opad = [],
	            hash;
	        ipad[15] = opad[15] = undefined;
	        if (bkey.length > 16) {
	            bkey = binl_md5(bkey, key.length * 8);
	        }
	        for (i = 0; i < 16; i += 1) {
	            ipad[i] = bkey[i] ^ 0x36363636;
	            opad[i] = bkey[i] ^ 0x5C5C5C5C;
	        }
	        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
	        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
	    }

	    /*
	    * Convert a raw string to a hex string
	    */
	    function rstr2hex(input) {
	        var hex_tab = '0123456789abcdef',
	            output = '',
	            x,
	            i;
	        for (i = 0; i < input.length; i += 1) {
	            x = input.charCodeAt(i);
	            output += hex_tab.charAt((x >>> 4) & 0x0F) +
	                hex_tab.charAt(x & 0x0F);
	        }
	        return output;
	    }

	    /*
	    * Encode a string as utf-8
	    */
	    function str2rstr_utf8(input) {
	        return unescape(encodeURIComponent(input));
	    }

	    /*
	    * Take string arguments and return either raw or hex encoded strings
	    */
	    function raw_md5(s) {
	        return rstr_md5(str2rstr_utf8(s));
	    }
	    function hex_md5(s) {
	        return rstr2hex(raw_md5(s));
	    }
	    function raw_hmac_md5(k, d) {
	        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
	    }
	    function hex_hmac_md5(k, d) {
	        return rstr2hex(raw_hmac_md5(k, d));
	    }

	    function md5(string, key, raw) {
	        if (!key) {
	            if (!raw) {
	                return hex_md5(string);
	            }
	            return raw_md5(string);
	        }
	        if (!raw) {
	            return hex_hmac_md5(key, string);
	        }
	        return raw_hmac_md5(key, string);
	    }

	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return md5;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        $.md5 = md5;
	    }
	}(this));


/***/ }
/******/ ])
});
;
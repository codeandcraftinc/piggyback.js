'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCallback = generateCallback;
exports.hasCallback = hasCallback;
exports.promisify = promisify;

var _lie = require('lie');

var _lie2 = _interopRequireDefault(_lie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo
 */
function generateCallback(resolve, reject) {
  return function (err) {
    if (err) {
      return reject(err);
    }

    resolve.apply.apply(resolve, [null].concat(Array.prototype.slice.call(arguments)));
  };
}

/**
 *
 */
function hasCallback(fn) {
  return (/^function \([\w\s,]+\)/.test(fn.toString())
  );
}

/**
 * @todo
 */
function promisify(fn) {
  return new _lie2.default(function (resolve, reject) {
    if (hasCallback(fn)) {
      fn(generateCallback(resolve, reject));
    } else {
      _lie2.default.resolve(fn()).then(resolve).catch(reject);
    }
  });
}
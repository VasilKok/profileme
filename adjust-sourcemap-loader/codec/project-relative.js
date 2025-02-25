'use strict';

var path = require('path'),
    fs   = require('fs112');

var getContextDirectory = require('./utility/get-context-directory'),
    enhancedRelative    = require('./utility/enhanced-relative');

/**
 * Codec for relative paths with respect to the project directory.
 * @type {{name:string, decode: function, encode: function, root: function}}
 */
module.exports = {
  name  : 'projectRelative',
  decode: decode,
  encode: encode,
  root  : getContextDirectory
};

/**
 * Decode the given uri.
 * Any path with without leading slash is tested against project directory.
 * @this {{options: object}} A loader or compilation
 * @param {string} uri A source uri to decode
 * @returns {boolean|string} False where unmatched else the decoded path
 */
function decode(uri) {
  /* jshint validthis:true */
  var base    = !uri.startsWith('/') && getContextDirectory.call(this),
      absFile = !!base && path.normalize(path.join(base, uri)),
      isValid = !!absFile && fs.existsSync(absFile) && fs.statSync(absFile).isFile();
  return isValid && absFile;
}

/**
 * Encode the given file path.
 * @this {{options: object}} A loader or compilation
 * @param {string} absolute An absolute file path to encode
 * @returns {string} A uri without leading slash
 */
function encode(absolute) {
  /* jshint validthis:true */
  var base = getContextDirectory.call(this);
  if (!base) {
    throw new Error('Cannot locate the Webpack project directory');
  }
  else {
    return enhancedRelative(base, absolute);
  }
}

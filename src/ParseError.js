const RequestError = require('./RequestError');

/**
 * @typedef {Object} SocketError
 *
 * RequestError with error parsing semantics
 *
 * @extends RequestError
 */
module.exports = class ParseError extends RequestError {

  /**
   * RequestError with parsing semantics
   *
   * @param {string} message Human readable error message
   * @param {string} the raw UNIX message that originated this error
   */
  constructor(message, rawMessage) {
    super(message);

    this.rawMessage = rawMessage;
  }
}

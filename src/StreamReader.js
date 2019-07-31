const stream = require('stream');

/**
 * @typedef {Object} StreamReader
 *
 * An utility to working with streams
 */
module.exports = class StreamReader extends stream.Writable {

  /**
   * The default constructor: Saves the element data.
   */
  constructor(readable) {
    super();
    this.buffers = [];
    this.finished = false;
    this.error = null;

    // Pipe the input of the readable stream into this
    readable.pipe(this);

    this.on('error', this.handleError.bind(this));
  }

  write(chunk, encoding, callback) {
    // Handle optional parameters
    if (typeof encoding === 'function') {
      callback = encoding;
    }

    this.buffers.push(chunk);

    if (callback) {
      callback();
    }
  }

  end(chunk, encoding, callback) {
    // Handle optional parameters
    if (typeof encoding === 'function') {
      callback = encoding;
    }

    if (chunk) {
      this.buffers.push(chunk);
    }

    this.finished = true;
    this.emit('finish');

    if (callback) {
      callback();
    }
  }

  handleError(error) {
    this.error = error;
  }

  /**
   * Read the stream entirely
   *
   * @return Buffer containing the stream contents
   */
  readAll() {
    const _this = this;
    const promise = new Promise((resolve, reject) => {

      function cleanup() {
        /* eslint-disable no-use-before-define */
        _this.removeListener('finish', handleFinished);
        _this.removeListener('error', handleError);

        /* eslint-enable no-use-before-define */
      }

      function handleError(error) {
        _this.error = error;
        reject(error);
        cleanup();
      }

      // Else listen for the end or error events
      function handleFinished() {
        resolve(Buffer.concat(_this.buffers));
        cleanup();
      }

      _this.once('finish', handleFinished);
      _this.once('error', handleError);
    });

    return promise;
  }
}

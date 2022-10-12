/* eslint-disable no-extend-native */
const customError = () => {
  if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
      value() {
        const alt = {
          message: this.message,
        };
        return alt;
      },
      configurable: true,
      writable: true,
    });
  }
};

module.exports = customError;

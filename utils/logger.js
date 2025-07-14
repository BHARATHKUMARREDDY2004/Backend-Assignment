'use strict';
module.exports = {
  info: console.log,
  error: console.error,
  warn: console.warn,
  
  stream: {
    write: function(message) {
      console.log(message.trim());
    }
  }
};
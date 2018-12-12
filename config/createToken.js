const createToken = () =>
  new Promise((resolve, reject) => {
    require('crypto').randomBytes(32, function(err, buffer) {
      var token = buffer.toString('hex');
      resolve(token);
    })
  });

  module.exports = createToken
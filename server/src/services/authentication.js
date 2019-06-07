const https = require('https');


const verifyToken = token => new Promise((resolve, reject) => {
  https.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      resolve(JSON.parse(data));
    });
  }).on('error', (err) => {
    reject(err);
  });
});

module.exports.verifyToken = verifyToken;

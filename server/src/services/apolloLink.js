const { execute, makePromise } = require('apollo-link');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const { server } = require('../config');

const link = new HttpLink({ uri: server.uninorteGraphQL, fetch });

const request = (credentials, query, variables) => {
  const operation = {
    query,
    variables,
    context: {
      headers: {
        authorization: `${credentials.username}:${credentials.password}`,
      },
    },
    // operationName: {} //optional
    // extensions: {} //optional
  };
  // execute returns an Observable so it can be subscribed to
  // execute(link, operation).subscribe({
  //   next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
  //   error: error => console.log(`received error ${error}`),
  //   complete: () => console.log('complete'),
  // });
  return makePromise(execute(link, operation));
};

module.exports = {
  request,
};

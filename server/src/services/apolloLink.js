const { execute, makePromise } = require('apollo-link');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');

const { server } = require('../config');

const link = new HttpLink({ uri: server.uninorteGraphQL, fetch });

/**
 * Request to graphQL api
 * @param {Object} credentials
 * @param {Object} query
 * @param {Object} variables
 * @returns {Promise}
 */
const request = (credentials, query, variables) => {
  const operation = {
    query,
    variables,
    context: {
      headers: {
        authorization: `${credentials.username}:${credentials.password}`,
      },
    },
  };
  return makePromise(execute(link, operation));
};

module.exports = {
  request,
};

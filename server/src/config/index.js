const config = {
  server: {
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    clientName: process.env.CLIENT_NAME,
    secret: process.env.SECRET,
    uninorteGraphQL: process.env.UNINORTE_GRAPHQL,
  },
  calendar: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secretClient: process.env.GOOGLE_SECRET_CLIENT,
    callback: process.env.CALLBACK,
  },
};

module.exports = config;

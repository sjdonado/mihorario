const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const axiosMock = new MockAdapter(axios);

global.axiosMock = axiosMock;

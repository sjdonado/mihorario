export const environment = {
  production: true,
  cookies: {
    expires: 1,
    path: '/',
    domain: 'mihorarioun.web.app',
    secure: true,
  },
  apiUrl: '{LAMBDA_API_URL}',
  firebase: {
    apiKey: '{FIREBASE_API_KEY}',
    authDomain: 'mihorarioun.firebaseapp.com',
    databaseURL: '',
    projectId: 'mihorarioun',
    storageBucket: '',
    messagingSenderId: '119902822900'
  }
};

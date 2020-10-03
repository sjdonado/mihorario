// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  cookies: {
    expires: 1,
    path: '/',
    domain: 'localhost',
    secure: false,
  },
  apiUrl: 'http://localhost:3000/api/v1',
  firebase: {
    apiKey: '',
    authDomain: 'mihorarioun.firebaseapp.com',
    databaseURL: '',
    projectId: 'mihorarioun',
    storageBucket: '',
    messagingSenderId: '119902822900'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

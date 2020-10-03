const replace = require('replace-in-file');
const firebaseApikey = process.argv[2];

const options = {
    files: 'src/environments/environment.prod.ts',
    from: /{API_KEY}/g,
    to: firebaseApikey,
    allowEmptyPaths: false,
};

try {
    replace.sync(options);
}
catch (error) {
    console.error('Error occurred:', error);
}
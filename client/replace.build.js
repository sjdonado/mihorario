const replace = require('replace-in-file');

const args = process.argv.slice(2);
const replacements = args.map(arg => {
  const [key, value] = arg.split("=");

  return {
    files: 'src/environments/environment.prod.ts',
    from: new RegExp(`{${key}}`, 'g'),
    to: value,
    allowEmptyPaths: false,
  };
});

try {
  replacements.forEach((replacement) => {
    const results = replace.sync(replacement);
    if(results[0].hasChanged === true){
      console.log(`Replaced ${replacement.from} in file ${replacement.files}`);
    }
  });
}
catch (error) {
  console.error('Error occurred:', error);
}

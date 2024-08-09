const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app');

let declarations = {};

function searchFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        searchFiles(filePath);
      } else if (file.endsWith('.module.ts')) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            return console.log(err);
          }
          const regex = /declarations:\s*\[([^\]]*)\]/g;
          let match;
          while ((match = regex.exec(data)) !== null) {
            const components = match[1].split(',').map(comp => comp.trim());
            components.forEach(comp => {
              if (declarations[comp]) {
                declarations[comp].push(filePath);
              } else {
                declarations[comp] = [filePath];
              }
            });
          }
        });
      }
    });
  });
}

searchFiles(directoryPath);

// Give it some time to complete file reading
setTimeout(() => {
  for (let comp in declarations) {
    if (declarations[comp].length > 1) {
      console.log(`Component ${comp} is declared in multiple modules:`);
      declarations[comp].forEach(declaration => console.log(`  - ${declaration}`));
    }
  }
}, 3000);

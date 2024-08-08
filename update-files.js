import fs from 'fs';
import path from 'path';

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Por favor, proporciona una nueva versión como argumento');
  process.exit(1);
}

const updateFile = (filePath, regex, replacement) => {
  const fullPath = path.join(process.cwd(), filePath);
  const contents = fs.readFileSync(fullPath, 'utf8');
  const newContents = contents.replace(regex, replacement);
  fs.writeFileSync(fullPath, newContents);
};

// Actualizar manifest.json
updateFile('public/manifest.json', /"version":\s*"\d+\.\d+\.\d+"/, `"version": "${newVersion}"`);

// Actualizar Footer/index.ts
updateFile('src/ui/components/Footer/index.ts', /v\d+\.\d+\.\d+/, `v${newVersion}`);

console.log(`Actualizados los archivos a la versión ${newVersion}`);

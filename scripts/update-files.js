import fs from 'fs';
import path from 'path';

import { config } from 'dotenv';

config();

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Por favor, proporciona una nueva versión como argumento');
  process.exit(1);
}

const API_URL = process.env.API_URL;
if (!API_URL) {
  console.error('API_URL no está definida en las variables de entorno');
  process.exit(1);
}


export const updateFile = (filePath, regex, replacement) => {
  const fullPath = path.join(process.cwd(), filePath);
  const contents = fs.readFileSync(fullPath, 'utf8');
  const newContents = contents.replace(regex, replacement);
  fs.writeFileSync(fullPath, newContents);
};

// Actualizar manifest.json
updateFile('public/manifest.json', /"version":\s*"\d+\.\d+\.\d+"/, `"version": "${newVersion}"`);

// Actualizar Footer/index.ts
updateFile('src/ui/components/Footer/index.tsx', /v\d+\.\d+\.\d+/g, `v${newVersion}`);

console.log(`Actualizados los archivos a la versión ${newVersion}`);

// Actualizar API_URL en el archivo correspondiente
updateFile('share/api.ts', /export const API_URL = ".*";/, `export const API_URL = "${API_URL}";`);
console.log(`Actualiza la URL del API ${API_URL}`);

import ncp from 'ncp';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const entrytPath = path.join(__dirname, 'frontend/styles');
const outputPath = path.join(__dirname, 'backend/public');



const origen = entrytPath
const destino = outputPath

ncp(origen, destino, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Archivos copiados con éxito');
});

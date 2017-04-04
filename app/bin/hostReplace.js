import bfs from 'babel-fs';
import path from 'path';
import { devHost, testHost, prodHost } from '../config/constants';

const [ , , env] = process.argv;
let host = devHost;

switch (env) {
  case 'prod': host = prodHost; break;
  case 'test': host = testHost; break;
}

const BUILD_PATH = path.join(process.cwd(), 'build');

(async function() {
  const files = await bfs.readdir(BUILD_PATH);
  const mainjsPath = files
    .filter(filename => path.extname(filename) === '.js')
    .map(filename => path.join(BUILD_PATH, filename))[0];
  const mainjsContent = await bfs.readFile(mainjsPath, 'utf8');
  await bfs.writeFile(mainjsPath, mainjsContent.replace(devHost, host));
})();

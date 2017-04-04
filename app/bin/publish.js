import sequest from 'sequest';
import bfs from 'babel-fs';
import fs from 'fs';
import path from 'path';

const BUILD_PATH = path.join(process.cwd(), 'build');
const IMAGE_PATH = path.join(BUILD_PATH, 'app', 'images');

const SFTP_COUPON_PATH = '/put/coupon';
const SFTP_COUPON_IMAGE_PATH = path.join(SFTP_COUPON_PATH, 'app', 'images');

let seq = sequest.connect('h5@120.55.113.150:40022', {
  password: 'Root!123'
});

(async function() {
  console.log('开始传输文件到sftp服务器');
  try {
    // images
    const imageNames = (await bfs.readdir(IMAGE_PATH))
      .map(name => `app/images/${name}`);
    // bundle.js bundle.js.map index.html
    const appFileNames = ['bundle.js', 'bundle.js.map', 'index.html'];

    transfer([...appFileNames, ...imageNames]);
  } catch(e) {
    console.log('文件传输出错');
    console.log(e);
  }
})();

let fileCount = 0;

function transfer(fileNames) {
  // aviod the max channel connect
  if (++fileCount == 10) {
    fileCount = 0;
    seq.end();
    seq = sequest.connect('h5@120.55.113.150:40022', {
      password: 'Root!123'
    });
    return transfer(fileNames);
  }
  const fileName = fileNames.shift();
  const writer = seq.put(path.join(SFTP_COUPON_PATH, fileName));
  fs.createReadStream(path.join(BUILD_PATH, fileName)).pipe(writer);
  console.log(`正在上传${fileName}...`);
  writer.on('close', () => {
    if (fileNames.length > 0) {
      transfer(fileNames);
    } else {
      console.log('文件传输完毕');
      seq.end();
    }
  });
  writer.on('error', (e) => {
    console.log(`${fileName}上传失败: ${e}`);
  });
}

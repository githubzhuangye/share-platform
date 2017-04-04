import bfs from 'babel-fs';
import path from 'path';
import cheerio from 'cheerio';

const BUILD_PATH = path.join(process.cwd(), 'build');

const [ , , env = 'prod'] = process.argv;

const jsSnipet = `
  <script>
    /*
      window.env值的情况：
        prod: 生产环境
        beta: 预发布环境
        test1: 内部测试环境1
        test2: 内部测试环境2(180)
    */
    window.env = '${env}';
  </script>
`;

(async function() {
  const indexHtmlPath = path.join(BUILD_PATH, 'index.html');
  const indexHtml = await bfs.readFile(indexHtmlPath, 'utf8');
  const $ = cheerio.load(indexHtml);
  $('#root').after(jsSnipet);
  await bfs.writeFile(indexHtmlPath, $.html());
})()
  .catch(error => console.log(error));

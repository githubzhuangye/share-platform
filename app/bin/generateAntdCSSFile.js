const fs = require('fs');
const path = require('path');
const less = require('less');

const SHARED_STYLE_PATH = path.join(process.cwd(), 'app', 'sharedStyles');
const ANTD_STYLE_PATH = path.join(process.cwd(), 'node_modules', 'antd', 'lib', 'style');
const THEME_PATH = path.join(SHARED_STYLE_PATH, 'theme.less');
const GENERATE_PATH = path.join(SHARED_STYLE_PATH, 'antd.css');

const lessTemplate = `
  @import "${ANTD_STYLE_PATH}/themes/default.less";
  @import "${THEME_PATH}";
  @import "${ANTD_STYLE_PATH}/core/index.less";
  @import "${ANTD_STYLE_PATH}/components.less";
`;

console.log('正在生成antd样式文件');
less.render(lessTemplate, (e, output) => {
  fs.writeFileSync(GENERATE_PATH, output.css);
  console.log('文件生成完毕!');
  console.log(`文件位于:${GENERATE_PATH}`);
});
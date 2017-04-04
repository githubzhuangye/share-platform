一、开发环境:  
1.执行`npm install -g yarn`, 安装[yarn](https://yarnpkg.com/)     
2.执行`yarn`,安装依赖库  
3.执行`npm start`, 然后访问 [http://localhost:8080/](http://localhost:8080/)  

二、发布  
发布到测试服务器时执行: `npm run build:test`, 该命令会用webpack进行一次打包，然后跑一个脚本将本地打包好的`build/`目录下的所有文件传输至svn服务器上

三、学习资源
webpack配置可参考: [http://survivejs.com/webpack/advanced-techniques/configuring-react/](http://survivejs.com/webpack/advanced-techniques/configuring-react/)  

redux学习可参考: [http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)  

es6/es7学习可参考:
[《ES6 标准入门》](http://es6.ruanyifeng.com/)  
主要涉及的几个使用示例:  
[变量的解构赋值](http://es6.ruanyifeng.com/#docs/destructuring) - `const { name } = this.props;`   
[对象的扩展运算符](http://es6.ruanyifeng.com/#docs/object#对象的扩展运算符) - `const a = {...this.props};`  
[Class](http://es6.ruanyifeng.com/#docs/class) - `class HomeComponent extends React.Component;`  
[Module](http://es6.ruanyifeng.com/#docs/module) - `export default HomeComponent;`  
[Promise](http://es6.ruanyifeng.com/#docs/promise)  - api调用中axiox返回的都是promise对象  
[Decorator](http://es6.ruanyifeng.com/#docs/decorator) - container组件中的connect函数的使用`@connect`  
[函数绑定](http://babeljs.io/docs/plugins/transform-function-bind/) - `::this.handleSubmit` 

git版本管理可参考: [git权威指南](https://git-scm.com/book/zh/v2)  

更多react相关学习资料可以参考我整理维护的一份资料: [https://github.com/ywwhack/react-journey](https://github.com/ywwhack/react-journey)


各目录说明如下:

* `api/` 与后台数据交互的逻辑统一封装在api这个目录中
* `bin/` 一些通用脚本
* `components/` react组件
* `config/` 配置文件，目前只有`react-router`的路由配置和一些常量
* `containers/` 与`redux`交互的react组件
*  `helpers/` 一些工具，其中`util.js`中存放着很多通用的方法
*   `hoc/` 高阶组件
* `images/` 用到的本地图片
*  `polyfills/` 补丁文件
* `redux/` 每个功能模块应有一个reducer和action文件
* `sharedStyles/` 通用的css样式,包括对antd的样式定制
* `index.js` 入口文件  

***
前端路由:  
使用的是[react-router@4](https://react-router.now.sh/)版本，主要的路由配置可参考`config/routes.js`和`components/admin/Main/Main.jsx`这两个文件

主题配置:  
参考自[https://ant.design/docs/react/customize-theme-cn](https://ant.design/docs/react/customize-theme-cn)  
配置文件位于`theme.json`  
部分样式覆盖位于`app/containers/admin/Main/MainContainer.jsx`的`componentDidMount()`方法中
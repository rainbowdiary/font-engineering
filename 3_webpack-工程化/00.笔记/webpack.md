# gulp:
  需要先将js模块化转换为commonjs,再使用browserify转化为浏览器可识别的语言
  
## 思想
 读取顺序
  所有构建工具都需要文件读写
## 使用的模块化:
  构建工具是基于nodejs平台,所以模块化使用commonjs

# webpack:
## 是什么?
	 JavaScript 应用程序的静态模块打包工具
   当 webpack 处理应用程序时，它会在内部构建一个 依赖图(dependency graph)，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle。
## 核心概念
- loader: 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。



## 使用
1.下载
	npm i webpack webpack-cli -g
    npm i webpack webpack-cli
2. webpack运行指令:
    webpack --config ./webpack.dev.config

# loader
* loader执行顺序:
  use中:
    1. 从下到上,从左到右
    2. enforce: pre 优先执行 
## loader处理的模块:
1. 处理css文件 
css-loader,style-loader
  将css文件解析成字符串,以commonjs模式化引入到js\
js: eslint-loader( airbnb国际)
修改图片输入的path路径  
  url-loader
  outputpath 修改图片输出路径
  name :修改图片命名
字体图标:
  file-loader

自动变:dev-webpack-server
模块热替换:
  1. style-loader,css-loader实现了模块热替换
  2. js内部没有实现热模块
   js自己实现:
    module.hot属性是否存在;
  3. html没有办法更新了:(只有一个文件,所以没有热模块)只能全部更新
     1. 入口文件修改为数组
     2. 添加html-loader
  4. 包含了watch功能配置
devtool 提供source-map文件,追踪源代码错误
  作用:提供与源代码的映射
  参数:
    source-map:显示报错的源代码;
    cheap-source-map
resolve :(缺点没有路径提示)
  alias: 路径别名
  extensions: 省略文件后缀名(必须写上js扩展名,不然报错)
targets: 声明运行再哪个环境
 electron:使用node开发运行在桌面
externals:
  js引入:不用重复构建,例如jquery
  外链引入

# 问题:
1. devtool:source-map;
测试不成功,
原因:一报错就编译失败,导致无法成功,错误也不是源码
解决: 因为使用了模块热替换,只有模块相关的代码报错才会报错

2. 测试external不打包jquery配置报错$不识别:
解决: index.html中引入的jquery错误,引入正确的jquery.min.js解决


# 生产环境搭建
1. 修改的地方:
config
  webpack.dev.js
  webpack.prod.js
  路径问题
devserver不需要
entry
mode
devtool 去掉eval

2. 修改指令webpack --config
3. 处路径问题:希望都是/开头
  /login
  /
  ./  /login/login开头
output:
  配置文件去掉./
  publicPath:输出资源的公共路径
  但是无法运行index.html
  只能自己启动服务运行 npm i -g serve
    使用server库:
      serve -s 暴露的目录 -p port
4. 每次构建删除输出目录
    插件:clear-webpack-plugin

*** 构建生产配置文件 ***
1. HMR
2. 压缩(mode:production会自动压缩)
3. 兼容性babel
   1. 只能转换ES6基本语法
   2. polyfill(缺点是全部的pollyfill都会被加载)
      1. corejs按需加载
         1. 不需要引入polyfill
         2. 预设env useBuiltIns corejs
         3. 使用userBuildIn: usage...
4. CSS
  1. 提取css为单独文件
    原因:样式需要单独的,以link引入,不然使用js引入不然会出现闪现
    1. miniCss(为每个引入 CSS 的 JS 文件创建一个 CSS 文件)
    2. 使用
        1. 替换style-loader
  2. 压缩css
     1. cssnano
     2. optimize 
     3. 开启souce-map 添加配置,github插件issues中找
  3. css兼容性
     1. postcss(使用插件的用法,所依赖的库都需要下载)
5. browserslist兼容性处理 (参考github的配置)
   1. package.json 配置browserslist 配置到github搜索
      1. 使用默认配置:defaults
      2. "cover 95%" 覆盖95%的
      3. "> 1%" 只要1%的
6. eslint和babel执行优先级
   1. babel需要先执行,再执行eslint
   2. enforce:pre 先执行
7. 压缩HTMl
   1. HtmlWebpackPlugin插件的option
      1. minify;规则github
# webpack优化:
1. **tree shaking 树摇**
   1. 作用:去除未经引用的代码
   2. 配置
      1. mode:production 会自动启动压缩js的插件,把引用但没使用的css去掉
      2. 前提模块化必须使用es6
   3. 问题:会把引入的css样式干掉
   4. 解决: 在package.json文件中加上 "sideEffects": ["*.css"],  // 将css资源标记成不要进行tree shaking的资源
      1. package.json文件必须在当前项目中
      2. 标记不需要tree shaking的文件
2. **oneOf**
   1. 作用:修改一个文件,但是所有loader都会被遍历.导致效率低
   2. 解决:oneOf: [规则] (以下loader只会命中一个)
   3. 必须执行的放在oneOf上面
3. **cacheDirectory:true**
   1. 作用:babel-loader过程比较长
   2. cacheDirectory:true 开缓存文件夹,第二次使用babel会先去缓存
 对比:thread-loader多线程打包
4. **多线程打包**
代码量大:优化打包慢的问题,主要处理babel-loader打包慢问题
  thread-loader:根据cpu核数
5. **cacheing**
   1. minCss中chunkfile使用contenthash**
   2. 服务器开启缓存的问题: 强制缓存express(static Maxage:)
   3. 文件缓存
   4. 但是文件修改后页面不会马上刷新
   5. 解决:minCss中chunkfile中,
      1. 文件名使用hash值,但是只改样式,js的文件名都改了        
      2. 解决最小化打包的时候,使用contenthash命名 
          new MiniCssExtractPlugin({  
          filename: "css/[contenthash:10].css", //如果存在缓存文件,只有文件发生改变页面才会刷新,改变根据contenthash变化决定
          chunkFilename: "css/[contenthash:10].css"
          }),
      3. hash值: 
         1. 也叫**文件指纹**
        hash: webpack打包会生成一个hash值（只要打包内容发生变化，hash都会变化）。
          问题：修改css文件变化，js没变，但是因为所有文件共享同一个hash，所以js文件缓存就失效
        chunkhash
          打包输出的资源。不同资源有不同的chunk。
          问题：如果资源是从一个chunk中打包出来的，那么这些资源共享同一个chunkhash
        contenthash
          根据文件的内容来生成hash值。文件内容不同，hash就不同  
6. **代码分割 code splitting**
   1. 作用: 1)提取重复代码 2)将一个大的js文件拆成多个小的js文件
   2. 思想:读取缓存                                               
   3. 方法:
      方法1: 有多少和入口文件,写多少个入口文件
      方法2: 配置ptimization 
          ptimization: {
          splitChunks: {
            chunks: 'all'  //提取入口文件的公用代码
            }
          }        
      方法3: ES10 动态导入js --> 用来代码分割
        有兼容性问题:
        解决:
          1.eslint默认是不解析的，会报错。要使用babel-eslint解析,npm下载
          1. package.json文件添加 "eslintConfig": {"parser": "babel-eslint"}
7. *** 应用到生产环境 ***:
  eslint不认识es10的import,解决:
    1.eslint默认是不解析的，会报错。要使用babel-eslint解析,npm下载
    2. package.json文件添加 "eslintConfig": {"parser": "babel-eslint"}
8. *** js懒加载 ***:
    1. 作用:js只加载需要的东西,只有触发(点击)的时候才加载剩下的 ;
      (一个域名只能加载6个域名)
    2. 使用:ES10的import动态异步加载
        ``` document.getElementById('btn').onclick = function () {
              import( /* webpackChunkName: "module1", webpackPrefetch: true */ './module1.js').then(({
                default: module1
              }) => {
                module1();
              })
            }
      /* webpackChunkName: "module1", webpackPrefetch: true */  //指定chunk被分割出来的名字 ```
    3.  webpackPrefetch: true
       1. 作用:触发才会加载,如果加载内容多,加载时间会很长
       2. 原理:网络空闲偷偷加载,(利用link的rel="prefetch"属性)
    4. 缺点: 兼容性问题大
9. *** shumming ***
  1. 作用:垫片,避免重复引入公共的库
  2. 使用:(向外暴露全局变量 $, 其他模块就不用了引入jquery)
      1. webpack插件:webpack
      2. const webpack = require('webpack');
          new webpack.ProvidePlugin({
          $: 'jquery'
          })
10. *** PWA 离线可访问 ***
渐进式网络应用程序
webpack指南:
1. 使用
  1. 下载:npm install workbox-webpack-plugin --save-dev   
  2. 引入:const WorkboxPlugin = require('workbox-webpack-plugin');  
  3. 修改配置文件:
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true
      });
  4. 注册serviceWorker,实现离线可缓存(入口的js文件 )
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
      
2. 测试:
    offline测试查看网页还是可以访问
    f12: Service Worker
    资源存起来了,没有网络就会到存起来的资源中找

兼容性处理流程:
  babel/polyfill corejs postcss browerslist

问题解决方式:
  问题解决方案,插件的issues中找
路径问题:
  都以/路径为主
其他:
stackoverflow:全球最大的论坛
权限:vscode以管理员的身份运行

11. **dll**
作用:提前单独打包公共库
使用:
  entry:{}
  output:{target:}
  plugin:
    webpack.dll.js: webpack.DllPlugin(打包jquery)
    webpack.config.js: weboack.DllReferencePlugin(让wepack不打包jquery)
  把jquery以link标签引入:
    plugin:
      add-asset-html-webpack-plugin(往html中新增引入jquery)
对比external:
  external:只能打包默认的库
  dll:可扩展,高度可配置的external,可自定义打包的文件



# 应用问题: 
## babel corejs替代polyfill使用方法:
1. 链接https://babeljs.io/docs/en/babel-preset-env#corejs
2. 下载 npm i core-js
3. 配置webpack.config.js预设写法
presets: [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage', // 实现按需加载 1. npm i core-js 2.配置
      corejs: {
        version: 3,
        proposals: true
      },
      "targets": { //兼容到哪些版本的浏览器
        "chrome": "58",
        "ie": "11"
      }
    }
  ]
],


# 问题:
1. 配置babel target选项的时候,写的只兼容ie11,但是ie9都是支持的
2.  [id]没生效   
  new MiniCssExtractPlugin({  //为每个引入 CSS 的 JS 文件创建一个 CSS 文件
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
3. browserslist 页面上IE9不生效



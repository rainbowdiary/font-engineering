# webpack

# 结合项目场景面试
项目遇到的问题?
* 自己结合场景面试: contenthash:10问题
- 在项目中有时候代码改了，但是页面并没有更新，然后查原因是因为文件被缓存了，导致无法更新，优化了配置文件使用hash值，
一开始是hash值，但是如果css样式变化，js文件hash值也会变化 
在是chunk hash ，最后使用contenthash
当文件内容发生变化，会重新加载，没有变化的，会访问缓存内容

问题? 
"版本更新，用户界面还是没有更新，如何处理  
    解决： 加上时间戳，或者，按钮显示新旧版本切换"

前端开发版本管理：
原因：缓存会导致新发布的资源因为缓存问题无法成功载入
文件名加入版本号或者时间戳的md5值：
方法1): 文件名加上版本号；版本号的来源：
          自动生成的版本号：将时间戳、动态hash等自动生成的信息作为版本号，在打包脚本中配置好，自动生成版本信息。
        方法webpack打包静态资源文件：webpack中配置contenthash，作为output输出文件名，即可自动生成版本信息


# 结合react脚手架看下
# webpack面试题
  webpack几大模块的区别
	代码分割
	tree shiing
	长缓存

# gulp:
  需要先将js模块化转换为commonjs,再使用browserify转化为浏览器可识别的语言

# webpack模块
entry output loader plugin

## webpack loader和plugin的区别?
  webpack 只能解析 JavaScript 和 JSON 文件。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
  loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

# loader
* loader执行顺序:
  use中:
    1. 从下到上,从左到右
    2. enforce: pre 优先执行

##  相关loader 
* css-loader
	  MiniCssExtractPlugin.loader, // 提取css成单独文件 
* style-loader
* less-loader 
* ts-loader 
* url-loader 解析jpe?g|png|gif图片
    设置小于10m以下文件会被base64处理	
    name: '[hash:10].[ext]' // [hash:10] -> hash值取前10位  [ext] -> 补全之前的文件扩展名
* html-loader
	- 处理html的img
  - 在html写图片，解析不来
* file-loader
	 /\.(eot|ttf|woff|svg|mp3|mp4)$/,
	将文件原封不动输出出去
  可以配置输出指定文件夹和文件名
* thread-loader 使用这个loader可以让webpack进行多线程打包
* eslint-loader
	fix: true // 自动修复一些错误

# 插件
* new HtmlWebpackPlugins
	创建html文件
	引入js文件
	保留html结构需要写配置
	```
	    new HtmlWebpackPlugin({ // 生成一个html文件，并自动引入打包后输出js/css资源
      template: './public/index.html', // 以某个html文件为模板，创建新的html文件（新文件和源文件结构一样）
      minify: {
        collapseWhitespace: true, // 去除空格 换行符
        removeComments: true, // 去除注释
        removeRedundantAttributes: true, // 移除默认值
        removeScriptTypeAttributes: true, // 移除script的type属性
        removeStyleLinkTypeAttributes: true, // 移除style/link的type属性
        useShortDoctype: true // 使用html5的文档声明
      }
    }),
	```
* CleanWebpackPlugin
	在生成新资源之前，自动清除output.path的目录下面的内容
* MiniCssExtractPlugin
	提取css成单独文件
	```
	new MiniCssExtractPlugin({ // 提取css成单独文件
      filename: "static/css/[contenthash:10].css",
      chunkFilename: "static/css/[id].[contenthash:10].css"
    }),
	```
* OptimizeCssAssetsPlugin
	压缩css
* cssProcessorOptions
	开启source map
	```
	cssProcessorOptions: { // 开启source map
        map: {
          inline: false,
          annotation: true,
        }
      },
	```
* ServiceWorkers
  * PWA离线可加载

# 其他配置
* devServer 
  * 结合package.json指令实现自动化（自动编译，自动刷新）
  * 开启了一个服务器
  * 运行指令： webpack-dev-server 才能运行
      compress: true, // 开启gzip压缩
      hot: true, // 开启HMR 模块热替换 功能
      open: true 自动打开浏览器
* devtool
	devtool: 'source-map', // 生成source-map（提供与源代码的映射）
  ```
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true
      })
  ```
* resolve 解决模块路径问题
  ```
 resolve: { 
    alias: { // 配置路径别名: 简化路径的写法（缺点：没有路径提示）
        // '$css': resolve(__dirname, '../src/css'),
        // '$less': resolve(__dirname, '../src/less')
      },
      extensions: ['.js', '.jsx', '.json'] // 可以省略文件后缀名
        //问题： 如果一个目录有js和jsx，如果找到了js就不会读取jsx，只要找到了就不会往下找了
    },

  ```
* target: 'web', webpack运行的环境
* externals: {
     jquery: '$', // 让jquery不被webpack打包，需要手动使用外链script引入
   }
```


# webpack做了哪些优化配置?

* **1. HMR** 
  * webpack最有用的功能
  * 修改了一个模块，不会整个刷新页面，而只会局部更新
  * 作用： 运行时更新模块，但是不需要完全刷新，页面不会整个刷新，而是局部修改
  * 操作： 结合devServer: {hot: true}
  * 不同文件的模块热加载
    * css文件如果使用了css-loader,style-loader内部实现了HMR，所以直接使用
    * js没有实现，需要自己写HMR功能
        ```
        if (module.hot) { // 说明开启了HMR功能
          module.hot.accept('./module1.js', function () {   //定义module1的HMR
            showMsg();
          })

          module.hot.accept('./module2.js', function () { //定义module2的HMR
            console.log(add(1, 2)); 
          })
        }
      ```
  * 缺点： 会导致html没办法更新，需要自己手动刷新
    * 引入热摸替换田间是多个模块，而html只有一个文件，所以无法热模替换
    * 解决 webpack配置文件entry配置中，把html文件也传入,并结合html-loader
    * ``` entry: ['./src/js/index.js', './src/index.html'], ```

  * 框架的html是写在js中，所以可以使用HMR 
* **2. pollyfile**
    * 做js高级语法兼容性处理
    * @babel/polyfill会将es6所有的兼容性都引入
      * 包太大了，但是我们需要按需加载
    * core-js 能够实现按需加载
* **3. tree shaking**
  * 去除未使用的代码
  * 配置
    * 使用ES6模块化语法
    * mode="production"自动开启
  * 问题
    * 可能会删除css代码（因为css的引用 import "./index.css"）
      * 解决
        * 在package.json中加上 
          * sideEffects: ['*.css',"*.less"]
        * 意思是将css不要标记为tree shaking
* **4. caching**
  * 缓存： 让上线的服务器更好的缓存前端资源
  * 配置[contenthash:10]
    * 文件变化，hash才会变
    * 让项目部署上线后更好的使用缓存

    hash: webpack打包回生成一个hash值（只要打包内容发生变化，hash都会变化）。
      问题：修改css文件变化，js没变，但是因为所有文件共享同一个hash，所以js文件缓存就失效
    chunkhash
      打包输出的资源。不同资源有不同的chunk。
      问题：如果资源是从一个chunk中打包出来的，那么这些资源共享同一个chunkhash
    contenthash
      根据文件的内容来生成hash值。文件内容不同，hash就不同
* **5. code splitting** 
  * 代码分割
    * 提取重复代码
    * 将一个大的js文件拆分为多个小的js文件
  * 操作：
    * import("./index.js").then(()=>{}) ES10的语法

  * 但是import语法eslint无法解析
    * 因为import语法是ES10的语法
    * 解决: package.json eslintConfig配置中加上parser: "babel-eslint"
    * babel-eslint库需要下载
* **6. lazing loading**
  * 懒加载： 就是代码分割的一种用法
  * import(/*webpackChunkName: "module1"*/,/*webpackPrefetch: true*/'./index.js')语法
    webpackChunkName 指定模块打包后的名称
    webpackPrefetch 偷偷加载，利用了link ref="prefetch" as="script"方法（兼容性很严重）
  * 作用： 一个域名一次性只能加载6个文件，如果一次性加载太多，会影响效率，需要懒加载，让其访问的时候才加载
* **7. PWA**（生产环境）
  * 渐进式网络应用: 离线可访问
  * plugins+service work+浏览器Cache
  * 操作：
     ```
     const WorkboxPlugin = require('workbox-webpack-plugin');
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true
      })
    ],
     ```
     ```js文件
     if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
     ```
    浏览器查看:
      Application->Service Work
      Cache->Cache-Storage会存两个东西html和js文件。当离线的时候还可以访问
* **8. OneOf**
  * loader使用太多，优化loader
  * 以下loader只会命中一个
  * 其他需要都命中的放在OneOf外面
* **9. shimming**垫片
    缺点：不建议使用，会增加全局变量
    例如：react项目每个组件都会引入React，shmming就让组件不用再引入
    操作：
      使用webpack插件
      向外暴露全局变量，$,其他模块就不用引入jquery
      ```
        const webpack = require("webpack")
        plugins: [new webpack.ProvidePlugin({$: "jquery"})]
      ```
* **10. dll**
    类似于extendes
  - 作用： 用于生产环境优化，就不需要反复打包某些库，比如jquery
  - 需求：有些包或则库，不需要每次打包的时候都打包
  - 思路：提前打包一个库，库就不会被webpack打包，需要手动通过外链引入
  - dll流程理解：
      - 使用dll配置文件将包提前打包
      - 使用webpack配置文件，使用插件将打包好的库，自动引入到html中

  dll的处理可以单独定义一个webpack配置文件
  webpack.dll.js
    ```
    const {
      resolve
    } = require('path');

    const webpack = require('webpack');

    module.exports = {
      entry: {
        jquery: ['jquery']  //配置需要打包的库
      },
      output: {
        path: resolve(__dirname, '../dll'),
        filename: '[name].dll.js',
        library: '[name]' // 与下面name一致
      },
      plugins: [
        new webpack.DllPlugin({
          name: '[name]',
          path: resolve(__dirname, '../dll/[name].manifest.json') //打包目标文件名
        })
      ],
      mode: 'production'
    }
    ```
  webpack配置文件：
    ```
    plugins: [
      new webpack.DllReferencePlugin({ // 让webpack不打包jquery
        manifest: resolve(__dirname, '../dll/jquery.manifest.json')
      }),
      new AddAssetHtmlPlugin({ // 为了引入js
        filepath: resolve(__dirname, '../dll/jquery.dll.js')
      }),
    ],
    ```

* **多线程打包**
 thread-loader 使用这个loader可以让webpack进行多线程打包

# 生产环境
* 配置两个配置文件，一个开发一个生产

* filename: 'static/js/[name].[contenthash:10].js', // 输出文件名(只会将入口文件打包后输出的名称修改)

* 输入文件路径有问题:
    这样路径才能改成/开头的，需要publicPath
    ```
    output: {
      path: resolve(__dirname, '../build'), // 文件输出目录(只要经过webpack打包的文件，都会输出到这个目录)
      filename: 'js/[name].[contenthash:10].js', // 输出文件名(只会将入口文件打包后输出的名称修改)
      publicPath: '/', // 所有输出资源的公共路径
    },
    ```

* ClearWebpackPlugin
  * 自动清除output里的目录

* js文件压缩
  * mode: "production" 会自动压缩

* js兼容性
  * babel-loader只能转换简单的ES6的语法
  * @babel/polyfill会将es6所有语法都加载，不是最优方案
  * babel提供的core-js按需加载相关语法（使用了哪些ES6语法就引入哪些）
    ```配置
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
    ```

  * 用对应的规则处理不用的文件：
    比如 js|jsx 
      使用presets: ['@babel/preset-react'], // 编译react语法
  * babel-loader优化
    babel转换语法时间比较长，所以需要优化
      ```cacheDirectory: true```
      缓存babel执行结果，让第二次编译快带你

* css兼容性问题
  * postcss + browserslist
  * postcss-loader
  将sass编译成css，由postcss编译成css
  ```
    {
    test: /\.css$/, 
    use: [ // 从下到上，从右到左依次执行
      MiniCssExtractPlugin.loader, // 提取css成单独文件
      'css-loader', 
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            require('postcss-import')({
              root: loader.resourcePath
            }),
            require('postcss-preset-env')(),
            require('cssnano')()
          ]
        }
      }
    ]
  },
  ```
  * 指定css的兼容到哪个版本
    package.json
      "browserslist": {}
      ```
        "browserslist": [
          "cover 95%",
          "not ie <= 8",
          "not dead"
        ],
      ```
  编译后的css样式，会加上兼容 前缀

* html文件压缩
  结合HtmlWebpackPlugins插件
  ```
      new HtmlWebpackPlugin({ // 生成一个html文件，并自动引入打包后输出js/css资源
      template: './src/index.html', // 以某个html文件为模板，创建新的html文件（新文件和源文件结构一样）
      minify: {
        collapseWhitespace: true, // 去除空格 换行符
        removeComments: true, // 去除注释
        removeRedundantAttributes: true, // 移除默认值
        removeScriptTypeAttributes: true, // 移除script的type属性
        removeStyleLinkTypeAttributes: true, // 移除style/link的type属性
        useShortDoctype: true // 使用html5的文档声明
      }
    }),
  ```




* eslint：
	在package.json中使用eslint
	```
	  "eslintConfig": {
	    "extends": "react-app"
	  },
	```
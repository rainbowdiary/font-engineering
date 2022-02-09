# webpack原理解读

**webpack原理**：使用webpack命令行是依赖于webpack-cli的，webpack-cli使用yargs作为脚手架来项目搭建，webpack命令执行文件一开始就判断你是否下载了webpack-cli如果没有则提示下载webpack-cli，

**webpack-cli**做了什么？

1. 分析命令行参数，对各个参数进行转换，组成编译配置项 
2. 引用webpack，根据配置项进行编译和构建

- 判断运行的命令是否需要实例化为一个webpack：NON_COMPILATION_ARGS，因为并不是所有的命令都需要实例化一个webpack；

这些命令是不需要的：const NON_COMPILATION_ARGS = ["init", "migrate", "serve", "generate-loader", "generate-plugin", "info"];

- process.argv中如果有这些命令：
  - return require("./utils/prompt-command")(NON_COMPILATION_CMD, ...process.argv);

- 如果没有: 

```js
options = require("./utils/convert-argv")(argv); // options = {entry,output,module,plugins,mode,externals等等}
processOptions(options);  // 定义outputOptions
```

processOptions(options); 

```js
// 定义outputOptions,设置一些默认的数据 
outputOptions.exclude = ["node_modules", "bower_components", "components"];
const webpack = require("webpack");
compiler = webpack(options);
```

./utils/convert-argv 合并配置文件中的配置和命令行中的options作为options返回

```js
// 拿到--config指定的webpack配置文件：requireConfig // webpack.prod.js绝对路径对应的modules.exports输出的配置对象，关键代码：获取options,有两处可以配置options，一处是webpackc.config.js配置文件，第二处是webpack命令options参数
options = [{entry,output,module,plugins,mode,externals}] //从配置文件中的配置加入options
processOptions(options); // 合并webpack命令中的options和配置文件中配置
options.context = process.cwd();
处理完成options返回options。
```

## compiler = webpack(options);

Webpack可以理解为一种基于事件流的编程范例，一系列的插件运行。

Compiler核心类继承Tapable

Tapable是发布订阅的库，类似于Node.js的EventEmitter的库，主要是控制钩子函数的发布的与订阅，控制着webpack的插件系统。












console.log(process.argv);
/*
第一: node启动路径， 第二： 当前文件运行路径
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\尚硅谷\\js-note\\07_webpack-工程化\\11.分析react脚手架\\index.js'
] */

const publicPath = isEnvProduction
  ? paths.servedPath
  : isEnvDevelopment && '/';
//如果开发环境 publicPath="/"

console.log([0, 1, 2].filter(Boolean))  // 过滤掉哪些为false的
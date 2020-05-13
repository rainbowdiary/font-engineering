const path = require("path");

module.export = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bunld.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css=loader'
        ]
      }
    ]
  },
  plugins: {},
  mode: "development"
}
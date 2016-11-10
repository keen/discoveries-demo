const webpack = require("webpack");
const path = require("path");
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');
const appConfig = require('./app.config.js');

module.exports = {
  entry: { app: ["./src/index.js"] },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015']
      }
    }
    ]
  },
  plugins: [
    new ExtendedDefinePlugin({
      APP_CONFIG: appConfig,
    })
  ]
}

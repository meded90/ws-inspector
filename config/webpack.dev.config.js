const webpack = require('webpack');
const path = require('path');
const fileSystem = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ip = require('ip');
const env = require('./env');

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];

const appDir = path.join(__dirname, '..');
const srcDir = path.join(appDir, 'src');

const options = {
  entry: {
    background: path.join(srcDir, 'background.ts'),
    inspector: path.join(srcDir, 'inspector.tsx'),
    main: path.join(srcDir, 'main.ts'),
  },
  output: {
    path: path.join(appDir, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`.(${fileExtensions.join('|') })$`),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript'),
          ],
          plugins: [
            [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
          ],
          cacheDirectory: true,
        },
      },
    ],
  },
  plugins: [
    // clean the build folder
    // new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
        transform(content) {
          // generates the manifest file using the package.json informations
          const oldJson = JSON.parse(content.toString());
          return Buffer.from(
            JSON.stringify({
              ...oldJson,
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              permissions: oldJson.permissions.concat(ip.address() + ':' + env.PORT),
            }),
          );
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'main.html'),
      filename: 'main.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'inspector.html'),
      filename: 'inspector.html',
      chunks: ['inspector'],
    }),
    new WriteFilePlugin(),
  ],
  devtool: 'inline-module-source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },
};

module.exports = options;

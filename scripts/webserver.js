const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const config = require('../config/webpack.dev.config');
const env = require('../config/env');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const options = config.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

for (const entryName in config.entry) {
  config.entry[entryName] = [
    'webpack-dev-server/client?http://' + require('ip').address() + ':' + env.PORT,
    'webpack/hot/dev-server',
  ].concat(config.entry[entryName]);
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);
const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  host: require('ip').address(),
  port: env.PORT,
  disableHostCheck: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
});

server.listen(env.PORT);

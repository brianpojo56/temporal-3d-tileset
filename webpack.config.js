const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  target: 'web',
  mode: 'production',
  entry: {
    index: './src/temporal-3d-tileset.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'temporal-3d-tileset.js',
    library: 'Temporal3DTilesetExtender',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: [/node_modules/, /test/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['minify']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};

module.exports = config;

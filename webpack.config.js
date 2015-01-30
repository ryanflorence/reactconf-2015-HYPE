var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var DEMOS = __dirname+'/demos';

var BOB = fs.readdirSync('./demos/06-itunes-style-interface/bob').reduce(function(files, file) {
  var id = file.match(/^R-(\d+)-/)[1];
  files[id] = 'bob/'+file;
  return files;
}, {});

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

module.exports = {

  devtool: 'eval',

  entry: fs.readdirSync(DEMOS).reduce(function (entries, dir) {
    if (isDirectory(path.join(DEMOS, dir)))
      entries[dir] = path.join(DEMOS, dir, 'app.js');
    return entries;
  }, {}),

  output: {
    path: 'demos/__build__',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      BOB: JSON.stringify(BOB)
    })
  ]

};


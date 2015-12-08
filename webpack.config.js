
var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        index: './src/javascript/index.js',
        login: './src/javascript/login.js'
    }, 
    output: {
        path: path.join(__dirname, '/dev'),
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.mcss$/,
            loader: 'style-loader!css-loader?sourceMap!mcss-loader?sourceMap'
        }, {
            test: /\.rgl$/,
            loader: 'rgl-loader'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js', ['index', 'login'])
    ]
}
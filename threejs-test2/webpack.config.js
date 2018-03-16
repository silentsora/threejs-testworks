const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/js/index.js'),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'main.js',
        publicPath: ''
    },
    devtool: 'none',
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['env', {
                            'targets': {
                                'chrome': 52,
                                'browsers': 'ie >= 9'
                            }
                        }]
                    ]
                }
            },
            {
                loader: 'eslint-loader'
            }],
            exclude: /node_modules/
        },
        {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader']
            }),
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif|svg|mp3|mp4)$/,
            use: 'url-loader?limit=10000&name=img/[name].[hash:8].[ext]'
        }]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.ejs',
            text: 'kukuku2'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        host: '0.0.0.0',
        contentBase: path.join(__dirname, '/dist/'),
        port: 3000,
        inline: true,
        hot: true
    }
}
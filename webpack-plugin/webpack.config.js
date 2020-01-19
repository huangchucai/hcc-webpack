const path = require('path');
const DonePlugin = require('./plugins/DonePlugin.js');
const AsyncPlugin = require('./plugins/AsyncPlugin');
const FileListPlugin = require('./plugins/FileListPlugin');
const TestPlugin = require('./plugins/PluginHooks');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new FileListPlugin({
            filename: 'list.md'
        }),
        new TestPlugin(),
        new DonePlugin(),
        new AsyncPlugin()
    ]
};

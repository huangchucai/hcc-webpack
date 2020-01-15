const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
        // 别名配置
        // alias: {
        //     loader1: path.resolve(__dirname, 'loaders', 'loader1.js')
        // }
    },
    module: {
        // loader执行 从左到右， 从下到上
        // loader 分类 1. pre  2. normal 4. inline 3. post
        rules: [
            {
                test: /\.js$/,
                use: ['loader3', 'loader2', 'loader1']
            }
        ]
    },
    plugins: [
        // new htmlWebpackPlugin()
    ]
};

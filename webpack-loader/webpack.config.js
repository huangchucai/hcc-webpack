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
    devtool: 'source-map',
    watch: true,
    module: {
        // loader执行 从左到右， 从下到上
        // loader 分类 1. pre  2. normal 4. inline 3. post
        rules: [
            // {
            //     test: /\.png$/,
            //     // 根据图片生成一个md5,发射到dist目录下，file-loader还会返回当前的路径
            //     use: 'file-loader'
            // },
            // {
            //     test: /\.png$/,
            //     // 根据图片生成一个md5,发射到dist目录下，file-loader还会返回当前的路径
            //     use: {
            //         loader: 'url-loader',
            //         options: {
            //             limit: 20 * 1024
            //         }
            //     }
            // },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'comment-loader',
            //         options: {
            //             text: '黄楚才',
            //             filename: path.resolve(__dirname, 'comment.js')
            //         }
            //     }
            // }
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // }
        ]
    },
    plugins: [
        // new htmlWebpackPlugin()
    ]
};

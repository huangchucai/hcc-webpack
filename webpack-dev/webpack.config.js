let path = require('path');

class EmitPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('emit', () => {
            console.log('emit');
        });
    }
}

class AfterPlugins {
    apply(compiler) {
        compiler.hooks.afterPlugins.tap('emit', () => {
            console.log('afterPlugins');
        });
    }
}

class EntryOption {
    apply(compiler) {
        compiler.hooks.entryOption.tap('emit', () => {
            console.log('entryOption');
        });
    }
}

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, 'loader', 'style-loader'),
                    path.resolve(__dirname, 'loader', 'less-loader')
                ]
            },
            {
                test: /\.png$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new EmitPlugin(),
        new AfterPlugins(),
        new EntryOption()
    ]
};

class AsyncPlugin {
    apply(compiler) {
        console.log(compiler);
        compiler.hooks.emit.tapAsync('AsyncPlugin', (compliation, cb) => {
            setTimeout(() => {
                console.log('文件发射发出来  等一秒');
                cb();
            }, 4000);
        });

        compiler.hooks.emit.tapPromise('AsyncPlugin', (compliation) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('文件发射发出来  等2秒');
                    resolve();
                }, 2000);
            });
        });
    }
}

module.exports = AsyncPlugin;

class FileListPlugin {
    constructor({ filename = 'index.md' }) {
        this.filename = filename;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
            let assets = compilation.assets;
            let content = '## 文件    资源大小\r\n';
            Object.entries(assets).forEach(([key, value]) => {
                content += `${key}    ${value.size()}\r\n`;
            });
            assets[this.filename] = {
                size() {
                    return content.length;
                },
                source() {
                    return content;
                }
            };
            cb();
        });
    }
}

module.exports = FileListPlugin;

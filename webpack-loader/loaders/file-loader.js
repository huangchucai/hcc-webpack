const loadersUtils = require('loader-utils');

function loader(source) {
    // file-loader 需要返回一个路径
    const filename = loadersUtils.interpolateName(this, '[hash].[ext]', {
        content: source
    });
    console.log(filename);
    this.emitFile(filename, source);

    return `module.exports="${filename}"`;
}

// 把图片转换成二进制
loader.raw = true;
module.exports = loader;

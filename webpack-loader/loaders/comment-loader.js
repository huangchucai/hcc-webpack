const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const fs = require('fs');

function loader(source) {
    // 不缓存loader
    this.cacheable(false);

    // 缓存（默认）
    this.cacheable && this.cacheable()
    let options = loaderUtils.getOptions(this);
    let cb = this.async();
    let schema = {
        type: 'object',
        properties: {
            text: {
                type: 'string'
            },
            filename: {
                type: 'string'
            }
        }
    };
    validateOptions(schema, options, 'comment-loader');
    if (options.filename) {
        // 自动的添加文件依赖
        this.addDependency(options.filename);
        fs.readFile(options.filename, 'utf8', (err, data) => {
            console.log(source);
            cb(err, `/**${data.trim()}**/\n${source}`)
        })
    } else {
        cb(`/**${options.text}**/`)
    }
    return source;
}

module.exports = loader;

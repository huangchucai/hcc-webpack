const path = require('path');
const fs = require('fs');

// babylon  主要是把源码 转换成ast
// @babel/traverse 需要遍历到对应的节点
// @babel/types  把遍历的节点替换
// @babel/generator 需要把替换的结果生成

const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;

const ejs = require('ejs');
const { SyncHook } = require('tapable');

class Compiler {
    constructor(config) {
        //entry output
        this.config = config;
        // 需要保存入口文件的路径
        this.entryId; // './src/index.js'
        // 需要保存所有的模块依赖
        this.modules = {};


        this.hooks.entryOption.call();
        this.entry = config.entry;  // 入口路径
        // 工作路径
        this.root = process.cwd();

        this.hooks = {
            entryOption: new SyncHook(),
            compile: new SyncHook(),
            afterCompile: new SyncHook(),
            afterPlugins: new SyncHook(),
            run: new SyncHook(),
            emit: new SyncHook(),
            done: new SyncHook()
        };
        // 如果传递了plugins参数
        const plugins = this.config.plugins;
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                plugin.apply(this);
            });
        }
        this.hooks.afterPlugins.call();
    }

    /**
     * 获取源码
     * @param modulePath  文件绝对路径
     * @returns {string}
     */
    getSource(modulePath) {
        let content = fs.readFileSync(modulePath, 'utf8');
        let rules = this.config.module.rules; // 拿到modules的rules
        // 拿到每个规则来处理
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            let { test, use } = rule;
            let len = use.length - 1;
            if (test.test(modulePath)) { // 如果能够匹配路径，就证明需要进行对应的loader 处理
                function normalLoader() {
                    let loader = require(use[len--]); // 获取对应的loader 函数
                    content = loader(content);
                    if (len >= 0) {
                        normalLoader();
                    }
                }

                normalLoader();
            }
        }
        return content;
    }

    /**
     * 解析源码
     * @param source 模块内容
     * @param parentPath  模块父目录
     */
    parse(source, parentPath) { // AST 解析语法树
        let ast = babylon.parse(source);
        let dependencies = []; // 依赖的数组
        traverse(ast, {
            CallExpression(p) { // a()  require()
                let node = p.node; // 拿到对应的节点
                if (node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value; // 取到的是模块的引用名字
                    moduleName = moduleName + (path.extname(moduleName) ? '' : '.js'); // -> './a.js'
                    moduleName = './' + path.join(parentPath, moduleName);  // './src/a.js'
                    dependencies.push(moduleName);
                    node.arguments = [types.stringLiteral(moduleName)];
                }
            }
        });
        let sourceCode = generator(ast).code;
        return {
            sourceCode,
            dependencies
        };
    }

    /**
     * 构建模块 this.modules
     * @param modulePath 模块的绝对路径
     * @param isEntry  是否是入口文件
     */
    buildModule(modulePath, isEntry) {
        // 拿到模块的内容
        let source = this.getSource(modulePath);
        // 模块ID  相对路径 = modulePath - this.root  ->  ./src/index.js
        let moduleName = './' + path.relative(this.root, modulePath);

        if (isEntry) {
            this.entryId = moduleName;
        }

        // 解析源码,进行改造，并返回一个依赖列表  require -> __webpack_require__  ./a.js -> ./src/a.js  ['./src/a.js']
        let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName));  // ./src
        // 把相对路径和模块中的内容 对应起来
        this.modules[moduleName] = sourceCode;

        // 递归所有的依赖项
        dependencies.forEach(dep => { // 父模块的加载
            this.buildModule(path.join(this.root, dep), false);
        });

    }


    /**
     * 用数据渲染到对应的output页面
     */
    emitFile() {
        let main = path.join(this.config.output.path, this.config.output.filename);
        let templateStr = this.getSource(path.join(__dirname, 'main.ejs'));
        let code = ejs.render(templateStr, {
            entryId: this.entryId,
            modules: this.modules
        });
        // 资源中，路径对应的代码
        this.assets = {};
        this.assets[main] = code;
        fs.writeFileSync(main, this.assets[main]);
    }

    /**
     * 运行程序
     */
    run() {
        this.hooks.run.call();
        this.hooks.compile.call();
        // 执行  并且创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true);
        this.hooks.afterCompile.call();

        // 发射一个文件，打包后的文件
        this.emitFile();
        this.hooks.emit.call();
        this.hooks.done.call();
    }
}


module.exports = Compiler;

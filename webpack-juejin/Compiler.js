const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const options = require('./webpack.config')
const fs = require('fs')
const { transformFromAst } = require('@babel/core')

const Parser = {
    getAst(path) {
        // 读取入口文件
        const content = fs.readFileSync(path, 'utf-8')

        // 将文件内容转为AST抽象语法树
        return parser.parse(content, {
            sourceType: 'module'
        })
    },
    // 从入口文件,根据ast获取文件依赖
    getDependecies(ast, filename) {
        const dependecies = {}
        // 遍历所有的 import 模块,存入dependecies
        traverse(ast, {
            // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
            ImportDeclaration({ node }) {
                console.log(filename)
                const dirname = path.dirname(filename)
                const filepath = './' + path.join(dirname, node.source.value)
                // 保存依赖模块路径,之后生成依赖关系图需要用到
                dependecies[node.source.value] = filepath
            }
        })
        return dependecies
    },
    getCode: ast => {
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        });
        return code;
    }
}

class Compiler {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        // 模块
        this.modules = []
    }

    // 构建启动
    run() {
        const { getAst, getDependecies, getCode } = Parser
        const ast = getAst(this.entry)
        const dependecies = getDependecies(ast, this.entry)
        const code = getCode(ast, this.entry)
        console.log(code)
    }

    // 重写 require函数,输出bundle
    generate() {

    }
}

new Compiler(options).run()

console.log('index.js');
// 行内loader inline-loader!./a.js
// -!: pre,normal loader 将不再触发 -!inline-loader!./a.js
// !: 没有normal !inline-loader!./a.js
// !!: 什么loader都不要，只要行内loader处理 !!inline-loader!./a.jscl
const a = require('!!inline-loader!./a.js')



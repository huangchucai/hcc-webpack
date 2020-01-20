console.log('index.js');
// 行内loader inline-loader!./a.js
// -!: pre,normal loader 将不再触发 -!inline-loader!./a.js
// !: 没有normal !inline-loader!./a.js
// !!: 什么loader都不要，只要行内loader处理 !!inline-loader!./a.jscl
// const a = require('!!inline-loader!./a.js')

// class Person {
//     constructor() {
//         this.name = 'hcc'
//     }
//     getName() {
//         return this.name
//     }
// }
//
// let p = new Person();
// console.log(p.getName());

// import pic from './vue-ssr.png';
//
// console.log(pic);
// const image = document.createElement('img');
// image.src = pic;
// document.body.appendChild(image);

import './index.less';

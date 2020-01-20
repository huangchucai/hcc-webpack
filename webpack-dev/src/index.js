let str = require('./a.js');
require('./index.less');
import pic from './vue-ssr.png';

console.log('-----------');
console.log(pic);
const image = document.createElement('img');
image.src = pic;
document.body.appendChild(image);

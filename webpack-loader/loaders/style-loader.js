function loader(source) {

    // 导出一个脚步
    let str = `
        let style = document.createElement('style')
        style.innerHTML=${JSON.stringify(source)};
        document.head.appendChild(style)
    `;

    return str;
}

module.exports = loader;

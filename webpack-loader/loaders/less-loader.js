const less = require('less');

function loader(source) {
    let css;
    less.render(source, function (err, r) {
        console.log(err);
        console.log(r);
        css = r.css;
    });

    return css;

}

module.exports = loader;

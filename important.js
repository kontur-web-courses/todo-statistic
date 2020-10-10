const {tableCreate} = require('./tableCreate');

function important(files, pathFiles) {
    const arrayStringFiles = files.map(file => file.split('\n'))
    let todoArray = [];
    let regEx = /\/\/ TODO.*!/gi
    for (let i = 0; i < arrayStringFiles.length; i++) {
        for (let j = 0; j < arrayStringFiles[i].length; j++) {
            if (arrayStringFiles[i][j].match(regEx)) {
                todoArray.push(arrayStringFiles[i][j].slice(arrayStringFiles[i][j].indexOf('//')) + ';' + pathFiles[i]);
            }
        }
    }
    tableCreate(todoArray)
}

module.exports = {
    important
};

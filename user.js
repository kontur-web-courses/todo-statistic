const {tableCreate} = require('./tableCreate');

function user(files, username, pathFiles) {
    const arrayStringFiles = files.map(file => file.split('\n'))
    let todoArray = [];

    let resultUserMassage = [];
    let regEx = /\/\/ TODO.*/gi
    for (let i = 0; i < arrayStringFiles.length; i++) {
        for (let j = 0; j < arrayStringFiles[i].length; j++) {
            if (arrayStringFiles[i][j].match(regEx)) {
                todoArray.push(arrayStringFiles[i][j].slice(arrayStringFiles[i][j].indexOf('//')) + ';' + pathFiles[i]);
            }
        }
    }
    let arrayTodoSplit = [];
    for (const todoString of todoArray) {
        arrayTodoSplit.push(todoString.split(';'))
    }
    for (const userMassegeElement of arrayTodoSplit) {
        if (userMassegeElement[0].toLowerCase().match(username.toLowerCase()) && userMassegeElement[0].length === username.length + 8) {
            resultUserMassage.push(userMassegeElement.join(';'));
        }
    }
    tableCreate(resultUserMassage)
}


module.exports = {
    user
};

const {tableCreate} = require('./tableCreate');

function date(files, dateCommand, pathFiles) {
    const arrayStringFiles = files.map(file => file.split('\n'))
    let todoArray = [];
    let regEx = /\/\/ TODO.*/gi
    for (let i = 0; i < arrayStringFiles.length; i++) {
        for (let j = 0; j < arrayStringFiles[i].length; j++) {
            if (arrayStringFiles[i][j].match(regEx)) {
                todoArray.push(arrayStringFiles[i][j].slice(arrayStringFiles[i][j].indexOf('//')) + ';' + pathFiles[i]);
            }
        }
    }
    let dateArray = [];
    let resultYearMonthDay = [];
    for (const todoArrayElement of todoArray) {
        dateArray.push(todoArrayElement.split(';')[1])
    }
    for (const dateArrayElement of dateArray) {
        if (Date.parse(dateArrayElement) >= Date.parse(dateCommand)) {
            resultYearMonthDay.push(dateArrayElement)
        }
    }
    let resultMassege = []
    for (const yearMonth of resultYearMonthDay) {
        for (const todoArrayElement of todoArray) {
            if (todoArrayElement.match(yearMonth)) {
                resultMassege.push(todoArrayElement)
            }
        }
    }
    tableCreate(resultMassege)
}

module.exports = {
    date
};

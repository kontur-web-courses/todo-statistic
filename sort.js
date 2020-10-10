const {tableCreate} = require('./tableCreate');

function sort(files, sortCommand, pathFiles) {
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

    if (sortCommand === "importance") {
        let mapImportance = new Map();
        let countExclamationMark;
        let sortArrayInportance = []
        for (const todoArrayElement of todoArray) {
            if (todoArrayElement.match("!")) {
                countExclamationMark = todoArrayElement.split('!').length - 1
                mapImportance.set(todoArrayElement, countExclamationMark);
                continue
            }
            mapImportance.set(todoArrayElement, 1);
        }
        mapImportance = Object.fromEntries(mapImportance)
        sortArrayInportance.push(Object.keys(mapImportance).sort(function (a, b) {
            return mapImportance[b] - mapImportance[a]
        }))
        tableCreate(sortArrayInportance[0])
    }
    if (sortCommand === "user") {
        let sortArray = [];
        let todoArrayCopy = todoArray.concat()
        for (const todoArrayElement of todoArrayCopy) {
            sortArray.push(todoArrayElement.split(';')[0])
        }
        sortArray.sort()
        for (const sortArrayElement of sortArray) {
            if (sortArrayElement.length <= 8) {
                sortArray.shift()
            }
        }
        let sortArrayName = []
        for (const sortArrayElement of sortArray) {
            for (const todoArrayElement of todoArrayCopy) {
                if (todoArrayElement.match(sortArrayElement)) {
                    sortArrayName.push(todoArrayElement)
                    todoArrayCopy.splice(todoArrayCopy.indexOf(todoArrayElement), 1)
                }
            }
        }
        for (const todoArrayElement of todoArrayCopy) {
            sortArrayName.push(todoArrayElement)
        }
        tableCreate(sortArrayName)
    }
    if (sortCommand === "date") {
        let arraySplit = [];
        let todoArrayCopy = todoArray.concat()
        for (const todoArrayElement of todoArrayCopy) {
            arraySplit.push(todoArrayElement.split(';')[1]);
        }
        arraySplit.sort()
        for (const arraySplitElement of arraySplit) {
            if (arraySplitElement.length <= 2) {
                arraySplit.shift()
            }
        }
        let sortArrayDate = []
        for (const arraySplitElement of arraySplit) {
            for (const todoArrayElement of todoArrayCopy) {
                if (todoArrayElement.match(arraySplitElement)) {
                    sortArrayDate.push(todoArrayElement)
                    todoArrayCopy.splice(todoArrayCopy.indexOf(todoArrayElement), 1)
                }
            }
        }
        for (const todoArrayElement of todoArrayCopy) {
            sortArrayDate.push(todoArrayElement)
        }
        tableCreate(sortArrayDate)
    }


}


module.exports = {
    sort
};

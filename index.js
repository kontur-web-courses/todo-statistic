const path = require("path");
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(filePath => {
        return {
            name: path.win32.basename(filePath),
            allStrings: readFile(filePath),
        }
    });
}

function processCommand(line) {
    let [command, argument] = line.split(' ');
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTable(parseTODOArr(showTODO()));
            break;
        case 'important':
            printTable(parseTODOArr(importantTODO()));
            break;
        case 'user':
            printTable(parseTODOArr(showUsersTODO(argument)));
            break;
        case 'sort':
            if (checkArg(argument, `Команда sort должна соответствовать виду 'sort {importance | user | date} 
            \n Вы ввели строку ${line}'`))
                printTable(parseTODOArr(sortTODO(argument)));
            break;
        case 'date':
            printTable(parseTODOArr(afterDateTODO(argument)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function createTODOArray() {
    let regex = /\/\/ TODO.*/gi; // TODO{...}
    return files.map(file => file.allStrings.match(regex)).flat().filter(string => string);
}

function parseTODOArr(arr) {
    let parsedTODOs = [];
    for (let todo of arr)
        parsedTODOs.push(parseTODO(todo, this.name))
    return parsedTODOs;
}

function parseTODO(todo, filename) {
    let [todoObject] = todo.matchAll(/\/\/\s*TODO\s*(?:([a-zA-Z _]+)?\s*;)?\s*((?:\d{4})-(?:\d{2})-(?:\d{2})|(?:\d{4})-(?:\d{2})|(?:\d{4}))?\s*;?\s*(.*)?/gi);
    let [user, date, comment] = [todoObject[1], todoObject[2], todoObject[3]];
    if (comment === undefined)
        comment = '';

    let importance = comment.includes('!')
        ? comment
            .split('')
            .reduce((p, i) => i === '!' ? p + 1 : p, 0)
        :
            0;
    return [importance, user, date, comment, filename];
}

function showTODO() {
    return createTODOArray();
}

function importantTODO() {
    return createTODOArray()
        .filter(string => string.includes('!'))
        .filter(arr => arr.length > 0);
}

function showUsersTODO(username) {
    let regex = `[\s:;]*${username};`; // TODO {user}; {date}; {comment}
    regex = new RegExp(regex, "gi");
    return createTODOArray()
        .filter(str => str.match(regex));
}

function afterDateTODO(date) {
    let todoArray = createTODOArray();
    let datePattern = /(\d{4})|(\d{4})-(\d{2})|(\d{4})-(\d{2})-(\d{2})/gi;
    todoArray = todoArray.filter(string => new Date(string.match(datePattern)) >= new Date(date));

    datePattern = /(\d{4})?-?(\d{2})?-?(\d{2})/gi;
    todoArray.sort((a, b) => {
        return (new Date(b.match(datePattern)) - new Date(a.match(datePattern)));
    })

    return todoArray;
}

function sortTODO(argument) {
    let todoArray = createTODOArray();
    switch (argument) {
        case 'importance':
            todoArray.sort((a, b) => {
                return (b.match(/!/gi) || []).length - (a.match(/!/gi) || []).length;
            })
            return todoArray;
        case 'user':
            let users = [];
            let nameless = [];
            for (let string of todoArray)
                if (string.indexOf(';') > -1)
                    users.push(string);
                else
                    nameless.push(string);
            return users.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            }).concat(nameless);
        case 'date':
            let datePattern = /(\d{4})?-?(\d{2})?-?(\d{2})/gi; // TODO 2020-09
            // TODO 2019-08-21
            // TODO 2018-07
            // It's working!
            todoArray.sort((a, b) => {
                return (new Date(b.match(datePattern)) - new Date(a.match(datePattern)));
            })
            return todoArray;
    }
}

function checkArg(argument, errorMessage) {
    if (!argument || (argument !== 'importance' && argument !== 'user' && argument !== 'date'))
        throw new Error(errorMessage);
    return true;
}

function printTable(arr) {
    let table = [];
    const header = ['!', 'user', 'date', 'comment', 'file'];
    table.push(header)
    let currentSizes = [1, 4, 4, 7, 4];
    let maxSizes = [1, 10, 10, 50, 50];
    for (let object of arr){
        object[0] = (object[0] > 0) ? '!' : ' ';

        for (let file of files)
            if (file.allStrings.includes(object[3])) {
                object[4] = file.name;
                break;
            }

        for (let i = 1; i < currentSizes.length; i++) {
            if (object[i] === undefined)
                object[i] = '';
            if (object[i].length > currentSizes[i]) {
                if (object[i].length > maxSizes[i]) {
                    object[i] = object[i].slice(0, maxSizes[i] - 3) + '...';
                    currentSizes[i] = maxSizes[i];
                }
                else
                currentSizes[i] = object[i].length;
            }
        }

        table.push(object);
    }

    let rowWidth = currentSizes[0] + currentSizes[1] + currentSizes[2] + currentSizes[3] + currentSizes[4] + 5 * 3 - 1;
    for (let row of table){
        console.log(row[0].padEnd(currentSizes[0]) + ' | ' +
            row[1].padEnd(currentSizes[1]) + ' | ' +
            row[2].padEnd(currentSizes[2]) + ' | ' +
            row[3].padEnd(currentSizes[3]) + ' | ' +
            row[4].padEnd(currentSizes[4]) + ' | ')
        if (row[2] === 'date')
            console.log('-'.repeat(rowWidth));
    }
    console.log('-'.repeat(rowWidth));
}

// TODO you can do it!

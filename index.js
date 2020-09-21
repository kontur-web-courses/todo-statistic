// TODO tester; 2018-09-21; Лучший коммент
const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const arrayTODO = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findString() {
    if (arrayTODO.length !== 0) return;
    for (let file of files) {
        let currentIndex = 0;
        while (~(currentIndex = file.indexOf('//' + ' TODO ', currentIndex))) {
            let end = file.indexOf('\r', currentIndex);
            if (~end) {
                arrayTODO.push(parseString(file.slice(currentIndex, end)));
            }
            else arrayTODO.push(parseString(file.slice(currentIndex)));
            currentIndex++;
        }
    }
}

function parseString(sourceString) {
    let [text, date, name] = sourceString.slice(8).split(';').map(str => str.trim()).reverse();

    let count = 0;
    for (let char of sourceString) {
        if (char == '!') count++
    }

    let result = {
        commentText: text,
        userName: name,
        commentDate: date,
        important: count,
        toString() {
            return ((this.userName ? 'имя ' + this.userName + '; ' : '') + (this.commentDate ? 'дата ' + this.commentDate + '; ' : '') + 'текст ' + this.commentText);
        }
    };
    return result;
}

function getString() {
    findString();
    for (let s of arrayTODO) {
        console.log(s.toString());
    }
}

// TODO tester; 2018-09-23; Лучший коммент 3

function getImportantString() {
    findString();
    for (let s of arrayTODO.filter(s => s.important)) {
        console.log(s.toString());
    }
}

function getStringByName(userName) {
    findString();
    for (let s of arrayTODO.filter(s => s.userName === userName)) {
        console.log(s.toString());
    }
}

function sortString(str) {
    findString();
    let funcSort;
    switch (str) {
        case 'importance':
            funcSort = (com1, com2) => {
                return - com1.important + com2.important;
            }
            break;
        case 'user':
            funcSort = (com1, com2) => {
                if (com1.userName && com2.userName)
                    return com1.userName.localeCompare(com2.userName);
                if (com1.userName) return -1;
                if (com2.userName) return 1;
                return 0;
            }
            break;
        case 'date':
            funcSort = (com1, com2) => {
                if (com1.commentDate)
                    return com2.commentDate ? new Date(com2.commentDate) - new Date(com1.commentDate) : -1;
                else
                    return com2.commentDate ? 1 : 0;
            }
            break;
        default:
            console.log('wrong command');
            return;
    }

    for (let s of arrayTODO.sort(funcSort))
        console.log(s.toString());
}

function processCommand(command) {
    let [key, parameter] = command.split(' ');
    switch (key) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getString();
            break;
        case 'important':
            getImportantString();
            break;
        case 'user':
            getStringByName(parameter);
            break;
        case 'sort':
            sortString(parameter);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

// TODO tester; 2018-09-22; Лучший коммент 2

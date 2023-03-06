const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const showArr = getAllTodo(getFiles());
            for (str of showArr) {
                console.log(str);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodo(codeStrings) {
    const todo = [];
    for (str of codeStrings) {
        if (/^\/\/ TODO /.test(str)) {
            todo.push(str);
        }
    }
    return todo;
}


function getLinesWithExclamation(arr) {
    filteredArr = [];
    for (let line of arr) {
        hasExclamation = false;
        for (let c of line) {
            if (c === '!') {
                hasExclamation = true;
                break;
            }
        }
        if (hasExclamation) {
            filteredArr.push(line);
        }
    }
    return filteredArr;
}
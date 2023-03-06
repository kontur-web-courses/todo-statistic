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
    const [action, parametr] = command.split(" ");
    switch (action) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const showArr = getAllTodo(files);
            for (str of showArr) {
                console.log(str);
            }
            break;
        case 'important':
            const myArr = getAllTodo(files);
            for (str of getLinesWithExclamation(myArr)) {
                console.log(str);
            }
            break;
        case 'name':
            const todoArr = getAllTodo(getFiles());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodo(files) {
    const todo = [];
    for (file of files) {
        for (str of file.split('\n')) {
            if (/^\/\/ TODO /.test(str.trim())) {
                todo.push(str.trim());
            }
        }
    }
    return todo;
}


function getLinesWithExclamation(arr) {
    filteredArr = [];
    for (let line of arr) {
        let hasExclamation = false;
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
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
    const [action, ...parametrs] = command.split(" ");
    const argument = parametrs.join(" ").toLowerCase();
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
            const importantArr = getLinesWithExclamation(getAllTodo(files));
            for (str of importantArr) {
                console.log(str);
            }
            break;
        case 'name':
            const nameArr = getNameTodo(getAllTodo(files), argument);
            for (str of nameArr) {
                console.log(str);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodo(files) {
    const todo = [];
    for (const file of files) {
        for (const str of file.split('\n')) {
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

function getNameTodo(arr, name) {
    const todoName = [];
    for (el of arr) {
        if ("// todo " + name === el.split(";")[0].toLowerCase()) {
            todoName.push(el);
        }
    }
    return todoName;
}
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoRe = /\/\/\sTODO\s(.*)\n?/;
const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    return files.map(file => file.match(todoRe)[1])
}

function getImportantTodos() {
    return getTodos().filter((todo, i) => todo.includes('!'));
}

function getUserTodos(username) {
    const todos = getTodos();
    const userRe = /\/\/ TODO {}; {}; {}/
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const todos = getTodos();
            console.log(todos);
            break;
        case 'important':
            const importantTodos = getImportantTodos();
            console.log(importantTodos)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

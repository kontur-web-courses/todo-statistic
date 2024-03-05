const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEXP = /\/\/ TODO.*/gm;
const IMPORTANT_TODO_REGEXP = /\/\/ TODO.*/gm;

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(file) {
    return file.match(TODO_REGEXP);
}

function getImportantTodos(file) {
    const todos = getTodos(file);

    return todos.filter(e => e.includes('!'));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

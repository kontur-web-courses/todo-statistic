const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEXP = /\/\/ TODO.*/gm;
const IMPORTANT_TODO_REGEXP = /\/\/ TODO.*/gm;
const USER_TODO_REGEXP = /\/\/ TODO\s*(.+)\s*;\s*(\d{4}-\d{2}-\d{2})\s*;\s*(.*)/gm

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(file) {
    const todos = Array.from(file.matchAll(USER_TODO_REGEXP));

    return todos
        .map(group => {
            return {
                isImportant: group[3].includes('!'),
                username: group[1],
                date: group[2],
                text: group[3],
            }
        });
}

function getImportantTodos(file) {
    const todos = getTodos(file);
    return todos.filter(e => e.isImportant);
}

function getUserTodos(file, username) {
    const todos = getTodos(file);
    return todos
        .filter(obj => obj.username === username);
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTodos(files.at(0)));
            break;
        case 'important':
            console.log(getImportantTodos(files.at(0)));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

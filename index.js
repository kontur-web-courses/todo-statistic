const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEXP = /\/\/ TODO\s*(.+)/gm;
const USER_TODO_REGEXP = /(.+)\s*;\s*(\d{4}-\d{2}-\d{2})\s*;\s*(.*)/gm

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(file) {
    const allTodos = Array.from(file.matchAll(TODO_REGEXP))
        .map(group => group[1]);

    const todosWithoutUser = allTodos
        .filter(todo => !USER_TODO_REGEXP.test(todo));

    const todosWithUser = allTodos
        .filter(todo => USER_TODO_REGEXP.test(todo))
        .map(todo => Array.from(todo.matchAll(USER_TODO_REGEXP))[0]);

    return todosWithoutUser
            .map(todo => {return {
                isImportant: todo.includes('!'),
                user: null,
                date: null,
                comment: todo,
            }}).concat(
        todosWithUser
            .map(group => {
                return {
                    isImportant: group[3].includes('!'),
                    user: group[1],
                    date: group[2],
                    comment: group[3],
                }
            }));
}

function getImportantTodos(file) {
    const todos = getTodos(file);
    return todos.filter(e => e.isImportant);
}

function getUserTodos(file, user) {
    const todos = getTodos(file);
    return todos
        .filter(obj => obj.user === user);
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(files.map(getTodos));
            break;
        case 'important':
            console.log(files.map(getImportantTodos));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

// TODO Переделать это!
function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    if (command.startsWith('user')) {
        const user = command.split(' ')[1];
        showUserTodos(user);
    } else if (command.startsWith('sort')) {
        const param = command.split(' ')[1];
        sortTodos(param);
    } else if (command === 'exit') {
        process.exit(0);
    } else if (command === 'show') {
        show();
    }
}

function sortTodos(param) {
    if (param === 'importance') {
        printTodos(getToDo().sort(function(a, b){
            return a.includes('!') ? -1 : 1;
        }))
    } else if (param === 'user') {

    } else if (param === 'date') {

    }
}
function formatTodo(todo){
    const important = todo.includes('!');
    const parts = [];

    return parts.join('  |  ');

}
function showUserTodos(user) {
    const todos = getToDo().filter(function (todo) {
        const parts = todo.split(';');
        if (parts.length !== 3) {
            return false;
        }

        const todoUser = parts[0].split(' ')[2];

        return user.toLowerCase() === todoUser.toLowerCase();
    });
    printTodos(todos);
}

function important() {
    const todos = getToDo().filter(function (n) {
        return n.contains('!');
    });

    printTodos(todos);
}

function show() {
    const todos = getToDo();
    printTodos(todos);
}

function printTodos(todos) {
    for (let todo of todos) {

        console.log(todo);
    }
}

function findAllOccurrences(text) {
    const pattern = /\/\/\s*TODO\s.*/g;
    const regex = new RegExp(pattern, 'g');
    let matches = text.match(regex);
    return matches;
}

// TODO you can do it!
function getToDo() {

    let comentsFiles = [];
    for (const fileText of getFiles()) {
        let col = findAllOccurrences(fileText);
        for (let i = 0; i < col.length; i++) { // выведет 0, затем 1, затем 2
            comentsFiles.push(col[i]);
        }
    }
    return comentsFiles;
}
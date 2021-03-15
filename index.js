const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todos = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    getToDos();
    let parts = command.split(' ');
    switch (parts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todo of todos) {
                formatTodo(todo);
            }
            break;
        case 'important':
            for (let todo of todos.filter(t => t.importance > 0)){
                formatTodo(todo);
            }
            break;
        case 'user':
            let user = parts[1].toLowerCase();
            for (let todo of todos.filter(t => t.user === user)){
                formatTodo(todo);
            }
            break;
        case 'sort':
            todos.sort((a, b) => compareFunc(a[parts[1]], b[parts[1]]));
            for (let todo of todos) {
                formatTodo(todo);
            }
            break;
        case 'date':
            let date = Date.parse(parts[1]);
            for (let todo of todos.filter(t => t.date > date)){
                formatTodo(todo);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getToDos(){
    for (let file of files){
        for (let str of file.split(`\n`)){
            let com = str.match(/\/\/ TODO (.+)/);
            if (com) {
                todos.push(getMetaData(com[0]));
            }
        }
    }
}

function getMetaData(todo) {
    let peaces = todo.split(';');

    return {
        original: todo,
        importance: (todo.match(/!/g) || []).length,
        user: peaces.length < 3 ? undefined : peaces[0].replace(/\/\/ TODO /, '').toLowerCase(),
        date: peaces.length < 3 ? undefined : new Date(peaces[1].replace(' ', '')),
        text: peaces[2] || peaces[0].replace(/\/\/ TODO /, ''),
    };
}

function compareFunc(a, b) {
    if (typeof a === "string") {
        return a.localeCompare(b);
    }
    return b - a;
}

function truncateString (str, len) {
    if (str === undefined)
    {
        return '';
    }
    if (str.length <= len) {
        return str;
    }
    return str.substr(0, len - 1) + '…';
}

function formatDate (date) {
    if (date === undefined)
    {
        return '';
    }
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}-${month}-${date.getFullYear()}`;
}

function formatTodo(todo) {
    let parts = [];
    parts[0] = todo.importance > 0 ? '!' : ' ';
    parts[1] = truncateString(todo.user, 10).padEnd(10);
    parts[2] = truncateString(formatDate(todo.date), 10).padEnd(10);
    parts[3] = truncateString(todo.text, 50).padEnd(50);
    console.log(parts.join('  |  '))
}

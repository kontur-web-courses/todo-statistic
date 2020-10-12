const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function logElements(arr) {
    for (const e of arr)
        console.log(e);
}


// user; date; importance
function parseBy(todo, field = "user") {
    let splittedTodo = todo.split(';');
    if (splittedTodo.length === 3 || field === 'importance') {
        switch (field) {
            case 'user':
                return splittedTodo[0].replace(/\/\/\W*todo\W+/gi, "").toLowerCase();
            case 'date':
                return new Date(splittedTodo[1].trim());
            case 'importance':
                return countItem(todo, '!')
        }
    }
    return undefined;
}

function sortBy(a, b, field = 'user') {
    let a_c = parseBy(a, field);
    let b_c = parseBy(b, field)
    let type = field === 'user' ? 'string' : field === 'date' ? 'object' : 'number';

    if (typeof a_c === 'undefined' && typeof b_c !== 'undefined') return 1;
    if (typeof a_c !== 'undefined' && typeof b_c === 'undefined') return -1;
    if (typeof a_c === 'undefined' && typeof b_c === 'undefined') return 0;

    if (type === 'string') return a_c.localeCompare(b_c);

    return b_c - a_c
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0)
            break;
        case 'show':
            logElements(getTodos());
            break;
        case 'important':
            logElements(getTodos(filterFunc = x => countItem(x, '!')));
            break;
        default:
            if (/^(user )/.test(command)) {
                let username = command.substring(5).toLowerCase();
                logElements(getTodos(filterFunc = x => parseBy(x) === username));
            } else if (/^(sort )/.test(command)) {
                let type = command.substring(5);
                let todos = getTodos()
                logElements(todos.sort((a, b) => sortBy(a, b, type)));
            } else
                console.log('wrong command');
            break;
    }
}

function getTodos(filterFunc = x => x, sortFunc = (a, b) => countItem(b, '!') - countItem(a, '!')) {
    return files
        .map(file => file.match(/\/\/.*todo.*/gi))
        .flat(Infinity)
        .filter(filterFunc)
        .sort(sortFunc);
}

function countItem(string, item) {
    return string.split('').reduce((p, i) => i === item ? p + 1 : p, 0);
}

// TODO you can do it!
// todo burn in Hell !

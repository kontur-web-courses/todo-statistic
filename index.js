const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoRe = /\/\/\sTODO\s(.*)/gm;
const todoParts = /\/\/\sTODO\s(.*);\s(\d{4}-\d{2}-\d{2});\s(.*)\n?/;
const todoWithoutParts = /\/\/\sTODO\s(.*)\n?/;
const usernameRe = new RegExp('user (.*)')
const dateRe = /\b\d{4}(?:-\d{2}(?:-\d{2})?)?\b/g;

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function count(str, char) {
    let ans = 0;
    for (let c of str) {
        ans += (c === char ? 1 : 0);
    }

    return ans;
}

function compareNulls(str1, str2) {
    if ((str1 == null && str2 == null) || (str1 != null && str2 != null))
        return 0;

    if (str1 == null)
        return 1;

    return -1;
}

function getTodos() {
    return files
        .map(file => file
            .match(todoRe)
            .map(match => toObject(match)))
        .reduce((prev, cur, i) => prev.concat(cur));
}

function toObject(match) {
    const parts = match.match(todoParts);
    return {
        name: parts != null ? parts[1] : null,
        date: parts != null ? new Date(parts[2]) : null,
        text: parts != null ? parts[3] : match.match(todoWithoutParts)[1],
        importance: count(
            parts != null ? parts[3] : match.match(todoWithoutParts)[1],
            '!'
        )
    };
}

function getImportantTodos() {
    return getTodos().filter((todo, i) => todo.text.includes('!'));
}

function getUserTodos(command) {
    const username = command.match(usernameRe)[1];
    return getTodos().filter(item => item.name === username);
}

function getDateTodos(command) {
    const date = new Date(command.match(dateRe)[0]);
    return getTodos().filter(item => item.date >= date);
}

function sort(argument) {
    const todos = getTodos();
    switch (argument) {
        case 'importance':
            return todos.sort((todo1, todo2) => todo2.importance - todo1.importance);
        case 'user':
            return todos.sort((todo1, todo2) => compareNulls(todo1.name, todo2.name));
        case 'date':
            return todos.sort((todo1, todo2) => (todo2.date - todo1.date));
        default:
            throw Error(`Unknown sort argument: ${argument}`);
    }
}

function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            const todos = getTodos();
            console.log(todos);
            break;
        case command === 'important':
            const importantTodos = getImportantTodos();
            console.log(importantTodos)
            break;
        case command.includes('sort'):
            const argument = command.slice(5);
            console.log(sort(argument))
            break;
        case command.includes('user'):
            const userTodos = getUserTodos(command);
            console.log(userTodos)
            break;
        case command.includes('date'):
            const dateTodos = getDateTodos(command);
            console.log(dateTodos)
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

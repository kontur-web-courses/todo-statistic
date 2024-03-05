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

function getTodos() {
    return files
        .map(file => file
            .match(todoRe)
            .map(match => toObject(match)))
        .reduce((prev, cur, i) => prev.concat(cur));
}

function toObject(match) {
    const parts = match.match(todoParts);
    if (parts !== null) {
        return {name: parts[1], date: new Date(parts[2]), text: parts[3]};
    }

    return {text: match.match(todoWithoutParts)[1]};
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
        case command.includes('user'):
            const userTodos = getUserTodos(command);
            console.log(userTodos)
            break;
        case command.includes('sort'):
            const argument = command.slice(5);
            break;
        case command.includes('date'):
            const dateTodos = getDateTodos(command);
            console.log(dateTodos)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

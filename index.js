const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoRe = /\/\/\sTODO\s(.*)/gm;
const todoRe2 = /\/\/\sTODO\s(.*)/;
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
            .map(match => match.match(todoRe2)[1]))
        .reduce((prev, cur, i) => prev.concat(cur));
}

function getImportantTodos() {
    return getTodos().filter((todo, i) => todo.includes('!'));
}

function getUserTodos(username) {
    const userRe = new RegExp(`// TODO \{${username}\}; \{(.*?)\}; \{(.*?)\}\\n`)
    return files.map(file => file.match(todoRe)[2])
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
        case command.includes('user'):
            usernameRe = new RegExp('user \{(.*?)\}')
            username = command.match(usernameRe)[1]
            const userTodos = getUserTodos(username);
            console.log(userTodos)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

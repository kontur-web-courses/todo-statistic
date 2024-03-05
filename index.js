const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const commandParts = command.split(' ');
    switch (commandParts[0]) {
        case 'important':
            const importantTodos = getImportantTodos();
            importantTodos.forEach(todo => console.log(todo));
            break;
        case 'user':
            if (commandParts.length === 2) {
                const userTodos = getTodosByUser(commandParts[1]);
                userTodos.forEach(todo => console.log(todo));
            }
            break;
        case 'show':
            console.log(getTODOComments());
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

const regex = /\/\/\s*TODO\s.*/g;
function getTODOComments() {
    let result = [];
    let matches;
    for (let file of files) {
        matches = file.match(regex);
        if (matches)
            result = result.concat(matches.map(line => line.slice(8)));
    }
    return result;
}

function getImportantTodos() {
    const todos = getTODOComments();
    return todos.filter(todo => todo.includes('!'));
}

function getTodosByUser(username) {
    const todos = getTODOComments();
    return todos.filter(todo => {
        const todoParts = todo.split(';').map(part => part.trim());
        return todoParts[0].toLowerCase().includes(username.toLowerCase());
    });
}
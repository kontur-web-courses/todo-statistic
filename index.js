const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

let todos = [];
let users = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processTodos(files) {
    const todoRegex = /\/\/ TODO (.*)/g;
    todos = files.reduce((acc, file) => {
        let match;
        while ((match = todoRegex.exec(file)) !== null) {
            acc.push(match[1]);
            users.push(match[1].split(';')[0].toLowerCase());
        }
        return acc;
    }, []);
}

function processCommand(command) {
    const commandParts = command.split(' ');
    switch (commandParts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            processTodos(getFiles());
            for (let i = 0; i < todos.length; i++) {
                console.log(todos[i])
            }
            break;
        case 'important':
            processTodos(getFiles());
            const importantTodos = todos.filter(todo => todo.includes('!'));
            for (let i = 0; i < importantTodos.length; i++) {
                console.log(importantTodos[i])
            }
            break;
        case 'user':
            processTodos(getFiles());
            for (let i = 0; i < users.length; i++) {
                if (commandParts[1].toLowerCase() === users[i]) {
                    console.log(todos[i])
                }
            }
            break;
        case 'sort':
            processTodos(getFiles());
            if (commandParts[1] === 'importance') {
                todos.sort((a, b) => {
                    const aImportance = a.match(/!/g) || [];
                    const bImportance = b.match(/!/g) || [];
                    return bImportance.length - aImportance.length;
                });
                console.log(todos);
            } else if (commandParts[1] === 'user') {
                const sortedTodos = todos.sort((a, b) => {
                    const aUser = a.split(';')[0].toLowerCase();
                    const bUser = b.split(';')[0].toLowerCase();
                    if (aUser === '') return 1;
                    if (bUser === '') return -1;
                    return aUser.localeCompare(bUser);
                });
                console.log(sortedTodos);
            } else if (commandParts[1] === 'date') {
                todos.sort((a, b) => {
                    const aDate = a.split(';')[1];
                    const bDate = b.split(';')[1];
                    if (!aDate) return 1;
                    if (!bDate) return -1;
                    return new Date(bDate) - new Date(aDate);
                });
                console.log(todos);
            } else {
                console.log('wrong sort argument');
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}
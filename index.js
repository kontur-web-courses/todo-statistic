const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    console.log(filePaths);
    return filePaths.map(path => readFile(path));
}

function getAllTodos(fileData) {
    const todos = [];
    const todoRegExp = /\/\/\sTODO\s(.*)/g;
    fileData.split('\n').forEach((line, index) => {
        const match = todoRegExp.exec(line);
        if (match) {
            todos.push(match[1]);
        }
    });
    return todos;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            files.forEach(file => {
                const todos = getAllTodos(file);
                todos.forEach(todo => console.log(todo));
            });
            break;
        case 'important':
            files.forEach(file => {
                const todos = getAllTodos(file);
                todos.forEach(todo => {
                    if (todo.includes('!')) {
                        console.log(todo);
                    }
                });
            });
            break;
        case command.split()[0] === 'user':
            files.forEach(file => {
                const todos = getAllTodos(file);
                todos.forEach(todo => {
                    if (todo.includes(command.split()[1])) {
                        console.log(todo);
                    }
                });
            });
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
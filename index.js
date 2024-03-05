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
    let splitCommand = command.split(' ');
    switch (splitCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            todos.forEach(t => console.log(t));
            break;
        case 'important':
            todos.filter(t => ~t.indexOf('!'))
                .forEach(t => console.log(t));
            break;
        case 'user':
            let user = splitCommand[1]
            console.log(getAllTodos()
                    .map(t => t.match(TODO_REGEX))
                    .filter(t => t !== null && t[1].toLowerCase() === user.toLowerCase())
                    .map(t => t[0]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showAllTODOs() {
    for (let file of files) {
        for (let line of file.split('\n')) {
            let todoIndex = line.indexOf("// TODO ");
            if (todoIndex === -1) continue;
            if (todoIndex === -1)
                continue;
            let todo = line.slice(todoIndex)
            console.log(todo);
        }
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO_REGEX = new RegExp("\\/\\/ TODO ([\\w\\-]+);\\s*([\\w\\-]+);\\s*(.*)$");

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
            console.log(getAllTodos());
            break;
        case 'important':
            console.log(getAllTodos().filter(t => t.includes('!')))
            break;
        case 'user':
            let user = splitCommand[1]
            console.log(getAllTodos()
                    .filter(t => t !== null && t[1].toLowerCase() === user.toLowerCase())
                    .map(t => t[0]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodos() {
    let result = [];
    for (let file of files) {
        for (let line of file.split('\n')) {
            let todoIndex = line.indexOf("// TODO ");
            if (todoIndex === -1) continue;
            if (todoIndex === -1)
                continue;
            let todo = line.slice(todoIndex)
            console.log(todo);
            result.push(todo);
        }
    }
    return result;
}

// TODO you can do it!

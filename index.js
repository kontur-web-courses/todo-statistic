const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getAllTODOS();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
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
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTODOS() {
    let res = [];
    for (let file of files) {
        for (let line of file.split('\n')) {
            let todoIndex = line.indexOf("// TODO ");
            if (todoIndex === -1) continue;
            let todo = line.slice(todoIndex)
            res.push(todo);
        }
    }
    return res;
}

// TODO you can do it!

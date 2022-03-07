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
    switch (command) {
        case 'show':
            getToDoLines().map(item => console.log(item));
            break;
        case 'important':
            getToDoLines()
                .filter(item => item.includes('!'))
                .map(item => console.log(item));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getToDoLines() {
    let todos = [];
    for (let file of getFiles()) {
        let lines = file.split('\r\n');
        for (let line of lines) {
            let match = /\/\/ TODO/.exec(line);
            if (match != null)
                todos.push(line.slice(match.index));
        }
    }
    return todos;
}

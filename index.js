const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles().map(f => f.split('\r\n'));

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
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOs(files){
    let todos = [];
    let re = /(\/\/ TODO .+?$)/;
    for (let file of files) {
        for (let line of file){
            let match = line.match(re);
            if (match !== null)
                todos.push(match[0])
        }
    }
    return todos
}
// TODO you can do it!

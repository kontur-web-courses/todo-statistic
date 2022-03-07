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
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showAllTODOs();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function showAllTODOs() {
    // console.log(files);
    for (let file of files) {
        for (let line of file.split('\n')) {
            let todoIndex = line.indexOf("// TODO ");
            if (todoIndex === -1) continue;
            let todo = line.slice(todoIndex)
            console.log(todo);
        }
    }
}
// TODO you can do it!

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
            console.log(getTODOcomments());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

const regex = /\/\/\s*TODO\s.*/g;
function getTODOcomments() {
    let result = [];
    for (let file of files) {
        result = result.concat(file.match(regex).map(line => line.slice(8)));
    }
    return result;
}

// TODO you can do it!

console.log(getTODOcomments())
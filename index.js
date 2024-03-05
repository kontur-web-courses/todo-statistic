const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function searchAllFiles(files){
    let result = [];
    for (let file of files){
        result.push(...findAllTodos(file));
    }
    return result;
}

function findAllTodos(file){
    let result = [];
    let lines = file.split('\n');
    for(let line of lines){
        let index = line.indexOf('// TODO ');
        if (index !== -1){
            result.push(line.slice(index));
            console.log(line.slice(index));
        }
    }
    return result;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(searchAllFiles(getFiles()));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

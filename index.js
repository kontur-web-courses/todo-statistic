const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const todoRe = "//\\sTODO\\s(.*)\n";
console.log(todoRe)

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    for (let file of files) {
        let kek = file.match(todoRe);
        for (let el of kek) {
            console.log(el);
        }
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let todos = getTodos();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

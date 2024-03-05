const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);
// TODO Переделать это!
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
            let coments = getToDo();
            console.log(coments);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function findAllOccurrences(text) {
    const pattern = /\/\/\s*TODO\s.*/g;
    const regex = new RegExp(pattern, 'g');
    let matches = text.match(regex)
    return matches;
}

// TODO you can do it!
function getToDo(){

    let comentsFiles = [];
    for (const fileText of getFiles()) {
        let col = findAllOccurrences(fileText)
        for (let i = 0; i < col.length; i++) { // выведет 0, затем 1, затем 2
            comentsFiles.push(col[i]);
        }
    }
    return comentsFiles;
}
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(files) {
    let res = [];
    for (let text of files) {
        for (let line of text.split('\n')){
            if (line.startsWith("\/\/ TODO ")){
                res.push(line.substring(8));
            }
        }
    }
    return res;
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

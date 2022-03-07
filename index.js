const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
let all_todo_re = new RegExp("\/\/ TODO [^\\n\\r]+", "gi");

function getTodo(path='./', regexp = all_todo_re){
    let todos = [];
    for (let str of getFiles(path)) {
        for (let strElement of str.split('\n')) {
            let todo = strElement.match(regexp) || [];
            for (let todoElement of todo) {
                todos.push(todoElement);
            }
        }
    }
    return todos;
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

// TODO you can do it!

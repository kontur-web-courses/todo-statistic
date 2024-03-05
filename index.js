const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let re = /\/\/ TODO .*/g;
let todos = [];
for(let file of files) {
    let c_todos = file.match(re);
    todos = todos.concat(c_todos);
}

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
            for (let i = 0; i < todos.length; i++) {
                console.log(todos[i]);
            }
            break;
        case 'important':
            let currentToDo;
            for (let i = 0; i < todos.length; i++) {
                currentToDo = todos[i];
                if (currentToDo.includes('!')) {
                    console.log(currentToDo);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

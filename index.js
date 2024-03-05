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
    switch (true) {
        case /exit$/g.test(command):
            process.exit(0);
            break;
        case /show$/g.test(command):
            for (let i = 0; i < todos.length; i++) {
                console.log(todos[i]);
            }
            break;
        case /important$/g.test(command):
            let currentToDo;
            for (let i = 0; i < todos.length; i++) {
                currentToDo = todos[i];
                if (currentToDo.includes('!')) {
                    console.log(currentToDo);
                }
            }
            break;
        case /user .*$/g.test(command):
            let userName = command.split(' ')[1].toLowerCase();
            let pattern = new RegExp(`\/\/ TODO .*${userName};`, 'g');
            for (let todo of todos) {
                if (pattern.test(todo)) {
                    console.log(todo);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let re = /\/\/ TODO .*/g;
let todos = [];
for (let file of files) {
    let c_todos = file.match(re);
    todos = todos.concat(c_todos);
}

console.log(sortByUsers(todos));

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
        case /sort .*/g.test(command):
            let argument = command.split(" ")[1];
        default:
            console.log('wrong command');
            break;
    }
}

function sortByUsers(todosList) {
    const extractNameRegex = /\/\/ TODO (?<name>\w*);/;
    const todoByName = [];
    for (let todo of todosList) {
        let match = todo.match(extractNameRegex);
        if (match === null) {
            todoByName.push([null, todo]);
            continue;
        }
        todoByName.push([match.groups.name.toLowerCase(), todo]);
    }
    todoByName.sort(function(a, b) { 
        if (a === null || a[0] < b[0]) {
            return -1;
        }
        if (b === null || a[0] > b[0]) {
            return 1;
        }
        return 0;
    });
    return todoByName.map(a => a[1])
}

// TODO you can do it!
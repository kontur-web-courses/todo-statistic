const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const todos = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function makeTODO() {
    for (let file of files) {
        file = file.split("\n");
        for (const line of file) {
            let idx = line.indexOf("// TODO ");
            if (idx > -1) {
                let todo = line.substring(idx);
                todos.push(todo);
            }
        }
    }
}

function showTODO() {
    if (todos.length === 0) {
        makeTODO();
    }
    for (const todo of todos) {
        console.log(todo);
    }
}

function importantTODO() {
    if (todos.length === 0) {
        makeTODO();
    }
    for (const todo of todos) {
        if (todo.indexOf("!") > -1){
            console.log(todo);
        }
    }
}

function userTODO(username){
    if (todos.length === 0) {
        makeTODO();
    }
    for (const todo of todos) {
        const splitStr = todo.split(";");
        if (splitStr.length == 3 & splitStr[0].indexOf(" " + username + ";") > -1){
            console.log(todo);
        }
        
    }
}

function processCommand(command) {
    switch (command.split(" ")[0]) {
        case 'user':
            userTODO(command.split(" ")[1]);
            break;
        case 'show':
            showTODO();
            break;
        case 'important':
            importantTODO();
            breal;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}


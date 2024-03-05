const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTODOS();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getTODOS(){
    const regexp = new RegExp(" // TODO .*()")

    const todoComments = files.filter(line => regexp.test(line));
    return todoComments
}

function showToDos() {
    for (let file of files) {
        for (let str of file.split(`\n`)) {
            let todos = str.match("// TODO (.+)");
            if (todos) {
                console.log(todos[0]);
            }
        }
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todo of todos) {
                console.log(todo);
            }
            showToDos();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todos = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    getToDos();
    let parts = command.split(' ');
    switch (parts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todo of todos) {
                console.log(todo.original);
            }
            break;
        case 'important':
            for (let todo of todos.filter(t => t.importance > 0)){
                console.log(todo.original);
            }
            break;
        case 'user':
            let user = parts[1].toLowerCase();
            for (let todo of todos.filter(t => t.user === user)){
                console.log(todo.original);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getToDos(){
    for (let file of files){
        for (let str of file.split(`\n`)){
            let com = str.match("// TODO (.+)");
            if (com) {
                todos.push(getMetaData(com[0]));
            }
        }
    }
}

function getMetaData(todo) {
    let peaces = todo.split(';');
    return {
        original: todo,
        importance: (todo.match(/!/g) || []).length,
        user: peaces[0] && peaces[0].replace('// TODO ', '').toLowerCase(),
        date: peaces[1] && Date.parse(peaces[1].replace(' ', '')),
        text: peaces[2],
    };
}

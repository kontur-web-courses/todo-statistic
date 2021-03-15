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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getToDos()
            for (let s of todos){
                console.log(s)
            }
            break;
        case 'important':
            getToDos()
            for (let s of todos){
                if ((s.match(/!/g) || []).length > 0)
                    console.log(s)
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
                todos.push(com[0]);
            }
        }
    }
}

function getMetaData(todo) {
    let importance = (todo.match(/!/g) || []).length;
    let peaces = todo.split(';');
    return {
        user: peaces[0].replace('// TODO ', ''),
        date: Date.parse(peaces[1].replace(' ', '')),
        text: peaces[2],
    };
}

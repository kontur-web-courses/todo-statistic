const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getToDos();

while (true) {
    console.log('Please, write your command!');
    readLine(processCommand);
}

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
            for (let todo of todos) {
                console.log(todo);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getToDos(){
    let result = [];
    for (let file of files){
        for (let str of file.split(`\n`)){
            let com = str.match("// TODO (.+)");
            if (com) {
                result.push(com[0])
            }
        }
    }
    return result;
}


const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs(text){
    const reg = RegExp(/\/\/ TODO .*$/, "gm")
    return text.match(reg)
}

function* iterTodos() {
    for (let fileContent of getFiles()){
        for (const v of getTODOs(fileContent)) {
            yield v;
        }
    }
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todo of iterTodos()) {
                console.log(todo);
            }
            break;
        case 'important':
            for (let todo of iterTodos()) {
                if (todo.includes('!')) {
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

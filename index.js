const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let currentData = command.split(' ')[0];
    switch (currentData) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            logToDo();
            break;
        case 'important':
            logToDo();
            break;
        case 'user':
            const requestedUser = command.split(' ')[1];
            let todos = getTodos(getFiles())
                .filter(function(x) { return hasUserName(x, requestedUser); });
            for(const todo of todos) {
                console.log(todo);
            }
            break;
        case 'sort':
            let dataSort = command.split(' ');
            let currentSortParam = dataSort[1];
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function hasUserName(todoStr, requestedName) {
    const name = todoStr.split(';')[0].slice(8);
    return name.toLowerCase() === requestedName.toLowerCase();
}

function logToDo(){
    const allToDo = getTodos(getFiles());
    for (const currentTodDo of allToDo){
        console.log(currentTodDo);
    }
}

function getTodos(files) {
    let res = [];
    for(const file of files) {
        for(const line of file.split(/\r?\n|\r|\n/g)) {
            if(line.startsWith('// TODO')) {
                res.push(line);
            }
        }
    }
    return res;
}

// TODO you can do it!

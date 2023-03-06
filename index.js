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
            logToDoWithImportant();
            break;
        case 'user':
            let dataUser = command.split(' ');
            let currentUser = dataUser[1];
            LogToDo();
            break;
        case 'sort':
            let dataSort = command.split(' ');
            let currentSortParam = dataSort[1];
            switch (currentSortParam){
                
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function logToDo(){
    const allToDo = getTodos(getFiles());
    for (const currentTodDo of allToDo){
        console.log(currentTodDo);
    }
}

function logToDoWithImportant(){
    const allToDo = getTodos(getFiles());
    for (let currentTodDo of allToDo){
        if (currentTodDo.indexOf('!') !== -1) {
            console.log(currentTodDo);
        }
    }
}



function getTodos(files) {
    let res = [];
    for(const file of files) {
        for(const line of file.split(/\r?\n|\r|\n/g)) {
            if(line.trim().startsWith('// TODO')) {
                res.push(line);
            }
        }
    }
    return res;
}

// TODO you can do it!

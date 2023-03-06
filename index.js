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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            LogToDo();
            break;
        case 'important':
            LogToDo();
            break;
        case 'user' in command:
            let data = command.split(' ');
            let currentUser = data[1];
            LogToDo();
            break;
        case 'sort' in command:
            LogToDo();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function LogToDo(){
    const allToDo = getTodods(getFiles())
    for (currentTodDo of allToDo){
        console.log(currentTodDo)
    }
}



// TODO you can do it!

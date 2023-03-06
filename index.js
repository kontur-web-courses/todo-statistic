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

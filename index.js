const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getToDo(){
    const pattern = new RegExp(/(\/\/ TODO .*)/)
    let files = getFiles();
    let result = [];
    for(let file of files){
        result.push(file.match(pattern));
    }
    console.log(result);

}

function processCommand(command) {
    switch (command) {
        case 'exit':
            getToDo();
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

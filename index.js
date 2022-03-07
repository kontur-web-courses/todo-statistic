const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


const comments = getComments();

function getComments(){
    //for (let i = 0; i < files.length; i++) {
    let myRe = /\/\/TODO*\n/;
    let myArray = myRe.exec(files[0]);
    return myArray;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}



// TODO you can do it!

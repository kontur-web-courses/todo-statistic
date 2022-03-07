const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = getComments();
const todo = comments.map((str) => new TODO(str));

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

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



class TODO{

    constructor(inp){
        this.text = inp;
        this.important = inp.match(/[!]/g).length;
        this.date;
        this.name;
    }
}
// TODO you can do it!

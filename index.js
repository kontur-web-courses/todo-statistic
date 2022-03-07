const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');


const DEBUG = true

const files = getFiles();
const comments = getComments();
console.log(comments)
const todo = comments.map((str) => new TODO(str));

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments(){
    let comments = [];
    files.forEach((file) => {
        comments = [...comments, ...file.match(/\/\/ TODO.*$/gim)];
    })
    if (DEBUG) {
        console.log(files[0]);
        console.log(comments);
    }
    return comments;
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
        this.date = NaN;
        this.name = NaN;
        let data = inp.split(';');
        if(data.length === 3){
            this.name = data[0];
            this.date = new date(data[1]);
        }
    }
}
// TODO you can do it!

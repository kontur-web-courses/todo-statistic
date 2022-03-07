const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

class TODO{

    constructor(inp){
        this.text = inp;
        this.important = (inp.match(/[!]/g) || []).length;
        this.date = NaN;
        this.name = NaN;
        let data = inp.split(';');
        if(data.length === 3){
            this.name = data[0].slice(8);
            this.date = new Date(data[1]);
        }
    }
}

const DEBUG = false

const files = getFiles();
const comments = getComments();
//console.log(comments)
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
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'user' + command.slice(command.indexOf(' ')):
            user(command.slice(command.indexOf(' ')).trim());
            break;
        case 'sort importance':
            sortImportance();
            break;
        default:
            console.log('wrong command');
            break;

    }
}

function show(){
    todo.forEach(element => console.log(element.text));
}

function important(){
    todo.filter(element => element.important > 0).forEach(element => console.log(element.text));
}

function  user(userName){
    for (let i = 0; i < todo.length; i++){

        if (userName.toLowerCase() === (todo[i].name || '').toLowerCase())
            console.log(todo[i].text);
    }
}

function sortImportance(){
    todo.sort((a, b) => b.important - a.important);
    show();
}

// TODO you can do it!

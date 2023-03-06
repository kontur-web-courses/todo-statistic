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
    let oper = command.split(" ")[0];
    let name = command.split(" ")[1];
    switch (oper) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(f(getFiles()));
            break;
        case 'important':
            console.log(exclamationPoint(f(getFiles())));
            break;
        case 'user':
            console.log(a(f(getFiles()), name))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function f(files) {
    let arr = []
    for (let str of files) {
        for (let s of str.split('\r\n')){
            if (s.indexOf("// TODO")!== -1) {
                 arr.push(s.slice(s.indexOf("// TODO")));
            }
        }
    }
    return arr.slice(0, arr.length-2);
}

function exclamationPoint(str){
    let arr = [];
    for (let s of str){
        if (s.includes("!")) arr.push(s);
    }
    return arr;
}

function a(str, name) {
    let arr = [];
    for (let s of str){
        s = s.toLowerCase();
        if (s.includes(';')){
            let b = s.split(";");
            if (s.includes(name.toLowerCase())){
                arr.push(b[2]);
            }
        }
    }
    return arr;
}
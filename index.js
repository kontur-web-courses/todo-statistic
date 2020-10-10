const {show} = require("./show")
const {important} = require("./important")
const {user} = require('./user');
const {sort} = require('./sort');
const {date} = require('./date');
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const path = require('path');

let file = [];
const files = getFiles();
const pathFiles = getPath()

console.log('Please, write your command!');
readLine(processCommand);

function getPath() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    let array = []
    for (let i = 0; i < files.length; i++) {
        array.push(path.basename(filePaths[i]))
    }
    return array
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    console.log(filePaths)
    console.log(file)
    return filePaths.map(path => readFile(path));

}

function processCommand(command) {
    if (command.split(' ')[0] === 'user') {
        user(files, command.split(' ')[1], pathFiles);
        return;
    }
    if (command.split(' ')[0] === 'sort') {
        sort(files, command.split(' ')[1], pathFiles);
        return;
    }
    if (command.split(' ')[0] === 'date') {
        date(files, command.split(' ')[1], pathFiles);
        return;
    }
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case "show":
            show(files, pathFiles)
            break;
        case "important":
            important(files, pathFiles)
            break;

        default:
            console.log('wrong command');
            break;


    }
}

``

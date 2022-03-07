const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const { type } = require('os');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    command = command.split(" ")
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(readToDos(files))
            break;
        case 'important':
            console.log(readToDos(files).filter(string => string.indexOf('!') !== -1));
            break;
        case 'user':
            users = readToDos(files).map(string => string.slice(8, string.indexOf(';')))
            // не доделал ;_)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function readToDos(files){
    todos = []
    for (let file of files){
        let strings = file.split('\n')
        for (let line of strings){
                let index = line.indexOf("\/\/ TODO ")
                todostring = line.slice(index)
                if (index !== -1) todos.push(todostring.substr(0,todostring.length - 1))
        }
    }
    return todos
}

// TODO you can do it!

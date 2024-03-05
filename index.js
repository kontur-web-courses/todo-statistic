const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const toDo = [];

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
        case 'show : показать все todo':
            func();
            for (let res of toDo)
                console.log(res);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function func() {
    for (let file of files) {
        let lines = file.split('\n');

        for (let line of lines) {
            if (line.trim().startsWith('// TODO')) {
                let todoSubstring = line.substring(line.indexOf('// TODO') + 8);
                toDo.push('// TODO ' + todoSubstring.trim())
            }
        }
    }
}


// TODO you can do it!
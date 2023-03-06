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
            console.log();
            let d = ToDoFind();
            if (d.length !== 0) {
                console.log(d.join('\n\n'));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function ToDoFind() {
    let list = [];
    for (let f of files) {
        for (let line of f.split('\n')) {
            let index = line.indexOf('// TODO ')
            if (index !== -1) {
                list = list.concat(line.substring(index));
            }
        }
    }

    return list;
}

// TODO you can do it!

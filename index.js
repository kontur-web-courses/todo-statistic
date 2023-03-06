const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODOs() {
    let TODOs = [];
    for (let file of files){
        for (let string of file.split('\n')) {
            if (string.includes('// TODO ')
                && !string.includes('\'// TODO ')
                && !string.includes('\`// TODO ')) {
                TODOs.push(string.substring(string.indexOf('// TODO')));
            }
        }
    }

    return TODOs;
}

function processCommand(command) {
    let cmd = command.split(' : ');
    let operation = cmd[0].split(' ')[0];
    let parameter = cmd[0].split(' ')[1];
    switch (operation) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let TODO of getAllTODOs()) {
                console.log(TODO);
            }
            break;
        case 'important':
            for (let TODO of getAllTODOs()) {
                if (TODO.includes('!')) {
                    console.log(TODO);
                }
            }
            break;
        case 'user':
            for (let TODO of getAllTODOs()) {
                if (TODO.includes(`// TODO ${parameter}`)) {
                    console.log(TODO);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

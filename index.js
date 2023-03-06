const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOs = getTODOs();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'show':
            console.log(TODOs)
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOs() {
    let res = [];
    const pattern = /\/\/ TODO .+/g
    for (let file of files) {
        let ans = file.match(pattern);
        if (ans === null)
            continue;
        res = res.concat(ans);
    }

    return res;
}

// TODO you can do it!

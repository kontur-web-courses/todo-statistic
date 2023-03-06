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
    let parameter = command.split(' ')[1];

    switch (command) {
        case 'show':
            console.log(TODOs)
            break;
        case 'important':
            console.log(getImportantTODOs())
            break;
        case `user ${parameter}`:
            let userTODOs = getUserTODOs(parameter)
            console.log(userTODOs)
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

function getImportantTODOs(){
    let res = [];
    for (let value of TODOs) {
        if (value.search('!') !== -1)
            res.push(value);
    }
    return res;
}

function getUserTODOs(parameter){
    let userTODOs = []

    for (let todo of TODOs) {
        let data = todo.split(';')
        // let username = data[0].split(' ')[2]

        if (username.toLowerCase() !== user) continue

        userTODOs.push(extract(data, 2))
    }

    return userTODOs
}

// TODO you can do it!

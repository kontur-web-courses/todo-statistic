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
    let spl = command.split(' ');
    let task = spl[0];
    let parameter = spl[1];

    switch (task) {
        case 'show':
            console.log(TODOs)
            break;
        case 'important':
            console.log(getImportantTODOs())
            break;
        case `user`:
            let userTODOs = getUserTODOs(parameter)
            console.log(userTODOs)
            break;
        case 'sort':
            if (parameter === 'importance') {
                console.log(getImportantTODOs());
            }
            break
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
    let importance = {};
    for (let value of TODOs) {
        let exclamatoryCount = value.split('!').length - 1;
        if (exclamatoryCount > 0) {
            if (!(exclamatoryCount in importance))
                importance[exclamatoryCount] = [];
            importance[exclamatoryCount].push(value);
        }
    }
    res = [];
    for (let importanceClass in importance) {
        let a = importance[importanceClass];
        res = res.concat(importance[importanceClass]);
    }
    return res.reverse();
}

function getUserTODOs(parameter){
    let userTODOs = []

    for (let todo of TODOs) {
        let data = todo.split(';')
        let username = data[0].split(' ')[2]

        if (username.toLowerCase() !== parameter) continue


    }

    return userTODOs
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOs = getTODOs();
let usernameTODOS = {};
fillUsernameTODOS();
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
            console.log(TODOs);
            break;
        case 'important':
            console.log(getImportantTODOs());
            break;
        case `user ${parameter}`:
            let userTODOs = getUserTODOs(parameter);
            console.log(userTODOs);
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
    return usernameTODOS[parameter];
}

function fillUsernameTODOS(){
    for (let todo of TODOs) {
        let data = todo.split(';');
        let username = data[0].split(' ')[2].toLowerCase();
        let comment = data[2]

        if (!(username in usernameTODOS))
            usernameTODOS[username] = []
        usernameTODOS[username].push(comment)
    }
}


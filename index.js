const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let TODOs = getTODOs();
let usernameTODOS = {};
let nonameTODOS = {};
let dateTODOS = getDateTODOs()
nonameTODOS['no name'] = []
fillUsernameTODOS();
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
            console.log(TODOs);
            break;
        case 'important':
            console.log(getImportantTODOs());
            break;
        case `user`:
            let userTODOs = getUserTODOs(parameter.toLowerCase());
            console.log(userTODOs);
            break;
        case 'date':
            console.log(getCommentsBeforeDate(new Date(parameter)))
            break;
        case 'sort':
            if (parameter === 'importance') {
                console.log(getImportantTODOs());
            }
            if (parameter === "date") {
                console.log(dateTODOS.map(x => x[2]));
            }
            if (parameter === 'user') {
                sortUser();
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

function getCommentsBeforeDate(date) {
    let res = []
    for (let todo of dateTODOS) {
        if (todo[3] <= date && todo[0] !== '') {
            res.push(todo[1]);
        }
    }
    return res;
}
// TODO toppop
function getDateTODOs() {
    let date = [];
    for (let todo of TODOs) {
        let data = todo.split(';');
        if (data.length > 1) {
            let commentDate = data[1].trim();
            let comment = data[2].trim();
            date.push([commentDate, comment, todo, new Date(commentDate)]);
        }
        else {
            date.push(['', todo.split('TODO')[1].trim(), todo, new Date(0)])
        }
    }
    date.sort((a, b) => b[3] - a[3])
    return date;
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
    return usernameTODOS[parameter];
}

function fillUsernameTODOS(){
    for (let todo of TODOs) {
        let data = todo.split(';');
        if (data.length === 3) {
            let username = data[0].split(' ')[2].toLowerCase();
            let comment = data[2]

            if (!(username === ''))
                nonameTODOS['no name'].push(comment)

            if (!(username in usernameTODOS))
                usernameTODOS[username] = []
            usernameTODOS[username].push(comment)
        }
    }
}

function sortUser(){
    for (let key in usernameTODOS) {
        console.log(`${key}:`)
        console.log(`${usernameTODOS[key]}\n`)
    }

    for (let key in nonameTODOS) {
        if (usernameTODOS[key] !== undefined){
            console.log(`${key}:`)
            console.log(`${usernameTODOS[key]}\n`)
        }
    }
}
// TODO kopter; 2016; добавить!

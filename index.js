const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let todos = getTODOs()
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getImportantTODOs() {
    let importantTODOs = []

    for (let todo of todos) {
        if (todo.includes('!')) {
            importantTODOs.push(todo)
        }
    }
    return importantTODOs
}

function getUserTODOs(user) {
    let userTODOs = []

    for (let todo of todos) {
        let data = todo.split(';')
        let username = data[0].split(' ')[2]
        if (username.toLowerCase() !== user) continue

        userTODOs.push(extract(data, 2))
    }

    return userTODOs
}

function extract(todo, part){
    let comment = todo[part];
    if (comment[0] === ' '){
        comment = comment.slice(1)
    }
    return comment
}

function getDateTODOs(dateToSearch){
    let dateTODOs = []

    let [year, month, day] = dateToSearch.split('-')

    for (let todo of todos) {
        let data = todo.split(';')

        if (data.length <= 1) continue

        let [yearTODO, monthTODO, dayTODO] = extract(data, 1).split('-')

        if (yearTODO === year &&
            (month === undefined || monthTODO === month) &&
            (day === undefined || dayTODO === day)){
            dateTODOs.push(extract(data, 2))
        }
    }

    return dateTODOs
}

function processCommand(command) {
    let parameter = command.split(' ')[1];

    switch (command) {
        case 'show':
            console.log(todos)
            break;
        case 'exit':
            process.exit(0);
            break;
        case `sort ${parameter}` :
            sortTODOs(parameter)
            break;
        case 'important':
            let importantTODOs = getImportantTODOs()
            console.log(importantTODOs)
            break;
        case `user ${parameter}`:
            let userTODOs = getUserTODOs(parameter.toLowerCase())
            console.log(userTODOs)
            break;
        case `date ${parameter}`:
            console.log(getDateTODOs(parameter))
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

function sortTODOs(type){
    function sortByImportance() {
        const pattern = /!+/
        let iCommentsMap = new Map();
        for (let todo of todos){
            let m = todo.match(pattern)
            if (m === null)
                continue
            iCommentsMap.set(todo, m.length);
        }
        let iComments = [...iCommentsMap].sort((a,b) => a-b);
        console.log(iComments);
    }

    function sortByUser() {
        for (let todo of todos){
            let data = todo.split(';')
            let username = data[0].split(' ')[2]
            let usertodos = getUserTODOs(todos, username)
            console.log(username)
            console.log(usertodos)

        }
    }
    function sortByDate () {
        let sortedList = todos.slice();
        sortedList.sort((a,b) => a-b);
        console.log(sortedList);
    }

    switch (type) {
        case 'importance':
            sortByImportance()
            break;
        case 'user':
            sortByUser()
            break

        case 'date':
            sortByDate()
            break


    }
}

// TODO you can do it!
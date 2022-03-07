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

function getImportantTODOs(todos) {
    let importantTODOs = []

    for (let todo of todos) {
        if (todo.includes('!')) {
            importantTODOs.push(todo)
        }
    }
    return importantTODOs
}

function getUserTODOs(todos, user) {
    let userTODOs = []

    for (let todo of todos) {
        let data = todo.split(';')
        let username = data[0].split(' ')[2]
        if (username.toLowerCase() !== user) continue

        let todoText = data[2];
        if (todoText[0] === ' '){
            todoText = todoText.slice(1)
        }

        userTODOs.push(todoText)
    }

    return userTODOs
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
            let importantTODOs = getImportantTODOs(todos)
            console.log(importantTODOs)
            break;
        case `user ${parameter}`:
            let userTODOs = getUserTODOs(todos, parameter.toLowerCase())
            console.log(userTODOs)
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
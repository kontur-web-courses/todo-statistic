const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    let result = []
    for (let i of getFiles())
        for (let j of i.split('\n')) {
            let match = j.match(/\/\/ TODO .*/)
            if (match)
                result.push(match[0])
        }
    return result
}

function getImportantTodos() {
    let result = []
    for (let i of getFiles())
        for (let j of i.split('\n')) {
            let match = j.match(/\/\/ TODO .*!.*/)
            if (match)
                result.push(match[0])
        }
    return result
}

function getUserTodos(username) {
    let result = []
    let regex = new RegExp('\/\/ TODO ' + username + '.*')
    for (let i of getFiles())
        for (let j of i.split('\n')) {
            let match = j.match(regex)
            if (match)
                result.push(match[0])
        }
    return result
}

function getSortedTodos(args){
    let todos = getTodos()
    function getSortedByImportance(){
        todos = todos.sort(function(a,b){
            if (a.match(/\/\/ TODO .*!.*/) && !b.match(/\/\/ TODO .*!.*/))
                return -1
            else if (b.match(/\/\/ TODO .*!.*/) && !a.match(/\/\/ TODO .*!.*/))
                return 1
            else return 0
        })
        return todos
    }
    function getSortedByUser(){
        let regex = new RegExp('\/\/ TODO ' + args[2] + '.*')
        todos = todos.sort(function(a,b){
            if(a.match(regex) && !b.match(regex))
                return -1
            else if(b.match(regex) && !a.match(regex))
                return 1
            else return 0
        })
        return todos
    }
    function getSortedByDate(){
        let regex = /^\/\/ TODO.*(0?[1-9]|1[012])[\/\-]\d{4}(0?[1-9]|[12][0-9]|3[01])[\/\-].*$/
        let dateRegex = /^(0?[1-9]|1[012])[\/\-]\d{4}(0?[1-9]|[12][0-9]|3[01])[\/\-]$/
        todos = todos.sort(function(a,b){
            if(a.match(regex) && !b.match(regex))
                return -1
            else if(b.match(regex) && !a.match(regex))
                return 1
            else {
                let adate = a.match(dateRegex)
                let bdate = b.match(dateRegex)
                // TODO david Допилить когда нибудь сравнение дат
            }
        })
        return todos
    }
    switch(args[1]){
        case 'importance':
            return getSortedByImportance()
        case 'user':
            return getSortedByUser()
        case 'date':
            return getSortedByDate()
    }
}

// TODO david bla bla bla

function processCommand(command) {
    let args = command.split(' ')
    switch (args[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTodos())
            break;
        case 'important':
            console.log(getImportantTodos(args[1]))
            break;
        case 'user':
            console.log(getUserTodos(args[1]))
            break;
        case 'sort':
            console.log(getSortedTodos(args))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

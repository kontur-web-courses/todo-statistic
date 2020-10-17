const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function processOutput(output) {
    let userColumn = []
    let dateColumn = []
    let commentColumn = []
    let result = []
    let maxUserLength = 0
    let maxCommentLength = 0

    userColumn.push('user')
    dateColumn.push('       date')
    commentColumn.push('comment')

    let nonParsable = []

    for (let el of output) {
        let parsed = el.split(';')
        if (parsed.length === 3) {
            userColumn.push(parsed[0].substr(7))
            dateColumn.push(parsed[1])
            commentColumn.push(parsed[2])
        } else
            nonParsable.push(el.substr(7))
    }

    for (let user of userColumn) {
        if (user.length > maxUserLength) {
            maxUserLength = user.length
        }
    }
    for (let comment of commentColumn) {
        if (comment.length > maxCommentLength) {
            maxCommentLength = comment.length
        }
    }
    for (let i = 0; i < userColumn.length; i++) {
        result.push(`${' '.repeat(2)}|${' '.repeat(2)}${userColumn[i]}${' '.repeat(maxUserLength - userColumn[i].length + 2)}|\
        ${' '.repeat(2)}|${' '.repeat(2)}${dateColumn[i]}\
        ${' '.repeat(2)}|${' '.repeat(2)}${commentColumn[i]}${' '.repeat(maxCommentLength - commentColumn[i].length + 2)}`)
    }
    for (let i of nonParsable)
        result.push(i)

    result.splice(1, 0, '-'.repeat(maxUserLength + maxCommentLength + 30))

    let stringResult = ''
    for (let res of result) {
        stringResult += res + '\n'
    }

    return stringResult
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    let result = []
    for (let i of files)
        for (let j of i.split('\n')) {
            let match = j.match(/\/\/ TODO .*/)
            if (match)
                result.push(match[0])
        }
    return result
}

function getImportantTodos() {
    let result = []
    for (let i of files)
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
    for (let i of files)
        for (let j of i.split('\n')) {
            let match = j.match(regex)
            if (match)
                result.push(match[0])
        }
    return result
}

function getSortedTodos(args) {
    let todos = getTodos()

    function getSortedByImportance() {
        todos = todos.sort(function (a, b) {
            if (a.match(/\/\/ TODO .*!.*/) && !b.match(/\/\/ TODO .*!.*/))
                return -1
            else if (b.match(/\/\/ TODO .*!.*/) && !a.match(/\/\/ TODO .*!.*/))
                return 1
            else return 0
        })
        return todos
    }

    function getSortedByUser() {
        let regex = new RegExp('\/\/ TODO ' + args[2] + '.*')
        todos = todos.sort(function (a, b) {
            if (a.match(regex) && !b.match(regex))
                return -1
            else if (b.match(regex) && !a.match(regex))
                return 1
            else return 0
        })
        return todos
    }

    function getSortedByDate() {
        let regex = /^\/\/ TODO.*(0?[1-9]|1[012])[\/\-]\d{4}(0?[1-9]|[12][0-9]|3[01])[\/\-].*$/
        let dateRegex = /^(0?[1-9]|1[012])[\/\-]\d{4}(0?[1-9]|[12][0-9]|3[01])[\/\-]$/
        todos = todos.sort(function (a, b) {
            if (a.match(regex) && !b.match(regex))
                return -1
            else if (b.match(regex) && !a.match(regex))
                return 1
            else {
                let adate = a.match(dateRegex)
                let bdate = b.match(dateRegex)
                // TODO david Допилить когда нибудь сравнение дат
            }
        })
        return todos
    }

    switch (args[1]) {
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
            console.log(processOutput(getTodos()))
            break;
        case 'important':
            console.log(processOutput(getImportantTodos(args[1])))
            break;
        case 'user':
            console.log(processOutput(getUserTodos(args[1])))
            break;
        case 'sort':
            console.log(processOutput(getSortedTodos(args)))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

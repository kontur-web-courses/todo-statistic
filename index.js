const { getAllFilePathsWithExtension, readFile } = require('./fileSystem')
const { readLine } = require('./console')

const files = getFiles()

console.log('Please, write your command!')
readLine(processCommand)

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js')
    return filePaths.map((path) => readFile(path))
}

function extractTODOs(filesData) {
    let result = []
    let regexp = /\/\/ TODO (.+)/gm
    filesData.forEach((fileContents) => {
        let parsedFileContents = fileContents.split('\n')
        parsedFileContents.forEach((fileString) => {
            let regexRes = regexp.exec(fileString)
            if (regexRes != null)
                result.push(regexRes[1])
        })
    })

    return result.flat(Infinity)
}

function getImportantOnly(todoList) {
    let res = []
    todoList.forEach((todoItem) => {
        if (todoItem.indexOf('!') != -1)
            res.push(todoItem)
    })

    return res
}

function getOnlyFormattedTODOs(todoList) {
    let result = []
    todoList.forEach((todoItem) => {
        let splittedTODO = todoItem.split(';')
        if (splittedTODO.length == 3) {
            result.push({
                username: splittedTODO[0].toUpperCase(),
                date: new Date(splittedTODO[1]),
                comment: todoItem,
            })
        }
    })
    return result
}

function printUserToDo(todoList, userName) {
    let result = []
    let regex = new RegExp(`${userName};.+;.+`, 'gm')
    todoList.forEach((todoItem) => {
        let regexResult = regex.exec(todoItem)
        if (regexResult != null)
            result.push(regexResult.input)
    })
    return result
}

function symbolAmount(str, symb) {
    return str.split(symb).length - 1
}

function processCommand(command) {
    let parsedCommand = command.split(' ')
    switch (parsedCommand[0]) {
        case 'show':
            console.log(extractTODOs(getFiles()).join('\n'))
            break

        case 'import':
            console.log(getImportantOnly(extractTODOs(getFiles())).join('\n'))

        case 'user':
            console.log(
                printUserToDo(extractTODOs(getFiles()), parsedCommand[1]).join('\n'),
            )
            break

        case 'sort':
            let todoList = extractTODOs(getFiles())
            let extractedUserList = getOnlyFormattedTODOs(todoList)

            switch (parsedCommand[1]) {
                case 'importance':
                    todoList.sort((a, b) => -symbolAmount(a, '!') + symbolAmount(b, '!'))
                    console.log(todoList.join('\n'))
                    break
                case 'user':
                    extractedUserList.sort((a, b) => a.username.localeCompare(b.username))
                    let usernameRes = []
                    extractedUserList.forEach((elem) => usernameRes.push(elem.comment))
                    console.log(usernameRes.join('\n'))
                    break
                case 'date':
                    extractedUserList.sort(function (x, y) {
                        if (x.date < y.date) {
                            return -1
                        }
                        if (x.date > y.date) {
                            return 1
                        }
                        return 0
                    })
                    let dateRes = []
                    extractedUserList.forEach((elem) => dateRes.push(elem.comment))
                    console.log(dateRes.join('\n'))
            }
            break

        case 'exit':
            process.exit(0)
            break

        default:
            console.log('wrong command')
            break
    }
}

// TODO you can't do it!

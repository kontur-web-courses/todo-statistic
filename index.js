const { getAllFilePathsWithExtension, readFile } = require("./fileSystem")
const { readLine } = require("./console")
const path = require("path")

const files = getFiles()

console.log("Please, write your command!")
readLine(processCommand)

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), "js")
    return filePaths.map((path) => readFile(path))
}

function processCommand(command) {
    let args = command.split(" ")
    switch (args[0]) {
        case "exit":
            process.exit(0)
            break
        case "show":
            printTodos(findAllTodosWithParams(files))
            break
        case "important":
            printTodos(findImportantTodos(files))
            break
        case "user":
            printTodos(findUserTodos(files, args[1]))
            break
        case "sort":
            if (args[1] === "importance" || args[1] === "user" || args[1] === "date") {
                printTodos(findAndSortTodosBy(files, args[1]))
                break
            }
        case "date":
            printTodos(todosAfter(files, args[1]))
            break
        default:
            printWrongCommand()
            break
    }
}

// TODO you can do it!

function todosAfter(files, date) {
    let dateParts = date.split("-")
    let dateEntity = new Date(dateParts[0], dateParts[1] - 1 || 0, dateParts[2] || 1)

    return findAllTodosWithParams(files).filter((todo) => new Date(todo.date) - dateEntity > 0)
}

function findImportantTodos(files) {
    return findAllTodosWithParams(files).filter((todo) => todo.importance > 0)
}

function findUserTodos(files, name) {
    return findAllTodosWithParams(files).filter((todo) => todo.user.toLowerCase() === name.toLowerCase())
}

function findAndSortTodosBy(files, sortBy) {
    let todos = findAllTodosWithParams(files)
    switch (sortBy) {
        case "importance":
            todos.sort((a, b) => b.importance - a.importance)
            return todos

        case "user":
            todos.sort((a, b) => {
                if (a.user.toLowerCase() < b.user.toLowerCase()) {
                    return 1
                }
                if (a.user.toLowerCase() > b.user.toLowerCase()) {
                    return -1
                }

                return 0
            })
            return todos

        case "date":
            todos.sort((a, b) => {
                if (a.date === "") return 1
                if (b.date === "") return -1
                return Date.parse(b.date) - Date.parse(a.date)
            })
            return todos
    }
}

function findAllTodosWithParams(files) {
    return findTodos(files).map((todo) => getTodoParams(todo))
}

function printTodos(todos) {
    let users = [...todos.map((el) => el.user), "user"]
    let dates = [...todos.map((el) => el.date), "date"]
    let texts = [...todos.map((el) => el.text), "comment"]
    let files = [...todos.map((el) => el.file, "file")]
    let colSizes = [1, getColSize(users, 10), getColSize(dates, 10), getColSize(texts, 50), getColSize(files, 20)]

    console.log(
        `  ${"!".padEnd(colSizes[0])}  |  ${printCol("user", colSizes[1])}  |  ${printCol(
            "date",
            colSizes[2]
        )}  |  ${printCol("comment", colSizes[3])}  |  ${printCol("file", colSizes[4])}`
    )

    let sumSpace = colSizes.reduce((sum, el) => (sum += el), 0) + 22
    console.log("-".repeat(sumSpace))

    for (const todo of todos) {
        console.log(
            `  ${todo.importance ? "!".padEnd(colSizes[0]) : "".padEnd(colSizes[0])}  |  ${printCol(
                todo.user,
                colSizes[1]
            )}  |  ${printCol(todo.date, colSizes[2])}  |  ${printCol(todo.text, colSizes[3])}  |  ${printCol(
                todo.file,
                colSizes[4]
            )}`
        )
    }
}

function printWrongCommand() {
    console.log("wrong command")
}

function getTodoParams(todo) {
    let regEx = /\/\/\s?TODO\s?:?/i
    todo.text = todo.text.replace(regEx, "")

    let params = todo.text.split(";").map((el) => el.trim())

    let user = ""
    let date = ""
    let text = ""
    let importance = 0

    if (params.length === 1) {
        text = params[0]
    } else if (params.length === 3) {
        user = params[0]
        date = params[1]
        text = params[2]
    }

    importance = text.split("!").length - 1

    return {
        user,
        date,
        text,
        importance,
        file: todo.file,
    }
}

function findTodos(files) {
    let regEx = /\/\/\s?TODO\s?:?.*/gi
    const fileContents = files.map((file) => file.split("\r\n"))
    const todos = []

    fileContents.forEach((fileContent, index) => {
        const filePaths = getAllFilePathsWithExtension(process.cwd(), "js")

        fileContent.forEach((line) => {
            if (line.match(regEx)) {
                let startTodo = line.indexOf("//")
                todos.push({ text: line.slice(startTodo), file: path.basename(filePaths[index]) })
            }
        })
    })

    return todos
}

function getColSize(cols, maxSize) {
    return cols.reduce((max, el) => {
        if (el.length > max) {
            max = el.length
        }
        if (max > maxSize) {
            max = maxSize
        }
        return max
    }, 0)
}

function printCol(text, maxSize) {
    return ellipsisText(text, maxSize).padEnd(maxSize)
}

function ellipsisText(text, size) {
    if (text.length > size) {
        return text.slice(0, size - 3) + "..."
    }

    return text
}

//todo handle lowcase
// ToDo:dmitriy;2020-10-03;handle colon!!
//TODO: dmitriy; 2020-10-03; handle space!

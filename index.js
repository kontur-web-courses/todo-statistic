const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
HEADER = "Список TODO"
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(line) {
    const [command, arg] = line.split(" ")
    let res;
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            res = findTodos(true)
            break;
        case 'important':
            res = findTodos(false, true)
            break;
        case 'user':
            checkArg(arg, `Команда user должна содержать аргумент {username}.\nВы ввели строку ${line}`)
            res = findTodos(false, false, arg)
            break;
        case 'sort':
            checkArg(arg, `Команда sort должна содержать один из аргументов importance, user, date\nВы ввели строку ${line}`)
            res = sortTodosBy(arg === 'user', arg === 'date', arg === 'important')
            break;
        default:
            console.log('wrong command');
            break;
    }
    console.log(res.toString())
}

function sortTodosBy(user, date, importance) {
    const todos = getAllTodos()
    let header = HEADER.concat(', сгруппированный по ')
    let sorted = []
    let others = []
    let info = 'Остальные Todo'
    if (user) {
        header = header.concat('пользователям')
        sorted = todos.filter(todo => todo.user)
        others = todos.filter(todo => !todo.user)
    }
    if (date) {
        header = header.concat('дате')
        sorted = todos.filter(todo => todo.date)
        others = todos.filter(todo => !todo.date)
    }
    if (importance) {
        header = header.concat('важности')
        sorted = todos.filter(todo => todo.importance > 0).sort((t1, t2) => {
            if (t1.importance < t2.importance) return -1
            if (t1.importance > t2.importance) return 1
            return 0
        })
        others = todos.filter(todo => todo.importance === 0)
    }
    return new TodosOutput(header, sorted, others, info)
}

function findTodos(showAll, needImportant, user) {
    const todos = getAllTodos()
    let sorted = []
    let header = HEADER
    if (showAll) {
        return new TodosOutput(header, todos)
    }
    header = header.concat(', отфильтрованный по ')
    if (needImportant) {
        header = header.concat("важности")
        sorted = todos.filter(todo => todo.importance > 0).sort((t1, t2) => {
            if (t1.importance < t2.importance) return -1
            if (t1.importance > t2.importance) return 1
            return 0
        })
    } else {
        header = header.concat(`пользователю ${user}`)
        sorted = todos.filter(todo => todo.user && todo.user === user)
    }
    return new TodosOutput(header, sorted)
}

function getAllTodos() {
    const todos = []
    files.forEach(file => {
        todos.push(...getFileTodos(file))
    })
    return todos
}

function getFileTodos(file) {
    const fileTodos = []
    const todoRegexp = new RegExp('^(// TODO).*')
    const advancedTodoRegexp = new RegExp('^(\\/\\/( )*TODO).* \\D+;( )*\\w+-\\w+-\\w+;( )*\\D+')
    // '// TODO Имя автора; 2020-12-24; текст комментария'
    file.split('\n').forEach(
        line => {
            const coincidence = line.match(todoRegexp)
            if (!coincidence) return
            const advancedCoincidence = line.match(advancedTodoRegexp)
            if (!advancedCoincidence) fileTodos.push(new Todo(coincidence[0].split(/\/\/( )+TODO/).join(' ').trim()))
            else {
                [todoWithAuthor, date, text] = advancedCoincidence[0].split(';')
                const author = todoWithAuthor.trim().split("TODO").slice(1).join( ).trim()
                fileTodos.push(new Todo(text.trim(), author, date.trim(), [...text].filter(symbol => symbol === '!').length))
            }
    })
    return fileTodos
}

function checkArg(arg, errorMessage) {
    if (!arg) throw new Error(errorMessage)
}


class Todo {
    constructor(text, user, date, importance = 0) {
        this.text = text
        this.user = user
        this.date = date
        this.importance = importance
    }

    toString() {
        let output = `текст: ${this.text}, `
        if (this.user) output = output.concat(`Пользователь: ${this.user}, `)
        output = output.concat(`Коэфициент важности: ${this.importance}, `)
        if (this.date) output = output.concat(`Дата: ${this.date}, `)
        return output
    }
}


class TodosOutput {
    constructor(header, sorted, others = [], info) {
        this.sorted = sorted
        this.header = header
        if (!info && others.length !== 0) throw new Error("Если others.length !== 0, то info должно быть передано")
        this.info = info
        this.others = others
    }

    toString() {
        let output = ''
        if (this.header) {
            output = output.concat(this.header, "\n")
        }
        this.sorted.forEach(
            todo => {
                output = output.concat(todo.toString(), "\n")
            })
        if (this.others.length === 0) return output
        output = output.concat("\n", this.info, "\n")
        this.others.forEach(
            todo => {
                output = output.concat(todo.toString(), "\n")
            })
        return output;
    }
}

// TODO you can do it!
// TODO Имя автора; 2020-09-12; текст !комментария

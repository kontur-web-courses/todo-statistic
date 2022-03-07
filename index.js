const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

const TODO_REGEX = new RegExp("\\/\\/ TODO ([\\w\\- ]+);\\s*([\\w\\-]+);\\s*(.*)$");
const IMPORTANT_SYMBOL = '!';

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let splitCommand = command.split(' ');
    let todos = getAllTodos();
    switch (splitCommand[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        case 'important':
            console.log(todos.filter(t => t.includes(IMPORTANT_SYMBOL)))
            break;
        case 'user':
            let user = splitCommand[1]
            console.log(findTodoByUser(todos, user));
            break;
        case 'sort':
            switch (splitCommand[1]) {
                case 'importance':
                    console.log(todos.sort(
                        (a, b) => countSymbols(b, IMPORTANT_SYMBOL) - countSymbols(a, IMPORTANT_SYMBOL)));
                    break;
                case 'user':
                    let obj = {'noName': []};
                    for (let todo of todos) {
                        let matched = todo.match(TODO_REGEX);
                        let user = 'noName';
                        if (matched !== null)
                            user = matched[1];
                        if (!(user in obj))
                            obj[user] = [];
                        obj[user].push(todo);
                    }
                    for (let v in obj) {
                        if (v !== 'noName')
                            console.log(obj[v]);
                    }
                    console.log(obj['noName']);
                    break;
                case 'date':
                    console.log(todos
                        .map(t => t.match(TODO_REGEX) || [t, null, new Date(0)])
                        .sort((a, b) => new Date(b[2]) - new Date(a[2]))
                        .map(t => t[0]))
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodos() {
    let result = [];
    for (let file of files) {
        for (let line of file.split('\n')) {
            let todoIndex = line.indexOf("// TODO ");
            if (todoIndex === -1)
                continue;
            let todo = line.slice(todoIndex)
            result.push(todo);
        }
    }
    return result;
}

function findTodoByUser(todos, user) {
    return getAllTodos()
        .map(t => t.match(TODO_REGEX))
        .filter(t => t !== null && t[1].toLowerCase() === user.toLowerCase())
        .map(t => t[0]);
}

function countSymbols(string, symbol) {
    return string.split(symbol).length - 1;
}

// TODO you can do it!

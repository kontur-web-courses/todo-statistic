const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODO = 'TODO'
const todo_list = []
files.flatMap(file => parseTODO(file)).forEach(todo => todo_list.push(todo))

console.log('Please, write your command!');
readLine(processCommand);

function parseTODO(file) {
    let lines = file.split("\n")
    return lines
        .filter(line => line.indexOf('// ' + TODO) >= 0)
        .map(line => line.slice(line.indexOf('// ' + TODO)))
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    if (command === 'exit') {
        process.exit(0);
    } else if (command === 'show') {
        print(todo_list)
    } else if (command === 'important') {
        let important_todo = getImportant()
        print(important_todo)
    } else if (command.indexOf('user ') >= 0) {
        let user = command.slice(command.indexOf('user') + 'user'.length + 1)
        let user_todo = getUserTODOs(user)
        print(user_todo)
    } else if (command.indexOf('sort') >= 0) {
        let sort_param = command.split(" ")[1]
        if (sort_param === 'importance') {
            let important_todo = getImportant()
            let another = todo_list.filter(todo => !important_todo.includes(todo))
            print(important_todo)
            print(another)
        } else if (sort_param === 'user') {
            let allUsers = [...new Set(todo_list
                .map(line => line
                    .split(";")[0]
                    .slice(line.indexOf('// ' + TODO) + 8).toLowerCase()))]
            let users_todo = allUsers.flatMap(user => getUserTODOs(user))
            print(users_todo)
        } else if (sort_param === 'date') {
            let date_todo = todo_list.sort(todo => todo.split(";")[1])
            print(date_todo)
        }
    } else {
        console.log('wrong command');
    }
}

function getImportant() {
    return todo_list
        .filter(line => line.indexOf('!') >= 0)
        .sort(line => (line.match(/!/g) || []).length)
}

function getUserTODOs(user) {
    return todo_list
        .filter(line => line
            .split(";")[0]
            .slice(line.indexOf('// ' + TODO) + 8).toLowerCase() === user.toLowerCase());
}

function print(list) {
    list.forEach(todo => console.log(todo))
}

// TODO you can do it!

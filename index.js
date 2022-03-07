const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let lines = getToDoLines();
    let result = getUserComments(lines);
    switch (command) {
        case 'show':
            lines.map(item => console.log(item));
            break;
        case 'important':
            getToDoLines()
                .filter(item => item.includes('!'))
                .map(item => console.log(item));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            if (command.slice(0, 4) === 'user') {
                let [, user] = command.split(' ');
                user = user.toLowerCase();
                result.get(user).map(item => console.log(item));
                break;
            }
            else {
                if (command.slice(0, 4) === 'sort') {
                    let condition = command.slice(5);
                    console.log(condition);
                    lines.sort((a, b) => conditionSort(a, b, condition)).map(item => console.log(item));
                }
                else {
                    console.log('wrong command');
                }
            }
            break;
    }
}

function getUserComments(lines) {
    let dict = new Map();
    for (let line of lines) {
        let arr = line.split(';');
        arr = arr.map(item => item.trimStart());
        if (arr.length == 3) {
            let [name, , comment] = arr;
            name = name.slice(8);
            name = name.toLowerCase();
            name.toLowerCase();
            if (!dict.has(name)) {
                dict.set(name, []);
            }
            let value = dict.get(name);
            value.push(comment);
            dict.set(name, value);
        }
    }
    return dict;
}

function getToDoLines() {
    let todos = [];
    for (let file of getFiles()) {
        let lines = file.split('\n');
        for (let line of lines) {
            let match = /\/\/ TODO/.exec(line);
            if (match != null)
                todos.push(line.slice(match.index));
        }
    }
    return todos;
}

function conditionSort(a, b, condition) {
    switch (condition) {
        case 'importance':
            return b.split('!').length - a.split('!').length;
        case 'user':
            return parseComment(a).user.localeCompare(parseComment(b).user);
        case 'date':
            return parseComment(a).date - parseComment(b).date;
    }
}

function parseComment(line) {
    let arr = line.split(';').map(item => item.trimStart());
    if (arr.length === 3) {
        return {
            'user': arr[0].toLowerCase().slice(8),
            'date': new Date(arr[1].trimStart()),
            'comment': arr[2]
        }
    }
    return null;
}

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const todoRegex = RegExp('.*(//.*?TODO.+) ?', 'g');
const exclRegex = RegExp('!', 'g');
const partsRegex = RegExp('//.*?TODO (.+); (.+); (.+)?', 'g');
const files = getFiles();
let groups;
let todos = getAllTodos();

let sortComps = new Map([
    ["user", (a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }],
    ["importance", (a, b) => Math.sign(b.importance - a.importance)],
    ["date", (a, b) => Math.sign(b.date.getTime() - a.date.getTime())]
])

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let cmd = command.split(' ');
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        case 'refresh':
            todos = getAllTodos();
            break;
        case 'important':
            groups.get('important').forEach(function (obj) {
                    console.log(obj.value)
                }
            );
            break;
        case 'user':
            (groups.get(cmd[1]) || []).forEach(function (obj) {
                console.log(obj.value);
            });
            break;
        case 'sort':
            let sortKey = cmd[1];
            todos.sort(sortComps.get(sortKey))
            todos.forEach(function (obj) {
                console.log(obj.value);
            });
            break;
        case 'date':
            let dateTo = new Date(cmd[1]);
            for (let i of todos) {
                if (i.date.getTime() > dateTo.getTime()) {
                    console.log(i.value);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodos() {

    let todos = []
    groups = new Map()
    groups.set('important', [])

    files.forEach(function (file) {
        [...file.matchAll(todoRegex)].forEach(function (match) {
            let obj = {
                importance: 0,
                user: '',
                date: new Date(1, 1, 1, 1, 1, 1),
                value: match[1]
            };
            let importance = ([...match[1].matchAll(exclRegex)] || []).length;
            if (importance > 0) {
                obj.importance = importance;
                groups.get('important').push(obj);
            }
            let data = [...match[1].matchAll(partsRegex)] || [];
            if (data.length > 0) {
                obj.user = data[0][1];
                obj.date = new Date(data[0][2]);
                obj.value = data[0][3];

                if (!groups.has(obj.user)) {
                    groups.set(obj.user, [])
                }
                groups.get(obj.user).push(obj)
            }
            todos.push(obj);
        });
    })
    return todos;
}

// TODO you can do it!

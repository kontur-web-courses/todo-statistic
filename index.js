const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const strings = getFiles().map(f => f.split('\n')).reduce((a, b) => a.concat(b));
const todoRegex = /\/\/ TODO (.*)/;
const namedTodoRegex = /\/\/ TODO (?<name>.+); *(?<date>.+); *(?<comment>.*)/;
const userNameRegex = /user (?<name>.+)/;

let namedTodoes = []

function todo(strings){
    let result = []
    for(let str of strings){
        let todo = str.match(todoRegex);
        if(todo)
            result.push(todo[0]);
        let name = str.match(namedTodoRegex);
        if (name) {
            let obj = name.groups;
            obj.name = obj.name.toLowerCase();
            obj.date = new Date(obj.date);
            namedTodoes.push(obj);
        }
    }
    return result;
}
let allTodoes = todo(strings);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandSplited = command.split(' ');
    switch (commandSplited[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for(let i of allTodoes){
                console.log(i);
            }
            break;
        case 'important':
            for (let i of allTodoes) {
                if (i.at(-1) === '!') {
                    console.log(i);
                }
            }
            break;
        case 'user':
            let userName = command.match(userNameRegex).groups.name.toLowerCase();
            for (let i of namedTodoes) {
                if (i.name.toLowerCase() === userName) {
                    console.log(i.date.toDateString() + '; ' + i.comment);
                }
            }
            break;
        case 'sort':
            let order = commandSplited[1];
            if (order === 'user') {
                let dict = new Map();
                for (let i of namedTodoes) {
                    if (!dict.has(i.name)) {
                        dict.set(i.name, [])
                    }
                    let comment = i.date.toDateString() + '; ' + i.comment;
                    let oldValue = dict.get(i.name);
                    oldValue.push(comment);
                    dict.set(i.name, oldValue);
                }

                for (let [key, values] of dict) {
                    console.log(key + ':');
                    for (let value of values) {
                        console.log(value);
                    }
                }
            }

            if (order === 'date') {
                let sorted = namedTodoes.sort(function(a,b) {
                    return new Date(b.date) - new Date(a.date);
                });
                for (let i of sorted) {
                    let comment = i.name + '; ' + i.date.toDateString() + '; ' + i.comment;
                    console.log(comment);
                }
            }

            if (order === 'importance') {
                allTodoes.sort((a, b) => b.split('!').length - a.split('!').length);
                for(let i of allTodoes){
                    console.log(i);
                }
            }

            break;
        case 'date':

            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

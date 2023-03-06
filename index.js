const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos(files) {
    let res = [];
    for (let text of files) {
        for (let line of text.split('\n')){
            if (line.includes("\/\/ TODO ")){
                line = line.substring(line.indexOf("\/\/ TODO ")+8);
                let comment = {
                    name: '',
                    date: '',
                    comment: line
                }
                line = line.split(';');
                if (line.length === 3) {
                    comment = {
                        name: line[0].toLowerCase(),
                        date: line[1],
                        comment: line[2].trim()
                    }
                }
                res.push(comment);
            }
        }
    }
    return res;
}

function formatTodo(todo){
    return `${todo.name} ${todo.date} ${todo.comment}`.trim();
}

function isCommand(command, sampleCommand){
    let splittedCommand = command.split(' ');
    if (splittedCommand[0] === sampleCommand)
        return command;
}

function countExclMarks(str){
    return (str.comment.match(/!/g) || []).length;
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {})
}

function hasDate(command){
    let splittedCommand = command.split(' ');
    if (splittedCommand[0] === 'date')
        return command;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos.map(todo => formatTodo(todo)));
            break;
        case hasDate(command):
            let date = new Date(command.split(' ')[1]);
            console.log(todos.filter(comment => new Date(comment.date) > date).map(formatTodo));
            break;
        case 'important':
            console.log(todos
                .map(formatTodo)
                .filter((comment => comment.includes('!'))));
            break;
        case isCommand(command, 'user'):
            let username = command.split(' ')[1];
            console.log(todos
                .filter(todo => todo.name.toLowerCase() === username.toLowerCase())
                .map(formatTodo));
            break;
        case isCommand(command, 'sort'):
            let sortFilter = command.split(' ')[1];
            switch (sortFilter){
                case 'importance':
                    console.log(todos
                        .sort((a, b) => countExclMarks(b) - countExclMarks(a))
                        .map(formatTodo));
                    break;
                case 'user':
                    let grouped = groupBy(todos, "name");
                    for (let user in grouped){
                        console.log(grouped[user].map(formatTodo))
                    }
                    break;
                case 'date':
                    console.log(todos
                        .sort((a, b) => {
                            if (a.date === '')
                                return 1;
                            if (b.date === '')
                                return -1;
                            return new Date(b.date) - new Date(a.date);
                        })
                        .map(formatTodo));
                    break;
                default:
                    console.log('wrong command');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

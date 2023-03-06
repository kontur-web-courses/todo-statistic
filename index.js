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
            if (line.startsWith("\/\/ TODO ")){
                line = line.substring(8);
                let comment = {
                    name: '',
                    date: '',
                    comment: line
                }
                line = line.split(';');
                if (line.length === 3) {
                    comment = {
                        name: line[0],
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

function hasUsername(command){
    let splittedCommand = command.split(' ');
    if (command.length === 1)
        return '';
    if (splittedCommand[0] === 'user')
        return command;
    return '';
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'important':
            console.log(todos
                .map(formatTodo)
                .filter((comment => comment.includes('!')))
                .join('\n'));
            break;
        case hasUsername(command):
            let username = command.split(' ')[1];
            console.log(todos
                .filter(todo => todo.name.toLowerCase() === username.toLowerCase())
                .map(formatTodo));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

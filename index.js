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


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'important':
            console.log(todos.map(todo => todo.comment).filter((comment => comment.includes('!'))).join('\n'));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

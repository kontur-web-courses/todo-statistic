const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function searchAllFiles(files){
    let result = [];
    for (let file of files){
        result.push(...findAllTodos(file));
    }
    return result;
}

function findAllTodos(file){
    let result = [];
    let lines = file.split('\r\n');
    for(let line of lines){
        let index = line.indexOf('// TODO ');
        if (index !== -1){
            result.push({
                text: line.slice(index + 8),
            });
        }
    }
    return result;
}

function markTodosImportance(todos){
    for (let todo of todos){
        todo.important = todo.text.includes('!');
    }
}

function findImportantTodos(todos){
    result = [];
    for (let todo of todos){
        if (todo.important){
            result.push(todo);
        }
    }
    return result;
}

function printText(todos){
    console.log(todos.map(obj => obj.text));
}

function processCommand(command) {
    const todos = searchAllFiles(getFiles());
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printText(todos);
            break;
        case 'important':
            markTodosImportance(todos);
            printText(findImportantTodos(todos));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function parseComment(comment) {
    const commentPattern = /(?:(.*?); ?([\d-]*?); ?)?(.*)/;
    const parsedComment = commentPattern.exec(comment);
    let commentObj = {
        text : parsedComment[3],
        hasDate : false,
        importanceLevel : symbolCount(comment, '!'),
    };

    const isVerbose = parsedComment[0] !== parsedComment[3];
    if (isVerbose) {
        commentObj.username = parsedComment[1];
        commentObj.hasDate = true;
        commentObj.date = new Date(parsedComment[2]);
    }

    return commentObj;
}

function symbolCount(str, symbol) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if(str[i] === symbol) {
            count++;
        }
    }

    return count;
}

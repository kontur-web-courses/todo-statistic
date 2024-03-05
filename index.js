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
        let match = /^.*?\/\/ ?(?:TODO)[ :](.*)/i.exec(line);
        if (match !== null){
            result.push(match[1]);
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
    console.log(todos.map(obj => obj.username + ':' + obj.date + ':' + obj.text));
}

function processCommand(command) {
    let [commandType, arg] = command.split(' ', 2);
    let todos = searchAllFiles(getFiles()).map(comment => parseComment(comment));
    switch (commandType) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            break;
        case 'important':
            todos = todos.filter(todo => todo.importanceLevel > 0);
            break;
        case 'user':
            todos = todos.filter(todo => todo.username === arg.toLowerCase());
            break;
        case 'sort':
            let comparator = null;
            switch (arg){
                case 'importance':
                    comparator = (a, b) => b.importanceLevel - a.importanceLevel;
                    break;
                case 'user':
                    comparator = (a, b) => -a.username.localeCompare(b.username);
                    break;
                case 'date':
                    comparator = (a, b) => b.date - a.date;
                    break;
            }
            todos.sort(comparator);
            break;
        case 'date':
            let checkDate = new Date(arg);
            todos = todos.filter(todo => todo.date > checkDate);
            break;
        default:
            console.log('wrong command');
            break;
    }
    printText(todos);
}

function parseComment(comment) {
    const commentPattern = /(?:(.*?); ?([\d-]*?); ?)?(.*)/;
    const parsedComment = commentPattern.exec(comment);
    let commentObj = {
        username : '',
        text : parsedComment[3],
        hasDate : false,
        importanceLevel : symbolCount(comment, '!'),
    };

    const isVerbose = parsedComment[0] !== parsedComment[3];
    if (isVerbose) {
        commentObj.username = parsedComment[1].toLowerCase();
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

//tODO You can do it!
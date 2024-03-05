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
    const commandParts = command.split(' ');
    switch (commandParts[0]) {
        case 'important':
            const importantTodos = getImportantTodos();
            importantTodos.forEach(todo => console.log(todo));
            break;
        case 'user':
            if (commandParts.length === 2) {
                const userTodos = getTodosByUser(commandParts[1]);
                userTodos.forEach(todo => console.log(todo));
            }
            else  {
                console.log('Need username');
            }
            break;
        case 'show':
            console.log(getTODOComments());
            break;
        case 'date':
            if (commandParts.length === 2) {
                const dateComments = getCommentsAfterDate(String(commandParts[1]))
                dateComments.forEach(comment => console.log(comment));
            }
            else  {
                console.log('Need date');
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

const TODORegex = /\/\/\s*TODO\s.*/g;
const dateRegex = /(\d{4}(-\d{2}(-\d{2})?)?)/
function getTODOComments() {
    let result = [];
    let matches;
    for (let file of files) {
        matches = file.match(TODORegex);
        if (matches)
            result = result.concat(matches.map(line => line.slice(8)));
    }
    return result;
}

function getImportantTodos() {
    const todos = getTODOComments();
    return todos.filter(todo => todo.includes('!'));
}

function getTodosByUser(username) {
    const todos = getTODOComments();
    return todos.filter(todo => {
        const todoParts = todo.split(';').map(part => part.trim());
        return todoParts[0].toLowerCase() === username.toLowerCase();
    });
}

function extractDateFromComment(comment) {
    const match = comment.match(dateRegex);
    return match ? match[1] : null;
}

function getCommentsAfterDate(date) {
    const targetDate = new Date(date);
    let result = [];
    let comments = getTODOComments();
    for (let comment of comments) {
        const commentDateString = extractDateFromComment(comment);
        if (commentDateString) {
            const commentDate = new Date(commentDateString);
            if (commentDate > targetDate) {
                result.push(comment);
            }
        }
    }
    return result;
}
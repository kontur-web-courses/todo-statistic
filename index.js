const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path =>  readFile(path));
}

function processCommand(command) {
    const commandParts = command.split(' ');
    switch (commandParts[0]) {
        case 'important':
            printTodos(getImportantTodos());
            break;
        case 'user':
            if (commandParts.length === 2) {
                printTodos(getTodosByUser(commandParts[1]));
            }
            else  {
                console.log('Need username');
            }
            break;
        case 'show':
            printTodos(getTODOComments());
            break;
        case 'sort':
            if (commandParts.length === 2) {
                sortTodos(commandParts[1]);
            }
            break;
        case 'date':
            if (commandParts.length === 2) {
                printTodos(getCommentsAfterDate(String(commandParts[1])));
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

function sortTodos(criteria) {
    switch (criteria) {
        case 'importance':
            printTodos(sortByImportance());
            break;
        case 'user':
            printTodos(sortByUser());
            break;
        case 'date':
            printTodos(sortByDate());
            break;
        default:
            console.log('Invalid sorting criterion. Please choose importance, user, or date.');
            break;
    }
}

function sortByImportance() {
    const todos = getTODOComments();
    const importantTodos = todos.filter(todo => todo.includes('!')).sort((a, b) => {
        const countA = (a.match(/!/g) || []).length;
        const countB = (b.match(/!/g) || []).length;
        return countB - countA;
    });
    const otherTodos = todos.filter(todo => !todo.includes('!')).sort();
    return [...importantTodos, ...otherTodos];
}

function sortByUser() {
    const todos = getTODOComments();
    const userTodos = {};
    const unnamedTodos = [];
    todos.forEach(todo => {
        const todoParts = todo.split(';').map(part => part.trim());
        if (todoParts.length >= 3) {
            const username = todoParts[0].toLowerCase();
            if (!userTodos[username]) {
                userTodos[username] = [];
            }
            userTodos[username].push(todo);
        } else {
            unnamedTodos.push(todo);
        }
    });
    const sortedUserTodos = Object.values(userTodos).flatMap(todos => todos.sort());
    return [...sortedUserTodos, ...unnamedTodos];
}

function sortByDate() {
    const todos = getTODOComments();
    const datedTodos = todos.filter(todo => todo.match(dateRegex)).sort((a, b) => {
        const dateA = new Date(extractDateFromComment(a));
        const dateB = new Date(extractDateFromComment(b));
        return dateB - dateA;
    });
    const undatedTodos = todos.filter(todo => !todo.match(dateRegex)).sort();
    return [...datedTodos, ...undatedTodos];
}

function printTodos(todos) {
    todos.forEach(todo => {
        const todoParts = todo.split(';').map(part => part.trim());
        let importance = '';
        if (todo.includes('!')) {
            importance = '!';
        }
        if (todoParts.length >= 3) {
            const username = todoParts[0] ? todoParts[0].substring(0, 10) : '';
            user = username.padEnd(10).length > 10 ? username.substring(0, 7) + '...' : username.padEnd(10);
            todoParts.shift();
        } else {
            user = ''.padEnd(10);
        }
        const date = todoParts[0] ? todoParts[0].substring(0, 10).padEnd(10) : ''.padEnd(10);
        const comment = todoParts[1] ? truncate(todoParts[1], 50) : '';
        console.log(`${importance.padEnd(3)}|  ${user}  |  ${date}  |  ${comment}`);
    });
}


function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}
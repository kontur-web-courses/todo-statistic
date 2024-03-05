const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoComments = parse(files);
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let splittedCommand = command.split(' ');
    let com = splittedCommand[0];
    switch (com) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let x of todoComments){
                console.log(x);
            }
            break;
        case 'user':
            for (let x of todoComments){
                if (x.username === splittedCommand[1])
                    console.log(x);
            }
            break;
        case 'important':
            for (let x of todoComments){
                if (x.is_important){
                    console.log(x);
                }
            }
            break;
        case 'sort':
            if (splittedCommand[1] === 'importance'){
                 console.log(sortByImportance(todoComments));
            }
            else if (splittedCommand[1] === 'user'){
                console.log(sortByUser(todoComments));
            }
            else if (splittedCommand[1] === 'date'){
                console.log(sortByDate(todoComments));
            }
            else{
                console.log('There is no anymore options')
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}


function parse(files) {
    const todos = [];
    const todoRegex = /\/\/ TODO .*/g;

    files.forEach(file => {
        const matches = file.match(todoRegex);
        if (!matches)
            return;
        for (let match of matches){
            match = match.slice(8);
            if (match)
                todos.push(extractCommentData(match));
        }        
    });

    return todos;
}

function extractCommentData(match){
    let username, date, text, is_important;
    if (match.indexOf(';') == -1){
        text = match;
    }
    else{
        [username, date, text] = match.split(';');
        date = new Date(date);
    }
    is_important = (text.indexOf('!') != -1);
    return {
        username,
        date,
        text,
        is_important
    };
}


function sortByImportance(comments) {
    return comments.sort((a, b) => {
        if (a.is_important === b.is_important) {
            if (a.is_important) {
                const exclamationCountA = (a.text.match(/!/g) || []).length;
                const exclamationCountB = (b.text.match(/!/g) || []).length;
                return exclamationCountB - exclamationCountA;
            }
            return 0;
        }
        return a.is_important ? -1 : 1;
    });
}


function sortByUser(comments) {
    return comments.sort((a, b) => {
        const usernameA = a.username || 'zzz';
        const usernameB = b.username || 'zzz';
        return usernameA.localeCompare(usernameB);
    });
}


function sortByDate(comments) {
    return comments.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });
}
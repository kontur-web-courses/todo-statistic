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
            for (let x in todoComments){
                console.log(x);
            }
            break;
        case 'user':
            for (let x in todoComments){
                if (x.username === splittedCommand[1])
                    console.log(x);
            }
            break;
        case 'important':
            for (let x in todoComments){
                if (x.is_important){
                    console.log(x);
                }
            }
            break;
        case 'sort':
            console.log(sortComments(todoComments, splittedCommand[1]));
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


function sortComments(comments, sortBy) {
    if (sortBy === 'importance') {
        return comments.sort((a, b) => {
            if (a.is_important === b.is_important) {
                const exclamationCountA = (a.text.match(/!/g) || []).length;
                const exclamationCountB = (b.text.match(/!/g) || []).length;
                return exclamationCountB - exclamationCountA;
            }
            return a.is_important === 'true' ? -1 : 1;
        });
    } else if (sortBy === 'user') {
        return comments.sort((a, b) => {
            if (a.username === b.username) return 0;
            if (a.username === undefined) return 1;
            if (b.username === undefined) return -1;
            return a.username.localeCompare(b.username);
        });
    } else if (sortBy === 'date') {
        return comments.sort((a, b) => {
            if (a.date === b.date) return 0;
            if (a.date === undefined) return 1;
            if (b.date === undefined) return -1;
            return b.date.localeCompare(a.date);
        });
    }
    return comments;
}
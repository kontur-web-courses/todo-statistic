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
        case 'user':
            for (let x of todoComments){
                if (x.username === splittedCommand[1])
                    console.log(x);
            }
        case 'important':
            for (let x of todoComments){
                if (x.is_important){
                    console.log(x);
                }
            }
        case 'sort':
            if (splittedCommand[1] === 'importance'){
                sortByImportance(todoComments);
            }
            else{
                console.log(':///');
            }
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
        console.log('Here');
        date = Date(date);
    }
    is_important = (text.indexOf('!') != -1);
    return {
        username,
        date,
        text,
        is_important
    };
}

// TODO you can do it!

const obj = {
    username: '',
    date: '',
    text: '',
    is_important: ''
};

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
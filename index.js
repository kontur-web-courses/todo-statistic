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
    switch (command) {
        case 'exit':
            process.exit(0);
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

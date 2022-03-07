const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodos() {
    let files = getFiles();
    let comments = []
    for (file of files){
        let current = [];
        let toDoIndex = file.indexOf('// TODO ');
        let newLineIndex = file.indexOf('\r', toDoIndex);
        while (toDoIndex != -1) {
            //console.log(toDoIndex, newLineIndex);
            current.push(file.slice(toDoIndex, newLineIndex));
            
            toDoIndex = file.indexOf('// TODO ', newLineIndex);
            newLineIndex = file.indexOf('\r', toDoIndex); 
            //console.log(current);
        }
        
        Array.prototype.push.apply(comments, current);
    }
    return comments;
}

let commentWithAuthorRegex = (/\/\/ TODO (?<name>[^;]+);\s?(?<date>[^;]+);\s?(?<comment>[^;]+)/);
function isCommentOfUser(comment, userName) {
    return comment.match(commentWithAuthorRegex)?.groups.name == userName;
}

function processCommand(command) {
    let splitted = command.split(' ');
    let comments;
    switch (splitted[0]) {
        case 'show':
            comments = getTodos();
            console.log(comments);
            break;
        case 'important':
            comments = getTodos();
            console.log(comments.filter(x => x.indexOf('!') != -1));
            break;
        case 'user':
            comments = getTodos();
            console.log(comments.filter(x => isCommentOfUser(x, splitted[1])));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

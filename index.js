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
    switch (command) {
        case 'exit':
            process.exit(0);
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

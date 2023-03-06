const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
//использовать регулярные выражения
function GetAllCommentsFromFiles(files) {
    let comments = [];
    for (let file of files) {
        let comment = file.match(/\/\/ TODO .*/g);
        if (comment != null) {
            comments.push(comment);
        }
    }
    return comments;
}


function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                console.log(comment);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

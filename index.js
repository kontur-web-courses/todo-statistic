const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    for (let file of files) {
        const regex = /\/\/ TODO (.+?)(?=\r\n|\n|$)/g;
        const matches = [...file.matchAll(regex)];
        for (const match of matches) {
             comments.push(match.toString());
        }
    }
}

function processCommand(command) {
    getComments();
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let comment of comments)
                console.log(comment);
            break;

        default:
            console.log('wrong command123');
            break;
    }
}

// TODO you can do it!

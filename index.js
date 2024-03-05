const KEYWORD = '// TODO '; // скипни ту хуйню

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
        case 'show':
            getAllComments();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllComments() {
    const comments = []
    for (const file of files) {
        const lines = file.split('\n');
        for (const line of lines) {
            const i = line.indexOf(KEYWORD);
            if (i != -1) {
                let sub = line.slice(i + KEYWORD.length, -1);
                if (!sub.includes('// скипни ту хуйню')) {
                    comments.push(line.slice(i + KEYWORD.length, -1));
                }
            }
        }
    }
    console.log(comments);
    return comments;
}

// TODO you can do it!

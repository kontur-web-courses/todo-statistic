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

function processCommand(input) {
    const command = input.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getAllComments());
            break;
        case 'important':
            console.log(getAllComments().filter(s => s.includes('!')));
            break;
        case 'user':
            console.log(getCommentsFromUser(command[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getCommentsFromUser(user) {
    const comments = getAllComments();
    return comments.filter(c => c.startsWith(`${user};`));
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
    return comments;
}

// TODO you can do it!

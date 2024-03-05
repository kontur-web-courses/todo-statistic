const KEYWORD = '// TODO '; // скипни это

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
        case 'sort':
            console.log(getSorted(command[1]));
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
                if (!sub.includes('// скипни это')) {
                    comments.push(line.slice(i + KEYWORD.length, -1));
                }
            }
        }
    }
    return comments;
}

function getSorted(sortBy) {
    const comments = getAllComments();
    const withUsers = comments.filter(e => e.includes(';'));
    const withoutUsers = comments.filter(e => !e.includes(';'));
    switch (sortBy) {
        case 'importance':
            return comments.sort((x, y) => countWOWinString(y) - countWOWinString(x));
        case 'user':
            withUsers.sort((a, b) => a.localeCompare(b));
            return withUsers.concat(withoutUsers);
        case 'date':
            withUsers.sort((a, b) => extractDate(b).localeCompare(extractDate(a)));
            return withUsers.concat(withoutUsers);
        default:
            console.log('wrong field');
            break;
    }
}

function countWOWinString(str) {
    return (str.match(/!/g) || []).length;
}

function extractDate(str) {
    return str.split(';')[1].trim();
}

// TODO you can do it!

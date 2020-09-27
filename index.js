const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

const COMMENTS = getAllComments(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            console.log('COMMAND', command)
            process.exit(0);
            break;
        case 'show':
            console.log('\r\nResults:\r\n');
            console.log(COMMENTS, COMMENTS.length);
            break;
        case 'important':
            COMMENTS.filter(c => c.important).map(c => console.log(c));
            break;
        case command.split(/user [a-zа-я0-9_\s]*/i)[1] === '' ? command : null:
            const user = command.replace('user ', '').trim();
            // console.log(user)
            COMMENTS.filter(c => c.user === user ).map(c => console.log(c));
            break;
        case command.split(/sort\s*importance/)[1] === '' ? command : null:
            console.log(COMMENTS.sort((a, b) => a.important && b.important ? 0 : a.important ? -1 : b.important ? 1 : 0));
            break;
        case command.split(/sort\s*user/)[1] === '' ? command : null:
            console.log(COMMENTS.sort((a, b) => (a.user && b.user) ? (a.user).localeCompare(b.user) : 0));
            break;
        case command.split(/sort\s*date/)[1] === '' ? command : null:
            console.log(COMMENTS.sort((a, b) => a.important && b.important ? 0 : a.important ? -1 : b.important ? 1 : 0));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getAllComments(files) {
    let comments = [];
    files.forEach(file => {
        file.split('\r\n').forEach(line => {
            const comment = line.split('// TODO ');
            if (comment.length === 2 && (comment[0] + comment[1]).trim() !== 'const comment = line.split(\'\');') {
                comments = [...comments, comment[1]];
            }
        });
    });
    comments = comments.map(comment => {
        const arr = comment.split(';').map(e => e.trim());
        let obj = {};
        if (/!/.test(comment)) {
            obj.important = true;
        }
        if (arr.length === 1) {
            obj.text = arr[0].trim();
        } else if (arr.length === 3) {
            obj.user = arr[0].trim();
            const date = new Date(arr[1].trim());
            obj.date = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            };
            obj.text = arr[2].trim();
        }
        return obj;
    });
    return comments;
}
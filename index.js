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
    let com = '';
    switch (command) {
        case 'exit':
            com = command;
            // console.log('COMMAND', command)
            process.exit(0);
            break;
        case 'show':
            console.log('\r\nResults:\r\n');
            COMMENTS.map(comment => console.log(comment.text))
            break;
        case 'important':
            console.log('\r\nResults:\r\n');
            COMMENTS
                .filter(c => c.importance > 0)
                .map(c => console.log(c.text));
            break;
        case command.match(/^user [a-zа-я0-9_\s]+$/gi) ? command : null:
            const user = command.replace('user ', '').trim().toLowerCase();
            console.log('\r\nResults:\r\n');
            COMMENTS
                .filter(c => c.user.toLowerCase() === user)
                .map(c => console.log(c.text));
            break;
        case command.match(/^sort importance$/gi) ? command : null:
            console.log('\r\nResults:\r\n');
            COMMENTS
                .sort((a, b) => b.importance - a.importance)
                .map(c => console.log(c.text));
            // sortImportance();
            break;
        case command.match(/^sort user$/gi) ? command : null:
            console.log('\r\nResults:\r\n');
            COMMENTS
                .sort((a, b) => (a.user && b.user) ? (a.user).localeCompare(b.user) : 0)
                .map(c => console.log(c));
            break;
        case command.match(/^sort date$/gi) ? command : null:
            console.log('\r\nResults:\r\n');
            COMMENTS
                .sort((a, b) => {
                    return (a.date && b.date) ? b.date.date - a.date.date :
                        a.date ? -1 : b.date ? 1 : 0;
                })
                .map(c => console.log(c));
            break;
        case command.match(/date [0-9]{4}(-[0-9]{2}(-[0-9]{2})?)?/i) ? command : null:
            const date = command.match(/date [0-9]{4}(-[0-9]{2}(-[0-9]{2})?)?/);
            console.log(date, date.length)
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO ; 2016; добавить writeLine!!!
// TODO ; ; добавить writeLine!!!

function getAllComments(files) {
    let comments = [];
    files.forEach(file => {
        const newComments = file.match(/\/\/ todo .+/gi);
        comments.push(...newComments);
    });
    console.log(comments)
    comments = comments.map(comment => {
        const arr = comment.split(/\/\/ todo /gi)[1].split(';').map(e => e.trim());
        let obj = {};
        const importance = comment.match(/!/g) || [];
        obj.importance = importance.length;
        if (arr.length === 1) {
            obj.text = arr[0].trim();
        } else if (arr.length === 3) {
            obj.user = arr[0].trim();
            const date = new Date(arr[1].trim());
            obj.date = {
                date: date,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            };
            obj.text = arr[2].trim();
        }
        return obj;
    });
    console.log(comments)
    return comments;
}

// function sortImportance() {
//     COMMENTS
//         .map(comment => {
//             const importance = comment.match(/!/g) || [];
//             return {
//                 text: comment,
//                 importance: importance.length,
//             };
//         })
//         .sort((a, b) => b.importance - a.importance)
//         .map(comment => console.log(comment.text));
// }
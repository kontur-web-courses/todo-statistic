const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            show();
            break;
        case command === 'important':
            important();
            break;
        case command.startsWith('user'):
            user(command);
            break;
        case command.startsWith('sort'):
            const sortParamm = command.split(' ')[1];
            sort(sortParamm);
            break;
        case command.startsWith('date'):
            const date = command.split(' ')[1];
            dateCmd(date);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getComments() {
    const lines = files.map(file => file.split('\r\n')).flat();
    return lines.map(parseComment).filter(comment => comment !== null);
}

const COMM_RE = /\/\/\sTODO\s(?:(?<name>.*?);\s?(?<date>.*?);\s?)?(?<comment>.*)/;
function parseComment(comment) {
    const match = comment.match(COMM_RE);
    if (match === null)
        return null;

    const [_, name, date, text] = match; 
    const dateDate = (date !== undefined) ? parseDate(date) : undefined;
    const importance = (text.match(/!/g) || []).length;
    return {
        user: name,
        date: dateDate,
        importance: importance,
        text: text
    }
}

function parseDate(date) {
    const parts = date.split('-').map(s => +s);
    const yyyy = parts[0];
    const mm = (parts[1] || 0) - 1;
    const dd = parts[2] || 0;
    return new Date(yyyy, mm, dd);
}

function truncateString (str, len) {
    return (str.length <= len) ? str : (str.slice(0, len - 1) + '…');
}

function formatToLength (str, len, pad=' ') {
    return truncateString(str, len).padEnd(len, pad);
}

function padZero(number) {
    return number.toString().padStart(2, "0");
}

function formatDate (date) {
    const formatDate = padZero(date.getDate());
    const formatMonth = padZero(date.getMonth() + 1);
    const formatYear = date.getFullYear();
    return `${formatYear}-${formatMonth}-${formatDate}`;
}

function formatComment(comm) {
    const formattedDate = (comm.date !== undefined) ? formatDate(comm.date) : '';
    return `${comm.importance > 0 ? '!' : ' '}  |  ` +
        `${formatToLength(comm.user || '', 10)}  |  ` +
        `${formatToLength(formattedDate, 10)}  |  ` +
        `${formatToLength(comm.text, 50)}`;
}

function printComment(comms) {
    for (const comm of comms) {
        const formatted = formatComment(comm);
        console.log(formatted);
    }
}

function show() {
    const comments = getComments();
    printComment(comments);
}

function important() {
    const importantComments = getComments().filter(comm => comm.importance > 0);
    printComment(importantComments)
}

function user(cmd) {
    const userName = cmd.slice(5).toLowerCase();
    const userComments = getComments().filter(comm => comm.user?.toLowerCase() === userName);
    printComment(userComments);
}

function dateCmd(date) {
    const dateDate = parseDate(date);
    printComment(getComments().filter(comm => comm.date > dateDate));
}

function sort(param) {
    const comments = getComments();
    switch (param) {
        case 'user':
            printComment(comments.sort((u1, u2) => u1.user?.toLowerCase().localeCompare(u2.user.toLowerCase())));
            break;
        case 'importance':
            printComment(comments.sort((i1, i2) => i2.importance - i1.importance));
            break;
        case 'date':
            printComment(comments.sort((d1, d2) => d2.date - d1.date));
            break;
        default:
            console.log("Unknown parameter!");
            break;
    }
}

console.log('Please, write your command!');
readLine(processCommand);

// TODO you can do it!

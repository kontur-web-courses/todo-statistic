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
            printTable(COMMENTS
                .map(comment => formatComment(comment)));
            break;
        case 'important':
            printTable(COMMENTS
                .filter(c => c.importance > 0)
                .map(c => formatComment(c)));
            break;
        case command.match(/^user [a-zа-я0-9_\s]+$/g) ? command : null:
            const user = command.replace('user ', '').trim().toLowerCase();
            printTable(COMMENTS
                .filter(c => c.user && c.user.toLowerCase() === user)
                .map(c => formatComment(c)));
            break;
        case command.match(/^sort importance$/g) ? command : null:
            printTable(COMMENTS
                .sort((a, b) => b.importance - a.importance)
                .map(c => formatComment(c)));
            break;
        case command.match(/^sort user$/g) ? command : null:
            printTable(COMMENTS
                .sort((a, b) => (a.user && b.user) ? (a.user).localeCompare(b.user, 'ru', {caseFirst: 'upper'}) :
                    a.user ? -1 : b.user ? 1 : 0)
                .map(c => formatComment(c)));
            break;
        case command.match(/^sort date$/g) ? command : null:
            printTable(COMMENTS
                .sort((a, b) => {
                    return (a.date && b.date) ? b.date.date - a.date.date :
                        a.date ? -1 : b.date ? 1 : 0;
                })
                .map(c => formatComment(c)));
            break;
        case command.match(/^((date [0-9]{4}-[0-9]{2}-[0-9]{2}|date [0-9]{4}-[0-9]{2})|date [0-9]{4})$/g) ? command : null:
            const date = new Date(command.match(/(([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{4}-[0-9]{2})|[0-9]{4})$/g)[0]);
            printTable(COMMENTS
                .filter(comment => comment.date && comment.date.date > date)
                .map(comment => formatComment(comment)));
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
    comments = comments.map(comment => {
        const arr = comment.split(/\/\/ todo /gi)[1].split(';').map(e => e.trim());
        let obj = {};
        const importance = comment.match(/!/g) || [];
        obj.importance = importance.length;
        if (arr.length === 1) {
            obj.text = arr[0].trim();
        } else if (arr.length === 3) {
            const user = arr[0].trim();
            obj.user = user && user.length > 0 ? user : null;
            const dateAsText = arr[1].trim();
            const dateAssArray = dateAsText.split('-');
            const date = new Date(dateAsText);
            obj.date = {
                date: date,
                year: dateAssArray[0] ? Number(dateAssArray[0]) : null,
                month: dateAssArray[1] ? Number(dateAssArray[1]) : null,
                day: dateAssArray[2] ? Number(dateAssArray[2]) : null,
            };
            obj.text = arr[2].trim();
        }
        return obj;
    });
    // console.log(comments)
    return comments;
}

function formatComment(comment) {
    const ending = '…';
    const importance = comment.importance > 0 ? '!' : '';

    let user = (comment.user ? comment.user : '');
    if (user.length > 10) {
        user = trimString(user, ending, 0, 10);
    }

    let date = '';
    if (comment.date) {
        if (comment.date.day && comment.date.month && comment.date.year) {
            date = `${comment.date.year.toString().padStart(4, '0')}-${comment.date.month.toString().padStart(2, '0')}-${comment.date.day.toString().padStart(2, '0')}`;
        } else if (comment.date.month && comment.date.year) {
            date = `${comment.date.year.toString().padStart(4, '0')}-${comment.date.month.toString().padStart(2, '0')}`;
        } else if (comment.date.year) {
            date = `${comment.date.year.toString().padStart(4, '0')}`;
        }
    }

    const text = comment.text.length > 50 ? trimString(comment.text, ending, 0, 50) : comment.text;

    return {
        ...comment,
        fieldsForPrint: {
            importance,
            user,
            date,
            text,
        },
        fieldSize: {
            importance: importance.length,
            user: user.length,
            date: date.length,
            text: text.length,
        }
    }
}

function trimString(str, ending, start, length) {
    return str.slice(start, length - ending.length) + ending;
}

function printTable(comments) {
    const head = formatComment({
        importance: 1,
        user: 'user',
        date: {year: 'date'},
        text: 'comment',
    });
    const [maxI, maxU, maxD, maxT] = getMaxLength([head, ...comments]);
    const aggregate = ' ';
    const widthTable = maxI + maxU + maxD + maxT + 4 + 4 * 3 + 1;

    console.log('\r\nResults:\r\n');
    printRow(
        head.fieldsForPrint.importance.padEnd(maxI, aggregate),
        head.fieldsForPrint.user.padEnd(maxU, aggregate),
        head.fieldsForPrint.date.padEnd(maxD, aggregate),
        head.fieldsForPrint.text.padEnd(maxT, aggregate)
    )
    console.log('-'.repeat(widthTable));
    if (comments.length > 0)
        comments.forEach(comment => {
            printRow(
                comment.fieldsForPrint.importance.padEnd(maxI, aggregate),
                comment.fieldsForPrint.user.padEnd(maxU, aggregate),
                comment.fieldsForPrint.date.padEnd(maxD, aggregate),
                comment.fieldsForPrint.text.padEnd(maxT, aggregate)
            )
        });
    else
        console.log('NO RESULTS'.padStart(widthTable / 2 + 'NO RESULTS'.length / 2, ' '));
    console.log('-'.repeat(widthTable));
}

function printRow(importance, user, date, text) {
    console.log(`  ${importance}  |  ${user}  |  ${date}  |  ${text}`);
}

function getMaxLength(comments, maxImportance = 1, maxUser = 10, maxDate = 10, maxText = 50) {
    let lengthImportance = 0, lengthUser = 0, lengthDate = 0, lengthText = 0;
    comments.forEach(comment => {
        if (comment.fieldSize.importance > lengthImportance) {
            lengthImportance = comment.fieldSize.importance;
        }
        if (comment.fieldSize.user > lengthUser) {
            lengthUser = comment.fieldSize.user;
        }
        if (comment.fieldSize.date > lengthDate) {
            lengthDate = comment.fieldSize.date;
        }
        if (comment.fieldSize.text > lengthText) {
            lengthText = comment.fieldSize.text;
        }
    });
    return [
        lengthImportance <= maxImportance ? lengthImportance : maxImportance,
        lengthUser <= maxUser ? lengthUser : maxUser,
        lengthDate <= maxDate ? lengthDate : maxDate,
        lengthText <= maxText ? lengthText : maxText
    ];
}
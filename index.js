const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoComments = getTodoComments(function (_) {
    return true;
})

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodoComment(line) {
    let splittedLine = line.split('//', 2);
    if (splittedLine.length > 1 && splittedLine[1].trim().startsWith('TODO')) {
        return '//' + splittedLine[1].trimEnd();
    }
    return null;
}

function getTodoComments(predicate) {
    const result = [];
    for (file of files) {
        for (line of file.split('\n')) {
            let comment = getTodoComment(line);
            if (comment !== null && predicate(comment))
                result.push(comment);
        }
    }
    return result;
}

function getUserComments(username) {
    const result = [];
    const predicate = function (c) {
        let data = c.split('TODO')[1].trim().split('; ');
        const author = data[0];
        const date = data[1];
        const message = data[2];
        return author.toLowerCase() === username;
    }
    todoComments.forEach(comment => {
        if (predicate(comment))
            result.push(comment);
    });
    return result;
}

function getUser(comment) {
    let data = comment.split('TODO')[1].trim().split('; ');
    if ((comment.match(';') || []).length < 2)
        return null;
    return data[0];
}

function getDate(comment) {
    let data = comment.split('TODO')[1].trim().split('; ');
    if ((comment.match(';') || []).length < 2)
        return new Date(null);
    return new Date(data[1]);
}

function getImportance(comment) {
    return (comment.match('!') || []).length;
}

function filterCommentsByDate(command, comments) {
    if (!command.startsWith("date")) {
        return "Неверная команда. Пожалуйста, используйте формат 'date {yyyy[-mm[-dd]]}'";
    }

    const dateStr = command.replace("date ", "");
    const filterDate = new Date(dateStr);

    if (isNaN(filterDate.getTime())) {
        return "Неверный формат даты. Пожалуйста, используйте формат 'yyyy', 'yyyy-mm' или 'yyyy-mm-dd'";
    }

    const filteredComments = comments.filter(comment => new Date(comment.createdAt) > filterDate);
    return filteredComments;
}

function processCommand(command) {
    const parts = command.split(/\s+/);
    switch (true) {
        case parts[0] === 'exit':
            process.exit(0);
            break;
        case command.trim() === 'show':
            for (comment of todoComments) {
                console.log(comment);
            }
            break;
        case  parts[0] === 'importance':
            for (let comment of todoComments) {
                if (getImportance(comment) > 0) {
                    console.log(comment);
                }
            }
            break;
        case parts[0] === 'user':
            const username = command.split(' ').slice(1).join(' ').toLowerCase();
            getUserComments(username).forEach(function (comment) {
                console.log(comment);
            })
            break;
        case parts[0] === 'sort':
            switch (parts[1]) {
                case 'importance':
                    todoComments.sort((a, b) => getImportance(b) - getImportance(a))
                    for (let comment of todoComments) {
                        console.log(comment);
                    }
                    break;
                case 'user':
                    todoComments.sort((a, b) => a.localeCompare(b))
                    for (let comment of todoComments) {
                        console.log(comment);
                    }
                    break;
                case 'date':
                    todoComments.sort((a, b) => getDate(b) - getDate(a))
                    for (let comment of todoComments) {
                        console.log(comment);
                    }
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}
// TODO Anonymous Developer; 2077-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
// TODO you can do it!

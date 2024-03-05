const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getComments() {
    const files = getFiles();
    const comments = [];
    for (const file of files) {
        for (const line of file.split('\n')) {
            const index = line.indexOf('// TODO');
            if (index !== -1) {
                comments.push(line.slice(index))
            }
        }
    }

    return comments;
}

function getImportantComments() {
    const comments = getComments();
    const importantComments = [];
    for (const comment of comments) {
        if (comment.includes('!'))
            importantComments.push(comment);
    }

    return importantComments.sort(x => x.split('').filter(char => char === '!').length);
}

function getUserCommentsByName(name) {
    const comments = getComments();
    const lowerName = name[0].toLowerCase() + name.slice(1);
    const upperName = name[0].toUpperCase() + name.slice(1);
    for (const comment of comments) {
        if (comment.includes(lowerName) || comment.includes(upperName))
            console.log(comment);
    }
}

function getAllUsersComments() {
    const comments = getComments();
    const usersComments = {};
    const simpleComments = [];

    for (const comment of comments) {
        const parts = comment.split('; ');

        if (parts.length !== 3) {
            simpleComments.push(comment);
            continue;
        }

        const firstPart = parts[0].split(' ');
        const name = firstPart[firstPart.length - 1].toLowerCase();

        if (Object.keys(usersComments).includes(name)) {
            usersComments[name].push(comment);
        } else {
            usersComments[name] = [comment];
        }
    }

    usersComments[' '] = simpleComments;

    return usersComments;
}

function getDateComments() {
    const comments = getComments();
    const dateCommentsDict = {};
    const dates = [];
    const nonDateComments = [];

    for (const comment of comments) {
        const parts = comment.split('; ');

        if (parts.length !== 3) {
            nonDateComments.push(comment);
            continue;
        }

        const date = parts[1];
        dates.push(date);
        if (Object.keys(dateCommentsDict).includes(date)) {
            dateCommentsDict[date].push(comment);
        } else {
            dateCommentsDict[date] = [comment];
        }
    }

    dateCommentsDict[' '] = nonDateComments;

    dates.sort((x, y) => new Date(y).getTime() - new Date(x).getTime());

    for (const date of dates) {
        console.log(date);
        for (const comment of dateCommentsDict[date]) {
            console.log(comment);
        }
    }

    console.log('no date');
    for (const comment of dateCommentsDict[' ']) {
        console.log(comment);
    }
}

function getSortedCommands(command) {
    const allComments = getComments();
    switch (command) {
        case 'importance':
            const importanceComments = getImportantComments();
            console.log('important')
            for (const importanceComment of importanceComments)
                console.log(importanceComment);

            console.log('unimportant')
            for (const comment of allComments) {
                if (!(importanceComments.includes(comment)))
                    console.log(comment);
            }
            break;

        case 'user':
            const comments = getAllUsersComments();
            let simpleComments = [];
            for (const name of Object.keys(comments)) {
                if (name === ' ') {
                    simpleComments = comments[name];
                    continue;
                }

                console.log(name);
                for (const comment of comments[name]) {
                    console.log(comment);
                }
            }

            console.log('no name')
            for (const comment of simpleComments) {
                console.log(comment);
            }
            break;
        case 'date':
            getDateComments();
            break;
    }
}

function processCommand(command) {
    command = command.split(' ');
    const commands = { exit: {}};

    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const comments = getComments();
            for (const comment of comments)
                console.log(comment);
            break;
        case 'important':
            const importanceComments = getImportantComments();
            for (const importanceComment of importanceComments) {
                console.log(importanceComment);
            }
            break;
        case 'user':
            getUserCommentsByName(command[1]);
            break;
        case 'sort':
            getSortedCommands(command[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
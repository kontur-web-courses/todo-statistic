const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getImportant(files) {
    const allComments = getComments(files);
    let important = [];
    for (const comment of allComments) {
        if (comment.at(-1) === '!') {
            let count = 0;
            for (let i = comment.length - 1; i >= 0 ; i--) {
                if (comment[i] === '!') {
                    count++;
                } else {
                    break;
                }
            }
            important.push([comment, count])
        }
    }
    return important;
}


function getCommentsByUser(files, name) {
    let commentsByName = [];
    for (const comment of getComments(files)) {
        const currComment = comment.split(';').map(x => x.trim());
        if (currComment[0].toLowerCase() === name.toLowerCase()) {
            commentsByName.push(comment);
        }
    }
    return commentsByName;
}

function getByUsers() {
    let commentsByName = {};
    let unnamed = [];
    for (const comment of getComments(files)) {
        if (!comment.includes(';')) {
            unnamed.push(comment);
            continue;
        }
        const currComment = comment.split(';').map(x => x.trim());
        currComment[0] = currComment[0].toLowerCase();
        if (!(currComment[0] in commentsByName)) {
            commentsByName[currComment[0]] = [comment];
        } else {
            commentsByName[currComment[0]].push(comment);
        }
    }
    let res = [];
    for (const name in commentsByName) {
        for (const comm of commentsByName[name]) {
            res.push(comm);
        }
    }

    for (const comm of unnamed) {
        res.push(comm);
    }
    return res;
}

function getByDates() {
    let commentsWithDates = [];
    let commentsWithoutDates = [];

    for (const comment of getComments(files)) {
        if (!comment.includes(';')) {
            commentsWithoutDates.push(comment);
            continue;
        }
        const currComment = comment.split(';').map(x => x.trim());
        let date = new Date(currComment[1]);
        commentsWithDates.push([comment, date]);
    }
    commentsWithDates.sort((a, b) => b[1] - a[1]);
    let onlyComments = [];
    for (const comm of commentsWithDates) {
        onlyComments.push(comm[0]);
    }
    return onlyComments.concat(commentsWithoutDates);
}

function processCommand(command) {
    const [action, value] = command.split(' ');
    switch (action) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getComments(getFiles()))
            break;
        case 'important':
            const allCommands = getImportant(getFiles());
            for (const comm of allCommands) {
                console.log(comm[0]);
            }

            break;
        case 'user':
            console.log(getCommentsByUser(getFiles(), value));
            break;
        case 'sort':
            switch (value){
                case 'importance':
                    const important = getImportant(getFiles());
                    important.sort((a, b) => b[1] - a[1]);
                    for (const comm of important) {
                        console.log(comm[0]);
                    }
                    break;
                case 'user':
                    console.log(getByUsers())
                    break;
                case 'date':
                    console.log(getByDates())
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getComments(files) {
    let comments = [];
    for (const file of files) {
        for (const line of file.split('\r\n')) {
            const i = line.indexOf('// TODO ')
            if (i === -1) {
                continue;
            }
            const comment = line.substring(i + 8);
            comments.push(comment)
        }
    }
    return comments;
}

// TODO you can do it!

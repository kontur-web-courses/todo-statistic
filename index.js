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
    let files = getFiles()
    let comments = [];

    for (const file of files) {
        let strings = file.split('\r\n');

        for (const string of strings) {
            const index = string.indexOf('// TODO')

            if (index >= 0 && string.at(index - 1) !== "'") {
                comments.push(string.substring(index));
            }
        }
    }

    return comments;
}

function getImportant(comment) {
    let comments = getComments();

    let importants = [];

    for (const comment of comments) {
        if (comment.includes('!')) {
            importants.push(comment)
        }
    }

    return importants;
}

function getUserComments(user){
    let comments = getComments();

    let userComments = [];

    for (const comment of comments) {
        if (comment.toLowerCase().includes(user.toLowerCase())) {
            userComments.push(comment)
        }
    }

    return userComments;
}

function getSorted(arg) {
    let comments = getComments();

    switch (arg) {
        case 'user':
            let users = [];
            let empty = [];

            for (const comment of comments) {
                if (comment.includes(';')) {
                    users.push(comment);
                } else {
                    empty.push(comment);
                }
            }

            console.log(users);
            console.log(empty);
            break
        case 'date':
            let sorted = comments.sort((a, b) => {
                let dateA = new Date(a.match(/\d{4}-\d{2}-\d{2}/));
                let dateB = new Date(b.match(/\d{4}-\d{2}-\d{2}/));
                return dateB - dateA;
            });

            console.log(sorted);
            break
        case 'importance':
            let a = comments.sort((a, b) => {
                const exclamationCountA = (a.match(/!/g) || []).length;
                const exclamationCountB = (b.match(/!/g) || []).length;

                return exclamationCountB - exclamationCountA;
            });

            console.log(a)
            break
    }
}

function processCommand(command) {
    command = command.split(" ");

    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getComments());
            break
        case 'important':
            console.log(getImportant());
            break
        case 'user':
            console.log(getUserComments(command[1]));
            break
        case 'sort':
            getSorted(command[1]);
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

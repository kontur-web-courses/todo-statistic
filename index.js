const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

const comments = [];

for (const file of getFiles()) {
    for (const line of file.split("\n")) {
        const pattern = /\/\/\s*TODO\s*(.*?);(.*?);(.*?)\r(?=\s|$)/i;
        const matches = line.match(pattern);
        if (matches) {
            const [, user, date, text] = matches;
            comments.push({
                user: user,
                date: date,
                text: text,
                important: line.includes("!"),
                importance: [...line].filter(x => x === "!").length
            })
        }
    }
}

function processCommand(command) {
    let split = command.split(' ');
    command = split[0];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            importantComments();
            break;
        case 'user':
            show_user(split[1]);
            break;
        case 'sort':
            sort(split[1]);
            break;
        case 'date':
            date(split[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function toString(comment) {
    let s = `// TODO ${comment.user}; ${comment.date}; ${comment.text}`;
    return s;
}

function show() {
    for (const comment of comments) {
        console.log(toString(comment));
    }
}

function importantComments() {
    for (const comment of comments) {
        if (comment.important) {
            console.log(toString(comment));
        }
    }
}

function show_user(user) {
    for (const comment of comments) {
        if (comment.user.toLowerCase() === user.toLowerCase()) {
            console.log(toString(comment));
        }
    }
}

function sort(arg) {
    switch (arg) {
        case 'importance':
            let sorted = comments.sort((a, b) => b.importance - a.importance);
            for (let c of sorted) {
                console.log(toString(c));
            }
            break;
        case 'user':
            let users = [...new Set(comments.map(x => x.user.toLowerCase()))];
            for (let user of users) {
                let filtered = comments.filter(x => x.user.toLowerCase() === user.toLowerCase());
                for (let f of filtered) {
                    console.log(toString(f));
                }
            }
            break;
        case 'date':
            let byDate = comments.sort((a, b) => new Date(b.date) - new Date(a.date))
            for (let comment of byDate) {
                console.log(toString(comment));
            }
    }
}

function date(arg) {
    let byDate = comments.sort((a, b) => new Date(b.date) - new Date(a.date))
    for (let comment of byDate) {
        if (new Date(comment.date) >= new Date(arg))
            console.log(toString(comment));
    }
}

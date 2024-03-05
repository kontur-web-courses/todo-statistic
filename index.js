const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

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
        case (command.startsWith("user")):
            let name = command.split(" ")[1];
            user(name);
            break;
        case (command.startsWith("sort")):
            let key = command.split(" ")[1];
            sort(key);
            break;
        case (command.startsWith("date")):
            let dateSrt = command.split(" ")[1];
            date(dateSrt);
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function findTodoInFile(file) {
    let matches = file.matchAll(/\/\/ TODO ([^\n]*)/g);
    let res = []
    for (const m of matches) {
        res.push(m[1]);
    }
    return res;
}

function findTodoInAllFiles(files) {
    let todos = [];
    let todosFromFile;
    for (let file of files) {
        todosFromFile = findTodoInFile(file);
        todos.push(todosFromFile);
    }
    return todos;
}

function show() {
    const comments = findTodoInAllFiles(files).flat();
    showCommentsTable(comments);
}


function important() {
    let comments = findTodoInAllFiles(files).flat();
    comments = comments.filter(val => val.indexOf('!') !== -1);
    showCommentsTable(comments);
}

function sort(key) {
    let comments = findTodoInAllFiles(files).flat();

    if (key === "importance") {
        let imp = comments.filter(val => val.indexOf('!') !== -1);
        imp = imp.sort((a, b) => {
            let aCount = (a.match(/!/g) || []).length;
            let bCount = (b.match(/!/g) || []).length;
            if (aCount > bCount) return -1;
            if (aCount < bCount) return 1;
            return 0;
        });
        let notImp = comments.filter(val => val.indexOf('!') === -1);
        let union = imp.concat(notImp);
        showCommentsTable(union);
    }

    if (key === "user") {
        let users = {};
        let unnamedComments = [];

        comments.forEach(comment => {
            let match = comment.match(/^\s*([^;]+);/);

            if (match && match[1]) {
                let username = match[1].trim().toLowerCase(); // Приводим к нижнему регистру
                if (username in users) {
                    users[username].push(comment);
                } else {
                    users[username] = [comment];
                }
            } else {
                unnamedComments.push(comment);
            }
        });

        let union = Object.keys(users).sort().reduce((acc, key) => {
            return acc.concat(users[key]);
        }, []);

        showCommentsTable(union.concat(unnamedComments));
    }

    if (key.toLowerCase() === "date") {
        const getDateFromComment = (comment) => {
            const match = comment.match(/\d{4}-\d{2}-\d{2}/);
            return match ? new Date(match[0]) : null;
        };

        comments.sort((a, b) => {
            const dateA = getDateFromComment(a);
            const dateB = getDateFromComment(b);

            if (dateA && dateB) {
                return dateB - dateA;
            } else if (dateA) {
                return -1;
            } else if (dateB) {
                return 1;
            } else {
                return 0;
            }
        });
        showCommentsTable(comments);
    }

}

function user(username) {
    let comments = findTodoInAllFiles(files).flat();
    comments = comments.filter(val => val.toLowerCase().indexOf(username.toLowerCase()) !== -1);
    showCommentsTable(comments);
}


function date(dateStr) {
    let comments = findTodoInAllFiles(files).flat();
    const dateComponents = dateStr.split('-');
    const year = parseInt(dateComponents[0], 10);
    const month = dateComponents[1] ? parseInt(dateComponents[1], 10) - 1 : 0; // Месяцы в JavaScript начинаются с 0
    const day = dateComponents[2] ? parseInt(dateComponents[2], 10) : 1;

    const referenceDate = new Date(year, month, day);

    comments = comments.filter(comment => {
        const match = comment.match(/\d{4}-\d{2}-\d{2}/);
        if (match) {
            const commentDate = new Date(match[0]);
            return commentDate >= referenceDate;
        }
        return false;
    });

    showCommentsTable(comments);
}

function showCommentsTable(comments) {
    console.log("!".padEnd(1) + "|" + "user".padEnd(10) + "|" + "date".padEnd(10) + "|" + "comment".padEnd(50));
    console.log("-".repeat(74));

    for (let comment of comments) {
        const matchImportance = comment.match(/!+/);
        const matchDate = comment.match(/\d{4}-\d{2}-\d{2}/);
        const matchUser = comment.match(/^\s*([^;]+);/);

        const importance = matchImportance ? '!' : '';
        let user = matchUser ? matchUser[1].trim() : '';
        let date = matchDate ? matchDate[0] : '';

        if (importance) {
            comment = comment.replace(matchImportance[0], '');
        }
        if (user) {
            comment = comment.replace(user, '').replace(';', '');
        }
        if (date) {
            comment = comment.replace(matchDate[0], '').replace(';', '').trim();
        }

        if (comment.length > 50) {
            comment = comment.substring(0, 50 - 3) + "...";
        }

        if (user.length > 10) {
            user = user.substring(0, 10 - 3) + "...";
        }

        if (date.length > 10) {
            date = date.substring(0, 10 - 3) + "...";
        }

        console.log(`${importance.padEnd(1)}|${user.padEnd(10)}|${date.padEnd(10)}|${comment.padEnd(50)}`);
    }
}


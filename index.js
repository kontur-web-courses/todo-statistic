const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function countExclamationMarks(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '!') {
            count++;
        }
    }
    return count;
}

function exclamationMarksCompare(a, b) {
    const countA = countExclamationMarks(a);
    const countB = countExclamationMarks(b);
    return countB - countA;
}

function dateCompare(a, b) {
    let todoSplitA = a.split(';', 3);
    let todoSplitB = b.split(';', 3);

    if (todoSplitA.length !== 3) {
        return 1;
    }
    if (todoSplitB.length !== 3) {
        return -1;
    }
    s
    let dateA = new Date(todoSplitA[1].trim());
    let dateB = new Date(todoSplitB[1].trim());
    return dateA - dateB;
}

function processCommand(command) {
    let commandSplit = command.split(' ');
    let name = ''
    command = commandSplit[0];
    if (commandSplit.length > 0) {
        name = commandSplit[1]
    }
    switch (command) {
        case 'sort':
            let todo = parseToDo();
            switch (name) {
                case "importance":
                    todo.sort((a, b) => exclamationMarksCompare(a, b));
                    console.log(todo);
                    break;
                case "date":
                    todo.sort((a, b) => dateCompare(a, b))
                    console.log(todo)
                    break;
                case 'user':
                    let users_and_comments = {};
                    let anon = [];
                    let info = parseToDo();
                    for (const todo of info) {
                        let todoSplit = todo.split(';', 3);

                        if (todoSplit.length !== 3)
                            continue;

                        let user = todoSplit[0].slice(todoSplit[0].indexOf('TODO ') + 5)
                        let comment = todoSplit[2].trim();
                        if (user === 'Anonymous Developer')
                        {
                            anon.push(comment)
                            continue;
                        }

                        if (!users_and_comments[user]) {
                            users_and_comments[user] = [];
                        }
                        users_and_comments[user].push(comment);
                    }
                    users_and_comments['Anonymous Developer'] = anon;
                    console.log(users_and_comments);
                    break;
                default:
                    console.log('wrong command');
            }
        case 'user':
            for (const todo of parseToDo()) {
                let todoSplit = todo.split(';', 3);

                if (todoSplit.length !== 3)
                    continue;

                let user = todoSplit[0].slice(todoSplit[0].indexOf('TODO ') + 5)
                let date = todoSplit[1].trim();
                let comment = todoSplit[2];

                if (user.toLowerCase() === name.toLowerCase()) {
                    console.log(todo);
                }
            }
            break;
        case 'show':
            console.log(parseToDo());
            break;
        case 'important':
            for (const todo of parseToDo()) {
                if (todo.indexOf('!') !== -1)
                    console.log(todo);
            }
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function parseToDo() {
    const regexp = /\/\/ TODO [\w\W]*/;
    const todoComments = [];

    for (const file of files) {
        for (const line of file.split('\r\n')) {
            if (regexp.test(line)) {
                todoComments.push('//' + line.split('//')[1]);
            }
        }
    }
    return todoComments;
}
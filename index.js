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
    const arg = command.split(' ');
    let mas = show();
    switch (arg[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            mas = show();
            for (let todo of mas) {
                console.log(todo);
            }
            break;
        case 'important':
            mas = show();
            showImportant(mas)
            break;
        case 'sort':
            mas = show();
            switch (arg[1]) {
                case 'importance':
                    let sorted = sortByImportance(mas)
                    for (let todo of sorted) {
                        console.log(todo);
                    }
                    break;
                case 'user':
                    let users = findUsers();
                    for(let user in users){
                        let todos = mas.filter(x=>x.split(";")[0].trim().toLowerCase() === user)
                        for (let todo of todos) {
                            console.log(todo);
                        }
                    }
                    let todos = mas.filter(x=> !(x.split(";")[0].trim().toLowerCase() in users))
                    for (let todo of todos) {
                        console.log(todo);
                    }


                    break
                case 'date':
                    break
                default:
                    break;
            }

            break;
        case 'user':
            let name = arg[1].toLowerCase();
            let users = findUsers();
            if (name in users) {
                for (let comment of users[name]) {
                    console.log(comment);
                }
            } else {
                console.log("User not find")
            }
            break;
        case 'date':
            let date = Date.parse(arg[1])
            let dates = findDates(date);
            for (let comment of dates) {
                console.log(comment);
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function findDates(date) {
    let data = show();
    let comments = [];
    for (comment of data) {
        let parseData = comment.split(";")
        if (parseData.length > 2) {
            let d = Date.parse(parseData[1].trim());
            if(d - date>0 )
            {
                comments.push(parseData[2].trim())
            }

        }
    }
    return comments;
}

function findUsers() {
    let data = show();
    let users = {};
    for (comment of data) {
        let parseData = comment.split(";")
        if (parseData.length > 2) {
            let user = parseData[0].trim().toLowerCase();
            if (!(user in users)) {
                users[user] = []
            }
            users[user].push(parseData[2].trim())
        }
    }
    return users;
}

function show() {
    let todoLines = [];
    for (let file of files) {
        for (let line of file.split("\n")) {
            let index = line.indexOf("// TODO ");
            if (index !== -1) {
                todoLines.push(line.slice(index + 8));
            }
        }
    }
    return todoLines;
}


// TODO you can do it!
function showImportant(todoLines) {
    for (let line of todoLines) {
        if (line.includes('!')) {
            console.log(line);
        }
    }
}

function sortByImportance(todoLines) {
    return todoLines.sort((a, b) => (b.split('').filter(x => x === '!').length - a.split('').filter(x => x === '!').length));
}
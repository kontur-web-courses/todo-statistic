const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTodos() {
    let allTodos = []
    for (let code of files) {
        for (let s of code.split('\n')) {
            if (s.includes("// TODO")) {
                let start = s.indexOf("/");
                allTodos.push(s.substring(start));
            }
        }
    }
    return allTodos;
}

function getImportant() {
    let allTodos = getAllTodos();
    let importantTodos = []
    for (let line of allTodos) {
        if (line.includes("!"))
            importantTodos.push(line);
    }
    return importantTodos;
}

function getUserTodos() {
    let allTodos = getAllTodos();
    let usersTodos = {};
    for (let todo of allTodos) {
        if (todo.includes(";")) {
            const user = todo.split(';')[0].split('TODO ')[1].toLowerCase();
            if (usersTodos[user] !== undefined)
                usersTodos[user].push(todo);
            else usersTodos[user] = [todo];
        }
    }
    return usersTodos;
}

function getSort(arg) {
    switch (arg) {
        case 'importance':
            return sortByImportance();
        case 'user':
            return sortByValue(getUserTodos);
        case 'date':
            return sortByDate();
    }
}

function sortByImportance() {
    let allTodos = getAllTodos();
    let todosByImportance = getImportant();
    for (let line of allTodos) {
        if (!todosByImportance.includes(line))
            todosByImportance.push(line);
    }
    return todosByImportance;
}

function sortByValue(func) {
    let byValueTodos = func();
    let todosByValue = [];
    for (let todo of Object.values(byValueTodos))
        todosByValue = todosByValue.concat(todo);
    return todosByValue;
}

function sortByDate() {
    let userTodos = sortByValue(getUserTodos);
    return userTodos.sort((a, b) => new Date(a.split(';')[1]) - new Date(b.split(';')[1]))
}

function makeTable(todosList) {
    console.log(`  !  |  ${'user'.padEnd(10)}  |  ${'date'.padEnd(10)}  | comment`);
    console.log(`${'-'.repeat(86)}`)
    for (let line of todosList) {
        let splittedLine = line.replaceAll('; ', '|').split('|');
        if (splittedLine.length !== 3) {
            console.log(`     |  ${"".padEnd(10)}  |  ${"".padEnd(10)}  |  ${splittedLine[0].padEnd(50)}`);
            continue;
        }
        let user = splittedLine[0].replaceAll("// TODO ", "");
        let date = splittedLine[1];
        let comment = splittedLine[2];
        let isImportant = comment.includes("!");

        let userToWrite = user.length <= 10 ? user.padEnd(10) : (user.substring(0, 7) + '...').padEnd(10);
        let commentToWrite = comment.length <= 50 ? comment.padEnd(50) : (comment.substring(0, 46) + '...').padEnd(50);
        console.log(`  ${isImportant ? "! " : "  "} |  ${userToWrite}  |  ${date}  |  ${commentToWrite}`);
    }
}

    function getTodosAfterDate(date) {
        let todosByTime = sortByDate();
        return todosByTime.filter(a => date < new Date(a.split(';')[1]))
    }

    function processCommand(command) {
        let splitedCommand = command.split(' ');
        switch (splitedCommand[0]) {
            case 'date':
                let date = new Date(splitedCommand[1]);
                makeTable(getTodosAfterDate(date))
                break;
            case 'sort':
                let arg = splitedCommand[1];
                makeTable(getSort(arg));
                break;
            case 'user':
                let user = splitedCommand[1].toLowerCase();
                makeTable(getUserTodos()[user])
                break;
            case 'important':
                makeTable(getImportant());
                break;
            case 'show':
                makeTable(getAllTodos());
                break;
            case 'exit':
                process.exit(0);
                break;
            default:
                console.log('wrong command');
                break;
        }
}

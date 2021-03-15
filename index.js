const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = [];

console.log('Please, write your command!');
readLine(processCommand);
getTodos();

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let c = command.indexOf('user');
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(todos);
            break;
        case 'important':
            console.log(todos.filter(x => x.includes('!')))
            break;
        case command.match(/user \w+/) ? command : undefined:
            let [_, userName] = command.split(' ');
            console.log(todos.filter(x => x.includes(userName)));
            break;
        case 'sort importance':
            console.log(sortByImportance());
            break;
        case 'sort user':
            console.log(sortByUser());
            break;
        case 'sort date':
            console.log(sortByDate());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function sortByImportance() {
    todos.sort(compareImportance)
    return todos
}

function compareImportance(line, line2) {
    let inFirst = (line.match(/!/g) || []).length;
    let inSecond = (line2.match(/!/g) || []).length;
    return inSecond - inFirst;
}

function sortByUser() {
    const withUser = todos.filter(x => hasUser(x));
    const withoutUser = todos.filter(x => !hasUser(x));
    withUser.sort();
    return withUser.concat(withoutUser);
}

function hasUser(line) {
    const parts = line.split(" ");
    return (isNaN(+parts[2][0])) && (parts[2].endsWith(';'));
}

function hasDate(line) {
    const probableData = Date.parse(line.split("; ")[1]);
    return !isNaN(probableData);
}

function sortByDate() {
    const withDate = todos.filter(x => hasDate(x));
    const withoutDate = todos.filter(x => !hasDate(x));
    withDate.sort(
        (line, line2) => {
            const fromFirst = new Date(Date.parse(line.split("; ")[1]));
            const fromSecond = new Date(Date.parse(line2.split("; ")[1]));
            return fromFirst > fromSecond;
        }
    );
    return withDate.concat(withoutDate);
}

function getTodos () {
    for (const file of files) {
        const filesLines = file.split('\r\n');
        for (const line of filesLines) {
            if (line.startsWith('// TODO ')) {
                todos.push(line);
            }
        }
    }
}

// TODO you can do it!

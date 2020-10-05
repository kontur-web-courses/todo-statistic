const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
// 1
const toDos = getTODO();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

// 1
function getTODO() {
    return files
        .map(file => file.match(/\/\/.todo.*/gi))
        .flat();
}

// 3,4
function showSelectedToDo(selectedItem) {
    return toDos
        .filter(toDo => toDo.toLowerCase().includes(selectedItem.toLowerCase()));
}

// 4
function getUsersComment(username) {
    let commentsOfUser = showSelectedToDo(username);
    if (commentsOfUser.length > 0) {
        for (let toDo of commentsOfUser)
            console.log(toDo);
    } else {
        console.log('Пользователь не найден!');
    }
}

function countAllEntries(str, word) {
    let pos = 0;
    let count = 0;
    while (true) {
        let foundPos = str.indexOf(word, pos);
        count++;
        if (foundPos === -1) break;
        pos = foundPos + 1;
    }
    return count;
}

// 5
function getSortedImportant(word) {
    return toDos
        .sort((a, b) => countAllEntries(b,word) - countAllEntries(a,word));
}

function getLastIndex(symbol) {
    let lastIndex = -1;
    for (let i = toDos.length - 1; i > 0; i--)
        if (toDos[i].includes(symbol)) {
            lastIndex = i;
            break;
        }
    return lastIndex;
}

// 5
function getDateOfToDo(toDo, symbol) {
    let firstIndex = toDo.indexOf(symbol);
    let lastIndex = toDo.lastIndexOf(symbol);
    let date = toDo.slice(firstIndex + 1,lastIndex).replace(/\s+/g, '');
    return new Date(Date.parse(date)).getTime();
}

// 5
function getSorted(symbol, func) {
    toDos.sort((a, b) => countAllEntries(b,symbol) - countAllEntries(a,symbol));
    let allToDos = toDos.slice();
    let index = getLastIndex(symbol) + 1;
    let arrayToSort = allToDos
        .splice(0,index)
        .sort(func);
    return arrayToSort.concat(allToDos);
}

// 5
function sortToDo(command) {
    switch (command) {
        case 'importance':
            for (let toDo of getSortedImportant('!'))
                console.log(toDo);
            break;
        case 'user':
            let sortByUser = getSorted(';',((a,b) => a.localeCompare(b, 'en')));
            for (let toDo of sortByUser)
                console.log(toDo);
            break;
        case 'date':
            let sortByDate = getSorted(';', ((a,b) => getDateOfToDo(b, ';') - getDateOfToDo(a,';')));
            for (let toDo of sortByDate)
                console.log(toDo);
            break;
        default:
            console.log('Неправильная команда sort!');
            break;
    }
}

function processCommand(command) {
    let commands = command.split(' ');
    switch (commands[0]) {
        case 'exit':
            process.exit(0);
            break;
        // 2
        case 'show':
            for (let toDo of toDos)
                console.log(toDo);
            break;
        // 3
        case 'important':
            for (let toDo of showSelectedToDo('!'))
                console.log(toDo);
            break;
        // 4
        case 'user':
            (commands.length > 1) ? getUsersComment(' ' + commands[1] + ';')
                : console.log('Вы не ввели имя пользователя!');
            break;
        // 5
        case 'sort':
            sortToDo(commands[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

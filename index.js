const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');
const {userTODO} = require('./userTODO');
const {sort} = require('./sort');
const {afterDate} = require('./afterDate');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(line) {
    let [command, argument] = line.split(' ');
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTODO();
            break;
        case 'important':
            importantTODO();
            break;
        case 'user':
            showUsersTODO(argument);
            break;
        case 'sort':
            if (checkArg(argument, `Команда sort должна соответствовать виду 'sort {importance | user | date} 
            \n Вы ввели строку ${line}'`))
                sortTODO(argument)
            break;
        case 'date':
            afterDateTODO(argument);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function createTODOArray() {
    let regex = /\/\/ TODO.*/gi; // TODO{...}
    return files.map(file => file.match(regex)).flat().filter(string => string);
}

function showTODO() {
    let todoArray = createTODOArray();
    console.log(todoArray);
}

function importantTODO() {
    let todoArray = createTODOArray()
        .filter(string => string.includes('!'))
        .filter(arr => arr.length > 0);
    console.log(todoArray);
}

function showUsersTODO(username) {
    let regex = `[\s:;]*${username};`; // TODO {user}; {date}; {info}
    regex = new RegExp(regex, "gi");
    let todoArray = createTODOArray()
        .filter(str => str.match(regex))
    console.log(todoArray);
}

function afterDateTODO(date) {
    let todoArray = createTODOArray();
    let datePattern = /(\d{4})|(\d{4})-(\d{2})|(\d{4})-(\d{2})-(\d{2})/gi;
    todoArray = todoArray.filter(string => new Date(string.match(datePattern)) >= new Date(date));

    datePattern = /(\d{4})?-?(\d{2})?-?(\d{2})/gi;
    todoArray.sort((a, b) => {
        return (new Date(b.match(datePattern)) - new Date(a.match(datePattern)));
    })

    console.log(todoArray);
}

function sortTODO(argument) {
    let todoArray = createTODOArray();
    switch (argument) {
        case 'importance':
            todoArray.sort((a, b) => {
                return (b.match(/!/gi) || []).length - (a.match(/!/gi) || []).length;
            })
            console.log(todoArray);
            break;
        case 'user':
            let userPattern = /\/\/ TODO[\s:;]*(\w+);/gi;

            break;
        case 'date':
            let datePattern = /(\d{4})?-?(\d{2})?-?(\d{2})/gi; // TODO 2020-09
            // TODO 2019-08-21
            // TODO 2018-07
            // It's working!
            todoArray.sort((a, b) => {
                return (new Date(b.match(datePattern)) - new Date(a.match(datePattern)));
            })
            console.log(todoArray);
    }
}

function checkArg(argument, errorMessage) {
    if (!argument || (argument !== 'importance' && argument !== 'user' && argument !== 'date'))
        throw new Error(errorMessage);
    return true;
}

function getInfo(todo) {
    return [
        string.importance > 0 ? '!' : '',


    ];
}

function convertStringToTODOObject(arr) {

}

function printTable(arr) {
    let table = [];
    const header = ['!', 'user', 'date', 'comment', 'file'];

    table.push(header);
    for (let string of arr)
        table.push(getInfo(string));


}

// TODO you can do it!

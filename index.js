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
        case /sort.*/.test(command):
            sortTODOs(command);
            break;
        case /user.*/.test(command):
            showUser(command);
            break;
        case /exit/.test(command):
            process.exit(0);
            break;
        case /show/.test(command):
            showTODOs();
            break;
        case /important/.test(command):
            showImportant();
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOs() {
    const todos = [];
    files.forEach(file => {
        file.split('\r\n').forEach(line => {
            const indexTODO = line.indexOf('// TODO');
            if (indexTODO !== -1)
                todos.push(line.slice(indexTODO))
        })
    });
    return todos;
}

function showTODOs() {
    getTODOs().forEach(element => console.log(element))
}

function showImportant() {
    files.forEach(file => {
        file.split('\r\n').forEach(line => {
            const indexTODO = line.indexOf('// TODO');
            const indexShout = line.indexOf('!');
            if (indexTODO !== -1 && indexShout !== -1)
                console.log(line.slice(indexTODO))
        })
    });
}

function showUser(command) {
    files.forEach(file => {
        file.split('\r\n').forEach(line => {
            const indexTODO = line.indexOf('// TODO');
            const indexUsername = line.toLowerCase().indexOf(command.split(' ')[1].toLowerCase());
            if (indexTODO !== -1 && indexUsername !== -1)
                console.log(line.slice(indexTODO))
        })
    });
}

function sortTODOs(command) {
    const todos = getTODOs();
    important = command.includes('importance');
    user = command.includes('user');
    date = command.includes('date');
    todos.sort(function(comment1, comment2) { return -comparer(comment1, comment2);});
    console.log(todos)
}

let important = false;
let user = false;
let date = false;

function comparer(comment1, comment2)
{
    if(important)
    {
        let result = importantComparer(comment1, comment2);
        if(result !== 0)
            return result;
    }

    if(user)
    {
        let result = userComparer(comment1, comment2);
        if(result !== 0)
            return result;
    }

    if(date)
    {
        let result = userComparer(comment1, comment2);
        return result;
    }
}

function dateComparer(comment1, comment2)
{
    let date1 = new Date(comment1);
    let date2 = new Date(comment2);

    return date1>date2 ? 1 : date1<date2 ? -1 : 0;
}

function importantComparer(comment1, comment2)
{
    return countSymbol('!', comment1) -  countSymbol('!', comment2);
}

function userComparer(comment1, comment2)
{
    if(isSpecialRazmetka(comment1) && isSpecialRazmetka(comment2))
    {
        return compareStrings(comment1.toLowerCase(), comment2.toLowerCase());
    }
    else if(isSpecialRazmetka(comment1))
    {
        return 1;
    }
    else if(isSpecialRazmetka(comment2))
    {
        return -1;
    }
    else
    {
        return 0;
    }
}

function compareStrings(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

function isSpecialRazmetka(comment)
{
    return comment.match(/\{.*?}; \{.*?}; \{.*?}/gi);
}

function getUser(comment)
{
    return comment.split(';')[0].split(' ')[2];
}

function countSymbol(symbol, str)
{
    let answer = 0;
    for(let i=0; i<str.length; ++i)
    {
        if(str[i]==symbol)
            ++answer;
    }
    return answer;
}
// TODO you can do it!

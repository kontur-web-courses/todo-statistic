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
    args = command.split(' ')
    switch (args[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log((getToDo()))
            break;
        case 'important':
            console.log(getImportantToDo())
            break
        case 'user':
            console.log(getUserToDo(args[1]))
            break
        case 'sort':
            console.log(getUserToDoSort(args[1]))
            break
        default:
            console.log('wrong command');
            break;
    }
}
function getUserToDoSort(action){
    switch (action)
    {
        case 'importance':
            return getSortedImportantToDo()
        case 'user':
            return getSortedUserToDo()
        case 'date':
            return dateToDo()
    }
}
function dateToDo(){
    let todos = getToDo()
    let arrNotSortedDates = []
    let arrSortedDates = []
    let res = []
    for (let i = 0; i<todos.length;i++)
        arrNotSortedDates.push(todos[i].split(';')[1])
    for (let i = 0; i<arrNotSortedDates.length;i++)
        arrNotSortedDates[i] = new Date(arrNotSortedDates[i])
    for (let i = 0; i<arrNotSortedDates.length;i++)
        arrSortedDates.push(arrNotSortedDates[i])
    arrSortedDates.sort(function(a,b){return b.getTime() - a.getTime()})
    for (let i = 0; i<arrSortedDates.length;i++)
        for(let j = 0; i<arrNotSortedDates.length;j++)
        if (arrSortedDates[i]===arrNotSortedDates[j])
        {
            res.push(todos[j])
            break}
    return res
}
function getToDo(){
    let result = []
    for (let i of files)
        for (let j of i.split('\n')) {
            let match = j.match(/\/\/ TODO .*/)
            if (match)
                result.push(match[0])
        }
    return result
    }
function getImportantToDo(){
    let todos = getToDo()
    let arr = []
    for (let i =0; i<todos.length;i++)
        if (todos[i].indexOf('!')>-1)
            arr.push(todos[i])
    return arr
}
function getSortedImportantToDo(){
    let res = []
    let dopImp = []
    let arr = getImportantToDo()
    let importantArr = []
    for (let i =0; i<arr.length;i++)
        importantArr.push(arr[i].split('!').length-1)
    for (let i =0; i<importantArr.length;i++)
        dopImp.push(importantArr[i])
    for (let i=0;i<importantArr.length;i++){
        let max = getMaxOfArray(dopImp)
        let ind = importantArr.indexOf(max)
        res.push(arr[ind])
        dopImp.splice(ind,1)
    }
    let todos = getToDo()
    for (let i = 0;i<todos.length;i++)
        if (res.indexOf(todos[i])<=-1)
                res.push(todos[i])
    return res
}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray)
}
function getUserToDo(name){
    let todos = getToDo()
    let arrLow = []
    for (let i = 0; i<todos.length;i++)
        arrLow.push(todos[i].toLowerCase())
    let arr = []
    for (let i =0; i<todos.length;i++)
        if (arrLow[i].split(';')[0].split(' ')[2].toLowerCase().indexOf(name)>-1)
            arr.push(todos[i])
    return arr
}
function getSortedUserToDo(){
    let todos = getToDo()
    let arrNames = []
    let res = []
    let sortedArrNames = []
    for (let i = 0; i<todos.length;i++)
        arrNames.push(todos[i].split(';')[0].split(' ')[2].toLowerCase())
    sortedArrNames = unique(arrNames)
    for (let i = 0; i<sortedArrNames.length;i++){
        let arr = getUserToDo(sortedArrNames[i])
        for (let i = 0; i<arr.length;i++)
            res.push(arr[i])}
    return res
}
function unique(arr) {
    let result = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}
// TODO you can do it!

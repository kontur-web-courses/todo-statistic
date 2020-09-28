const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

const allToDo = getAllTODO(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let commandSecondItem = command.substring(5,command.length);
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            consoleLogArrays(allToDo);
            break;
        case 'important' :
            for(let todo of allToDo)
                if(todo.indexOf('!') != -1)
                    console.log(`important : ${todo}`);
            break;
        case `user ${commandSecondItem}` :
            getUsersTODO(commandSecondItem);
            break;
        case `sort ${commandSecondItem}` :
            getSortTODO(commandSecondItem);
        default:
            console.log('wrong command');
            break;
    }
}

function getSortTODO(command)
{
    switch(command)
    {
        case `importance`:
            getSortImportanceTODO();
        case `user`:
            
        case `date`:
            getSortByDate();
        default:
            break;
    }
}

function getSortByDate () {
    let sortedList = allToDo.slice();
    sortedList.sort((a,b) => a-b);
    consoleLogArrays(sortedList);
}

function getSortImportanceTODO(){
    let re = new RegExp('!');
    let iCommentsMap = new Map();
    for (let todo of allToDo){
        iCommentsMap.set(todo, re.matchAll(todo).length);
    }
    let iComments = [...iCommentsMap].sort((a,b) => a-b);
    consoleLogArrays(iComments);
}

function getUsersTODO(command){
    for (let todo of allToDo){
        let todoArr = todo.split(';');
        if(todoArr[0].toLowerCase() === command.toLowerCase())
            console.log(`user ${todoArr[0]} : ${todoArr[2]}`);
    }
}

function getAllTODO (files){
    let allTODO = [];
    for (let file of files)
    {
        let lines = file.split('\n');
        for(let i = 0; i < lines.length; i++)
            if(lines[i].substring(0, 7) === '// TODO')
                allTODO.push(lines[i].substring(8, lines[i].length));
    }
    return allTODO;
}

function consoleLogArrays(arr){
    for(let el of arr)
        console.log(el);
}
// TODO you can do it!

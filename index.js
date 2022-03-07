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
    switch (arg[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log();
            let d = ToDoFind();
            if (d.length !== 0) {
                console.log(d.join('\n\n'));
            }
            break;
        case 'important':
            console.log();
            let imp = ImportantFind();
            if (imp.length !== 0){
                console.log(imp.join('\n\n'));
            }
            break;
        case 'user':
            console.log();
            let name = arg[1].toLowerCase();
            let nameList = NameFind(name);
            if (nameList.length !== 0){
                console.log(nameList.join('\n\n'));
            }
            break;
        case 'sort':
            console.log();
            let sort = DataFind(arg[1]);
            if (sort.length !== 0){
                console.log(sort.join('\n\n'));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function ToDoFind(){
    let list = [];
    for (let f of files) {
        for (let line of f.split('\n')){
            let index = line.indexOf('// TODO ')
            if (index !== -1) {
                list = list.concat(line.substring(index));
            }
        }
    }
    return list;
}

function ImportantFind(){
    let list  = ToDoFind();
    let impList = [];
    for (let line of list){
        if (line.indexOf('!') !== -1){
            impList = impList.concat(line);
        }
    }
    return impList;
}

function NameFind(name){
    let list = ToDoFind();
    let nameList = [];
    for (let line of list){
        if (line.indexOf(`;`) !== -1){
            let splitLine = line.split(';');
            let nameToLower = splitLine[0].slice(8).toLowerCase();
            if (nameToLower === name) {
                nameList = nameList.concat(splitLine[2].slice(1));
            }
        }
    }
    return nameList;
}

function DataFind(arg){
    let list  = ToDoFind();
    if (arg === 'importance'){
        return list.sort((x, y) => y.split('').filter(t => t === '!').length
            - x.split('').filter(t => t === '!').length);
        }
    else if (arg === 'user'){
        return list.sort( (x,y) => x.split(';')[0].toLowerCase() < y.split(';')[0].toLowerCase()
            ? -1 : x.split(';')[0].toLowerCase() > y.split(';')[0].toLowerCase() ? 1 : 0)
            .sort((x,y) => y.split(';').length - x.split(';').length);
    }
    else if (arg === 'date'){
         return  list.sort( (x,y) => x.split(';')[1] < y.split(';')[1]
            ? 1 : x.split(';')[1] > y.split(';')[1] ? -1 : 0)
            .sort((x,y) => y.split(';').length - x.split(';').length);
    }
}
// TODO you can do it!

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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTODO().join('\r\n'));
            break;
        case 'important':
            console.log(getImportantTODO().join('\r\n'));
            break;
        case command.startsWith('user ') ? command : true:
            console.log(getTODOByName(command.split(' ')[1]).join('\r\n'));
            break;
        case command.startsWith('sort ') ? command : true:
            console.log(getSortedTODO(command.split(' ')[1]).join('\r\n'));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function getTODO(){
    let filesLines = files.map(file => file.split('\r\n'));
    return filesLines.map(lines => lines.filter(s => s.startsWith('// TODO '))).flat();
}

function getImportantTODO(){
    return getTODO().filter(s => s.indexOf('!') >= 0);
}

function getTODOByName(name){
    return getTODO().filter(s => {
        let start = s.slice(0, s.indexOf(';'));
        return start.toLowerCase().indexOf(name.toLowerCase()) >= 0;
    });
}

function getSortedTODO(sort){
    switch (sort){
        case 'important':
            return compare(getTODO(), x => x.match(/!/g) ? x.match(/!/g).length : 0);
        case 'user':
            return compare(getTODO(), x => x.indexOf(';') >= 0
                ? x.slice(0, x.indexOf(';')).split(' ')[2].toLowerCase() : "");
        case 'date':
            return compare(getTODO(), x => getDate(x));
        default:
            console.log('wrong command');
            break;
    }
}

function compare(info, funk){
    return info.sort((a, b) => {
        let c = funk(a);
        let d = funk(b);
        if (c === d){
            return 0;
        }
        if (c > d){
            return -1;
        } else {
            return 1;
        }
    });
}

function getDate(str){
    let date = str.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g);
    if (!date)
        return new Date(0,0,0);
    date = date[0].split('-');
    return new Date(date[0], date[1] - 1, date[2]);
}



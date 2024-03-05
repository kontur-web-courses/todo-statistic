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
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printArray(getTODOLines());
            break;
        case 'important' :
            printArray(getImportantLines(getTODOLines()));
            break;
        case 'user':
            let user = command.split(' ')[1];
            printArray(getUserLines(getFormatLines(getTODOLines()), user));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTODOLines()
{
    const todoLine = 'TODO';
    chosenLines = new Array();
    for(let file of files){
        let lines = file.split('\n');
        for(let line of lines){
            const index = line.indexOf(`// ${todoLine}`)
            if(index !== -1){
                chosenLines.push(line.substring(index));
            }
        }
    }
    return chosenLines;
}

function getImportantLines(lines){
    const res = new Array();
    for(const line of lines){
        if(line.indexOf('!') !== -1){
            res.push(line);
        }
    }
    return res;
}

function printArray(arr){
    for(const item of arr){
        console.log(item);
    }
}

function getFormatLines(lines) {
    let formatLines = new Array();
    for (const line of lines) {
        let data = {
            line : line,
            user : '',
            date : '',
            text : '',
            important : false
        };
        let a = line.split(";");
        if (a.length - 1 === 2) {
            data.user = a[0].split('TODO ')[1].toLowerCase();
            data.date = a[1];
            data.text = a[2];
        }
        if(line.indexOf('!') !== -1){
            data.important = true;
        }
        formatLines.push(data);
    }
    return formatLines;
}

function getUserLines(formatLines, user) {
    let result = new Array();
    for (const line of formatLines) {
        if (line.user === user.toString().toLowerCase()) {
            result.push(line.line);
        }
    }
    return result;
}
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
    let c = command.split(' ')[0];
    switch (c) {
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
        case 'user':
            let name = command.replace("user ", "");
            let comments = UserName(name);
            if (comments.length !== 0) {
                console.log(comments.join('\n\n'));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function ToDoFind() {
    let list = [];
    for (let f of files) {
        for (let line of f.split('\n')) {
            let index = line.indexOf('// TODO ')
            if (index !== -1) {
                let todo = line.substring(index).replaceAll(';', '; ').replaceAll('  ', ' ');
                list.push(todo);
            }
        }
    }
    return list;
}

function TakeName(str){
    if (str.indexOf(';')!==-1)
        return  str.replace("// TODO ", "").split(';')[0];
    return '';
}

function UserName(name) {
    let data = ToDoFind();
    let list = [];
    for (let f of data) {
        let takedName = TakeName(f);
        if (takedName === name)
            list.push(f);
        }
    return list;
}

// TODO you can do it!

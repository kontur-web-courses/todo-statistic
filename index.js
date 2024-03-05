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
    let args = command.split(' ').slice(1);
    let arg = args[0]
    let commands = command.split(' ')[0];
    switch (commands) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show(); 
            break;
        case 'user':
            user(arg);
            break;
        case "important":
            important();
            break;
        case 'sort':
            sort(arg);
            break
        case 'date':
            date(arg);
            break;
        default:
            console.log('wrong command');
            break;
    }
}






function show() {
    console.log(getToDos());
}

function getToDos() {
    const list = getFiles();
    return list.flatMap(x => x.match(/\/\/ TODO.*/g) || []);
}


function user(username) {
    files.map(x => x.match(new RegExp(`\/\/ TODO ${username};.*;.*`, 'gi')))
        .reduce((a, b) => b === null ? a : a.concat(b), [])
        .forEach(x => console.log(x));
}

function important() {
    const list = getFiles();
    list.flatMap(x => x.match(/\/\/ TODO.*!.*/g) || [])
        .forEach(x => console.log(x));
}

function sort(arg) { 
    let todos = getToDos()
    switch (arg) {
        case "important":
            {
                let list = getFiles();
                important();
                list.map(x => x.match(/\/\/ TODO[^!\r\n]+\r/g)).reduce(function (a, b) {
                    return b === null ? a : a.concat(b);
                }, []).sort((a, b) => a.split('!').length < b.split('!').length)
                    .forEach(x => console.log(x));
                break;
            }
        
        case 'user':
            {
                return todos.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                    .sort((a, b) => b.split(";").length - a.split(";").length).forEach(x => console.log(x));
                break;
            }

        case 'date':
            {
                break
            }

    }
}
// TODO you can do it!



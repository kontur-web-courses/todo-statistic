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
    let command_name = command.split(' ')[0];
    let args = command.split(' ').slice(1);
    switch (command_name) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'sort':
            console.log(args[0])
            sort(args[0]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function all_todos() {
    let list = getFiles();
    return list.map(x => x.match(/\/\/ TODO.*/g)).reduce(function (a, b) {
        return a.concat(b);
    }, [])
}


function show() {
    let list = getFiles();
    list.map(x => x.match(/\/\/ TODO.*/g)).reduce(function (a, b) {
        return a.concat(b);
    }, []).forEach(x => console.log(x));
}

function important() {
    let list = getFiles();
    list.map(x => x.match(/\/\/ TODO.*!.*/g)).reduce(function (a, b) {
        return b === null ? a : a.concat(b);
    }, []).forEach(x => console.log(x));
}


function sort(arg) {
    let all = all_todos();
    switch (arg) {
        case 'importance':
        {
            let list = getFiles();
            important();
            list.map(x => x.match(/\/\/ TODO[^!\r\n]+\r/g)).reduce(function (a, b) {
                return b === null ? a : a.concat(b);
            }, []).sort((a, b) => a.split('!').length < b.split('!').length).forEach(x => console.log(x));
            break;
        }
        case 'date':
        {
            let withDate = all.filter((el) => el.split(";").length === 3);
            let withoutDate = all.filter((el) => el.split(";").length !== 3);
            withDate
                .sort((a, b) => {
                    a = new Date(a.split(";")[1]);
                    b = new Date(b.split(";")[1]);
                    return a > b ? -1 : a < b ? 1 : 0;
                })
                .concat(withoutDate).forEach(x => console.log(x));
            break;
        }
        case 'user':
        {
            return all
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                .sort((a, b) => b.split(";").length - a.split(";").length).forEach(x => console.log(x));
        }
    }
}

// TODO you can do it!
// sort importance
// sort date

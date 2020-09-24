const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function searchTODO() {
    let arr = [];
    files.forEach(file => {
        let pos = 0;
        while (file.indexOf('// TODO', pos) != -1) {
            let r = file.indexOf('// TODO', pos);
            let t = file.indexOf('\n', r);
            pos = r + 1;
            if (file[r - 2] != '(') {
                arr.push(file.slice(r, t));
            }
        }
    });
    return arr;
}
function getCount(str) {
    let i = 0;
    for (let s of str) {
        if (s === '!') i++;
    }
    return i;
}

function showTODO(object) {
    let str = "";
    for (item in object) {
        if (item != 'full' && item != 'count') {
            str += ' ' + object[item];
        }
    }
    console.log(str);
}

function createTODOList(arr) {
    let result = [];
    for (let item of arr) {
        let s = item.split(';');
        let [todo_name, date, text] = s;
        if (date) {
            result.push({
                todo: todo_name.split(' ')[1],
                name: todo_name.split(' ')[2],
                date,
                text,
                full: true,
                count: getCount(text),
            });
        }
        else {
            result.push({
                todo: todo_name,
                full: false,
                count: getCount(todo_name)
            });
        }
    }
    return result;
}

function processCommand(command) {
    let name = command.split(' ')[1];
    let arr = createTODOList(searchTODO());
    let result = arr;
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show': {
            break;
        }
        case 'important': {
            result = arr.filter(e => e.count != 0);
            break;
        }
        case `user ${name}`: {
            result = arr.filter(e => e.name === name);
            break;
        }
        case 'sort importance': {
            result = arr.sort((a, b) => b.count - a.count);
            break;
        }
        case 'sort user': {
            result = arr.sort((a, b) => {
                if (a.name === b.name) return 0;
                if (a.name === undefined) return 1;
                if (b.name === undefined) return -1;
            });
            break;
        }
        case 'sort date': {
            result = arr.sort((a, b) => {
                if (a.date === undefined) return 1;
                if (b.date === undefined) return 1;
                let date1 = new Date(a.date);
                let date2 = new Date(b.date);
                return date2.getTime() - date1.getTime();
            });
            break;
        }
        default:
            console.log('wrong command');
            break;
    }
    result.forEach(item => showTODO(item));
}

// TODO you can do it!

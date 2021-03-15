const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let TODOgex = '// TODO (.+)';
let TODO = '// TODO';
let TODOFormGex = /\/\/ TODO (\w+);\s*([0-9-]+);\s*(.+)/;

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let parts = command.split(' ');
    switch (parts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getToDo());
            break;
        case 'user':
            let formatted = getToDoWithForm()
            let name = parts[1].toLowerCase().match('(.+)')[1];
            let aans = formatted.filter(x => x['name'] === name).map(x => x.raw);
            console.log(aans);
            break;
        case 'important':
            let g = getToDoWithVoskl();
            let ans = [];
            for (let elem of g) {
                if (elem[1] !== 0) {
                    ans.push(elem[0]);
                }
            }
            console.log(ans);
            break;
        case 'sort':
            if (parts[1] == 'user') {
                let res = getToDoWithForm();
                console.log(
                    Array
                        .from(res)
                        .sort((x, y) => x['name'] > y['name'] ? -1 : 1).map(x => x['raw'])
                )
                break;
            } else if (parts[1] == 'importance') {
                let res = getToDoWithVoskl();
                console.log(
                    Array
                        .from(res)
                        .sort((x, y) => x[1] > y[1] ? -1 : 1).map(x => x[0])
                )
                break;
            } else {
                console.log('wrong command');
                break;
            }
        default:
            console.log('wrong command');
            break;
    }
}

function getToDo() {
    let files = getFiles();
    let ans = [];
    for (let file of files) {
        let strings = file.split("\r\n");
        for (let str of strings) {
            let k = str.match(TODOgex);
            if (k !== null) {
                ans.push(TODO+' '+k[1])
            }
        }
    }
    return ans;
}


function getToDoWithVoskl() {
    let ToDoS= getToDo();
    ans = new Map();
    for (let todo of ToDoS){
        let counter = 0;
        for (let ch of todo){
            if (ch === '!')
                counter++;
        }
        ans.set(todo, counter);
    }
    return ans;
}

function getToDoWithForm() {
    let ToDos = getToDo();
    let ans = [];
    for (let str of ToDos) {
        let k = str.match(TODOFormGex);
        if (k !== null) {
            ans.push({'name': k[1].toLowerCase(), 'date': k[2], 'text': k[3], 'raw' : str})
        }
        else{
            k = str.match(TODOgex);
            if (k !== null) {
                ans.push({'name': null, 'date': null, 'text': k[1], 'raw' : str})
            }
        }
    }
    return ans;
}

//processCommand('show')
//processCommand('important')
// processCommand('user Veronika')
// processCommand('sort user')

// console.log(getToDoWithVoskl());

// TODO you can do it!
// TODO {Andrey}; {day}; {stfu}
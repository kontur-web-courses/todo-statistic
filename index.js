const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);


function readTextFile(file) {
    let reader = new FileReader();
    reader.readAsText(file);}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function getAllToDo() {
    const files = getFiles();
    let res = []
    const regular_todo = /\/\/ TODO .+/g;
    for (const file1 of files) {
        let ans = file1.match(regular_todo);
        if (ans === null){
            continue;
        }
        res = res.concat(ans);
    }
    return res;
}

function getDate(str) {
    let a = str.split(';')[0];
    let b = str.split(';')[1];
    if (!isNaN(Date.parse(b))) return b;
         else if (!isNaN(Date.parse(a))) return a;
             else return null;
}

function sortByImportance() {
    const result = getAllToDo().sort(importanceComparer);
    return result;
}

function importanceComparer(first, second) {
    const inFirst = (first.match(/!/g) || []).length;
    const inSecond = (second.match(/!/g) || []).length;

    return inSecond - inFirst;
}

function sortByUser() {
    const todos = getAllToDo();
    const hasUser = todos.filter(a => textHasUser(a));
    const hasNoUser = todos.filter(a => !textHasUser(a));
    hasUser.sort();

    return hasUser.concat(hasNoUser);
}

function textHasUser(text) {
    const parts = text.split(" ");

    return (isNaN(+parts[2][0])) && (parts[2].endsWith(';'));
}

function formatDate (date) {
    const formatFunc = (x => x.toString().padStart(2, '0'));
    const day = formatFunc(date.getDate());
    const month = formatFunc(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatOutput(str){
    const importance = (str.match(/!/g) || [])[0] ?? " ";
    const matched = str.match(/\/\/ TODO (.*?);\s*(.*?); (.*)/)
    if (matched !== null){
        const name = matched[1].toLowerCase();
        const date = formatDate(new Date(matched[2]));
        const text = matched[3].trim();
        console.log(`${importance} | ${name.padEnd(10, " ")} | ${date.padEnd(10, " ")} | ${text.padEnd(50, " ")}`);
    }
    else {
        const name = "";
        const date = "";
        console.log(`${importance} | ${name.padEnd(10, " ")} | ${date.toString().padEnd(10, " ")} | ${str.padEnd(50, " ")}`);
    }

}

function processCommand(command) {
    const args = command.split(' ');
    switch (args[0]) {
        case 'user':
            getAllToDo().filter((v) =>  v.includes(`// TODO ${args[1]}`))
                .map((value) => formatOutput(value));
            break;
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const ans of getAllToDo()){
                formatOutput(ans);
            }
            break;
        case 'importance':
            getAllToDo().filter((v, i, a) => v.includes('!')).map((value) => formatOutput(value));
            break;
        case 'sort':
            switch (args[1]) {
                case 'importance':
                    sortByImportance().map(v => formatOutput(v));
                    break;
                case 'user':
                    sortByUser().map(v => formatOutput(v));
                    break;
                case 'date':
                    getAllToDo().sort((a, b) => {
                        if ((getDate(a) != null) && (getDate(b) == null)) return -1;
                        if ((getDate(a) == null) && (getDate(b) != null)) return 1;
                        if (getDate(a) > getDate(b)) return 1;
                        if (getDate(a) < getDate(b)) return -1;
                        if (getDate(a) === getDate(b)) return 0;
                    }).map((value) => formatOutput(value));
                    break;
                default:
                    console.log('ahaha');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

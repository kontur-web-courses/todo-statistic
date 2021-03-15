const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const regWthoutImp=/\/\/ (TODO .+[^!])[^!]\n/g
const regAll = /\/\/(TODO .+)\n/g
const regImp =/\/\/ (TODO .+!)\n/g
const formatRegexp = new RegExp("\/\/ todo (.+);(.+);(.+)\n","g")

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function compareImp(a,b) {
    return b.match(/!/g).length-a.match(/!/g).length
}

function* parseTODOwithParam(arr, regex){
    for (let obj in arr) {
        let y = arr[obj].matchAll(regex)
        for (const match of y) {
            yield match[1];
        }
    }
}
function* sortImp(arr) {
    let strWithImp= []
    for (let obj of parseTODOwithParam(arr,regImp)){
        strWithImp.push(obj)
    }

    strWithImp.sort(compareImp)
    for (let obj of strWithImp){
        yield obj
    }

    for (let obj of parseTODOwithParam(arr,regWthoutImp)){
        yield obj
    }
}

function* parseUser(arr,user){
    for (let obj in arr){
        let y=arr[obj].matchAll(formatRegexp);
        for (const match of y) {
            yield match[3];
        }
    }
}

function* getTODOsWithFormat(arr) {
    const regExp = new RegExp("todo (.+);(.+);(.+)\n","gi");
    for (let str of arr) {
        let todos = str.matchAll(regExp);
        for (let todo of todos) {
            yield todo[0];
        }
    }
}

function sortByDate(arr) {
    const todos = [];
    for (var todo of getTODOsWithFormat(arr)) {
        todos.push(todo);
    }
    todos.forEach(e => (console.log(Array.from(e.matchAll(formatRegexp)))));
    return todos;
}

function processCommand(input) {
    let data = input.match(/^[^ ]*|(?<= ).*/g);
    const command = data[0]
    const param = data[1]
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            let files =getFiles();
            for(let obj of parseTODOwithParam(files,regWthoutImp)){
                console.log(obj)
            }
            break;
        case 'sort':
            switch (param) {
                case 'importance':
                    let j = getFiles();
                    for(let obj of sortImp(j)){
                        console.log(obj)
                    }
                    break;
                case 'date':
                    let files = getFiles();
                    for (let todo of sortByDate(files)) {
                        // console.log(todo);
                    }
                    break;
            }
            break;
        case 'important':
            let b = getFiles();
            for(let obj of parseTODOwithParam(b,regImp)){
                console.log(obj);
            }
            break;
        case 'user':
            let c = getFiles();
            for(let obj of parseUser(c,param)){
                console.log(obj)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!!!!

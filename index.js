const {
    getAllFilePathsWithExtension,
    readFile
} = require('./fileSystem');
const {
    readLine
} = require('./console');

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

function compareImp(a, b) {
    return b.match(/!/g).length - a.match(/!/g).length
}

function* parseTODOwithParam(arr, regex) {
    for (let obj in arr) {
        let allMatches = arr[obj].matchAll(regex)
        for (const match of allMatches) {
            yield match[1];
        }
    }
}

function* sortImp(arr) {
    let strWithImp = []
    for (let obj of parseTODOwithParam(arr, regImp)) {
        strWithImp.push(obj)
    }
    strWithImp.sort(compareImp)
    for (let obj of strWithImp) {
        yield obj
    }
    for (let obj of parseTODOwithParam(arr, regWthoutImp)) {
        yield obj
    }
}


function* sortUser(arr) {
    const allWithNames = []
    const reg = new RegExp("(todo (.+);(.+);(.+))\n", "gi")
    for (let obj in arr) {
        let allMatches = arr[obj].matchAll(reg)
        for (let mat of allMatches) {
            allWithNames.push(mat[1]);
        }
    }
    allWithNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    for (let obj of allWithNames) {
        yield obj;
    }
}

function sortParam(arr, param) {
    if (param === 'user') {
        return sortUser(arr)
    } else if (param === 'important') {
        return sortImp(arr)
    }else if (param === 'date'){

    }
}

function* parseUser(arr, user) {
    const reg = new RegExp("todo (" + user + ");(.+);(.+)\n", "gi")
    for (let obj in arr) {
        let allMatches = arr[obj].matchAll(reg)
        for (const match of allMatches) {
            yield match[3];
        }
    }
    todos.forEach(e => (console.log(Array.from(e.matchAll(formatRegexp)))));
    return todos;
}

function processCommand(input) {
    let data = input.match(/^[^ ]*|(?<= ).*/g);
    const command = data[0]
    const param = data[1]
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let obj of parseTODOwithParam(files, regImp)) {
                console.log(obj)
            }
            for (let obj of parseTODOwithParam(files, regWthoutImp)) {
                console.log(obj)
            }
            break;
        case 'sort':
            for (let obj of sortParam(files, param)) {
                console.log(obj)
            }
            break
        case 'important':
            for (let obj of parseTODOwithParam(files, regImp)) {
                console.log(obj);
            }
            break;
        case 'user':
            for (let obj of parseUser(files, param)) {
                console.log(obj)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!!!!

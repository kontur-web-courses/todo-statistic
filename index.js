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
const formatRegexp = new RegExp("\/\/ TODO (.+);(.+);(.+)\n","g")

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
}

function getTodosWithFormat(arr) {
    const todos = [];
    for (file of arr) {
        const matches = file.matchAll(formatRegexp);
        for (match of matches) {
            todos.push(match[0]);
        }
    }
    
    return todos;
}

function getDateFromTodo(e) {
    const [year, month, date] = Array.from(e.matchAll(formatRegexp))[0][2].trim().split('-');
    const curDate = new Date(year, month, date);

    return curDate;
}

function sortByDate(arr) {
    const todos = getTodosWithFormat(arr);
    todos.sort((e1, e2) => {
        return getDateFromTodo(e1) <= getDateFromTodo(e2) ? -1 : 1;
    })
    
    return todos.map((e)=>e.trim());
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

function* todoAfterDate(arr,date){
    const reg = new RegExp("(todo (.+);(.+);(.+))\n", "gi");
    for (let obj of arr) {
        let allMatches = obj.matchAll(reg)
        for (let mat of allMatches) {
            if(new Date(mat[3].trim())>=date){
                yield mat[1];
            }
        }
    }
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
        case 'date':
            const date = new Date(param);
            for(let obj of todoAfterDate(files,date)){
                console.log(obj);
            }
            break;
        case 'sort':
            switch (param) {
                case 'user':
                    for (let obj of sortUser(files)) {
                        console.log(obj)
                    }
                case 'importance':
                    for (let obj of sortParam(files, param)) {
                        console.log(obj)
                    }
                    break;
                case 'date':
                    for (let obj of sortByDate(files)) {
                        console.log(obj);
                    }
                    break;
            }
            break;
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

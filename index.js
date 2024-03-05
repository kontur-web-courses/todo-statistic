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
    const parts = command.split(' ');
    const comments = getAllComments();
    switch (parts[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(comments.join(''))
            break;
        case 'important':
            let important = comments.filter(x => x.includes('!'));
            console.log(important.join(''));
            break;
        case 'user':
            if (parts.length === 1)
                console.error('wrong command');
            const name = parts.slice(1).join(' ')
            const d = getUserMessage(comments, 1);
            console.log(d.get(name).join(''))
            break;
        case 'sort':
            sortCom(parts[1], comments);
            break;
        case 'date':
            if (parts.length === 1)
                console.error('wrong command');
            const dict = getUserMessage(comments, 2);
            const sortedKeys = getSortedDateKeys(dict).filter(x => x >= parts[1]);
            for (const key of sortedKeys){
                console.log(`${key}: ${dict.get(key).join('')}`)
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllComments() {
    let arr = [];
    const regexp = /(\/\/ TODO .+)(\r\n)*/g;
    for (const prog of files) {
        const comments = prog.match(regexp);
        arr = comments ? arr.concat(comments) : arr;
    }
    return arr;
}

function sortCom(param, comments){
    switch (param){
        case 'importance':
            console.log(comments.filter(x => x.includes('!')).join(''))
            console.log(comments.filter(x => !x.includes('!')).join(''))
            break;
        case 'user':
            const d = getUserMessage(comments, 1);
            for (const entry of d.entries()){
                if (entry[0] !== 'unknown') {
                    console.log(`${entry[0]}: \n${entry[1].join('')}`);
                }
            }
            console.log(`unknown: \n${d.get('unknown').join('')}`);
            break;
        case 'date':
            const dateDict = getUserMessage(comments, 2);
            let sortedKeys = getSortedDateKeys(dateDict);
            for (const key of sortedKeys){
                console.log(`${key}: ${dateDict.get(key).join('')}`);
            }
    }
}

function dataSorter(a, b){
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
}
function getSortedDateKeys(dict){
    return Array.from(dict.keys()).sort(dataSorter);
}
function getUserMessage(comments, argNum){
    const reg = /^\s*\/\/ TODO (.+); (\d{4}-\d{2}-\d{2}); (.+)$/;
    const dict = new Map();
    for (const str of comments) {
        const matches = str.trimEnd().match(reg);
        if (matches) {
            const name = matches[argNum].toLowerCase();
            if(!dict.has(name)){
                dict.set(name, [])
            }
            dict.get(name).push(str)
        } else {
            if (!dict.has('unknown')){
                dict.set('unknown', [])
            }
            dict.get('unknown').push(str);
        }
    }
    return dict;
}
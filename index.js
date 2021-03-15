const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const regWthoutImp=/(todo .+[^!])[^!]\n/gi
const regAll = /(todo .+)\n/gi
const regImp =/(todo .+!)\n/gi

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
function compareImp(a,b) {
    return b.match(/!/g).length-a.match(/!/g).length
}
function* parseTODOwithParam(arr,regex){
    for (let obj in arr){
        let y=arr[obj].matchAll(regex)
        for (const match of y) {
            yield match[1];
        }
    }
}
function* sortImp(arr){
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
    const reg=new RegExp("todo ("+user+");(.+);(.+)\n","gi")
    for (let obj in arr){
        let y=arr[obj].matchAll(reg)
        for (const match of y) {
            yield match[3];
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
            let files =getFiles();
            for(let obj of parseTODOwithParam(files,regWthoutImp)){
                console.log(obj)
            }
            break;
        case 'sort':
            let j =getFiles();
            for(let obj of sortImp(j)){
                console.log(obj)
            }
            break;
        case 'important':
            let b =getFiles();
            for(let obj of parseTODOwithParam(b,regImp)){
                console.log(obj);
            }
            break;
        case 'user':
            let c =getFiles();
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

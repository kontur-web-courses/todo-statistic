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
    let oper = command.split(" ")[0];
    let name = command.split(" ")[1];
    switch (oper) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(f(getFiles()));
            break;
        case 'important':
            console.log(exclamationPoint(f(getFiles())));
            break;
        case 'user':
            console.log(a(f(getFiles()), name))
            break;
        case 'sort':
            if (name === "importance") {
                console.log(getImportantFirst(f(getFiles())));
            }
            else if (name === "user"){
                console.log(getGroupByUsers(f(getFiles())));
            }
            else if(name === "date"){
                console.log(getNewestDates(f(getFiles())));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function f(files) {
    let arr = []
    for (let str of files) {
        for (let s of str.split('\r\n')) {
            if (s.indexOf("// TODO") !== -1) {
                arr.push(s.slice(s.indexOf("// TODO")));
            }
        }
    }
    return arr.slice(0, arr.length - 2);
}

function exclamationPoint(str) {
    let arr = [];
    for (let s of str) {
        if (s.includes("!")) arr.push(s);
    }
    return arr;
}

function a(str, name) {
    let arr = [];
    for (let s of str) {
        s = s.toLowerCase();
        if (s.includes(';')) {
            let b = s.split(";");
            if (s.includes(name.toLowerCase())) {
                arr.push(b[2]);
            }
        }
    }
    return arr;
}

function getImportantFirst(arr){
    let mp = new Map();
    for (const str of arr) {
        let count = (str.match(/!/g) || []).length;
        mp.set(str, count);
    }
    return new Map([...mp].sort((a, b) => b[1] - a[1])).keys();
}

function getGroupByUsers(arr){
    let result = [];

    for (let i = 0; i< arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
    }
    const dictionary = {};
    let withoutNames = [];

    for (const str of arr) {
        if (str.includes(';')) {
            let splstr = str.split(";");
            if (splstr[0] in dictionary){
                dictionary[splstr[0]].push(str);
            } else{
                dictionary[splstr[0]] = [str];
            }
        }
        else withoutNames.push(str);
    }

    for (const elem of Object.values(dictionary)) {
        for (const elemElement of elem) {
            result.push(elemElement);
        }
    }
    for (const strin of withoutNames) {
        result.push(strin);
    }
    
    return result;
}

function getNewestDates(arr){
    let ar = [];
    for (let str of arr) {
        if (str.includes('-')){
            let date = str.slice(str.indexOf('-') - 4, str.indexOf('-') + 6);
            ar.push(date);
        }
    }
    let arrDateRes = [];
    let mapDate =  ar.sort();
    for (let mapDateElement of mapDate) {
        for (let arrElement of arr) {
            if (arrElement.includes(mapDateElement)) arrDateRes.push(arrElement)
        }
    }
    for (let arrElement of arr) {
        if (arrDateRes.includes(arrElement)) continue;
        else arrDateRes.push(arrElement);
    }
    return arrDateRes;
}
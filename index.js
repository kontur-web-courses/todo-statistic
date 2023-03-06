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
            console.log(show(getFiles()));
            break;
        case 'important':
            console.log(exclamationPoint(show(getFiles())));
            break;
        case 'user':
            console.log(names(show(getFiles()), name))
            break;
        case 'sort':
            if (name === "importance") {
                console.log(getImportantFirst(show(getFiles())));
            }
            else if (name === "user"){
                console.log(getGroupByUsers(show(getFiles())));
            }
            else if(name === "date"){
                console.log(getNewestDates(show(getFiles())));
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
function show(files) {
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

function names(str, name) {
    let arr = [];
    for (let s of str) {
        s = s.toLowerCase();
        if (s.includes(';')) {
            let b = s.split(";");
            if (s.includes(name.toLowerCase())) {
                arr.push(`${b[0].replace('// todo ', )} : ${b[2]}`);
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
    let map = new Map();
    for (let str of arr) {
        if (str.includes('-')){
            let date = str.slice(str.indexOf('-') - 4, str.indexOf('-') + 6);
            map.set(date, str);
        }
    }
    let mapDate =  [...map].sort((a, b) => b[1] - a[1]);
    for (let arrElement of arr) {
        if (!(arrElement in mapDate.values())) {
            mapDate.push(arrElement);
        }
    }
    return mapDate;
}
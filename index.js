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
    switch (command.split(" ")[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showAllTODO(getTODO());
            break;
        case 'important':
            showImportantTODO(getTODO());
            break;
        case 'user':
            showUser(command.split(' ')[1]);
            break;
        case 'sort':
            showSorted(command.split(' ')[1]);
            break;
        case 'date':
            showAfterDate(command.split(' ')[1]);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function cut(str, len) {
    while (str.length < len) {
        str += " ";
    }
    if (str.length > len) {
        return str.slice(0, len - 3) + "...";
    }
    return str;
}

function showKrasivo(obj) {
    let ans = "";
    if (!obj.hasOwnProperty('important')) {
       ans += " |";
    }
    else {
        ans += "!|";
    }

    if (obj.hasOwnProperty('name')) {
        ans += cut(obj.name, 10);
    }
    else {
        ans += cut("", 10);
    }
    ans += "|";

    if (obj.hasOwnProperty('date')) {
        ans += cut(obj.date.toLocaleDateString(), 10);
    }
    else {
        ans += cut("", 10);
    }
    ans += "|";
    if (obj.hasOwnProperty('name')) {
        ans += cut(obj.text.split(";")[2], 50);
    }
    else {
        ans += cut(obj.text.slice(4, obj.text.length), 50);
    }
    console.log(ans);
}

function showSorted(arg) {
    let huj = getTODOObjects();
    let comparator;
    if (arg === "importance") {
        comparator = function (a, b) {
            return b.hasOwnProperty('important') ? 1 : -1;
        }
    }
    else if (arg === "user") {
        comparator = function (a, b) {
            if (!a.hasOwnProperty('name') || !b.hasOwnProperty('name')) {
                return b.hasOwnProperty('name') ? 1 : -1;
            }
            else if (a.hasOwnProperty('name') && b.hasOwnProperty('name')) {
                return a.name < b.name ? -1 : 1;
            }
            else {
                return 0;
            }
        }
    }
    else if (arg === "date") {
        comparator = function (a, b) {
            if (!a.hasOwnProperty('date') || !b.hasOwnProperty('date')) {
                return b.hasOwnProperty('date') ? 1 : -1;
            }
            else if (a.hasOwnProperty('date') && b.hasOwnProperty('date')) {
                return a.date < b.date ? 1 : -1;
            }
            else {
                return 0;
            }
        }
    }
    huj.sort(comparator);
    for (let obj of huj) {
        showKrasivo(obj);
    }
}

function showAfterDate(date) {
    date = new Date(date);
    let huj = getTODOObjects();
    for (let obj of huj) {
        if (obj.hasOwnProperty('date') && date < obj.date) {
            showKrasivo(obj);
        }
    }
}
function showAllTODO() {
    for (let s of getTODOObjects()) {
        showKrasivo(s);
    }
}

function showImportantTODO() {
    for (let s of getTODOObjects()) {
        if (s.text.includes("!")) {
            showKrasivo(s);
        }
    }
}

function showUser(user) {
    for (let s of getTODOObjects()) {
        let huj = s.text.split(";");
        if (huj.length === 3 && huj[0].toLowerCase() === "todo " + user.toLowerCase()) {
            showKrasivo(s);
        }
    }
}

function getTODOObjects() {
    let ans = [];
    for (i of getFiles()) {
        for (j of i.toString().split('\n')) {
            if (j.includes("// TODO")) {
                let text = j.split("// ")[1];
                let huj = {text:text};
                let splitted = text.split(";");
                if (splitted.length === 3) {
                    huj.name = splitted[0].toLowerCase().slice(5, splitted[0].length);
                    huj.date = new Date(splitted[1]);
                }
                if (text.includes("!")) {
                    huj.important = true;
                }
                ans.push(huj);
            }
        }
    }
    return ans;
}

function getTODO() {
    let ans = [];
    for (i of getFiles()) {
        for (j of i.toString().split('\n')) {
            if (j.includes("// TODO")) {
                ans.push(j.split("// ")[1]);
            }
        }
    }
    return ans;
}

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getAllTODOs() {
    let TODOs = [];
    for (let file of files){
        for (let string of file.split('\n')) {
            if (string.includes('// TODO ')
                && !string.includes('\'// TODO ')
                && !string.includes('\`// TODO ')) {
                TODOs.push(string.substring(string.indexOf('// TODO')));
            }
        }
    }

    return TODOs;
}

function printArrayWithStatement(array, statement) {
    for (let element of array) {
        if (statement(element)) {
            console.log(element);
        }
    }
}
function importanceComparator(a, b) {
    let regex = /!/g;

    let aMatch = a.match(regex);
    if (aMatch === null) aMatch = 0;
    else aMatch = aMatch.length;

    let bMatch = b.match(regex);
    if (bMatch === null) bMatch = 0;
    else bMatch = bMatch.length;

    if (aMatch > bMatch) {
        return -1;
    }
    if (aMatch < bMatch) {
        return 1;
    }
    return 0;
}

function userComparator(a, b) {
    let lowerA = a.toLowerCase();
    let lowerB = b.toLowerCase();

    if (lowerA.includes(';') && !lowerB.includes(';')) {
        return -1;
    }
    if (!lowerA.includes(';') && lowerB.includes(';')) {
        return 1;
    }

    if (lowerA < lowerB) {
        return -1;
    }
    if (lowerA > lowerB) {
        return 1;
    }

    return 0;
}

function dateComparator(a, b) {
    let regex = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/g;

    let aMatch = a.match(regex);
    let aCount = 0;
    if (aMatch !== null) aCount = aMatch.length;

    let bMatch = b.match(regex);
    let bCount = 0;
    if (bMatch !== null) bCount = bMatch.length;

    if (aCount > bCount) {
        return -1;
    }
    if (aCount < bCount) {
        return 1;
    }

    if (aMatch > bMatch) {
        return -1;
    }
    if (aMatch < bMatch) {
        return 1;
    }

    return 0;
}

function processCommand(command) {
    let operation = command.split(' ')[0];
    let parameter = command.split(' ')[1];
    switch (operation) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printArrayWithStatement(getAllTODOs(), () => true);
            break;
        case 'important':
            printArrayWithStatement(getAllTODOs(), (TODO) => TODO.includes('!'));
            break;
        case 'user':
            printArrayWithStatement(getAllTODOs(),
                (TODO) => TODO.toLowerCase().includes(`// todo ${parameter.toLowerCase()}`));
            break;
        case 'sort':
            let TODOs = getAllTODOs();
            switch (parameter) {
                case 'importance':
                    let sortedTODOsByImportance = TODOs.sort(importanceComparator);
                    printArrayWithStatement(sortedTODOsByImportance, () => true);
                    break;
                case 'user':
                    let sortedTODOsByUser = TODOs.sort(userComparator);
                    printArrayWithStatement(sortedTODOsByUser, () => true);
                    break;
                case 'date':
                    let sortedTODOsByDate = TODOs.sort(dateComparator);
                    printArrayWithStatement(sortedTODOsByDate, () => true);
                    break;
                default:
                    console.log('wrong parameter');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function parseToDo(array) {
    let result = []
    for (let toDo of array) {
        let curr = [toDo];
        if (toDo.indexOf(';') !== -1) {
            curr.push(toDo.split(';')[0].trim().split(' ').at(-1).toLowerCase());
            curr.push(new Date(toDo.split(';')[1].trim()));
        } else {
            curr.push(null);
            curr.push(null);
        }
        if (toDo.indexOf('!') !== -1) {
            curr.push(true);
        } else {
            curr.push(false);
        }
        result.push(curr);
    }
    return result;
}

function maximum(array) {
    max = 0;
    for (let i of array) {
        if (i > max)
            max = i;
    }
    return max;
}
function getDenominator(array) {
    return maximum(array.map(x => (x + "").length));
}



function getTableView(array, text_denom, name_denom, date_denom) {
    let newStr = "";
    if (array.at(-1)) {
        newStr += '! |  ';
    } else {
        newStr += '  |  ';
    }
    newStr += array[0].split(';').at(-1) + " ".repeat(text_denom - array[0].split(';').at(-1).length + 2) + "|";
    if (array.at(1) !== null) {
        newStr += "  " + array.at(1) + " ".repeat(name_denom - array.at(1).length + 2) + "|";
    } else {
        newStr += "  " + " ".repeat(name_denom + 2) + "|";
    }
    if (array.at(2) !== null) {
        newStr += "  " + array.at(2) + " ".repeat(date_denom-(array.at(2)+"").length + 2) + '|';
    } else {
        newStr +="  " + " ".repeat(date_denom + 2) + '|';
    }
    return newStr;
}

function getToDo() {
    const pattern = new RegExp(/\/\/ TODO .*/)
    let files = getFiles();
    let result = [];
    for (let file of files) {
        for (let line of file.split("\n")) {
            let matching = line.match(pattern);
            if (matching !== null)
                result.push(matching[0]);
        }
    }
    return result;
}

function compareDate(a, b) {
    if (a > b) return -1;
    if (a === b) return 0;
    if (a < b) return 1;
}

function processCommand(command) {
    switch (command.split(' ').at(0)) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            array = parseToDo(getToDo());
            console.log(array.map(x => getTableView(x, getDenominator(array.map(x => x.at(0).split(';').at(-1))), getDenominator(array.map(x => x.at(1))), getDenominator(array.map(x => x.at(2))))));
            break;
        case 'important':
            console.log(parseToDo(getToDo()).filter(x => x.at(-1)).map(x => x.at(0)));
            break;
        case 'user':
            console.log(parseToDo(getToDo()).filter(x => x.at(1) === command.split(' ').at(1).toLowerCase()).map(x => x.at(0)));
            break;
        case 'date':
            console.log(parseToDo(getToDo()).filter(x => x.at(2) != null && x.at(2) < new Date(command.split(' ').at(1))).map(x => x.at(0)));
            break;
        case 'sort':
            switch (command.split(' ').at(1)) {
                case 'importance':
                    console.log(parseToDo(getToDo()).sort(x => -x.at(-1)).map(x => x.at(0)));
                    break;
                case 'user':
                    console.log(parseToDo(getToDo()).sort(x => x.at(1) !== null).map(x => x.at(0)));
                case 'date':
                    console.log(parseToDo(getToDo()).sort((x, y) => compareDate(x.at(2), y.at(2))).map(x => x.at(0)));
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

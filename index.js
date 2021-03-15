const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todoLine = '// ' + 'TODO ';

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getLines() {
    const filteredLines = files.map(file => file.split("\r\n").filter(line => line.includes(todoLine)));
    let lines = [].concat.apply([], filteredLines);
    lines = lines.map(line => line.substring(line.indexOf(todoLine)));
    return lines;
}

// TODO function sort(param) { !!!!!
//     switch (param) {
//         case 'importance':
//             const lines = getLines();
//             const mostCommon = {};
//             for (let line of lines) {
//                 let count = 0;
//                 for (let i of line) {
//                     if (i === "!") {
//                         count++;
//                     }
//                 }
//                 if (count in mostCommon) {
//                     mostCommon[count].push(line);
//                 } else {
//                     mostCommon[count] = [line];
//                 }
//             }
//             mostCommon.keys
//             Object.keys(mostCommon).map(i => +i)
//             return getLines();
//         case 'user':
//             return;
//         case 'date':
//             return;
//         default:
//             return 'wrong command';
//     }
// }

function processCommand(command) {
    let param = '';
    if (command.includes('user ')) {
        param = command.split(' ')[1];
        command = 'user';
    }
    // if (command.includes('sort ')) {
    //     param = command.split(' ')[1];
    //     command = 'sort';
    //}
    switch (command) {
        case 'show':
            console.log(getLines());
            break;
        case 'important':
            console.log(getLines().filter(line => line.includes('!')));
            break;
        case 'user':
            console.log(getLines().filter((line =>
                line.substr(todoLine.length, param.length).toLowerCase() === param.toLowerCase())));
            break;
        // case 'sort':
        //     console.log(sort(param));
        //     break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function show(i){
    const important = i || false
    const data = getFiles().join("");
    const regexpr = important ? /\/\/\sTODO\s(.*)!+\n/g : /\/\/\sTODO\s(.*)\n/g
    return data.match(regexpr).join("");
}

function userFinder(name){
    const data = getFiles().join("");
    const regexpr = new RegExp('\/\/ TODO ' + name + ';(.*)\n','gi');
    return Array.from(data.match(regexpr)).map(x => x[1]).join("\n");
}


function sortOutput(command){
    const data = getFiles().join("");
    const regexpr = /\/\/\sTODO\s(.*)\n/g;
    const parsedData = data.match(regexpr);
    switch (command) {
        case 'importance':
            return parsedData
                .map(x => [x, x.matchAll(/(!+)\n/g)[1] || ''])
                .map(x => [x[0], x[1].length])
                .sort((a, b) => b[1] - a[1])
                .map(a => a[0])
                .join("");
        case 'user':
            break
        case 'date':
            break
    }
}

function processCommand(command) {
    const consoleAgrv = command.split(" ");
    const com = consoleAgrv[0];
    switch (com) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(show());
            break;
        case 'important':
            console.log(show(true));
            break;
        case 'user':
            console.log(userFinder(consoleAgrv[1]));
            break;
        case 'sort':
            console.log(sortOutput(consoleAgrv[1]));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

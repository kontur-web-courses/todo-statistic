const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodoComment(line) {
    let splittedLine = line.split('//', 2);
    if (splittedLine.length > 1 && splittedLine[1].trim().startsWith('TODO')) {
        return '//' + splittedLine[1].trimEnd();
    }
    return null;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (file of files) {
                for (line of file.split('\n')) {
                    let comment = getTodoComment(line);
                    if (comment !== null)
                        console.log(comment);
                }
            }
            break;
        case 'important':
            // TODO
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

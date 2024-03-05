const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const regex = /\/\/(.*?)\r\n/g;


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            files.forEach(text => {
                let match;
                while ((match = regex.exec(text)) !== null) {
                    console.log(match[1]);
                }
            });
            break
        case 'important':
            files.forEach(text => {
                let match;
                while ((match = regex.exec(text)) !== null) {
                    if (match[1].indexOf('!') !== -1){
                        console.log(match[1]);
                    }
                }
            });
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const comments = [];
            for (const file of files) {
                const lines = file.split('\n');
                for (const line of lines) {
                    if (line.trim().startsWith('// TODO')) {
                        comments.push(line.replace('// TODO', '').trim());
                    }
                }
            }
            console.log(comments);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
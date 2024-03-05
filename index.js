const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const regex = /(\/\/ *TODO *.*$)/mg;
const nameDataRegex = /(?:\/\/ *TODO (.+); (.+); (?:.*$))/mg;


console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let cmd = command.split(' ');
    switch (cmd[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            getComments().forEach(comment => console.log(comment));
            break;
        case 'important':
            getComments().forEach(comment => {
                if (comment.indexOf('!') !== -1){
                    console.log(comment);
                }
            })
            break;
        case 'user':
            if (command.length > 0){
                getComments().forEach(comment => {
                    if ((match = nameDataRegex.exec(comment)) !== null){
                        if (match[1].toLowerCase() === cmd[1].toLowerCase()){
                            console.log(comment);
                        }
                    }
                })
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getComments(){
    const comments = [];
    files.forEach(text => {
        let match;
        while ((match = regex.exec(text)) !== null) {
                comments.push(match[1]);
        }
    });
    return comments;
}
// TODO you can do it!

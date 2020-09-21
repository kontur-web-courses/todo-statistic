const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const commentStart = "// TODO"
const commentEnd = "\r\n"

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let action = command.split(" ")[0]
    switch (action) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(showRunner())
            break
        case 'important':
            console.log(importantRunner())
            break
        case 'user':
            let user = command.split(" ")[1]
            console.log(userRunner(user))
            break
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

function showRunner(){
    let comments = []
    for (const contents of files) {
        let caret = 0
        while (caret !== -1) {
            let comment = ""
            caret = contents.indexOf(commentStart, caret)
            if (caret !== -1) {
                comment = contents.substring(caret, contents.indexOf(commentEnd, caret + 1))
                comments.push(comment)
                caret++
            }
        }
    }
    return comments;
}

function importantRunner() {
    let showResult = showRunner()
    return showResult.filter(value => value.includes("!"))
}

function userRunner(user) {
    const nameEnd = ";"
    let showResult = showRunner()
    return showResult.filter(value => value.substring(value.indexOf(commentStart), value.indexOf(nameEnd)) === user)
}
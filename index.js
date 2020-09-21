const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function Comment(user, date, text) {
    this.user = user && user.toLowerCase();
    this.date = date;
    this.text = text;
    this.importance = 0;
    for (let char of text) {
        if (char === '!') {
            this.importance++;
        }
    }
}

function parseComments()
{
    let comments = [];
    let regExpr = new RegExp(`.*;.*;.*`, 'i')
    for(file of files) {
        for(line of file.split("\r\n").filter(x => x !=='' &&  x !=='\n\r')){
            if (line.includes('TODO') && line.includes('//')){
                let onlyComm = line.split('//')[1];
                if(onlyComm.includes('TODO')){
                    onlyComm = onlyComm.replace('TODO', '').trim();
                    if (regExpr.test(onlyComm)) {
                        let comm = onlyComm.split(';');
                        comments.push(new Comment(comm[0], new Date(comm[1].trim()), onlyComm));
                    }else{
                        comments.push(new Comment('', '', onlyComm));
                    }
                }
            }
        }
    }
    return(comments);
}

function processCommand(command) {
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for(comm of parseComments()){
                    console.log(comm.text);
            }
            break;
        case 'important':
            for (let comment of parseComments()) {
                if (comment.importance > 0) {
                    console.log(comment.text);
                }
            }
            break;
        case 'user':
            for (let comment of parseComments()) 
                if(comment.user === command[1])
                    console.log(comment.text);
            break;
        case 'sort':
            for (let comm of parseComments().sort((a, b) => {
                if(a[command[1]] < b[command[1]]) { return 1; }
                    if(a[command[1]] > b[command[1]]) { return -1; }
                    return 0;
            }))
                console.log(comm.text);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

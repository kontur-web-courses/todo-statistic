const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

let todoContainer = []  

function Comment({name = undefined, date = undefined, message = undefined, important = 0}) {
    this.name = name;
    this.date = date;
    this.message = message;
    this.important = important;
}


let pattern = /(?<=(\/\/ TODO )).+/g
const files = getFiles();
for(let str of files) {
    let commentArray = str.match(pattern)
    if(commentArray !== null) {
        for(let comment of commentArray) {
            let splitedComment = comment.split("; ")
            if(splitedComment.length == 3) {
                todoContainer.push(new Comment({name : splitedComment[0], date : splitedComment[1], message : comment}));
            } else {
                todoContainer.push(new Comment({name : "noname", message : comment}))
            }
        }
    }
}
console.log(todoContainer)
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
            for(let todo of todoContainer){
                console.log(todo.message);
            }
            break;
        case 'important':
            for(let todo of todoContainer[command]){
                console.log(todo);
            }
            break;
        case command.includes('user'):
            let userName = command.split(' ')[1];
            for(let todo of todoContainer[userName]){
                console.log(todo);
            }
            break;
        case command.includes('sort'):
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

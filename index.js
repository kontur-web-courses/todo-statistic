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
            let splitedComment = comment.split("; ");
            let imp = (comment.match(/!/g));
            imp = imp != null ? imp.length : 0;
            if(splitedComment.length == 3) {
                todoContainer.push(new Comment({name : splitedComment[0].toLowerCase(), date : splitedComment[1], message : comment, important : imp}));
            } else {
                todoContainer.push(new Comment({name : "$noname", message : comment, important : imp}))
            }
        }
    }
}

console.log('Please, write your command!');
readLine(processCommand);


function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function processCommand(command) {
    [command, commandName] = command.split(' ');
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
            for(let todo of todoContainer){
                if (todo.important > 0){
                    console.log(todo.message);
                }
            }
            break;
        case 'user':
            for(let todo of todoContainer){
                if(todo.name === commandName.toLowerCase()){
                    console.log(todo.message);
                }
            }
            break;
        case 'sort':
            if(commandName === 'important'){
                for(let comment of todoContainer.sort((a, b) => b.important - a.important)){
                    console.log(comment.message);
                }
            } else if(commandName === "user") {
                for(let comment of todoContainer.sort((a, b) => b.name.localeCompare(a.name))) {
                    console.log(comment.message)
                }
                
            } else if (commandName === 'date'){
                for(let comment of todoContainer.sort(function(a, b) {
                    let keyA = new Date(a.date);
                    let keyB = new Date(b.date);
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                  })) {
                    console.log(comment.message)
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

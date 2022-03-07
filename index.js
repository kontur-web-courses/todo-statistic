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
        case `sort ${flag = command.split(' ')[1]}`:
            const simpleComments = [];
            if (flag === 'important'){
                const todoComments2 = getAllTodoComments(files);
                for (const comment of todoComments2){
                    if (comment.indexOf('!') !== -1){
                        console.log(comment);
                    }
                    else{
                        simpleComments.push(comment)
                    }
                }
            }
            else if (flag === 'user'){
                const регулярка = RegExp(`\/\/ TODO \w*; [\w\W]*`);
                const todoComments1 = getAllTodoComments(files);
                for (const comment of todoComments1){
                    if (регулярка.test(comment))
                        console.log(comment);
                    else
                        simpleComments.push(comment);
                }
            }
            else if (flag === 'date'){
                const todoComments1 = getAllTodoComments(files);
                const commentsWithDate = []
                for (const e of todoComments1){
                    const date = e.split(';')[1];
                    console.log(date)
                    commentsWithDate.push({date:date, comment:e});
                }
                const sorted = commentsWithDate.sort((a, b) => a.date < b.date);
                for (const c of sorted){
                    console.log(c.comment);
                }
            }
            for (const simpleComment of simpleComments){
                console.log(simpleComment);
            }
            break;

        case `user ${username = command.split(' ')[1]}`:
            const регулярка = RegExp(`\/\/ TODO ${username}; [\w\W]*`);
            const todoComments1 = getAllTodoComments(files);
            for (const comment of todoComments1){
                if (регулярка.test(comment))
                    console.log(comment);
            }
            break;
        case 'important':
            const todoComments = getAllTodoComments(files);
            for (const comment of todoComments){
                if (comment.indexOf('!') !== -1){
                    console.log(comment);
                }
            }
            break;
        case 'show':
            console.log(getAllTodoComments(files));
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodoComments(fileData){
    const регулярка = /\/\/ TODO [\w\W]*/;
    const todoComments = [];
    for (const singleFile of fileData){
        const lines = singleFile.split('\r\n');
        for (let line of lines){
            if (регулярка.test(line)) {
                line = line.split("//")[1];
                todoComments.push("//" + line);
            }
        }
    }
    return todoComments;
}

// TODO you can do it!

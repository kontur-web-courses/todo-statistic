const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}
//использовать регулярные выражения
function GetAllCommentsFromFiles(files) {
    let comments = [];
    for (let file of files) {
        let comment = file.match(/\/\/ TODO .*/g);
        if (comment != null) {
            for (const com of comment){
                comments.push(com);
            }
        }
    }
    return comments;
}




function processCommand(command) {
    let comments = GetAllCommentsFromFiles(getFiles());
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                console.log(comment);
            }
            break;
        case 'important': //только с восклицательным знаком
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                if (comment.includes('!')) {
                    console.log(comment);
                }
            }
            break;
        case ''://выводит комментарии, которые были добавлены конкретным пользователем
            comments = GetAllCommentsFromFiles(getFiles());
            for (let comment of comments) {
                if (comment.includes(`${username};`)) {

                    console.log(comment);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

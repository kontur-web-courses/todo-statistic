const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTodo(regexp) {
    let result = [];
    for (let file of files) {
        result = result.concat(file.match(regexp));
    }

    return result;
}

function getCommentWithName(comment) {
    let mo = comment.match(/TODO ([\w\s]+);/);
    if (mo) return [mo[1].toLowerCase(), comment];
    return ["", comment];
}

function getCommentWithDate(comment) {
    let mo = comment.match(/;(\s*[-\d]+);/);
    if (mo) return [new Date(mo[1]), comment];
    return [new Date("1970-01-01"), comment]
}

function sortCmd (cmd) {
    switch (cmd) {
        case 'importance':
            let importance = getTodo(/\/\/ TODO [^\n\r]+/g).map(s => [s.split("!").length - 1, s]);
            importance.sort(function(a,b){return a[0] - b[0]});
            return importance.reverse().map(x => x[1]);
        case 'user':
            const users = getTodo(new RegExp(`\/\/ TODO [^\n\r]+`, "gi")).map(x => getCommentWithName(x));
            users.sort();
            return users.reverse().map(x => x[1]);
        case 'date':
            const date = getTodo(new RegExp(`\/\/ TODO [^\n\r]+`, "gi")).map(s => getCommentWithDate(s));
            date.sort(function(a, b) { return a[0] - b[0]});
            return date.reverse().map(x => x[1]);
        default:
            break;
    }
}

function processCommand(commandWithArgs) {

    const [command, ...args] = commandWithArgs.split(" ");
    console.log()
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(getTodo(/\/\/ TODO [^\n\r]+/g).join("\n"));
            break;
        case 'important':
            console.log(getTodo(/\/\/ TODO [^\n\r]*![^\n\r]*/g).join("\n"));
            break;
        case 'user':
            console.log(getTodo(new RegExp(`\/\/ TODO ${args.join(" ")};[^\n\r]+`, "gi")).join("\n"))
            break;
        case 'sort':
            console.log(sortCmd(args[0]).join("\n"));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = files.map(file => file.split("\n").map(line => line.trim()).filter(line => line.startsWith("// TODO ")))
    .flatMap(x => x).map(x => x.slice(8));
const todos_obj = todos.map(todo => {
    let todoSplit = todo.split(";");
    if (todoSplit.length !== 3) {
        return { importance: todo.split('!').length - 1, name: "", date: new Date("1000"), comment: todo, pureComment: todo }
    }
    return { importance: todo.split('!').length - 1, name: todoSplit[0].toLowerCase(), date: new Date(todoSplit[1]), comment: todo, pureComment: todoSplit[2].trim() }
});

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function formatEntries(entries) {
    const nameColumnWidth = Math.min(Math.max(...entries.map(obj => obj.name.length)), 10);
    const dateColumnWidth = Math.min(Math.max(...entries.map(obj => obj.date)), 10);
    const commentColumnWidth = Math.min(Math.max(...entries.map(obj => obj.comment.length)), 50)

    const formatName = name => name.length > nameColumnWidth 
        ? `  ${name.slice(0, nameColumnWidth - 3)}...  ` 
        : `  ${name.padEnd(nameColumnWidth, ' ')}  `;

    const formatDate = date => date.toISOString().split("T")[0] > dateColumnWidth 
        ? `  ${date.toISOString().split("T")[0].slice(0, dateColumnWidth - 3)}...  ` 
        : `  ${date.toISOString().split("T")[0].padEnd(dateColumnWidth, ' ')}  `;

    const formatComment = comment => comment.length > commentColumnWidth 
        ? `  ${comment.slice(0, commentColumnWidth - 3)}...  ` 
        : `  ${comment.padEnd(commentColumnWidth, ' ')}  `;

    return entries.map(entry => `${entry.importance !== 0 ? "!" : " "}  |${formatName(entry.name)}|${formatDate(entry.date)}|${formatComment(entry.pureComment)}`).join("\n");
}

function processCommand(command) {
    let [commandPure, arg] = command.split(' ');
    switch (commandPure) {
        case 'exit':
            process.exit(0);
            break;

        case 'show':
            console.log(formatEntries(todos_obj));
            break;

        case 'important':
            console.log(formatEntries(todos_obj.filter(obj => obj.importance !== 0).map(obj => obj.comment)))
            break;

        case "user":
            let username = arg;
            console.log(formatEntries(todos_obj.filter(obj => obj.name === username).map(obj => obj.comment)))
            break;

        case "sort":
            let entries;
            if (arg === "importance") {
                entries = todos.slice();
                entries.sort((a, b) => b.importance - a.importance);
            } else if (arg === "user") {
                named_entries = todos_obj.filter(obj => obj.name !== "");
                unnamed_entries = todos_obj.filter(obj => obj.name === "")

                named_entries.sort((a, b) => a.name.localeCompare(b.name));
                entries = [...named_entries, ...unnamed_entries].map(obj => obj.comment);
            } 
            else if (arg === "date") {
                entries = todos_obj.slice();
                entries.sort((a, b) => b.date - a.date);
                entries = entries.map(todo_obj => todo_obj.comment);
            }

            if (entries === undefined) {
                console.log("This command's argument must be 'user', 'importance' or 'date'.");
            } else {
                console.log(formatEntries(entries));
            }   
            break;

        case "date":
            const date = new Date(arg);
            let entriesDate = todos_obj.filter(obj => obj.date > date).map(obj => obj.comment);
            console.log(formatEntries(entriesDate)); 
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO daemetry; 05.07.033; a comment from future!!!!!!

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
    const [cmd, arg] = command.split(" ");
    switch (cmd) {
        case "date":
            printFormattedOutput(getNextDateTODO(getAllTODOs(), arg));
            break;
        case "sort":
            printFormattedOutput(sortByParameter(getAllTODOs(), arg));
            break;
        case "user":
            printFormattedOutput(getUserTODOs(getAllTODOs(), arg));
            break;
        case "important":
            printFormattedOutput(getOnlyImportantTODOs(getAllTODOs()));
            break;
        case "show":
            printFormattedOutput(getAllTODOs());
            break;
        case "exit":
            process.exit(0);
            break;
        default:
            console.log("Unknown command");
            break;
    }
}

function getNextDateTODO(todos, date) {
    return todos
        .filter((el) => {
            const parts = el.split(";");
            return parts.length === 3 && new Date(parts[1]) > new Date(date);
        })
        .sort((a, b) => {
            a = new Date(a.split(";")[1]);
            b = new Date(b.split(";")[1]);
            return a > b ? -1 : a < b ? 1 : 0;
        });
}

function getAllTODOs() {
    return files.flatMap((file) => {
        return file
            .split("\n")
            .filter((line) => line.includes("// TODO"));
    });
}

function getOnlyImportantTODOs(todos) {
    return todos.filter((todo) => todo.includes("!"));
}

function getUserTODOs(todos, username) {
    return todos.filter((todo) => {
        const [name] = getTODOParts(todo);
        return name.toLowerCase() === username.toLowerCase();
    });

}

function getTODOParts(todo) {
    const [, name = "", date = "", text = ""] = todo.match(/\/\/ TODO (\w+;)?(\d{4}-\d{2}-\d{2};)?(.+)/) || [];
    return {
        name: name.replace(";", ""),
        date: date.replace(";", ""),
        text: text.trim(),
    };
}

function sortByParameter(todos, parameter) {
    switch (parameter) {
        case "importance":
            return todos
                .sort((a, b) => b.split("!").length - a.split("!").length);
        case "user":
            return todos
                .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: "base"}))
                .sort((a, b) => b.split(";").length - a.split(";").length);
        case "date":
            const withDate = todos.filter((todo) => getTODOParts(todo).length === 3);
            const withoutDate = todos.filter((todo) => getTODOParts(todo).length !== 3);
            return withDate
                .sort((a, b) => new Date(b.split(";")[1]) - new Date(a.split(";")[1]))
                .concat(withoutDate);
        default:
            return todos;
    }
}

function printFormattedOutput(todos) {
    todos.forEach((todo) => {
        const [name, date, text] = getTodoParts(todo);
        const importance = todo.includes("!") ? "!" : " ";
        const formattedName = formatString(name, 11);
        const formattedDate = formatString(date, 11);
        const formattedText = formatString(text, 50);
        console.log(`${importance}  |  ${formattedName}  |  ${formattedDate}  | ${formattedText}`);
    });
}

function formatString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength - 3) + '...';
    }
}
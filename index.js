const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => ({
        path: path,
        file: readFile(path)
    }));
}

function processCommand(command) {
    let parsed = command.split(" ");
    switch (parsed[0]) {

        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTable(getCleverTodos(findTODO()));
            break;
        case 'important':
            printTable(getCleverTodos(findTODO()).filter(x => x.importance > 0));
            break;
        case 'user':
            printTable(getCleverTodos(findTODO()).filter(x => x.name === parsed[1].toLowerCase()));
            break;
        case 'sort':
            printTable(sort(getCleverTodos(findTODO()), parsed[1]));
            break;
        case 'date':
            let dateParsed = Date.parse(parsed[1])
            printTable(sort(getCleverTodos(findTODO()).filter(x => x.date >= dateParsed), 'date'));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function* findTODO() {
    for (const file of files) {
        let fileText = file.file;
        for (const line of fileText.split('\n')) {
            let match = line.match(/\/\/\s*TODO\s*:*.*/i)
            let index = line.indexOf('// TODO');
            if (match != null) {
                yield [line.substring(match.index), file.path];
            }
        }
    }
}

function sort(array, command) {
    if (command === 'importance') {
        return array.sort((x, y) => y.importance - x.importance);
    }
    if (command === 'user') {
        return array.sort((x, y) => y.name.localeCompare(x.name));
    }
    if (command === 'date') {
        return array.sort((x, y) => y.date - x.date);
    }
}

function getCleverTodos(todos) {
    let ans = [];
    for (const todo of todos) {
        let matched = todo[0].match(/\/\/ TODO (.*?);\s*(.*?); (.*)/);
        if (matched !== null) {
            ans.push({
                importance: (todo[0].match(/!/g) || []).length,
                name: matched[1].toLowerCase(),
                date: Date.parse(matched[2]),
                text: todo[0].trim(),
                shortText: matched[3].trim(),
                file: todo[1]
            });
        } else {
            ans.push({
                importance: (todo[0].match(/!/g) || []).length,
                name: "",
                date: 0,
                text: todo[0].trim(),
                shortText: todo[0].trim(),
                file: todo[1]
            });
        }
    }
    return ans;
}

function printTable(arr) {
    let maxImportance = Math.max(...arr.map(x => x.importance.toString().length));
    let maxName = Math.min(Math.max(...arr.map(x => x.name.length)), 10);
    let maxText = Math.min(Math.max(...arr.map(x => x.shortText.length)), 50);
    let maxFileName = Math.max(...arr.map(x => x.file.length));

    console.log(` ${"!".padEnd(maxImportance, ' ')} | ${"user".padEnd(maxName, ' ')} | ${"date".padEnd(10, ' ')} | ${"comment".padEnd(maxText, ' ')} | ${"filename".padEnd(maxFileName, ' ')}`)
    console.log('-'.repeat(maxImportance + maxName + maxText + maxFileName + 23))

    for (const item of arr) {
        let s = item.importance.toString().padEnd(maxImportance, " ") > 0 ? "!" : " ";
        let s1 = item.date === 0 ? " ".repeat(10) : new Date(item.date).toLocaleDateString().slice(0, 10);
        let s2 = item.shortText;
        console.log(` ${truncateString(s, 1)} | ${truncateString(item.name.padEnd(maxName, " "), maxName)} | ${truncateString(s1, 10)} | ${truncateString(s2, maxText).padEnd(maxText, ' ')} | ${item.file.padEnd(maxFileName, ' ')}`);
    }

}

function truncateString(str, len) {
    if (str.length > len)
        return str.slice(0, len - 1) + '…';
    return str;
}


// TODO you can do it!

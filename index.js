const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function printTodos(todos) {
    for (const todo of todos) {
        console.log(todo);
    }
}

function processCommand(command) {
    let parsed = command.split(" ");
    switch (parsed[0]) {

        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTodos(findTODO());
            break;
        case 'important':
            printTodos(getImportant(findTODO()));
            break;
        case 'user':
            printTodos(getCleverTodos(findTODO()).filter(x => x.name === parsed[1].toLowerCase()).map(x => x.text));
            break;
        case 'sort':
            printTodos(sort(getCleverTodos(findTODO()), parsed[1]).map(x => x.text));
            break;
        case 'date':
            let dateParsed = Date.parse(parsed[1])
            printTodos(sort(getCleverTodos(findTODO()).filter(x => x.date >= dateParsed), 'date').map(x => x.text));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function* getImportant(todos) {
    for (const todo of todos) {
        if (todo.indexOf("!") !== -1) {
            yield todo;
        }
    }
}

function* findTODO() {
    for (const file of files) {
        for (const line of file.split('\n')) {
            let index = line.indexOf('// TODO');
            if (index !== -1) {
                yield line.substring(index);
            }
        }
    }
}

function sort(array, command) {
    if (command === 'importance') {
        return array.sort((x, y) => y.importance - x.importance);
    }
    if (command === 'user') {
        return array.sort((x, y) => x.name.localeCompare(y.name));
    }
    if (command === 'date') {
        return array.sort((x, y) => y.date - x.date);
    }
}

function getCleverTodos(todos) {
    let ans = [];
    for (const todo of todos) {
        let matched = todo.match(/\/\/ TODO (.*?);\s*(.*?); (.*)/);
        if (matched !== null) {
            ans.push({
                importance: (todo.match(/!/g) || []).length,
                name: matched[1].toLowerCase(),
                date: Date.parse(matched[2]),
                text: todo
            });
        } else {
            ans.push({
                importance: (todo.match(/!/g) || []).length,
                name: "",
                date: 0,
                text: todo
            });
        }
    }
    return ans;
}

function printTable(arr) {
    let maxImportance = Math.max(...arr.map(x => x.importance.toString().length))
    let maxName = Math.max(...arr.map(x => x.name.length))
    let maxText = Math.max(...arr.map(x => x.text.length))
    for (const item of arr) {
        console.log(` ${item.importance.toString().padEnd(maxImportance, " ")} | ${item.name.padEnd(maxName, " ")} | ${new Date(item.date.getTime().slice(0, 10))} | ${item.text.padEnd(maxText, " ")}`);
    }

}


// TODO you can do it!

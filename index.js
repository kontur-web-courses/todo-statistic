const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
let s = "    // TODO Anonymous Developer; 2016-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла\n";
let data = s.match(/\/\/ TODO (.*?);\s*(.*?); (.*)/);
console.log(data);
let data1 = Date.parse(data[2]);
console.log(data1)
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
    switch (command) {

        case 'exit':
            process.exit(0);
            break;
        case 'show':
            printTodos(findTODO());
            break;
        case 'important':
            printTodos(getImportant(findTODO()));
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

function* getCleverTodos(todos) {
    for (const todo of todos) {
        let matched = todo.match(/\/\/ TODO (.*?);\s*(.*?); (.*)/);
        if (matched !== null) {
            yield {
                importance: (todo.match(/!/g) || []).length,
                name: matched[1],
                date: Date.parse(matched[2]),
                text: matched[3]
            }
        } else {
            yield {
                importance: (todo.match(/!/g) || []).length,
                name: "",
                date: 0,
                text: todo
            }
        }
    }
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

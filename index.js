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

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}


function getImportant(todos) {
    let ans = []
    for (const todo of todos) {
        if (todo.contains("!")) {
            ans.push(todo);
        }
    }
    return ans;
}
function* getCleverTodos(todos){
    for (const todo of todos){
        let matched = todo.match(/\/\/ TODO (.*?);\s*(.*?); (.*)/);
        if(matched !== null){
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


// TODO you can do it!

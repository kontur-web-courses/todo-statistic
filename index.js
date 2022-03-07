const {readLine} = require('./console');
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const files = getFiles();
const todos = [];
const important = [];
const importantSorted = []
let importantIndex = {}
const date = [];
const withoutDate = [];

console.log('Please, write your command!');

for (file of files) {
    let strings = file.split('\n');
    for (str of strings) {
        if (str.substring(0, 7) == '// TODO') {
            todos.push(str);
                for (j of str.split("")){
                if (j === '!'){
                    important.push(str);
                    break;
                }   
            }
            var find_info = str.split(";");
            if (find_info.length == 3) date.push({info: str, date : new Date(find_info[1].substring(1))});
            else withoutDate.push(str);
        }
    }
}

for (i of important){
    importantIndex[i] = 0
    for (j of i.split('')){
        if (j === '!'){
            importantIndex[i] = importantIndex[i] + 1;
        }
    }
}
while (Object.keys(importantIndex).length > 0){
    let max = 0;
    let str = "";
    for (i of Object.keys(importantIndex)){
        if (importantIndex[i] > max){
            max = importantIndex[i];
            str = i;
        }
    }
    importantSorted.push(str)
    delete importantIndex[str]
}

for (i of todos){
    if (importantSorted.indexOf(i) === -1){
        importantSorted.push(i)
    }
}


readLine(processCommand);
readLine(processCommand('show'));
readLine(processCommand('important'));
readLine(processCommand('sort importance'));
readLine(processCommand('sort date'));
readLine(processCommand('exit'));

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (element of todos) console.log(element);
            break;
        case 'important':
            for (element of important) console.log(element);
            break;
        case 'sort importance':
            for (element of importantSorted) console.log(element);
            break;
        case 'sort date':
            for (var i = date.length - 1; i > 0; i--) {
                for (var j = 0; j < i; j++) {
                    if (date[j].date < date[j + 1].date) {
                        let temp = date[j];
                        date[j] = date[j + 1];
                        date[j + 1] = temp;
                    }
                }
            }
            for (element of date) console.log(element.info);
            for (element of withoutDate) console.log(element);
            break;
        default:
            let sCommand = command.split(' ');
            if (sCommand[0] == 'user'){
                let name = sCommand[1];
                for (element of todos) {
                    if (element.substring(0, 9 + name.length) === `// TODO ${name};`) console.log(element)
                }
            }
            else console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO Semyon; 11.11.11; {текст комментария}lcxmbvcb
// TODO gsdhgfhdh!!!!!!!!!!!!!!!!!!!!!
// TODO sdjfh!!!!!!!!!
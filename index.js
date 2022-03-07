const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const specialLabelRegex = new RegExp("(?<username>.*); (?<date>(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})); (?<comment>.*)", "gi");

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function* getAllLines(){
    for (let fileLines of getFiles()){
        for (let line of fileLines.split('\n')) {
            yield line;
        }
    }
}

function* getTODOLines(){
    for (let line of getAllLines()){
        if (line.includes('// TODO')){
            yield line.slice(line.indexOf('// TODO')+8);
        }
    }
}

function show(){
    for(let line of getTODOLines()){
        console.log(line.trim());
    }
}

function important(){
    for(let line of getTODOLines()){
        if(line.includes('!'))
            console.log(line.trim());
    }
}

function* getSpecialLabeledTodoLines(){
    for (let todoLine of getTODOLines()){
        if (specialLabelRegex.exec(todoLine)) yield todoLine;
    }
}

function showAllUserComments(username){
    for (let line of getSpecialLabeledTodoLines()){
        specialLabelRegex[Symbol.match](line);
        let match = specialLabelRegex.exec(line);
        if (match.groups["username"].toLowerCase() === username.toLowerCase()){
            console.log(match.groups["comment"]);
        }
    }
}

function processCommand(input) {
    let splittedInput = input.split(" ", 2);
    let command = splittedInput[0];
    let argument = splittedInput[1];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            show();
            break;
        case 'important':
            important();
            break;
        case 'user':
            showAllUserComments(argument);
            break;
        case 'sort':
            switch (argument) {
                case 'importance':
                    for (let importantLine of getSpecialLabeledTodoLines()){
                        specialLabelRegex[Symbol.match](importantLine);
                        if (importantLine.includes("!"))
                            console.log(specialLabelRegex.exec(importantLine).groups["comment"]);
                    }
                    for (let notImportantLine of getSpecialLabeledTodoLines()){
                        specialLabelRegex[Symbol.match](notImportantLine);
                        if (!notImportantLine.includes("!"))
                            console.log(specialLabelRegex.exec(notImportantLine).groups["comment"]);
                    }
                    break;
                default:
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

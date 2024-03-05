const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = getComments();

console.log('Please, write your command!');

readLine(processCommand);


function count(str, sub){
    let count = 0;
    let index = str.indexOf(sub);
    while (index !== -1) {
        count++;
        index = str.indexOf(sub, index + 1);
    }
    return count
}

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processTODO(string){
    return string;
    let baseString = string;
    let first = string.indexOf(';');
    if (first === -1){
        return {inf: baseString};
    }
    let comment = {};
    comment.name = string.substring(first+1).split(';')[0];
    string = string.substring(first + 1, 9999999);
    let second = string.indexOf(';');
    if (second === -1){
        return {inf: baseString};
    }
    comment.date = string.substring(second+1).split(';')[0];
    string = string.substring(first + 1, 9999999);
    let third = string.indexOf(';');
    if (third === -1){
        return {inf: baseString};
    }
    comment.text = string.substring(third);
    return comment;
}

function getComments() {
    const files = getFiles();
    const todoComments = [];


    files.forEach(file => {
        const lines = file.split('\n');
        lines.forEach(line => {
            if (line.trim().startsWith('// TODO')) {
                todoComments.push(line.trim().substring(8));
            } else {
                let index = line.indexOf('// TODO');
                if (index !== -1) {
                    let str = line.substring(0,index);
                    if (count(str, '"') % 2===0 && count(str,"'") % 2===0){
                        todoComments.push(line.substring(index + 8, 99999));
                    }
                }
            }
        });
    });

    return todoComments.map(processTODO);
}

function processCommand(command) {
    const commandArgument = command.split(' ')[1];
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            todos.forEach(comment => {
                console.log(comment);
            });
            break;
        case 'important':
            todos.filter(comment => comment.includes('!'))
                .forEach(comment => {
                    console.log(comment);
                });
            break;
        case 'user':
            const username = commandArgument.toLowerCase();
            todos.filter(comment => {
                return comment.toLowerCase().includes(`${username};`);
            }).forEach(comment => {
                console.log(comment);
            });
            break;
        case 'sort':
            const sortOption = commandArgument;
            if (sortOption === 'importance') {
                todos.sort((a, b) => {
                    return count(b, '!') - count(a, '!');
                }).forEach(comment => {
                    console.log(comment);
                });
            } else if (sortOption === 'user') {
                let groupedComments = {};
                todos.forEach(comment => {
                    const user = comment.split(';')[0].toLowerCase();
                    if(groupedComments[user]) {
                        groupedComments[user].push(comment);
                    } else {
                        groupedComments[user] = [comment];
                    }
                });
                Object.keys(groupedComments).forEach(user => {
                    groupedComments[user].forEach(comment => {
                        console.log(comment);
                    });
                });
            } else if(sortOption === 'date') {
                todos.sort((a, b) => {
                    const getDate = (comment) => {
                        const match = comment.match(/\d{4}-\d{2}-\d{2}/);
                        return match ? new Date(match[0]) : new Date('1970-01-01');
                    };
                    return getDate(b) - getDate(a);
                }).forEach(comment => {
                    console.log(comment);
                });
            } else {
                console.log('Please specify valid sort option: importance, user, date');
            }
            break;
        case 'date':
            const dateArg = command.split(' ')[1];
            const targetParts = dateArg.split('-');

            let targetYear = parseInt(targetParts[0], 10);
            let targetMonth = targetParts[1] ? parseInt(targetParts[1], 10) - 1 : 11;
            let targetDay = targetParts[2] ? parseInt(targetParts[2], 10) : -1;

            if (targetDay === -1) {
                const nextMonthDate = new Date(targetYear, targetMonth);
                targetDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth()+1, -1).getDate();
            }

            const targetDate = new Date(targetYear, targetMonth, targetDay);

            todos.forEach(comment => {
                const commentDateMatch = comment.match(/\d{4}-\d{2}-\d{2}/);
                if (commentDateMatch) {
                    const [year, month, day] = commentDateMatch[0].split('-').map(Number);
                    const commentDate = new Date(year, month - 1, day);
                    if (commentDate > targetDate) {
                        console.log(comment);
                    }
                }
            });

            break;
        default:
            console.log('Unknown command. Please enter "exit" to exit or one of the specified commands.');
            break;
    }
}

function processCommand2(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show : показать все todo':
            getComments().forEach(comment => {
                console.log(comment);
            });
            break;
        case 'important':
            getComments().filter(comment => comment.includes('!'))
                .forEach(comment => {
                    console.log(comment);
                });
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

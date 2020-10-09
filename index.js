const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const EMPTY = '';

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

console.log(getAllFilePathsWithExtension(process.cwd(), 'js'));

function processCommand(command) {
    if(command === 'exit')
        process.exit(0);
    else if(command ==='show')
        showTodoRecord();
    else if(command ==='important')
        showImportant();
    else if(command.match(/^user.*$/gi))
        userComments(command.split(' ').splice(1).join(' '));
    else if(command.match(/^sort.*$/gi))
        sortBy(command.split(' ')[1]);
    else if(command.match(/^date.*(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}|\d{4})$/gi))
        displayAfterDate(command.split(' ')[1]);
    else
        console.log('wrong command');
}

// TODO you can do it!

function showTodoRecord(){
    displayTable(generateTodoRecordArray().flat())
}

function generateTodoRecordArray(){
    let pattern = /\/\/ TODO.*/gi;
    return files.map(file => file.match(pattern));
}

function showImportant(){
    let importantOnlyTodoRecord = generateTodoRecordArray()
        .map(todoRecordArr => todoRecordArr.filter(x => x.includes('!')))
        .filter(arr=>arr.length>0)
    displayTable(importantOnlyTodoRecord.flat())
}

function userComments(user){
    let str = `\/\/ TODO.*${user};.*\\d{4}-\\d{2}-\\d{2};.*`;
    let todoRecordArr = generateTodoRecordArray().flat();
    let pattern = new RegExp(str,'gi');
    displayTable(todoRecordArr.filter(x => x.match(pattern)))
}

function sortBy(arg){
    let todoRecordArr = generateTodoRecordArray().flat();
    switch (arg){
        case 'importance':
            todoRecordArr.sort((a,b)=>{
                return (b.match(/!/gi) || []).length - (a.match(/!/gi) || []).length
            })
            displayTable(todoRecordArr);
            break;
        case 'user':
            let pattern = /\/\/ TODO.*;.*\d{4}-\d{2}-\d{2};.*/gi
            let noNameArr = todoRecordArr.filter(line => !line.match(pattern))
            let userMessages = new Map()

            todoRecordArr.filter(line => line.match(pattern)).forEach(todoRecord => {
                let userName = todoRecord.split(';')[0].split('TODO')[1].trim().toLowerCase();
                if(userMessages.has(userName))
                    userMessages.get(userName).push(todoRecord);
                else
                    userMessages.set(userName,[todoRecord]);
            })

            let sortedArr = []
            userMessages.forEach(message => sortedArr.push((message)))
            sortedArr.push(noNameArr)
            displayTable(sortedArr.flat())
            break;
        case 'date':
            let datePattern = /\d{4}-\d{2}-\d{2}/gi
            todoRecordArr.sort((a,b)=> {
                return(new Date(b.match(datePattern)) - new Date(a.match(datePattern)));
            });
            displayTable(todoRecordArr)
            break;
    }
}

function displayAfterDate(date){
    let todoRecordArr = generateTodoRecordArray().flat();
    let datePattern = /(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}|\d{4})/gi
    displayTable(todoRecordArr.filter(x=> new Date(x.match(datePattern)) > new Date(date)));
}

function parseTodoRecords(arr, maxImportanceLength, maxNameLength, maxDateLength, maxCommentLength, table) {
    arr.forEach(todoRecord => {
        let importance = todoRecord.includes('!') ? '!' : EMPTY;

        let userName = (todoRecord.match(/TODO [\w ]*;/gi) || [EMPTY])[0].replace(';', '');

        let date = todoRecord.match(/(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}|\d{4})/gi);
        date = (date === null ? [EMPTY] : date)[0];

        let comment = date !== EMPTY ?
            todoRecord.split('TODO')[1].split(';')[2].trim() :
            todoRecord.split('TODO')[1].trim();

        maxImportanceLength = importance.length > maxImportanceLength ? importance.length : maxImportanceLength;
        maxNameLength = userName.length > maxNameLength ? userName.length : maxNameLength;
        maxDateLength = date.length > maxDateLength ? date.length : maxDateLength;
        maxCommentLength = comment.length > maxCommentLength ? comment.length : maxCommentLength;

        table.push({
            importance: importance,
            userName: userName,
            date: date,
            comment: comment,
        })
    });


    maxImportanceLength = maxImportanceLength === 0 ? 2 : 3;
    maxNameLength = maxNameLength > 10 ? 12 : maxNameLength + 2;
    maxDateLength = maxDateLength + 2;
    maxCommentLength = maxCommentLength > 49 ? 52 : maxCommentLength + 2;


    return {maxImportanceLength, maxNameLength, maxDateLength, maxCommentLength};
}

const displaySeparator = function (count){
    console.log('-'.repeat(count))
}

function displayTodoRecords(table, maxImportanceLength, maxNameLength, maxDateLength, maxCommentLength) {

    displayTableRow('!'.padEnd(maxImportanceLength),
        'user'.padEnd(maxNameLength),
        'date'.padEnd(maxDateLength),
        'comment'.padEnd(maxCommentLength));

    displaySeparator(maxCommentLength+maxImportanceLength+maxNameLength+maxDateLength+10);

    table.forEach(todoRecord => {
        todoRecord.importance = todoRecord.importance.padEnd(maxImportanceLength, ' ');

        todoRecord.userName = (todoRecord.userName === EMPTY ?
            EMPTY :
            todoRecord.userName.split(' ').splice(1).join(' '));

        todoRecord.userName = (todoRecord.userName.length > 10 ?
            todoRecord.userName.slice(0, 7) + '...' :
            todoRecord.userName)
            .padEnd(maxNameLength, ' ');

        todoRecord.date = todoRecord.date.padEnd(maxDateLength, ' ');

        todoRecord.comment = (todoRecord.comment.length > 50 ?
            todoRecord.comment.slice(0, 47) + '...' :
            todoRecord.comment)
            .padEnd(maxCommentLength > 49 ? 52 : maxCommentLength, ' ');
        
        displayTableRow(todoRecord.importance,todoRecord.userName,todoRecord.date,todoRecord.comment);
    });

    displaySeparator(maxCommentLength+maxImportanceLength+maxNameLength+maxDateLength+10);

}

function displayTableRow(importance,name,date,comment){
    console.log(`${importance}|  ${name}|  ${date}|  ${comment}|`)
}

function displayTable(arr){

    let table = []
    let maxImportanceLength = 0;
    let maxNameLength = 0;
    let maxDateLength = 0;
    let maxCommentLength = 0;

    const __ret = parseTodoRecords(arr, maxImportanceLength, maxNameLength, maxDateLength, maxCommentLength, table);

    displayTodoRecords(table, __ret.maxImportanceLength, __ret.maxNameLength, __ret.maxDateLength, __ret.maxCommentLength);
}
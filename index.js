const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

let nameSize = 0;
let dateSize = 0;
let comSize = 50;
let result = '';

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let comand = command.split(' ')[1];
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const todo of getTodos())
                result += deduceResult(todo) + '\n';
            console.log(makeHeading() + result);
            break;
        case 'important':
            for (const imp of getTodos())
                if (imp.com.indexOf('!') !=-1)
                    result += deduceResult(imp) + '\n';
            console.log(makeHeading() + result);
            break;
        case `user ${comand}`:
            let name =  new RegExp('^'+comand+'$', 'i');
            for (const todo of getTodos())
                if (name.test(todo.name))
                    result += deduceResult(todo) + '\n';
            console.log(makeHeading() + result);
            break;
        case `sort ${comand}`:
            for (const todo of sortTodos(comand))
                result += deduceResult(todo) + '\n';
            console.log(makeHeading() + result);
            break;
        case `date ${comand}`:
            let regexp1 = /^\d\d\d\d$/;
            let regexp2 = /^\d\d\d\d-\d\d$/;
            let regexp3 = /^\d\d\d\d-\d\d-\d\d$/;
            if (!regexp1.test(comand) && !regexp2.test(comand) && !regexp3.test(comand))
                break;
            for (const todo of getDateAfter())
                if (todo.hasOwnProperty('date') && todo.date > comand)
                    result += deduceResult(todo) + '\n';
            console.log(makeHeading() + result);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function makeHeading(){
    let res ='!'.padEnd(3)+'|'.padEnd(3) + 'user'.padEnd(nameSize)+'  |'.padEnd(5) + 'date'.padEnd(dateSize)+'  |'.padEnd(5)  + 'comment'.padEnd(comSize) + '\n';
    return res + '-'.repeat(4+nameSize+5+dateSize+5+comSize) + '\n';
}

function deduceResult(todo){
    let result = '';
    if (todo.com.indexOf('!') != -1){ // восклицательный знак
        result = '!'.padEnd(3)+'|'.padEnd(3);
    } else
        result = ' '.padEnd(3)+'|'.padEnd(3);
    if (todo.hasOwnProperty('name')){ // имя
        let name = todo.name;
        if (name.length >10){
            name = name.substr(0, 7) + '...';
        }
        result = result + name.padEnd(nameSize)+'  |'.padEnd(5);
    } else 
        result = result +''.padEnd(nameSize)+'  |'.padEnd(5);
    if (todo.hasOwnProperty('date')) // Дата
        result = result + todo.date.padEnd(dateSize)+'  |'.padEnd(5);
    else 
        result = result + ''.padEnd(dateSize)+'  |'.padEnd(5);
    let comment = todo.com;
    if (comment.length>50){ // комментарий
        comment = comment.substr(0, 47) + '...';
    }
    return(result = result + comment);
}

function getDateAfter(){
    let todosArr = getTodos();
    todosArr.sort(function(a, b){
        var dateA=new Date(a.date), dateB=new Date(b.date)
        return dateB-dateA;
    })
    return todosArr;     
}

function sortTodos(nameSort){
    let result = getTodos();
    switch (nameSort) {
        case 'important':
            return result.sort((a,b)=> countItem(b.com, '!') - countItem(a.com,'!'));
        case 'user':
            return result.sort(function(a, b){
                let nameA=a.name, nameB=b.name
                if (nameA < nameB)
                  return -1
                if (nameA > nameB)
                  return 1
                return 0
                });
        case 'date':
            return result.sort(function(a, b){
                let dateA=new Date(a.date), dateB=new Date(b.date)
                return dateB-dateA;
            })   
        }
}

function getSize(result){
    
    for( todo of result){
        if (todo.hasOwnProperty('name') && todo.name.length > nameSize && todo.name.length < 11){
            nameSize = todo.name.length;
        }
        if (todo.hasOwnProperty('date') && todo.date.length > dateSize && todo.date.length < 11){
            dateSize = String(todo.date).length;
        }
    }
    
}

function getArrObj(todos){
    let todosArr = [];
    for (let todo of todos){
        let newCom = todo.split(";");
        if (newCom.length < 2)
            todosArr.push({
                com: newCom[0].slice(8)});
                else
                    todosArr.push({
                        name: newCom[0].slice(8),
                        date: newCom[1].slice(1),
                        com: newCom[2].slice(1)});
            }
    return todosArr;
}

function getTodos(){
    let todos = files
    .map(file => file.match(/\/\/.*todo.*/gi))
    .flat(Infinity);
    let result = getArrObj(todos)
    getSize(result);
     return result;
}

function countItem(string, item){
    return string.split('').reduce((p,i)=> i === item ? p+1 : p , 0);
}

// TODO you can do it!
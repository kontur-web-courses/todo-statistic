let allTodos = [];
function getAllTodos(files){
    const todoArray = files.map(file =>  file.split('\n'))
    let regEx = /\/\/\s?todo(\s|:).+/gi
    for (let item of todoArray){
        for (let str of item){
            if (str.match(regEx)){
                allTodos.push(str
                    .slice(str.indexOf('//')))
            }
        }
    }
}

function show () {
    console.log(allTodos);
}

function important () {
    const regEx = new RegExp('.*!$');
    let importantTodos = allTodos.filter(str => str.match(regEx));
    console.log(importantTodos);
    return importantTodos;
}

function user(command){
    const userName = command.replace('user ', '').trim().toLowerCase();
    const regEx = new RegExp(`.*${userName};.*`, 'i');
    console.log(allTodos.filter(str => str.match(regEx)));
}

function userSort(){
    let userTodo = [];
    let anonTodo = [];
    let localTodos = JSON.parse(JSON.stringify(allTodos));
    for (let todo of localTodos) {
        let paramArr = todo.split("; ");
        if (paramArr.length >= 3)
            userTodo.push(todo);
        else
            anonTodo.push(todo);
    }
    anonTodo.map(element => userTodo.push(element));
    localTodos = userTodo;
    console.log(localTodos);
}

function importanceSort(){
    let localTodos = JSON.parse(JSON.stringify(allTodos));
    localTodos.sort((a, b) => {
        let firstElement = a.match(/!/gi) || [];
        let secondElement = b.match(/!/gi) || [];
        return secondElement.length - firstElement.length;
    })
    console.log(localTodos);
}

function dateSort(){
    const regEx = /\d{4}-\d{2}-\d{2}/gi;
    let localTodos = JSON.parse(JSON.stringify(allTodos));
    localTodos.concat(allTodos);
    localTodos.sort((a, b) => {
        let firstElement = new Date(a.match(regEx));
        let secondElement = new Date(b.match(regEx));
        return secondElement - firstElement;
    })
    return localTodos;
}

function filterByDate(date){
    let formattedDate = new Date(date);
    let dateSortedTodos = dateSort();
    let result = [];
    for (let todo of dateSortedTodos){
        let paramArr = todo.split('; ');
        if(paramArr.length >= 3){
            let todosDate = new Date(paramArr[1]);
            if(formattedDate < todosDate)
                result.push(todo)
        }
    }
    console.log(result);
}

exports.show = show;
exports.user = user;
exports.important = important;
exports.getAllTodos = getAllTodos;
exports.userSort = userSort;
exports.importanceSort = importanceSort;
exports.dateSort = dateSort;
exports.filterByDate = filterByDate;
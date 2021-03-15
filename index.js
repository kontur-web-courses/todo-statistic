const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const groupBy = (arr, fn) =>
    arr
        .map(typeof fn === 'function' ? fn : val => val[fn])
        .reduce((acc, val, i) => {
            acc[val] = (acc[val] || []).concat(arr[i]);
            return acc;
        }, {});
let whileTrue = 1;

console.log('Please, write your command!');

readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let input = String(command).split(" ");
    let allTodo = getAllTodo();
    switch (input[0]) {
        case 'sort':
            switch (input[1]){
                case 'date':
                    allTodo.sort(function(a,b){
                        return new Date(get_date(b)) - new Date(get_date(a));
                    for (let todo of allTodo)
                        console.log(todo)
                    });
                    break
                case 'user':
                    let usersTodos = groupBy(allTodo, x => x.split(';').length > 1  ? x.split(';')[0].substr(8) : 'other');
                    for (let i in usersTodos) {
                        if (i !== "other") {
                            for (let todo of usersTodos[i]) {
                                console.log(todo);
                            }
                        }
                    }
                    for (let todo of usersTodos['other']) {
                        console.log(todo);
                    }
                    break;
                case 'important':
                    let importantTodo = getImortantTodo(allTodo).sort(compare)
                    console.log(importantTodo)
                    break;
            }
            break;
        case 'user':
            let usersTodos = allTodo.filter(x => x.split(';')[0].substr(8).toLowerCase() === input[1].toLowerCase())
            for(let userTodo of usersTodos){
                console.log(userTodo);
            }
            break;
        case 'date':
            let rule = new Date(input[1]);
            let type = 'all';
            if (input[1].split('-').length === 2) {
                type = 'year-month';
            } else {
                type = 'year';
            }
            let dataTodos = allTodo.filter(x => dateComparator(x, rule, type));
            for (let dateTodo of dataTodos){
                console.log(dateTodo);
            }
            break;
        case 'important':
            let rightTodos = getImortantTodo(allTodo)
            for (let t of rightTodos)
                console.log(t)
            break;
        case 'show':
            formatTableOutput(allTodo)
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
// TODO Jopa; 2015-08-10; you can do it!

function sort_data(array) {

    return array;
}

function compare(a, b) {
    if (a.match(/!/g).length > b.match(/!/g).length) {
        return -1;
    }
    if (a.match(/!/g).length < b.match(/!/g).length) {
        return 1;
    }
    return 0;
}


function getImortantTodo(allTodo){
    return allTodo.filter(x => x.search('!') !== -1);
}

function getAllTodo(){
    let keyword = 'TODO';
    const regex = new RegExp(
        // exclude TODO in string value with matching quotes:
        '^(?!.*([\'"]).*\\b' + keyword + '\\b.*\\1)' +
        // exclude TODO.property access:
        '(?!.*\\b' + keyword + '\\.\\w)' +
        // exclude TODO = assignment
        '(?!.*\\b' + keyword + '\\s*=)' +
        // final TODO match
        '.*\\b' + keyword + '\\b'
    );

    let files = getFiles();
    let todos = [];
    for(let file of files) {
        file.split('\n').forEach((file) => {
            let m = regex.test(file);
            if (m) {
                let rightString = file.substr(file.indexOf('// TODO'));
                if (rightString.length > 6)
                    todos.push(rightString);
            }
        });
    }
    return todos;
}

function getStringDate(string){
    let tmp;
    try {
        return  String(string.split(';')[1].substr(1));
    } catch {
        return -1;
    }
}

function dateComparator(input, rule, type){
    let tmp = getStringDate(input);
    if (tmp === -1)
        return false;
    let dateString = new Date(tmp);
    switch (type){
        case 'year':
            return dateString.getFullYear() === rule.getFullYear();
        case 'all':
            return dateString.getDate() === rule.getDate()
        case 'year-month':
            return dateString.getFullYear() === rule.getFullYear() && dateString.getMonth() === rule.getMonth();
    }
}
/*
function formatTableOutput(comments){
    for(let comment of comments){
        let splitedComment = comment.substr(8).split(';');
        console.log(comment, splitedComment.length, splitedComment);
        let first = '!';
        let user = '';
        let date = '';
        let text = '';
        switch (splitedComment.length){
            case 1:
                break;
        }
        console.log(`${first}|${user}.`)
    }

}
*/
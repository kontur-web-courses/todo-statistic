const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function get_user(todos, username){
    let res = []
    for (const iterator of todos) {
        let splited = iterator
          .slice(7)
          .split(";")
          .map((s) => s.trim());

        if (
          splited.length === 3 &&
          (splited.at(0).toLowerCase() === username.toLowerCase() || username === '')
        ) {
          //                 if (
          //                   (only_important && temp.at(-1) === "!") || !only_important
          // ) {
          //                   todos.push(temp);
          //                 }
          res.push(iterator);
        }
    }
    return res;   
}

function get_importance(todos){
    let res = []
    for (const iterator of todos) {
        if (iterator.at(-1) === '!') res.push(iterator);
    }
    return res;
}


function getTODOs(str_file, only_important=false, username=''){
    let substr = "// TODO "

    let todos = []

    let bidx = 0;

    while(bidx != -1){
        let todo_idx = str_file.indexOf(substr, bidx);
        
        if (todo_idx == -1){
            bidx = -1;
            break;
        }

        let endl = str_file.indexOf('\n', todo_idx);
        let temp = str_file.slice(todo_idx, endl).trim();
    
        todos.push(temp);
        
        bidx = endl + 1;
    }   

    return todos;
}

function get_sym_importanse(s){
    let imp = 0
    while (s.at(-imp - 1) === '!') imp ++;
    return imp
}

function compare_importanse(s1, s2){
    return get_sym_importanse(s1) - get_sym_importanse(s2)
}


function get_sort(todos, sort_arg){
    if (sort_arg === "importance") {
    //   console.log("AAS");
      todos.sort(compare_importanse);
    }
    else if (sort_arg == 'user'){
        console.log("FDF")
        let user_todos = get_user(todos, '')
        user_todos.sort((a, b) => {
            a.toLowerCase().localeCompare(b.toLowerCase());
        })
        console.log(user_todos)
        let nonameUsers = todos.filter(t => t.split(';').length != 3)
        nonameUsers.sort();
        todos = user_todos.concat(nonameUsers)
    }

    else if (sort_arg == "date"){
        
    }

    return todos
}

// a= "// TODO aaba"
// b = "// TODO bab"
// console.log(a.toLowerCase().localeCompare(b.toLowerCase()))

function processCommand(rcommand) {
    res = []
    let args = rcommand.split(' ')
    switch (args[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const file of files) {
                res = res.concat(getTODOs(file));
            }
            break;
        case 'important':
            for (const file of files) {
              res = res.concat(get_importance(getTODOs(file)));
            }
            break;
        case 'user':
            for (const file of files) {
              res = res.concat(get_user(getTODOs(file), args[1]));
            }
            break
        case 'sort':
            for (const file of files) {
              res = res.concat(get_sort(getTODOs(file), args[1]));
            }
            break
        default:
            console.log('wrong command');
            break;
    }
    console.log(res)
}

// TODO you can do it!

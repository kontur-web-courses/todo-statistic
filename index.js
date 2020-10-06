const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    let [commands, arg] = command.split(" ")
    switch (commands) {
        case 'exit':
            process.exit(0);
            break;
            
        case 'show':
            for (const todo of getTodos())
                console.log(todo);
            break;
        
        case 'important':
            for (const todo of getTodos().filter(value => value.includes("!")))
                console.log(todo);
            break;

        case 'user':
            let user = arg.toLowerCase();
            for (const todo of getTodos().filter(value => value.toLowerCase().includes('\/\/ todo ' + user)))
                console.log(todo);
            break;

        case 'sort':
            console.log(sortBy(arg === 'important', arg === 'user', arg === 'date'))
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function getTodos() {
    return files
        .map(file => file.match(/\/\/.*todo.*/gi))
        .flat(Infinity)
        .filter(x => x)
        .sort((a,b) => countItem(b, '!')-countItem(a, '!'))
}

//function todoSplit(todo){
//    let arr = [];
//    for (let i = 0; i<3; i++){
//        arr[i] = todo.substr(8).split(';')[i];
//        if (arr[i] != undefined)
//            arr[i] = (arr[i][0] === ' ')? arr[i].substr(1) : arr[i];    
//    }
//    return(arr);
//}

function countItem(string, item){
    return string.split('').reduce((p,i) => i === item? p + 1 :  p, 0)
}

function sortBy(important, user, date){
    let todos = getTodos();
    
    if (important){
        for (const todo of getTodos())
                console.log(todo);
    }

    else if (user){
        console.log(':(');
    }

    else if (date){
        console.log(':(')
    }

}
// TODO you can do it!

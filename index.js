const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const allTodos = [];
getAllTodoFromFiles(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    command = command.split(' ');
    switch (command[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (let todo of allTodos) {
                console.log(todo);
            }
            break;
        case 'important':
            for (let todo of allTodos) {
                if (todo.includes('!')) {
                    console.log(todo);
                }
            }
            break;
        case 'user':
            for (let todo of allTodos) {
                if (todo.includes(command[1])) {
                    console.log(todo);
                }
            }
            break;
        case 'sort':
            switch (command[1]) {
                case 'importance':
                    let counter = [];
                    for (let todo of allTodos) {
                        let signCount = 0;
                        for (let elem of todo) {
                            if (elem === '!'){
                                signCount += 1;
                            }
                        }
                        counter.push({todo: todo, signCount: signCount});
                    }
                    counter = counter.sort( (x, y) => y.signCount - x.signCount);
                    for (let todo of counter){
                        console.log(todo.todo);
                    }
                    break;
                case 'user':
                    let names = [];
                    for (let todo of allTodos){
                        let name = '';
                        let end = todo.search(';');
                        if (end !== -1) {
                            name = todo.slice(8, end);
                        }
                        names.push({name: name, todo: todo});
                    }
                    names.sort(function(a, b){
                        if(a.name < b.name) { return 1; }
                        if(a.name > b.name) { return -1; }
                        return 0}
                    );
                    for (let todo of names){
                        console.log(todo.todo);
                    }
                    break;
                case 'date':
                    let dates = [];
                    for(let todo of allTodos){
                        let temp = todo;
                        let date = '';
                        let start = todo.search(';');
                        if (start !== -1){
                            temp = temp.slice(start+1);
                            date = temp.slice(0, temp.search(';'));
                        }
                        if (date === ''){
                            dates.push({date: null, todo: todo})
                        } else {
                            dates.push({date: new Date(date), todo: todo})
                        }
                    }
                    dates.sort(function(a, b){
                        if(a.date < b.date) { return 1; }
                        if(a.date > b.date) { return -1; }
                        return 0}
                    );
                    for (let todo of dates){
                        console.log(todo.todo);
                    }
                    break;
            }
            break;
        case 'date':
            let inDate = new Date(command[1]);
            for(let todo of allTodos){
                let temp = todo;
                let date = '';
                let start = todo.search(';');
                if (start !== -1){
                    temp = temp.slice(start+1);
                    date = temp.slice(0, temp.search(';'));
                }
                if (date !== ''){
                    if (new Date(date) > inDate){
                        console.log(todo);
                    }
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getAllTodoFromFiles(inputFiles) {
    for (let file of inputFiles){
        while (file.length > 0){
            let start = file.search('// TODO')
            if (start === -1) {
                break;
            }
            file = file.slice(start);
            let end = file.search('\n');
            allTodos.push(file.slice(0, end));
            file = file.slice(end);
        }
    }
}

// TODO you can do it!

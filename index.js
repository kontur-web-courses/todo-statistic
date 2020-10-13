Array.prototype.max = function () {
    return Math.max.apply(null, this);
}

const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function logElements(arr, uW = 10, dW = 10, cW = 50, margin=2) {
    let iS = arr.map(x => parseBy(x, 'importance')).map(x => typeof x === 'undefined' ? '' : x);
    let uS = arr.map(x => parseBy(x, 'user')).map(x => typeof x === 'undefined' ? '    ' : x);;

    let dS = arr.map(x => parseBy(x, 'date')).map(function (x) {
        if (!isNaN(x)) {
            const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(x);
            const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(x);
            const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(x);
            return `${ye}-${mo}-${da}`;
        }
        return '    ';
    });
    let cS = arr.map(x => parseBy(x, 'comment')).map(x => x.replace(/!/g, '')).map(x => typeof x === 'undefined' ? '       ' : x);

    let uMaxLength = Math.min(uW, uS.map(x => x.length).max());
    let dMaxLength = Math.min(dW, dS.map(x => x.length).max());
    let cMaxLength = Math.min(cW, cS.map(x => x.length).max());

    let iPart = ` !  `;
    let uPart = `  ${"user".padEnd(uMaxLength)}  `;
    let dPart = `  ${"date".padEnd(dMaxLength)}  `;
    let cPart = `  ${"comment".padEnd(cMaxLength)}  `;
    let full = iPart + '|' + uPart + '|' + dPart + '|' + cPart;
    console.log(full);
    console.log('-'.repeat(full.length));

    for (let i = 0; i < arr.length; i++) {

        let iPart = ` ${iS[i] > 0 ? '!' : ' '}  `;
        let uPart = `  ${uS[i].length > uW ? uS[i].substring(0, uW - 3) + '...' : uS[i].padEnd(uMaxLength)}  `;
        let dPart = `  ${dS[i].length > dW ? dS[i].substring(0, dW - 3) + '...' : dS[i].padEnd(dMaxLength)}  `;
        let cPart = `  ${cS[i].length > cW ? cS[i].substring(0, cW - 3) + '...' : cS[i].padEnd(cMaxLength)}  `;
        console.log(iPart + '|' + uPart + '|' + dPart + '|' + cPart);
    }


    /*
    for (const e of arr)
        console.log(e);

     */
}


// user; date; importance; comment
function parseBy(todo, field = "user") {
    let splittedTodo = todo.split(';');
    if (splittedTodo.length === 3 || field === 'importance' || field === 'comment') {
        switch (field) {
            case 'user':
                return splittedTodo[0].replace(/\/\/\W*todo\W+/gi, "").toLowerCase();
            case 'date':
                return new Date(splittedTodo[1].trim());
            case 'importance':
                return countItem(todo, '!');
            case 'comment':
                if (splittedTodo.length === 3) {
                    return splittedTodo[2].trim();
                }
                return todo.replace(/\/\/\W*todo\W+/gi, "").trim();
        }
    }
    return undefined;
}

function sortBy(a, b, field = 'user') {
    let a_c = parseBy(a, field);
    let b_c = parseBy(b, field)
    let type = field === 'user' ? 'string' : field === 'date' ? 'object' : 'number';

    if (typeof a_c === 'undefined' && typeof b_c !== 'undefined') return 1;
    if (typeof a_c !== 'undefined' && typeof b_c === 'undefined') return -1;
    if (typeof a_c === 'undefined' && typeof b_c === 'undefined') return 0;

    if (type === 'string') return a_c.localeCompare(b_c);

    return b_c - a_c
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0)
            break;
        case 'show':
            logElements(getTodos());
            break;
        case 'important':
            logElements(getTodos(filterFunc = x => countItem(x, '!')));
            break;
        default:
            if (/^(user )/.test(command)) {
                let username = command.substring(5).toLowerCase();
                logElements(getTodos(filterFunc = x => parseBy(x) === username));
            } else if (/^(sort )/.test(command)) {
                let type = command.substring(5);
                let todos = getTodos()
                logElements(todos.sort((a, b) => sortBy(a, b, type)));
            } else if (/^(date )/.test(command)) {
                let date = new Date(command.substring(5).trim());
                logElements(getTodos(filterFunc = (x) => parseBy(x, 'date') - date >= 0));
            } 
            else
                console.log('wrong command');
            break;
    }
}

function getTodos(filterFunc = x => x, sortFunc = (a, b) => countItem(b, '!') - countItem(a, '!')) {
    return files
        .map(file => file.match(/\/\/.*todo.*/gi))
        .flat(Infinity)
        .filter(filterFunc)
        .sort(sortFunc);
}

function countItem(string, item) {
    return string.split('').reduce((p, i) => i === item ? p + 1 : p, 0);
}

// TODO you can do it!
// todo burn in Hell !

const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const todos = [];

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function makeTODO() {
    if (todos.length == 0) {
        for (let file of files) {
            file = file.split("\n");
            for (const line of file) {
                let idx = line.indexOf("// TODO ");
                if (idx > -1) {
                    let todo = line.substring(idx);
                    todos.push(todo);
                }
            }
        }
    }
}

function showTODO() {
    for (const todo of todos) {
        console.log(todo);
    }
}

function importantTODO() {
    for (const todo of todos) {
        if (todo.indexOf("!") > -1) {
            console.log(todo);
        }
    }
}

function sortImportantTODO() {
    let mapTODO = new Map();

    for (const todo of todos) {
        mapTODO.set(todo, todo.split("").filter(x => x === '!').length);
    }

    const mapTODOSort = new Map([...mapTODO.entries()].sort((a, b) => b[1] - a[1]));

    for (const todo of mapTODOSort) {
        console.log(todo[0]);
    }
}

function userTODO(username) {
    for (const todo of todos) {
        const splitStr = todo.split(";");
        if (splitStr.length == 3 & splitStr[0].toLowerCase() === "// todo " + username.toLowerCase()) {
            console.log(todo);
        }

    }
}

function sortUserTODO() {
    let userTODO = new Map();

    for (const todo of todos) {
        const splitStr = todo.split(";");
        let userName = "";
        if (splitStr.length == 3) {
            userName = splitStr[0].substring(8).toLowerCase();
        }
        if (!userTODO.has(userName)) {
            userTODO.set(userName, []);
        }
        userTODO.get(userName).push(todo);
    }

    console.log(userTODO);
}

function sortDateTODO() {
    let dateTODO = new Map();
    let dateless = [];

    for (const todo of todos) {
        const splitStr = todo.split(";");
        let date = "";
        if (splitStr.length == 3) {
            date = splitStr[1];

            if (!dateTODO.has(date)) {
                dateTODO.set(date, []);
            }
            dateTODO.get(date).push(todo);
        } else {
            dateless.push(todo);
        }
    }

    let sortedDateTODO = new Map([...dateTODO.entries()].sort().reverse());
    sortedDateTODO.set("", dateless);

    console.log(sortedDateTODO);
}

function showAfterDate(dateAfter) {
    for (const todo of todos) {
        const splitStr = todo.split(";");
        if (splitStr.length === 3) {
            date = splitStr[1].trimLeft();
            if (date > dateAfter) {
                console.log(todo);
            }
        }
    }
}

function processCommand(command) {
    makeTODO();

    switch (command.split(" ")[0]) {

        case 'user':
            let userName = command.split(" ")[1];
            if (userName != undefined) {
                userTODO(userName.toLowerCase());
            }
            break;
        case 'sort':
            let sorting = command.split(" ")[1];
            if (sorting === "importance") {
                sortImportantTODO();
            } else if (sorting === "user") {
                sortUserTODO();
            } else if (sorting === "date") {
                sortDateTODO();
            }
            break;
        case 'date':
            let newDate = command.split(" ")[1];
            if (newDate != undefined) {
                showAfterDate(newDate);
            }
            break;
        case 'show':
            showTODO();
            break;
        case 'important':
            importantTODO();
            breal;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

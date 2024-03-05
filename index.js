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
    const dateRegex = /\d{4}-\d\d-\d\d/

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const todos = getTodos();
            todos.forEach(todo => {
                printTodo(todo);
            });
            break;
        case 'important':
            const allTodos = getTodos();
            allTodos.forEach(todo => {
                if (todo.includes("!")) {
                    printTodo(todo);
                }
            });
            break;
        case 'sort important':
            const allSortImportantTodos = getTodos();
            const elseTodos = [];
            allSortImportantTodos.forEach(todo => {
                if (todo.includes("!")) {
                    printTodo(todo);
                } else {
                    elseTodos.push(todo);
                }
            });
            elseTodos.forEach(todo => {
                printTodo(todo);
            });
            break;
        case 'sort user':
            sortUsers();
            break;
        case 'sort date':
            const todoList = getTodos();

            const datesWithTodos = new Map();

            todoList.forEach(todo => {
                const match = dateRegex.exec(todo)

                if (match) {
                    const dateStr = todo.slice(match.index, match.index + 10);

                    const date = new Date(dateStr);

                    if (datesWithTodos.has(date)) {
                        const dateTodos = datesWithTodos.get(date);
                        datesWithTodos.set(date, dateTodos + todo);
                    } else {
                        datesWithTodos.set(date, [todo]);
                    }
                }
            });

            const sorted = Array.from(datesWithTodos).sort((a, b) => a[0] - b[0]);

            sorted.forEach(todo => {
                printTodo(todo.flat(Infinity)[1]);
            })
    }

    if (command.includes("user")) {
        const allUserTodos = getTodos();
        const userName = command.split(" ")[1];

        allUserTodos.forEach(todo => {
            const curUserName = todo.substring(8, todo.indexOf(";"));
            if (userName.toLowerCase() === curUserName.toLowerCase()) {
                printTodo(todo);
            }
        });
    }
}

function getTodos() {
    const todos = [];
    files.forEach(file => {
        const lines = file.split('\n');
        lines.forEach(line => {
            if (line.includes('// TODO')) {
                const comment = line.slice(line.indexOf('// TODO'));
                if (comment[7] === " ") {
                    todos.push(comment);
                }
            }
        });
    });

    return todos;
}

function sortUsers() {
    const allUserTodos = getTodos();
    const users = {};
    users["missing"] = [];

    allUserTodos.forEach(todo => {
        const index = todo.indexOf(";");
        if (index === -1) {
            users["missing"].push(todo);
        } else {
            const curUserName = todo.substring(8, index).toLowerCase();
            if (users[curUserName] !== undefined) {
                users[curUserName].push(todo);
            } else {
                users[curUserName] = [todo];
            }
        }
    });

    for (const user in users) {
        if (user === "missing") {
            continue;
        }
        for (const todo of users[user]) {
            printTodo(todo);
        }
    }

    for (const todo of users["missing"]) {
        printTodo(todo);
    }
}

function printTodo(todo) {
    const indices = [];
    for (let i = 0; i < todo.length; i++) {
        if (todo[i] === ';') {
            indices.push(i);
        }
    }

    if (indices.length === 0) {
        const comment = todo.slice(7);
        const strMissing = "missing";
        if (todo.includes("!")) {
            console.log(`! | ${strMissing.padEnd(20, " ")}| ${strMissing.padEnd(10, " ")} | ${comment}`);
        } else {
            console.log(`! | ${strMissing.padEnd(20, " ")}| ${strMissing.padEnd(10, " ")} | ${comment}`);
        }
        return;
    }

    const username = todo.slice(8, indices[0]);
    const date = todo.slice(indices[0] + 2, indices[1]);
    let comment = todo.slice(indices[1] + 1);
    if (comment.length > 100) {
        comment = `${comment.slice(0, 100)}...`
    }

    if (todo.includes("!")) {
        console.log(`! | ${username.padEnd(20, " ")}| ${date} | ${comment}`);
    } else {
        console.log(`  | ${username.padEnd(20, " ")}| ${date} | ${comment}`);
    }
}

// TODO you can do it!

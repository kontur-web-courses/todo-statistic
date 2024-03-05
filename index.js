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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show todo':
            const todos = getTodos();
            todos.forEach(todo => {
                console.log(`${todo}\n`);
            });
            break;
        case 'important todo':
            const allTodos = getTodos();
            allTodos.forEach(todo => {
                if (todo.includes("!")) {
                    console.log(`${todo}\n`);
                }
            });
            break;
    }

    if (command.includes("user"))
    {
        const allUserTodos = getTodos();
        const userName = command.split(" ")[1];

        allUserTodos.forEach(todo => {
            const curUserName = todo.substring(8, todo.indexOf(";"));
            if (userName.toLowerCase() === curUserName.toLowerCase()) {
                console.log(todo);
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

// TODO you can do it!

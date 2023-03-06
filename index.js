const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");
const todoString = "// " + "TODO";

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
  return filePaths.map((path) => readFile(path));
}

function filterByUser(todos, username) {
  return todos.filter(
    (todo) => todo.user.toLowerCase() === username.toLowerCase()
  );
}

function filterByDates(todos) {
    todos.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
      });
    return todos;
}

function showTodos(todos) {
  todos.forEach((todo) => console.log('*' + todo.text));
}

function filterByImportance(todos) {
  const important = todos.filter((todo) => /!/.test(todo.text));
  const other = todos.filter((todo) => !/!/.test(todo.text));
  return [...important, ...other];
}

function filterByUsers(todos) {
    let userNames = new Set();
    let output = [];
    todos.forEach(todo => {
        userNames.add(todo.user);
    });

    userNames.forEach(userName => {
        filterByUser(todos, userName).forEach(el => {
            output.push(el);
        })
    });
    return output;
}

function getTodos() {
  const todos = [];
  const files = getFiles();
  for (const file of files) {
    const lines = file.split("\n");
    lines.forEach((line, index) => {
      if (line.includes(todoString)) {
        const startIndex = line.indexOf(todoString) + 8;
        const endIndex =
          line.lastIndexOf("!", startIndex) === -1
            ? line.length
            : line.lastIndexOf("!");
        const todoText = line.substring(startIndex, endIndex + 1).trim();
        const userMatch = line.match(/\/\/ TODO (.+?);/i);
        const dateMatch = new Date(todoText.split(';')[1]);
        todos.push({
          text: todoText,
          file,
          line: index + 1,
          priority: line.includes("!"),
          user: userMatch ? userMatch[1] : "unknown",
          date: dateMatch
        });
      }
    });
  }
  return todos;
}

function showImportantTodos() {
  const todos = getTodos().filter((todo) => todo.text.includes("!"));
  showTodos(todos);
}

function processCommand(command) {
  switch (command.split(" ")[0]) {
    case "show":
      showTodos(getTodos());
      break;
    case "important":
      showImportantTodos();
      break;
    case "user":
      const username = command.substring(5).toLowerCase();
      showTodos(filterByUser(getTodos(), username));
    case "sort":
        switch (command.split(" ")[1]) {
            case "importance":
                showTodos(filterByImportance(getTodos()));
                break;
            case "user":
                showTodos(filterByUsers(getTodos()));
                break;
            case "date":
                showTodos(filterByDates(getTodos()));
                break;
            default:
                console.log("Unknown filter");
        }
        break;
    case "exit":
      process.exit(0);
    default:
      console.log(`Unknown command: ${command}`);
  }
}

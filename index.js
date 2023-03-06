const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");
const fs = require("fs");
const readline = require("readline");

const files = getFiles();

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
  return filePaths.map((path) => readFile(path));
}

function findTodoComments() {
  const files = getFiles();
  const todos = [];

  for (const file of files) {
    const contents = fs.readFileSync(file, "utf8");
    const lines = contents.split("\n");

    for (const line of lines) {
      const match = line.match(/\/\/ TODO(?: (.*?);(?: (.*?);)?)? (.*)/i);
      if (match) {
        const [, author = "", date = "", text] = match;
        todos.push({ file, line, author, date, text });
      }
    }
  }

  return todos;
}

function filterByUser(todos, username) {
  return todos.filter(
    (todo) => todo.user.toLowerCase() === username.toLowerCase()
  );
}

function showTodos(todos) {
  todos.forEach((todo) => console.log(`${todo.line} - ${todo.text}`));
}

function filterByImportance(todos) {
  const important = todos.filter((todo) => /!/.test(todo.text));
  const other = todos.filter((todo) => !/!/.test(todo.text));
  return [...important, ...other];
}

function getTodos() {
  const todos = [];
  const files = getFiles();
  for (const file of files) {
    const lines = file.split("\n");
    lines.forEach((line, index) => {
      if (line.includes("// TODO")) {
        const startIndex = line.indexOf("// TODO") + 8;
        const endIndex =
          line.indexOf("!", startIndex) === -1
            ? line.length
            : line.indexOf("!", startIndex);
        const todoText = line.substring(startIndex, endIndex + 1).trim();
        const userMatch = line.match(/\/\/ TODO (.+?);/i);
        const dateMatch = line.match(/\/\/ TODO .+?; (.+)/i);
        todos.push({
          text: todoText,
          file,
          line: index + 1,
          priority: line.includes("!"),
          user: userMatch ? userMatch[1] : "unknown",
          date: dateMatch ? dateMatch[1] : "unknown",
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
    case "exit":
      process.exit(0);
    default:
      console.log(`Unknown command: ${command}`);
  }
}

// TODO you can do it!

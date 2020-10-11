const { readLine } = require("./console");
const { TaskManager } = require("./taskManager");

let taskManager = new TaskManager();

console.log("Please, write your command!");
readLine(processCommand);

function processCommand(command) {
  let command_args = command.split(" ");
  let command_name = command_args[0];

  switch (command_name) {
    case "exit":
      process.exit(0);
      break;
    case "show":
      console.log(taskManager.getAllTasks().map((task) => task.taskString));
      break;
    case "important":
      console.log(
        taskManager.getImportantTasks().map((task) => task.taskString)
      );
      break;
    case "user":
      console.log(
        taskManager.getByName(command_args[1]).map((task) => task.taskString)
      );
      break;
    case "sort":
      console.log(
        taskManager.getSortedBy(command_args[1]).map((task) => task.taskString)
      );
      break;
    default:
      console.log("wrong command");
      break;
  }
}
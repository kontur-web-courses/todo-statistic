const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { TodoTask } = require("./todoTask");

const task_regex = /\/\/ TODO ((.*);\ ?(.*);)?.*/g;

const SortType = {
  IMPORTANCE: "importance",
  USER: "user",
  DATE: "date",
};

class TaskManager {
  constructor() {
    if (!this.taskCache) {
      let files = getFiles();
      this.taskCache = files
        .map((fileText) => findTasksInFile(fileText))
        .reduce((a, b) => a.concat(b))
        .map((taskString) => new TodoTask(taskString));
    }
  }

  getAllTasks() {
    return this.taskCache.slice();
  }

  getImportantTasks() {
    return this.taskCache.filter((task) => task.importance > 0);
  }

  getByName(name) {
    return this.taskCache.filter((task) => {
      return task.userName && task.userName === name.toLowerCase();
    });
  }

  getSortedBy(sortType) {
    switch (sortType) {
      case SortType.IMPORTANCE:
        return this.taskCache.sort((a, b) => {
          return b.importance - a.importance;
        });
      case SortType.USER:
        return this.taskCache.sort((a, b) => {
          if (!a.userName || !b.userName)
            return +(b.userName ? true : false) - +(a.userName ? true : false);

          return a.userName.localeCompare(b.userName);
        });
      case SortType.DATE:
        return this.taskCache.sort((a, b) => {
          if (!a.creationDate || !b.creationDate)
            return +(b.creationDate ? true : false) - +(a.creationDate ? true : false);

          return b.creationDate - a.creationDate;
        });
      default:
        console.log(`[ERROR] Could not sort tasks by ${sortType}`);
        return [];
    }
  }
}

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
  return filePaths.map((path) => readFile(path));
}

function findTasksInFile(fileText) {
  let match = fileText.match(task_regex);
  return match || [];
}

module.exports = {
  TaskManager,
};

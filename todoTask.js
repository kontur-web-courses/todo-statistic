const task_regex = /\/\/ TODO ((.*);\ ?(.*);)?.*/g;

function calculateImportance(taskString)
{
  return (taskString.match(/!/g) || []).length;
}

class TodoTask {
    constructor(taskString) {
      task_regex.lastIndex = 0;
      let match = task_regex.exec(taskString);

      this.taskString = taskString; 
      this.importance = calculateImportance(taskString);
      this.userName = match[2] && match[2].toLowerCase();
      this.creationDate = match[3] && new Date(match[3]);
    }
  }

  module.exports = {
    TodoTask,
  };
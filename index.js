const { getAllFilePathsWithExtension, readFile } = require('./fileSystem')
const { readLine } = require('./console')

const files = getFiles()

console.log('Please, write your command!')
readLine(processCommand)

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js')
  return filePaths.map((path) => readFile(path))
}

function processCommand(command) {
  let todos = getTodos()
  let result = []
  command = command.split(' ')
  let additional = command[1]
  switch (command[0]) {
    case 'show':
      for (const todo of makeTODOTable(todos)) console.log(todo)
      break
    case 'important':
      todos.forEach((element) => {
        if (element.com.includes('!')) result.push(element)
      })
      for (const element of makeTODOTable(result)) console.log(element)
      break
    case 'user':
      let name = new RegExp('^' + additional + '$', 'i')
      todos.forEach((element) => {
        if (name.test(element.name)) result.push(element)
      })
      for (const todo of makeTODOTable(result)) console.log(todo)
      break
    case 'sort':
      todos = sortTodos(additional, todos)
      for (const todo of makeTODOTable(todos)) console.log(todo)
      break
    case 'date':
      let year = additional.split('-')[0]
      let month = additional.split('-')[1] || 1
      let day = additional.split('-')[2] || 1
      let date = new Date(year + '-' + month + '-' + day)
      todos.forEach((element) => {
        if (new Date(element.date) >= date) result.push(element)
      })
      for (const todo of makeTODOTable(result)) console.log(todo)
      break
    case 'exit':
      process.exit(0)
      break
    default:
      console.log('wrong command')
      break
  }
}

function getTodos() {
  let todos = files.map((file) => file.match(/\/\/.*todo.*/gi)).flat(Infinity)
  let result = getArrObj(todos)
  return result
}

function getArrObj(todos) {
  let todosArr = []
  for (let todo of todos) {
    let newCom = todo.split(';')
    if (newCom.length < 2)
      todosArr.push({
        com: newCom[0].slice(8)
      })
    else
      todosArr.push({
        name: newCom[0].slice(8),
        date: newCom[1].slice(1),
        com: newCom[2].slice(1)
      })
  }
  return todosArr
}

/*function makeTODOString(todos){
    let result = todos
    .map(value=> value = "// TO" + `DO ${value.name !== undefined? value.name+"; ": ""}${value.date !== undefined? value.date+"; ": ""}${value.com}`);
    return result;
}*/

function makeTODOTable(todos) {
  let lengths = findMax(todos)
  let result = todos.map(
    (value) =>
      (value =
        `  ${value.com.includes('!') ? '!' : ' '}  |` +
        `  ${
          value.hasOwnProperty('name')
            ? value.name.length <= lengths.name
              ? value.name.padEnd(lengths.name)
              : value.name
                  .substring(0, lengths.name - 3)
                  .padEnd(lengths.name, '.')
            : ''.padEnd(lengths.name)
        }  |` +
        `  ${
          value.hasOwnProperty('date')
            ? value.date.length <= lengths.date
              ? value.date.padEnd(lengths.date)
              : value.date
                  .substring(0, lengths.date - 3)
                  .padEnd(lengths.date, '.')
            : ''.padEnd(lengths.date)
        }  |` +
        `  ${
          value.com.length <= lengths.com
            ? value.com.padEnd(lengths.com)
            : value.com.substring(0, lengths.com - 3).padEnd(lengths.com, '.')
        }`)
  )
  let lending = `  !  |  ${'user'.padEnd(lengths.name)}  |  ${'date'.padEnd(
    lengths.date
  )}  |  ${'comment'.padEnd(lengths.com)}  `
  result.unshift(`${''.padEnd(lending.length, '-')}`)
  result.push(`${''.padEnd(lending.length, '-')}`)
  result.unshift(lending)
  return result
}

function findMax(todos) {
  let lengths = { name: 4, date: 4, com: 7 }
  todos.forEach((value) => {
    if (value.hasOwnProperty('name') && value.name.length > lengths.name)
      lengths.name = value.name.length > 10 ? 10 : value.name.length
    if (value.hasOwnProperty('date') && value.date.length > lengths.date)
      lengths.date = value.date.length > 10 ? 10 : value.date.length
    if (value.com.length > lengths.com)
      lengths.com = value.com.length > 50 ? 50 : value.com.length
  })
  return lengths
}

function sortTodos(sortItem, todos) {
  switch (sortItem) {
    case 'importance':
      return todos.sort(
        (a, b) =>
          (b.com.match(/!/g) || []).length - (a.com.match(/!/g) || []).length
      )
    case 'user':
      return todos.sort((a, b) => (a.name < b.name ? -1 : 1))
    case 'date':
      return todos.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
}

// TODO you can do it!

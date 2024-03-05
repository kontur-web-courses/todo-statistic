let test = '// TODO Имя автора; Дата комментария; текст комментария'

regex = /\/\/ TODO\s*(.*)\s*;\s*(.*)\s*;\s*(.*)/;

let something = test.match(regex);
console.log(something[1]);
console.log(something == null);


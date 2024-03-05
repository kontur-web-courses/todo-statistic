const greedyTodo = new RegExp('\/\/ ?TODO ?.*$', 'gm');
const todoDeclaration = new RegExp('\/\/ ?TODO ?', 'gm');


function priority(todoText) {
    let p = 0;
    for (const c of todoText) {
        if (c === '!')
            p += 1;
    }

    return p;
}


function todos(text) {
    let allTodos = greedyTodo.exec(text);
    if (allTodos === null)
        return [];

    let todos = [];
    for (const todoText of allTodos) {
        todos.push({
            text: todoText.replace(todoDeclaration, ''),
            priority: priority(todoText)
        });
    }

    return todos;
}

module.exports = {
    todos
};
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

function full(todoText) {
    let components = todoText.split(';', 3).map(c => c.trim());
    if (components.length < 3)
        return null;

    let date = Date.parse(components[1]);
    if (date == null)
        return null;

    return {
        type: 'full',
        user: components[0],
        date: date,
        text: components[2],
        priority: priority(components[2])
    };
}

function truncated(todoText) {
    return {
        type: 'truncated',
        text: todoText,
        priority: priority(todoText)
    };
}


function todos(text) {
    let allTodos = greedyTodo.exec(text);
    if (allTodos === null)
        return [];

    let todos = [];
    for (const todoText of allTodos) {
        let text = todoText.replace(todoDeclaration, '');
        let todo = full(text) ?? truncated(text);
        todos.push(todo);
    }

    return todos;
}

module.exports = {
    todos
};
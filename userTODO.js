function userTODO (filesWithTODO, username) {
    const todoArray = filesWithTODO
        .map(file => file.split('\n'));
    let result = [];
    let regEx = /\/\/\s*TODO[\s:;]([\w\s]+);\s*([\d-]+);\s*(.*)/gi;
    for (let item of todoArray)
        for (let str of item) {
            if (str.match(regEx)  && regEx.exec(str)[1].toLowerCase() === username.toLowerCase()) {
                result.push(str.slice(str.indexOf('//')));
            }
        }
    console.log(result);
}

module.exports = {
    userTODO
};
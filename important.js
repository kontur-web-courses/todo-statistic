function important (filesWithTODO) {
    const todoArray = filesWithTODO
        .map(file => file.split('\n'));
    let result = [];
    let regEx = /\/\/ TODO.*!$/gim
    for (let item of todoArray)
        for (let str of item)
            if (str.match(regEx))
                result.push(str.slice(str.indexOf('//')));
    console.log(result);
}

module.exports = {
    important
};
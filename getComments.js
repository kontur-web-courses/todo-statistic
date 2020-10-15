function getComments (files) {
    const todoArray = files.map(file =>  file.split('\n'))
    let result = []
    let regEx = /\/\/ TODO.*/gi
        for (let item of todoArray){
            for (let str of item){
                if (str.match(regEx) && !str.includes('\r')){
                    result.push(str
                        .slice(str.indexOf('//')))
                }
            }
        }
    return result;
}

module.exports = {
    getComments: getComments
};
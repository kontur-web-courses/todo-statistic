function readLine(callback) {
    process.stdin.setEncoding('utf8'); 
    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            const line = chunk.trim();
            callback(line);
        }
    });
}

module.exports = {
    readLine,
};

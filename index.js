const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");

const files = getFiles();

console.log("Please, write your command!");
readLine(processCommand);

function getFiles() {
	const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
	return filePaths.map((path) => readFile(path));
}

function processCommand(command) {
	const commandContext = command.split(" ");
	switch (commandContext[0]) {
		case "date":
			const date = commandContext[1];
			formatPrint(getNextDateTODO(getAllTODO(), date));
			break;
		case "sort":
			const parameter = commandContext[1];
			formatPrint(sortByParameter(getAllTODO(), parameter));
			break;
		case "user":
			const username = commandContext[1];
			formatPrint(getUserTODO(getAllTODO(), username));
			break;
		case "important":
			formatPrint(getImportants(getAllTODO()));
			break;
		case "show":
			formatPrint(getAllTODO());
			break;
		case "exit":
			process.exit(0);
			break;
		default:
			console.log("wrong command");
			break;
	}
}

function formatPrint(data) {
	for (let line of data) {
		const importance = line.indexOf("!") > -1 ? "!" : " ";
		const lineWithoutTODO = line.slice(8);
		const parts = lineWithoutTODO.split(";");
		let name = (parts.length === 3 ? parts[0] : "").padEnd(11);
		name = name.length > 10 ? name.slice(0, 7).concat("...") : name;
		let date = (parts.length === 3 ? parts[1] : "").padEnd(11);
		let text = parts.length === 3 ? parts[2].trim() : lineWithoutTODO;
		text = text.length > 50 ? text.slice(0, 47).concat("...") : text;
		console.log(`${importance}  |  ${name}  |  ${date}  | ${text}`);
	}
}

function getAllTODO() {
	return files.join().match(/\/\/ TODO [^\r]*/g);
}

function getImportants(todos) {
	return todos.filter((el) => el.indexOf("!") > -1);
}

function getUserTODO(todos, username) {
	return todos.filter(
		(el) =>
			el.split(";")[0].slice(8).toLowerCase() === username.toLowerCase()
	);
}

function sortByParameter(todos, parameter) {
	switch (parameter) {
		case "importance":
			return todos.sort(
				(a, b) => b.split("!").length - a.split("!").length
			);
		case "user":
			return todos
				.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
				.sort((a, b) => b.split(";").length - a.split(";").length);
		case "date":
			let withDate = todos.filter((el) => el.split(";").length === 3);
			let withoutDate = todos.filter((el) => el.split(";").length !== 3);
			return withDate
				.sort((a, b) => {
					a = new Date(a.split(";")[1]);
					b = new Date(b.split(";")[1]);
					return a > b ? -1 : a < b ? 1 : 0;
				})
				.concat(withoutDate);
	}
}

function getNextDateTODO(todos, date) {
	// Сортировочка не обязательно, поэтому копипастим =)
	return todos
		.filter((el) => {
			const parts = el.split(";");
			return parts.length === 3 && new Date(parts[1]) > new Date(date);
		})
		.sort((a, b) => {
			a = new Date(a.split(";")[1]);
			b = new Date(b.split(";")[1]);
			return a > b ? -1 : a < b ? 1 : 0;
		});
}

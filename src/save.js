// it's unrealized module. here you can write your own implementation to save results to database or file, for example.

const { promisify } = require("util");
const writeFile = promisify(require("fs").writeFile);

module.exports = { writeFile };

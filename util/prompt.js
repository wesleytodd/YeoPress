var Prompt = require('prompt-improved');

var chalk = Prompt.chalk;

module.exports = new Prompt({
	prefix: chalk.grey('[') + chalk.green('?') + chalk.grey(']') + ' ',
	textTheme: chalk.white,
	defaultTheme: chalk.gray,
	suffix: ':'
});

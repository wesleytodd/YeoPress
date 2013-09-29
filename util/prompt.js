var Prompt = require('prompt-improved');
module.exports = new Prompt({
	prefix: Prompt.chalk.white('[') + Prompt.chalk.green('?') + Prompt.chalk.white(']') + ' ',
	textTheme: Prompt.chalk.white,
	defaultTheme: Prompt.chalk.gray,
	suffix: ':'
});

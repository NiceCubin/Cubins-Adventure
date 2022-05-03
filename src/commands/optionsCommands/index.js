const Category = require('../../structures/Category');

module.exports = new Category({
  dirname: __dirname,
  triggers: ['options', 'config'],
  description: 'commands of options for servers and users.',
  emojiID: '844639950892040203',
  hidden: false
});
const Category = require('../../structures/Category');

module.exports = new Category({
  dirname: __dirname,
  triggers: ['information', 'info'],
  description: 'commands that give information surrounding the bot and more.',
  emojiID: '883185955316572202',
  hidden: false
});
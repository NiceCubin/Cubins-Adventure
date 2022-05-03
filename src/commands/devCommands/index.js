const Category = require('../../structures/Category');

module.exports = new Category({
  dirname: __dirname,
  triggers: ['developer', 'dev'],
  description: 'commands categorically for the developers of this bot to use.',
  emojiID: '883708356085297242',
  hidden: true
});
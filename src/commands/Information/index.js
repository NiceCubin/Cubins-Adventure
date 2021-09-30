const fs = require("fs");
const path = require("path");
const Category = require("../../structures/Category");

const commands = fs.readdirSync(__dirname)
  .filter(cmd => cmd !== "index.js")
  .map(cmd => require(`${__dirname}/${cmd}`));
const name = path.basename(__dirname);

module.exports = new Category({
  commands,
  name,
  description: "gives information about the bot.",
  emojiID: "883185955316572202"
});
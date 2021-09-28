module.exports = {
  getEmojiImage: emojiID => `https://cdn.discordapp.com/emojis/${emojiID}.png`,
  cleanText(text) {
    const formatChars = ["\\", "*", "_", "`", ">"];
    formatChars.forEach(char => text = text.replaceAll(char, `\\${char}`));
    return text;
  }
}
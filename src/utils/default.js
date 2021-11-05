module.exports = {
  getEmojiIcon(emoji) {
    if (emoji == null) return;
    
    if (emoji.animated) {
      return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
    }
    
    return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;
  },

  getCamelCase(str) {
    str = str.toLowerCase();
    
    str = str.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());

    return str;
  }
}
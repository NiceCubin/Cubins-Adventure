module.exports = {
  getEmojiIcon(emoji) {
    if (emoji == undefined) return;
    
    if (emoji.animated) {
      return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
    }
    
    return `https://cdn.discordapp.com/emojis/${emoji.id}.png`
    },

  getCamelCase(str) {
    str = str.toLowerCase();
    
    str = str.replaceAll(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());

    return str;
  }
}
module.exports = {
  getEmojiIcon(emoji) {
    if (emoji == undefined) return
    
    if (emoji.animated) {
      return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
    }
    
    return `https://cdn.discordapp.com/emojis/${emoji.id}.png`
    },
  
  cleanText(text) {
    const formatChars = ["\\", "*", "_", "`", ">"];
    
    formatChars.forEach(char => text = text.replaceAll(char, `\\${char}`));
    
    return text;
  },

  getCamelCase(text) {
    text = text.toLowerCase();
    
    text = text.replaceAll(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());

    return text;
  }
}
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
  },

  parseTime(time) {
    let totalSeconds = time / 1000;
    
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
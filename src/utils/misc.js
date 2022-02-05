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
  
  parseTime(time, short = false) {
    let totalSeconds = time / 1000;
    
    const weeks = Math.floor(totalSeconds / 604800);
    totalSeconds %= 604800;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    const seconds = Math.floor(totalSeconds);
    
    let times = [];
    
    if (weeks) times.push(`${weeks}${short ? 'w' : ` week${weeks === 1 ? '' : 's'}`}`);
    if (days) times.push(`${days}${short ? 'd' : ` day${days === 1 ? '' : 's'}`}`);
    if (hours) times.push(`${hours}${short ? 'h' : ` hour${hours === 1 ? '' : 's'}`}`);
    if (minutes) times.push(`${minutes}${short ? 'm' : ` minute${minutes === 1 ? '' : 's'}`}`);
    if (seconds) times.push(`${seconds}${short ? 's' : ` second${seconds === 1 ? '' : 's'}`}`);
    
    return times.join(', ').replace(/(,\s)(?!.*,\s)/, times.length >= 3 ? ', and ' : ' and ');
  },
  
  updateJsonFile(file, data) {
    require('fs').writeFileSync(file, JSON.stringify(data, null, 2));
  }
}
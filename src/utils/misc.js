const { writeFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
  getEmojiIcon(emoji) {
    if (emoji.animated) {
      return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
    }
    
    return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;
  },

  punctualJoin(arr) {
    if (arr.length <= 2) {
      return arr.join(' and ');
    }
    
    return `${arr.slice(null, -1).join(', ')}, and ${arr[arr.length - 1]}`;
  },
  
  toCamelCase(str) {
    str = str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
    
    return str;
  },
  
  parseTime(time, short = false) {
    const timeUnits = [
      { name: 'day', short: 'd', count: 86400 },
      { name: 'hour', short: 'h', count: 3600 },
      { name: 'minute', short: 'm', count: 60 },
      { name: 'second', short: 's', count: 1 }
    ];

    const times = [];
    
    for (let i = 0; i < timeUnits.length; i++) {
      const unitValue = ~~(time / timeUnits[i].count);
      const unitFormat = short ? timeUnits[i].short : ` ${timeUnits[i].name}${unitValue === 1 ? '' : 's'}`;
      
      if (unitValue) {
        times.push(`${unitValue}${unitFormat}`);
      }

      time %= timeUnits[i].count;
    }

    if (times.length <= 2) {
      return times.join(' and ');
    }
    
    return `${times.slice(null, -1).join(', ')}, and ${times[times.length - 1]}`;
  },
  
  updateJsonFile(file, run) {
    const data = require(resolve(file));
    
    run(data);
    writeFileSync(file, JSON.stringify(data, null, 2));
  },
  
  toCodeBlock(str, lang = '') {
    return `\`\`\`${lang}\n${str}\n\`\`\``;
  },

  getRandomColor() {
    return Math.floor(Math.random() * (0xFFFFFF + 1));
  }
}
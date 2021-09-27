const Discord = require("discord.js");
const Client = require("./Client.js");

class Event {
  constructor(event, runFunction) {
    this.event = event;
    this.run = runFunction;	
  }
}

module.exports = Event;
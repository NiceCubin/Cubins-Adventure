class Event {
  constructor(options) {
    this.event = options.event;
    this.once = options.once ?? false;
    this.run = options.run;
  }
}

module.exports = Event;
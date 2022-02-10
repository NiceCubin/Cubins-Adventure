class Event {
  constructor(options) {
    this.filename = options.filename;
    this.event = options.event;
    this.once = options.once;
    this.run = options.run;
  }
}

module.exports = Event;
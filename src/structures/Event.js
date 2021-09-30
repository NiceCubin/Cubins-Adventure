class Event {
  constructor(event, runFunction, once) {
    this.event = event;
    this.once = once ?? false;
    this.run = runFunction;
  }
}

module.exports = Event;
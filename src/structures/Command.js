class Command {
  constructor(options) {
    this.name = options.name;
    this.description = options.description;
    this.permissions = options.permissions ?? [];
    this.run = options.run;
  }
}

module.exports = Command;
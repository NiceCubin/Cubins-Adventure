class Command {
  constructor(options) {
    this.triggers = options.triggers;
    this.name = this.triggers[0];
    this.description = options.description;
    this.cooldown = options.cooldown ?? 0;
    this.permissions = options.permissions ?? [];
    this.usage = options.usage;
    this.run = options.run;
  }
}

module.exports = Command;
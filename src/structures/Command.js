class Command {
  constructor(options) {
    this.filename = options.filename;
    this.triggers = options.triggers;
    this.description = options.description;
    this.cooldown = options.cooldown;
    this.permissions = options.permissions;
    this.usage = options.usage;
    this.devOnly = options.devOnly;
    this.run = options.run;
    
    this.name = this.triggers[0];
  }
}

module.exports = Command;
const { MessageEmbed } = require("discord.js")

const embed = new MessageEmbed()

function error(description) {
  return embed
    .setTitle("Error...")
    .setDescription(description)
    .setColor("RED")
}

function win(description) {
  return embed
    .setTitle("You Win!")
    .setDescription(description)
    .setColor(0x00ff00)
}

function lose(description) {
  return embed
    .setTitle("You Lose...")
    .setDescription(description)
    .setColor(0xff0000)
}

function timeout(description) {
  return embed
    .setTitle("Timeout!")
    .setDescription(description ?? "You took too long to respond!")
    .setColor("RED")
}

module.exports = {
  invalid: description => ({title: "Oops!", description, color: "RED"}),
  error: description => ({title: "Error...", description, color: "RED"}),
    win: description => ({title: "You Won!", description, color: 0x00ff00}),
    lose: description => ({title: "You Lost...", description, color: 0xff0000}),
    timeout: description => ({title: "Timeout!", description, color: "RED"})
}
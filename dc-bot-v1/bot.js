console.log("here1");
const Discord = require('discord.js');
console.log("here");
const client = new Discord.Client();
const auth = require('./auth.json');
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
 if (msg.content === 'hello') {
  msg.reply('hi!');
 }
});
client.login(auth.token);
const Discord = require('discord.js');
//const client = new Discord.Client();
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

const ytdl = require("ytdl-core");

const PREFIX = '!';

const auth = require('./auth.json');

var servers = {}; // store queue songs

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    let args = message.content.substring(PREFIX.lenghth).split( " " );
    
    switch (args[0]){
        case 'ping':
            message.channel.send("Pong!");
            /*bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });*/
        break;

        case 'play':
            if(!args[1]){
                message.channel.send("You need to provide a link!");
                return;
            }
            if(!message.member.voice.channel){
                message.channel.send("You need to be in a voice Channel!");
                return; 
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: [] // important part 
            }
            
            //let us use the var server to manage the servers in their queue
            var server = servers[message.guild.id];

            if(!message.guild.voice.channel) message.member.voice.channel


        break;
    }

   /* if (msg.content === 'hello') {
  msg.reply('hi!');
 }*/
 
});
bot.login(auth.token);
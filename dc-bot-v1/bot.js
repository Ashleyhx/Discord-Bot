import{
    connectToChannel,
} from "./Functionality/VoiceChannel.js";
import { createRequire } from "module";

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
    generateDependencyReport,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';

const require = createRequire(import.meta.url);

const Discord = require('discord.js');

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const ytdl = require("ytdl-core");
//import * as ytdl from "ytdl-core";
const PREFIX = '!';

const token = 'OTgyMDMwNTE5ODUwMTE1MTMy.GdMN0C.e4I1rhW0q7dZBE1dlLFexdMVJw60oN5BgTmtbQ';
    //require('./auth.json');

var servers = {}; // store queue songs

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    let args = message.content.substring(PREFIX.lenghth).split( " " );
    
    switch (args[0]){
        case 'ping':
            message.channel.send("Pong!");
        break;

        case 'play':

            /*function play(connection, message){
                var server = servers[message.guild.id];

            }*/

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

            if(message.member.voice.channel){
                message.channel.send("[debug] in a voice channel");
                //const url = 'https://www.youtube.com/watch?v=NevKVKbCNy4&ab_channel=NTDM'
                //const stream = ytdl(url, {filter: 'audioonly'});
                //const player = createAudioPlayer();
                //const resource = createAudioResource(stream);
                //const GuildMember = message.author.id;
                //const connection = 
                joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                   adapterCreator: message.guild.voiceAdapterCreator            
                });
                //connection.subscribe(bot);
               // bot.play(resource);
                message.channel.send("[debug] success!");
            }
            /* message.member.voice.channel.joinVoiceChannel().then(function(connection){
                play(connection, message);
            })*/


        break;
    }

   /* if (msg.content === 'hello') {
  msg.reply('hi!');
 }*/
 
});
bot.login(token);
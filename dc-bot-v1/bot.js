import{
    connectToChannel,
} from "./Functionality/VoiceChannel.js";
import { createRequire } from "module";

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
    NoSubscriberBehavior,
    generateDependencyReport,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';

const require = createRequire(import.meta.url);

const Discord = require('discord.js');

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });

const ytdl = require("ytdl-core");

const PREFIX = '!';

const token = 'OTgyMDMwNTE5ODUwMTE1MTMy.GdMN0C.e4I1rhW0q7dZBE1dlLFexdMVJw60oN5BgTmtbQ';


var servers = {}; // store queue songs

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', message => {
    let args = message.content.substring(PREFIX.lenghth).split( " " );
    
    switch (args[0]){
        case 'ping':
            message.channel.send("Pong!");
        break;

        case 'play':
            //connection? below function not working since a lot of ... is out of date
            /*function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: 'audioonly'}));

                server.queue.shift();

                server.Discord.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else{
                        connection.disconnect();
                    }
                });
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
                message.channel.send("[debug] you are in a voice channel");
                const url = 'https://www.youtube.com/watch?v=NevKVKbCNy4&ab_channel=NTDM'
                const stream = ytdl(url, {filter: 'audioonly'});
                const player = createAudioPlayer({
                    behaviors: {
                      noSubscriber: NoSubscriberBehavior.Pause
                    }
                  });
                const resource = createAudioResource(stream);
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator            
                });
                const ct = Promise.resolve(connection);
                ct.then(connection => {               
                    player.play(resource);
                    connection.subscribe(player);
                }).catch(console.error)
               
                //player.on("error", (err) => {
                    //queue.songs.shift();
                    //processQueue(queue.songs[0], message);
                //});
                
                
                message.channel.send("[debug] run success!");
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
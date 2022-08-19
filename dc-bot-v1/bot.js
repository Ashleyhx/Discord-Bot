import { createRequire } from "module";
import { Client } from "@notionhq/client";
const require = createRequire(import.meta.url);

var cron = require("cron");
const Discord = require('discord.js');

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
    AudioResource,
    NoSubscriberBehavior,
    generateDependencyReport,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';

const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });

const notion = new Client({
    auth: "",
});
const databaseId = "";

const ytdl = require("ytdl-core");

const PREFIX = '!';

const token = '';

const playQueue = (connection, player, message) => {
    const server = servers[message.guild.id];
    const url = server.queue[0];
    console.log(url);
    const stream = ytdl(url, {filter: 'audioonly'});
    const resource = createAudioResource(stream);
    console.log(resource.silencePaddingFrames);
    //server.queue.shift();
    player.on(AudioPlayerStatus.Playing, () => {
        message.channel.send("a song is already playing!");

    });
    const limit = 30;
    let retry = 0;
    //const p = new Promise(resolve => setTimeout(resolve, 60 * 1000));

     // new Promise(resolve => setTimeout(resolve, 60 * 1000));
     function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sleep( 60*1000 );
    while (retry < limit) {
        player.on(AudioPlayerStatus.Idle, () =>{
            //break;
            player.play(resource);
        })
        player.on(AudioPlayerStatus.Playing, () =>{
            sleep(10 * 1000);
        });
        retry ++;
      }
    player.play(resource);
    //player.play(resource); // will play directly
    /*player.on(AudioPlayerStatus.Playing, () => {
    //player.on("stateChange", async (oldState, newState) => {
        console.log("here1");
        if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
            console.log("here1");
            if (server.queue.length == 0) {
                connection.disconnect();
            } else {
                console.log("here1");
                player.play(resource);
                server.queue.shift();
                playQueue(connection, player, message);
            }
        }      
    });*/
};

export async function NotionEventsListener() {
    const timeStamp = new Date().getTime();
    const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
    const yesterdayDate = new Date(yesterdayTimeStamp);
    const EditedItems = await notion.databases.query({
        database_id: databaseId,
        filter: {
          timestamp: "last_edited_time",
          last_edited_time: {
            after: yesterdayDate.toISOString(),
          },
        },
      });
     return EditedItems.results;
}

var servers = {}; // store queue songs

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', async message => {
    let args = message.content.substring(PREFIX.lenghth).split( " " );
    //var server = servers[message.guild.id];
    switch (args[0]){
        case 'ping':
            message.channel.send("Pong!");
        break;

        case 'notion':
            let EditedItems = await NotionEventsListener();
            message.channel.send("** Note! These tasks has been changed in last 24 hours: **");
            let i = 0;
            let EditorName = "";
            let title = "";
            while(i < EditedItems.length){
                EditorName = EditedItems[i].properties["Last edit by"].last_edited_by.name;
                title = EditedItems[i].properties["Title"].title[0]["text"];
                message.channel.send(title);
                message.channel.send("__*Last edit by:*__ " + EditorName);
                message.channel.send("__*Last edit by:*__ " + EditorName);
                message.channel.send("__*url:*__ " + EditedItems[i].url);
                message.channel.send("--------------------------------------------------");
                i++;
            }           
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
                queue: [], // important part 
                player: createAudioPlayer({
                    behaviors: {
                      noSubscriber: NoSubscriberBehavior.Pause
                    }
                }),
            }
            var server = servers[message.guild.id];
            const connection = 
            joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator            
            });
            const player = servers[message.guild.id].player;
            connection.subscribe(player);
//=======================================================

            server.queue.push(args[1]);
            playQueue(connection,player, message);

//====== the current playlist ================

            message.channel.send("current queue is: ");
            for(let i = 0; i < 5 && i < server.queue.length ; i++){
                message.channel.send(server.queue[i]);
            }
//==================================================

            message.channel.send("[debug] run success!");

        break;
/*
        case 'queue':
            if(server.queue.length == 0){
                message.channel.send("Empty queue!");
            }
            else {
                for(let i = 0; i < 5 && i < server.queue.length ; i++){
                    message.channel.send(server.queue[i]);
                }
            }
        break;
        */
    }
 
});

// let scheduledMessage = new cron.CronJob('00 41 10 * * *', () => {
//     let channel = '982092867357012029';
//     channel.send('You message');
// });
  
// scheduledMessage.start()


bot.login(token);

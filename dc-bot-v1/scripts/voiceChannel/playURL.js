import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Discord = require('discord.js');
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

const ytdl = require("ytdl-core");

export async function playSong({ message, url }) {
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
    player.play(resource);
    connection.subscribe(player);
               
    message.channel.send("[debug] run success!");
}
/**
 * @param {channel.VoiceChannel} VoiceChannel - The date
 */

import { Client, VoiceChannel, Intents } from 'discord.js';

import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';

function playSong() {
	const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
		inputType: StreamType.Arbitrary,
	});

	player.play(resource);

	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}

//I turned off "javascript.validate.enable": false, 
//otherwise this will give me an error
export async function connectToChannel(message) {

	const connection = joinVoiceChannel({
		channelId: message.channelId,
		guildId: message.guildId,
		adapterCreator: message.guild.voiceAdapterCreator
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}
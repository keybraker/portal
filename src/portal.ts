// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/PortalDB', { useNewUrlParser: true })
// 	.catch(error => {
// 		console.error.bind(console, 'PortallDB connection error:');
// 		console.log('Could not connect to PortalDB (mongo) with error:\n', error);
// 		return -1;
// 	});
// const PortalDB = mongoose.connection;
// PortalDB.once('open', function() { console.log('we\'re connected!'); });

// list of all managed channels in servers
const portal_managed_guilds_path = './database/guild_list.json';
import guild_list from './database/guild_list.json';

if (guild_list === null) {
	console.log('guild json is corrupt');
	process.exit(1);
}

import config from './config.json';
import cooldown_list from './assets/jsons/cooldown_list.json';

import { isProfane } from './libraries/moderation_manager.js';
import { included_in_url_list } from './libraries/guild_manager';
import { is_url, message_reply, pad, time_elapsed, update_portal_managed_guilds } from './libraries/help_manager';
import { client_talk } from './libraries/localization_manager';
import { add_points_message } from './libraries/user_manager';
import { start } from './libraries/music_manager';

// load up the discord.js library
import { Client, Message, Guild, DMChannel, GuildChannel, GuildMember, Presence, User, MessageReaction, VoiceState } from "discord.js";
import { ReturnPormise } from './types/classes/ReturnPormise';

// this is the client the Portal Bot. Some people call it bot, some people call
// it 'self', client.user is actually the presence of portal bot in the server
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const active_cooldown = { guild: [], member: [] };

// This event will run if the bot starts, and logs in, successfully.
client.on('ready', () =>
	event_loader('ready', {
		'client': client,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path,
	})
);

// When bot connects to shard again ?
client.on('shardReconnecting', (id: number) =>
	event_loader('shardReconnecting', {
		'id': id
	})
);

// this event triggers when the bot is removed from a guild.
client.on('guildDelete', (guild: Guild) =>
	event_loader('guildDelete', {
		'guild': guild,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path
	})
);

// This event triggers when the bot joins a guild.
client.on('guildCreate', (guild: Guild) =>
	event_loader('guildCreate', {
		'client': client,
		'guild': guild,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path
	})
);

// This event triggers when the bot joins a guild.
client.on('channelDelete', (channel: DMChannel | GuildChannel) =>
	event_loader('channelDelete', {
		'channel': channel,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path
	})
);

// This event triggers when a new member joins a guild.
client.on('guildMemberAdd', (member: GuildMember) =>
	event_loader('guildMemberAdd', {
		'member': member,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path
	})
);

// This event triggers when a new member leaves a guild.
client.on('guildMemberRemove', (member: GuildMember) =>
	event_loader('guildMemberRemove', {
		'member': member,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path
	})
);

// This event triggers when the status of a guild member has changed
client.on('presenceUpdate', (oldPresence: Presence, newPresence: Presence) =>
	event_loader('presenceUpdate', {
		'client': client,
		'guild_list': guild_list,
		'newPresence': newPresence
	})
);

// This event triggers when a member reacts to a message
client.on('messageReactionAdd', (messageReaction: MessageReaction, user: User) =>
	event_loader('messageReactionAdd', {
		'client': client,
		'guild_list': guild_list,
		'messageReaction': messageReaction,
		'user': user
	})
);

// This event triggers when a message is deleted
client.on('messageDelete', (message: Message) =>
	event_loader('messageDelete', {
		'client': client,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path,
		'message': message
	})
);

// This event triggers when a member joins or leaves a voice channel
client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) =>
	event_loader('voiceStateUpdate', {
		'client': client,
		'guild_list': guild_list,
		'portal_managed_guilds_path': portal_managed_guilds_path,
		'oldState': oldState,
		'newState': newState
	})
);

// runs on every single message received, from any channel or DM
client.on('message', async (message: Message) => {
	// Ignore other bots and also itself ('botception')
	if (message.author.bot) return;

	// Ignore any direct message
	if (message.channel.type === 'dm') return;

	// check if something written in portal channels
	portal_channel_handler(message);

	// ranking system
	ranking_system(message);

	// word check
	if (isProfane(message.content)) {
		message.react('🚩');
		message.author
			.send("try not to use profanities")
			.catch(console.error);
	}

	update_portal_managed_guilds(true, portal_managed_guilds_path, guild_list);

	// Ignore any message that does not start with prefix
	if (message.content.indexOf(config.prefix) !== 0) return;

	// Separate function name, and arguments of function
	const args: string[] = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let type: string = '';

	if (cooldown_list.guild[cmd]) {
		type = 'guild';
	}
	else if (cooldown_list.member[cmd]) {
		type = 'member';
	}
	else if (cooldown_list.none[cmd]) {
		type = 'none';
	}
	else {
		return;
	}

	if (cooldown_list[type][cmd].auth) {
		const is_user_authorized = is_authorized(
			guild_list[message.guild.id].auth_role, message.member);

		if (!is_user_authorized) {
			message_reply(false, message.channel, message, message.author,
				'you are not authorized to access this command', guild_list, client);
			return;
		}
	}

	if (cooldown_list[type][cmd].premium && !guild_list[message.guild.id].premium) {
		message_reply(
			false, message.channel, message,
			message.author, 'this server is not premium', guild_list, client);
		return;
	}

	if (type === 'none' && cooldown_list.none[cmd].time === 0) {
		require(`./commands/${cmd}.js`)(client, message, args, guild_list, portal_managed_guilds_path)
			.then(rspns => {
				message_reply(rspns.result, message.channel, message,
					message.author, rspns.value, guild_list, client, cooldown_list[type][cmd].auto_delete);
				update_portal_managed_guilds(true, portal_managed_guilds_path, guild_list);
			});
		return;
	}

	const active = active_cooldown[type].find(active_current => {
		if (active_current.command === cmd) {
			if (type === 'member' && active_current.member === message.author.id) {
				return true;
			}
			if (type === 'guild') {
				return true;
			}
		}
		return false;
	});

	if (active) {
		const time = time_elapsed(active.timestamp, cooldown_list[type][cmd].time);
		const type_for_msg = type === 'member' ? '.*' : `, as it was used again in* **${message.guild.name}**.`;

		message_reply(false, message.channel, message, message.author,
			`*you need to wait* **${pad(time.remaining_min)}:` +
			`${pad(time.remaining_sec)}/${pad(time.timeout_min)}:` +
			`${pad(time.timeout_sec)}** *to use* **${cmd}** *again${type_for_msg}`,
			guild_list, client);

		return;
	}

	require(`./commands/${cmd}.js`)(client, message, args, guild_list, portal_managed_guilds_path)
		.then((rspns: ReturnPormise) => {
			if (rspns.result === true) {
				active_cooldown[type].push({ member: message.author.id, command: cmd, timestamp: Date.now() });

				setTimeout(() => {
					active_cooldown[type] = active_cooldown[type]
						.filter(active.command !== cmd);
				}, cooldown_list[type][cmd].time * 60 * 1000);
			}
			console.log('cooldown_list[type][cmd].auto_delete :>> ', cooldown_list[type][cmd].auto_delete);
			message_reply(rspns, message.channel, message, message.author,
				rspns ? 'executed correctly' : 'executed falsely', guild_list, client,
				cooldown_list[type][cmd].auto_delete);

			update_portal_managed_guilds(true, portal_managed_guilds_path, guild_list);
		});
});

function event_loader(event: string, args: any): void {
	console.log(`event emitted: ${event}`);
	require(`./events/${event}.js`)(args)
		.then((rspns: ReturnPormise) => {
			if (rspns !== null && rspns !== undefined) {
				if (event === 'messageReactionAdd') {
					const music_channel_id = args.guild_list[args.messageReaction.message.guild.id]
						.music_data.channel_id;
					const music_channel = args.messageReaction.message.guild.channels.cache
						.find(channel => channel.id === music_channel_id);

					music_channel
						.send(`${args.user}, ${rspns.value.toString()}`)
						.then(msg => { msg.delete({ timeout: 5000 }); })
						.catch(error => console.log(error));
				}
				else {
					console.log(rspns.result, rspns.value);
				}
			}
		});
};

function portal_channel_handler(message: Message): void {
	let channel_type = null, channel_support = null, channel_talk = null;

	if (included_in_url_list(message.channel.id, guild_list[message.guild.id])) {
		if (is_url(message.content)) {
			client_talk(client, guild_list, 'url');
			return;
		}
		else {
			channel_type = 'URL';
			channel_support = 'url';
			channel_talk = 'read_only';
		}
	}
	else if (guild_list[message.guild.id].music_data.channel_id === message.channel.id) {
		start(client, message, message.content, guild_list)
			.then(joined => {
				message_reply(joined.result, message.channel, message,
					message.author, joined.value, guild_list, client, true);
			})
			.catch(error => {
				console.log(error);
				message.delete();
			});
		return;
	}

	if (channel_type !== null && channel_support !== null && channel_talk !== null) {
		client_talk(client, guild_list, channel_talk);
		message_reply(
			null, message.channel, message,
			message.author, `${channel_type} channel is ${channel_support}-only.`,
			guild_list, client);
		message.delete();
		return;
	}
}

function ranking_system(message: Message): void {
	const level = add_points_message(message, guild_list);
	if (level) {
		message_reply(
			null, message.channel, message,
			message.author, `You reached level ${level}!`,
			guild_list, client);
	}
}

function log_portal() {
	client.login(config.token_dev);
}

log_portal();

exports.client = client;
exports.log_portal = log_portal;

// console.log('Object.getOwnPropertyNames(message) = ', Object.getOwnPropertyNames(message))
// console.log('Object.getOwnPropertyNames(message.author) = ', Object.getOwnPropertyNames(message.author))
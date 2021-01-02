/* eslint-disable no-unused-vars */
import { GuildMember, MessageEmbed, VoiceChannel } from 'discord.js';
import { create_rich_embed } from '../libraries/help_manager';
import { ObjectFunction } from './TypePortal';

const locales = ['gr', 'en', 'de'];
export const attribute_prefix: string = '&';
const attributes: ObjectFunction[] = [
	{
		name: 'ann_announce',
		description: 'returns/sets whether Portal announces events in current channel',
		super_description: '**ann_announce** returns/sets whether Portal announces events in current channel',
		example: '&ann_announce',
		args: 'true/false',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any) => {
			return voice_object.ann_announce;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (value === 'true') {
				voice_object.ann_announce = true;
				return 1;
			}
			else if (value === 'false') {
				voice_object.ann_announce = false;
				return 1;
			}
			return -7;
		},
		auth: 'voice',
	},
	{
		name: 'ann_announce_portal',
		description: 'returns/sets whether Portal announces events in current portals spawned channels',
		super_description: '**ann_announce_portal** returns/sets whether Portal announces events in ' +
			'current portals spawned channels',
		example: '&ann_announce_portal',
		args: 'true/false',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any) => {
			return portal_object.ann_announce;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (value === 'true') {
				portal_object.ann_announce = true;
				return 1;
			}
			else if (value === 'false') {
				portal_object.ann_announce = false;
				return 1;
			}
			return -7;
		},
		auth: 'portal',
	},
	{
		name: 'ann_user',
		description: 'returns/sets whether Portal announces user\'s join or leave from current channel',
		super_description: '**ann_user** returns/sets whether Portal announces user\'s join or leave from current channel',
		example: '&ann_user',
		args: 'true/false',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any) => {
			return voice_object.ann_user;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (value === 'true') {
				voice_object.ann_user = true;
				return 1;
			}
			else if (value === 'false') {
				voice_object.ann_user = false;
				return 1;
			}
			return -7;
		},
		auth: 'voice',
	},
	{
		name: 'ann_user_portal',
		description: 'returns/sets whether Portal announces user\'s join or leave from current portals spawned channels',
		super_description: '**ann_user_portal** returns/sets whether Portal announces user\'s join or leave from ' +
			'current portals spawned channels',
		example: '&ann_user_portal',
		args: 'true/false',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any) => {
			return portal_object.ann_user;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (value === 'true') {
				portal_object.ann_user = true;
				return 1;
			}
			else if (value === 'false') {
				portal_object.ann_user = false;
				return 1;
			}
			return -7;
		},
		auth: 'portal',
	},
	{
		name: 'bitrate',
		description: 'returns/sets bitrate of channel',
		super_description: '**bitrate** returns/sets bitrate of channel',
		example: '&bitrate',
		args: 'number',
		get: (voice_channel: VoiceChannel) => {
			return voice_channel.bitrate;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			// voice_channel.setBitrate(Number(value));
			voice_channel.edit({ bitrate: Number(value) })
				.then(channel => console.log(
					`Channel's new position is ${channel.bitrate} and should be ${value}`))
				.catch(console.error);
			return 1;
		},
		auth: 'voice',
	},
	{
		name: 'locale',
		description: 'returns/sets locale of current channel',
		super_description: '**locale**, returns/sets language used in statuses',
		example: '&locale',
		args: 'en/gr/de',
		get: (voice_channel: VoiceChannel, voice_object: any) => {
			return voice_object.locale;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (locales.includes(value)) {
				voice_object.locale = String(value);
				return 1;
			}
			else {
				return -5;
			}
		},
		auth: 'voice',
	},
	{
		name: 'locale_guild',
		description: 'returns/sets locale_guild of the guild',
		super_description: '**locale_guild**, returns/sets guild locale makes the bot talk your language and all communication is done' +
			'in your local language',
		example: '&locale_guild',
		args: 'en/gr/de',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any) => {
			return guild_object.locale;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (locales.includes(value)) {
				guild_object.locale = String(value);
				return 1;
			}
			else {
				return -5;
			}
		},
		auth: 'admin',
	},
	{
		name: 'locale_portal',
		description: 'returns/sets locale_portal of current channel',
		super_description: '**locale_portal**, returns/sets language used in statuses',
		example: '&locale_portal',
		args: 'en/gr/de',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any) => {
			return portal_object.locale;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			if (locales.includes(value)) {
				portal_object.locale = String(value);
				return 1;
			}
			else {
				return -5;
			}
		},
		auth: 'portal',
	},
	{
		name: 'position',
		description: 'returns/sets the position of the channel',
		super_description: '**position**, returns/sets the position of the channel',
		example: '&position',
		args: '!position of channel',
		get: (voice_channel: VoiceChannel) => {
			return voice_channel.position;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			voice_channel.edit({ position: Number(value) })
				.then(channel => console.log(
					`Channel's new position is ${channel.position} and should be ${value}`))
				.catch(console.error);
			return 1;
		},
		auth: 'voice',
	},
	{
		name: 'regex',
		description: 'returns/sets the title for current voice channel',
		super_description: '**regex**, returns/sets the title for current voice channel',
		example: '&regex',
		args: '!regex',
		get: (voice_channel: VoiceChannel, voice_object: any) => {
			return voice_object.regex;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			voice_object.regex = value;
			return 1;
		},
		auth: 'voice',
	},
	{
		name: 'regex_portal',
		description: 'returns/sets title-guidelines of portal channel',
		super_description: '**regex_portal**, returns/sets title-guidelines of portal channel',
		example: '&regex_portal',
		args: '!regex',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any) => {
			return portal_object.regex_portal;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			portal_object.regex_portal = value;
			return 1;
		},
		auth: 'portal',
	},
	{
		name: 'regex_voice',
		description: 'returns/sets the default title for created voice channels',
		super_description: '**regex_voice**, returns/sets the default title for created voice channels',
		example: '&regex_voice',
		args: '!regex',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any) => {
			return portal_object.regex_voice;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: string) => {
			portal_object.regex_voice = value;
			return 1;
		},
		auth: 'portal',
	},
	{
		name: 'user_limit',
		description: 'returns/sets maximum number of members allowed',
		super_description: '**user_limit**, returns/sets maximum number of members allowed',
		example: '&user_limit',
		args: '!number of maximum members (0 is infinite)',
		get: (voice_channel: VoiceChannel) => {
			return voice_channel.userLimit;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: number) => {
			if (value >= 0) {
				voice_channel.userLimit = Number(value);
				return 1;
			}
			return -6;
		},
		auth: 'voice',
	},
	{
		name: 'user_limit_portal',
		description: 'returns/sets maximum number of members guideline for portal',
		super_description: '**user_limit_portal**, returns/sets maximum number of members guideline for portal',
		example: '&user_limit_portal',
		args: '!number of maximum members (0 is infinite)',
		get: (voice_channel: VoiceChannel, voice_object: any, portal_object: any) => {
			return portal_object.user_limit_portal;
		},
		set: (voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, value: number) => {
			if (value >= 0) {
				portal_object.user_limit_portal = Number(value);
				return 1;
			}
			return -6;
		},
		auth: 'portal',
	},
];

export function is_attribute(candidate: any): string  {
	for (let i = 0; i < attributes.length; i++) {
		if (String(candidate).substring(1, (String(attributes[i].name).length + 1)) == attributes[i].name) {
			return attributes[i].name;
		}
	}
	return '';
}

export function get_attribute_help(): MessageEmbed {
	const attr_array = [];
	for (let i = 0; i < attributes.length; i++) {
		attr_array.push({
			emote: attributes[i].name,
			role: '**desc**: *' + attributes[i].description + '*' +
				'\n**args**: *' + attributes[i].args + '*',
			inline: true,
		});
	}
	return create_rich_embed(
		'Attributes',
		'Prefix: ' + attribute_prefix + '\nimmutable statistics of Portal channel.' +
		'\n**!**: *mandatory*, **@**: *optional*',
		'#FF5714',
		attr_array,
		null,
		null,
		null,
		null,
		null);
};

export function get_attribute_help_super(candidate: string): MessageEmbed | boolean {
	for (let i = 0; i < attributes.length; i++) {
		const attr = attributes[i];
		if (attr.name === candidate) {
			return create_rich_embed(
				attr.name,
				'Type: Attribute' +
				'\nPrefix: ' + attribute_prefix +
				'\n**!**: *mandatory*, **@**: *optional*',
				'#FF5714',
				[
					{ emote: 'Description', role: '*' + attr.super_description + '*', inline: false },
					{ emote: 'Arguments', role: '*' + attr.args + '*', inline: false },
					{ emote: 'Example', role: '*' + attr.example + '*', inline: false },
				],
				null,
				null,
				null,
				null,
				null);
		}
	}
	return false;
};

export function get_attribute(voice_channel: VoiceChannel, voice_object: any, portal_object: any, guild_object: any, candidate: string): any {
	for (let l = 0; l < attributes.length; l++) {
		if (candidate === attributes[l].name) {
			return attributes[l].get(voice_channel, voice_object, portal_object, guild_object);
		}
	}
	return -1;
};

export function set_attribute(voice_channel: VoiceChannel, voice_object: any, portal_object: any,
	guild_object: any, candidate: string, value: any, member: GuildMember): any {
	for (let l = 0; l < attributes.length; l++) {
		if (candidate === attributes[l].name) {
			switch (attributes[l].auth) {
				case 'admin':
					if (!member.hasPermission('ADMINISTRATOR')) {
						return -2;
					}
					break;
				case 'portal':
					if (portal_object.creator_id !== member.id) {
						return -3;
					}
					break;
				case 'voice':
					if (voice_object.creator_id !== member.id) {
						return -4;
					}
					break;
				default:
					break;
			}

			return attributes[l].set(voice_channel, voice_object, portal_object, guild_object, value);
		}
	}
	return -1;
};
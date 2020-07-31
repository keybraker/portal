/* eslint-disable no-unused-vars */
/* eslint-disable no-cond-assign */
/* eslint-disable no-undef */
const help_mngr = require('../functions/help_manager');

module.exports = async (client, message, args, portal_guilds, portal_managed_guilds_path) => {
	return new Promise((resolve) => {
		if (portal_guilds[message.guild.id].member_list[message.member.id]) {
			const member_info = portal_guilds[message.guild.id].member_list[message.member.id];

			message.channel.send(help_mngr.create_rich_embed(
				false,
				false,
				'#00FFFF',
				[
					{ emote: 'level', role: `***${member_info.level}***`, inline: true },
					{ emote: 'rank', role: `***${member_info.rank}***`, inline: true },
					{ emote: 'tier', role: `***${member_info.tier}***`, inline: true },
					{ emote: 'points', role: `***${member_info.points}***`, inline: false }
				], 
				false,
				message.member,
				false));

			return resolve (null);
		}
	});
};
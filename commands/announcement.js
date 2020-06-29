/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-cond-assign */
const guld_mngr = require('./../functions/guild_manager');

module.exports = async (client, message, args, portal_guilds, portal_managed_guilds_path) => {
	return new Promise((resolve) => {
		if (args.length === 0) {
			if (guld_mngr.is_announcement_channel(message.channel.id, portal_guilds[message.guild.id])) {
				return resolve ({ result: true, value: '*this already is, the Announcement channel.*' });
			}
			if (guld_mngr.is_spotify_channel(message.channel.id, portal_guilds[message.guild.id])) {
				return resolve ({ result: true, value: '*this can\'t be set as the Announcemennt channel for it is the Spotify channel.*' });
			}
			if (guld_mngr.included_in_url_list(message.channel.id, portal_guilds[message.guild.id])) {
				return resolve ({ result: true, value: '*this can\'t be set as the Spotify channel for it is an url channel.*' });
			}
		}

		if (announcement = message.guild.channels.cache.find(channel => channel.id == portal_guilds[message.guild.id].announcement)) {
			guld_mngr.delete_channel(announcement);
		}

		if (args.length === 0) {
			portal_guilds[message.guild.id].announcement = message.channel.id;

			return resolve ({ result: true, value: '*this is now the Announcement channel.*' });
		} else if (args.length > 0) {
			const announcement_channel = args.join(' ').substr(0, args.join(' ').indexOf('|'));
			const announcement_category = args.join(' ').substr(args.join(' ').indexOf('|') + 1);

			if (announcement_channel !== '') {
				guld_mngr.create_announcement_channel(
					message.guild, announcement_channel, announcement_category, portal_guilds[message.guild.id]);

				return resolve ({ result: true, value: '*announcement channel and category have been created*' });
			} else if (announcement_channel === '' && announcement_category !== '') {
				guld_mngr.create_announcement_channel(
					message.guild, announcement_category, null, portal_guilds[message.guild.id]);

				return resolve ({ result: true, value: '*announcement channel has been created*' });
			} else {
				return resolve ({ result: false, value: '*you can run "./help announcement" for help.*' });
			}
		}
	});
};
